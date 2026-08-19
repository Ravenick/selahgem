// Core Bible domain types. Kept provider-agnostic so translations can come
// from a bundled public-domain dataset today and an external API later.

export type BibleVersionId = string;

export interface BibleVersion {
  id: BibleVersionId;
  name: string;
  abbreviation: string;
  /** Whether the full text is available locally (offline searchable). */
  offline: boolean;
  /** Set when the translation exists but is not licensed/configured yet. */
  available: boolean;
  note?: string;
}

export interface Verse {
  version: BibleVersionId;
  book: string;
  bookIndex: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface VerseRef {
  book: string;
  chapter: number;
  verse: number;
}

export function verseId(v: { book: string; chapter: number; verse: number }) {
  return `${v.book} ${v.chapter}:${v.verse}`;
}

/**
 * BibleProvider — the single seam between the app and any Scripture source.
 * Swap in an API-backed provider without touching UI code.
 */
export interface BibleProvider {
  id: string;
  versions(): BibleVersion[];
  /** Load/prepare a translation (may download + cache locally). */
  load(version: BibleVersionId): Promise<void>;
  search(version: BibleVersionId, query: string, limit?: number): Promise<Verse[]>;
  getVerse(version: BibleVersionId, ref: VerseRef): Promise<Verse | null>;
  /** Adjacent verse navigation (crosses chapter/book boundaries). */
  neighbour(version: BibleVersionId, ref: VerseRef, delta: number): Promise<Verse | null>;
}