// Local (offline-first) Bible provider.
//
// Data source: public-domain King James Version, shipped with the app at
// /bible/kjv.json. On first use it is fetched once, then persisted in
// IndexedDB, so every later search — reference or full text — runs entirely
// offline with zero network requests.
//
// To add an API-backed translation later, implement the same BibleProvider
// interface in a sibling file and register it in ./registry.ts. Any API key
// must be read server-side (createServerFn), never in this client module.

import type { BibleProvider, BibleVersion, Verse, VerseRef } from "./types";
import { parseReference, resolveBook } from "./abbreviations";
import { idbGet, idbSet } from "./idb";

interface RawBook {
  n: string; // name
  a: string; // abbrev
  c: string[][]; // chapters -> verses
}

const VERSIONS: BibleVersion[] = [
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    offline: true,
    available: true,
    note: "Public domain • bundled for offline use",
  },
  {
    id: "nkjv",
    name: "New King James Version",
    abbreviation: "NKJV",
    offline: false,
    available: false,
    note: "Requires a licensed Bible API",
  },
  {
    id: "niv",
    name: "New International Version",
    abbreviation: "NIV",
    offline: false,
    available: false,
    note: "Requires a licensed Bible API",
  },
  {
    id: "esv",
    name: "English Standard Version",
    abbreviation: "ESV",
    offline: false,
    available: false,
    note: "Requires an ESV API key",
  },
  {
    id: "nlt",
    name: "New Living Translation",
    abbreviation: "NLT",
    offline: false,
    available: false,
    note: "Requires a licensed Bible API",
  },
  {
    id: "amp",
    name: "Amplified Bible",
    abbreviation: "AMP",
    offline: false,
    available: false,
    note: "Requires a licensed Bible API",
  },
];

const cache = new Map<string, RawBook[]>();
const inflight = new Map<string, Promise<RawBook[]>>();

export class UnavailableTranslationError extends Error {}

function normalizeBook(b: any): RawBook {
  return {
    n: b.n || b.book || b.name || "",
    a: b.a || b.abbrev || b.abbreviation || "",
    c: b.c || b.chapters || [],
  };
}

async function loadBooks(version: string): Promise<RawBook[]> {
  const cached = cache.get(version);
  if (cached) return cached;
  const pending = inflight.get(version);
  if (pending) return pending;

  const task = (async () => {
    const meta = VERSIONS.find((v) => v.id === version);
    if (!meta || !meta.available) {
      throw new UnavailableTranslationError(
        `${meta?.abbreviation ?? version} is not installed. Switch to KJV, which is available offline.`,
      );
    }
    // 1. Local copy first — instant and network-free.
    const stored = await idbGet<RawBook[]>(`bible:${version}`);
    if (stored && stored.length) {
      const normalized = stored.map(normalizeBook);
      cache.set(version, normalized);
      return normalized;
    }

    // 2. Try bundled local path first
    let rawData: any = null;
    try {
      const res = await fetch(`/bible/${version}.json`);
      if (res.ok) {
        rawData = await res.json();
      }
    } catch {
      // ignore
    }

    // 3. Fallback to public CDN if local dataset is not present
    if (!rawData && version === "kjv") {
      try {
        const cdnRes = await fetch("https://cdn.jsdelivr.net/gh/thiagobodruk/bible@master/json/en_kjv.json");
        if (cdnRes.ok) {
          rawData = await cdnRes.json();
        }
      } catch {
        // ignore
      }
    }

    if (!rawData || !Array.isArray(rawData)) {
      throw new Error("Bible data could not be downloaded.");
    }

    const books = rawData.map(normalizeBook);
    cache.set(version, books);
    void idbSet(`bible:${version}`, books);
    return books;
  })();

  inflight.set(version, task);
  try {
    return await task;
  } finally {
    inflight.delete(version);
  }
}

function toVerse(version: string, books: RawBook[], bi: number, ci: number, vi: number): Verse | null {
  const book = books[bi];
  const text = book?.c[ci]?.[vi];
  if (!book || text === undefined) return null;
  return { version, book: book.n, bookIndex: bi, chapter: ci + 1, verse: vi + 1, text };
}

export const localBibleProvider: BibleProvider = {
  id: "local-kjv",

  versions: () => VERSIONS,

  async load(version) {
    await loadBooks(version);
  },

  async search(version, query, limit = 40) {
    const q = query.trim();
    if (!q) return [];
    const books = await loadBooks(version);
    const names = books.map((b) => b.n);

    // 1) Reference lookup ("Jn 3:16", "romans 8 28", "psalm 23")
    const ref = parseReference(q, names);
    if (ref) {
      const bi = names.indexOf(ref.book);
      const chapter = books[bi]?.c[ref.chapter - 1];
      if (chapter) {
        if (ref.verse != null) {
          const results: Verse[] = [];
          const exact = toVerse(version, books, bi, ref.chapter - 1, ref.verse - 1);
          if (exact) results.push(exact);
          for (let i = ref.verse; i < Math.min(chapter.length, ref.verse + limit - 1); i++) {
            const v = toVerse(version, books, bi, ref.chapter - 1, i);
            if (v) results.push(v);
          }
          if (results.length) return results;
        } else {
          const results: Verse[] = [];
          for (let i = 0; i < Math.min(chapter.length, limit); i++) {
            const v = toVerse(version, books, bi, ref.chapter - 1, i);
            if (v) results.push(v);
          }
          return results;
        }
      }
    }

    // 2) Full-text search over the local dataset.
    if (q.length < 3) return [];
    const needle = q.toLowerCase();
    const results: Verse[] = [];
    for (let bi = 0; bi < books.length; bi++) {
      const book = books[bi]!;
      for (let ci = 0; ci < book.c.length; ci++) {
        const chapter = book.c[ci]!;
        for (let vi = 0; vi < chapter.length; vi++) {
          if (chapter[vi]!.toLowerCase().includes(needle)) {
            const v = toVerse(version, books, bi, ci, vi);
            if (v) results.push(v);
            if (results.length >= limit) return results;
          }
        }
      }
    }
    return results;
  },

  async getVerse(version, ref) {
    const books = await loadBooks(version);
    const names = books.map((b) => b.n);
    const book = resolveBook(ref.book, names);
    if (!book) return null;
    return toVerse(version, books, names.indexOf(book), ref.chapter - 1, ref.verse - 1);
  },

  async neighbour(version, ref, delta) {
    const books = await loadBooks(version);
    const names = books.map((b) => b.n);
    const book = resolveBook(ref.book, names);
    if (!book) return null;
    let bi = names.indexOf(book);
    let ci = ref.chapter - 1;
    let vi = ref.verse - 1 + delta;
    while (true) {
      const chapter = books[bi]?.c[ci];
      if (!chapter) return null;
      if (vi >= 0 && vi < chapter.length) return toVerse(version, books, bi, ci, vi);
      if (vi < 0) {
        ci -= 1;
        if (ci < 0) {
          bi -= 1;
          if (bi < 0) return null;
          ci = books[bi]!.c.length - 1;
        }
        vi = (books[bi]?.c[ci]?.length ?? 1) - 1;
      } else {
        ci += 1;
        if (ci >= books[bi]!.c.length) {
          bi += 1;
          if (bi >= books.length) return null;
          ci = 0;
        }
        vi = 0;
      }
    }
  },
};

/** List of book names for the loaded translation (empty until loaded). */
export function bookNames(version: string): string[] {
  return (cache.get(version) ?? []).map((b) => b.n);
}

export function chapterCount(version: string, book: string): number {
  return cache.get(version)?.find((b) => b.n === book)?.c.length ?? 0;
}