// Operator panel — SEARCH → SELECT → PREVIEW → DISPLAY.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  ListPlus,
  Monitor,
  MonitorX,
  Moon,
  Search as SearchIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  X,
  HelpCircle,
  Play,
} from "lucide-react";
import { VerseCanvas } from "@/components/selah/VerseCanvas";
import { AppearanceMenu } from "@/components/selah/AppearanceMenu";
import { ShortcutsDialog } from "@/components/selah/ShortcutsDialog";
import { DisplaySettingsPanel } from "@/components/selah/DisplaySettingsPanel";
import { InteractiveGuide } from "@/components/selah/InteractiveGuide";
import { SelahLogo } from "@/components/selah/SelahLogo";
import { bible } from "@/lib/bible/registry";
import type { Verse } from "@/lib/bible/types";
import { verseId } from "@/lib/bible/types";
import { publishLive, readLive } from "@/lib/selah/live";
import { readLocalRaw, writeLocal } from "@/lib/selah/storage";
import { DEFAULT_SETTINGS, type DisplaySettings, type SessionItem } from "@/lib/selah/types";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Presentation Panel — Selah" },
      {
        name: "description",
        content: "Search Scripture, preview it and send it to the projector in seconds with Selah.",
      },
      { property: "og:title", content: "Presentation Panel — Selah" },
      { property: "og:description", content: "Search, preview and display Bible verses on the congregation screen." },
    ],
  }),
  component: Panel,
});

const btn =
  "rounded-md border border-border px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors hover:bg-accent disabled:opacity-40";

export function Panel() {
  const [version, setVersion] = useState("kjv");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Verse[]>([]);
  const [status, setStatus] = useState<string>("Loading King James Version for offline use…");
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState<Verse | null>(null);
  const [liveVerse, setLiveVerse] = useState<Verse | null>(null);
  const [black, setBlack] = useState(false);
  const [seq, setSeq] = useState(0);
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_SETTINGS);
  const [recent, setRecent] = useState<Verse[]>([]);
  const [session, setSession] = useState<SessionItem[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [autoDisplay, setAutoDisplay] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const outputWindow = useRef<Window | null>(null);

  /* ---------- auto-show guide on first startup ---------- */
  useEffect(() => {
    const isDismissed = localStorage.getItem("selah:dismiss_tutorial_guide") === "true";
    if (isDismissed) return;
    const timer = window.setTimeout(() => setShowGuide(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  /* ---------- boot: restore local state and prepare the Bible ---------- */
  useEffect(() => {
    const live = readLive();
    setSettings(live.settings);
    setLiveVerse(live.verse);
    setBlack(live.black);
    setRecent(readLocalRaw<Verse[]>("recent", []));
    setSession(readLocalRaw<SessionItem[]>("session", []));
    bible
      .load("kjv")
      .then(() => {
        setReady(true);
        setStatus("KJV ready · stored locally, works offline");
      })
      .catch(() => setStatus("Bible data is currently unavailable. Reconnect once to download the KJV, then it stays offline."));
  }, []);

  /* ---------- search (debounced, runs entirely on local data) ---------- */
  useEffect(() => {
    if (!ready) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const t = window.setTimeout(() => {
      bible
        .search(version, q, 40)
        .then((r) => {
          setResults(r);
          setStatus(
            r.length ? `${r.length} result${r.length === 1 ? "" : "s"}` : `No verse found for “${q}”. Try “John 3:16”.`,
          );
        })
        .catch((e: Error) => {
          setResults([]);
          setStatus(e.message || "Search is unavailable right now.");
        });
    }, 90);
    return () => window.clearTimeout(t);
  }, [query, version, ready]);

  /* ---------- live output plumbing ---------- */
  const push = useCallback(
    (verse: Verse | null, blackOut: boolean, s: DisplaySettings, bump = true) => {
      const nextSeq = bump ? seq + 1 : seq;
      setSeq(nextSeq);
      publishLive({ verse, black: blackOut, settings: s, seq: nextSeq });
    },
    [seq],
  );

  const rememberRecent = useCallback((verse: Verse) => {
    setRecent((prev) => {
      const next = [verse, ...prev.filter((v) => verseId(v) !== verseId(verse))].slice(0, 12);
      writeLocal("recent", next);
      return next;
    });
  }, []);

  const display = useCallback(() => {
    if (!preview) return;
    setLiveVerse(preview);
    setBlack(false);
    push(preview, false, settings);
    rememberRecent(preview);
    setSession((prev) => {
      const next = prev.map((i) => (verseId(i.verse) === verseId(preview) ? { ...i, done: true } : i));
      writeLocal("session", next);
      return next;
    });
  }, [preview, push, settings, rememberRecent]);

  const clearOutput = useCallback(() => {
    setLiveVerse(null);
    setBlack(false);
    push(null, false, settings);
  }, [push, settings]);

  const toggleBlack = useCallback(() => {
    const next = !black;
    setBlack(next);
    push(liveVerse, next, settings);
  }, [black, liveVerse, push, settings]);

  const updateSettings = useCallback(
    (patch: Partial<DisplaySettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        publishLive({ verse: liveVerse, black, settings: next, seq });
        return next;
      });
    },
    [liveVerse, black, seq],
  );

  const step = useCallback(
    async (delta: number) => {
      const base = preview ?? liveVerse;
      if (!base) return;
      const v = await bible.neighbour(version, { book: base.book, chapter: base.chapter, verse: base.verse }, delta);
      if (!v) return;
      setPreview(v);
      if (autoDisplay && liveVerse) {
        setLiveVerse(v);
        setBlack(false);
        push(v, false, settings);
        rememberRecent(v);
      }
    },
    [preview, liveVerse, version, autoDisplay, push, settings, rememberRecent],
  );

  /* ---------- second display ---------- */
  const openOutput = useCallback(() => {
    const win = window.open("/output", "selah-output", "width=1280,height=720");
    if (!win) {
      setStatus("Your browser blocked the output window. Allow pop-ups for Selah, or open /output in a new tab.");
      return;
    }
    outputWindow.current = win;
    setOutputOpen(true);
    setStatus(
      "Output window opened. Drag it onto the projector, then press F11 (or click it) for fullscreen." +
        (typeof window !== "undefined" && !("getScreenDetails" in window)
          ? " Automatic second-screen placement isn't available in this browser."
          : ""),
    );
    // Re-publish so the fresh window immediately mirrors current state.
    window.setTimeout(() => publishLive({ verse: liveVerse, black, settings, seq: seq + 1 }), 600);
  }, [liveVerse, black, settings, seq]);

  /* ---------- keyboard shortcuts ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }
      if (typing) {
        if (e.key === "Enter" && results[0]) {
          e.preventDefault();
          setPreview(results[0]);
        }
        if (e.key === "Escape") searchRef.current?.blur();
        return;
      }
      switch (e.key) {
        case " ":
          e.preventDefault();
          display();
          break;
        case "Escape":
          clearOutput();
          break;
        case "ArrowUp":
          e.preventDefault();
          void step(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          void step(1);
          break;
        case "b":
        case "B":
          toggleBlack();
          break;
        case "+":
        case "=":
          updateSettings({ fontSize: Math.min(7, settings.fontSize + 0.2) });
          break;
        case "-":
          updateSettings({ fontSize: Math.max(1.6, settings.fontSize - 0.2) });
          break;
        case "?":
          setShowShortcuts(true);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [display, clearOutput, step, toggleBlack, updateSettings, settings.fontSize, results]);

  /* ---------- service session ---------- */
  const addToSession = (verse: Verse) => {
    setSession((prev) => {
      const next = [...prev, { id: `${verseId(verse)}-${Date.now()}`, verse, done: false }];
      writeLocal("session", next);
      return next;
    });
  };
  const mutateSession = (fn: (prev: SessionItem[]) => SessionItem[]) =>
    setSession((prev) => {
      const next = fn(prev);
      writeLocal("session", next);
      return next;
    });
  const move = (index: number, delta: number) =>
    mutateSession((prev) => {
      const next = [...prev];
      const to = index + delta;
      if (to < 0 || to >= next.length) return prev;
      const [item] = next.splice(index, 1);
      next.splice(to, 0, item!);
      return next;
    });
  const exportSession = () => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selah-service.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importSession = (file: File) => {
    file
      .text()
      .then((text) => mutateSession(() => JSON.parse(text) as SessionItem[]))
      .catch(() => setStatus("That file isn't a valid Selah service list."));
  };

  const nextUp = useMemo(() => session.find((i) => !i.done)?.verse ?? null, [session]);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3.5">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Return to SELAH Canyon Landing Page">
            <SelahLogo className="h-7 w-7" />
            <span className="font-extrabold text-xl tracking-wider font-['Manrope'] text-foreground">
              SELAH <span className="text-primary text-xs font-normal">Studio</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`rounded px-2 py-1 font-semibold uppercase tracking-[0.14em] ${
                black ? "bg-foreground/80 text-background" : liveVerse ? "bg-live text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {black ? "Black" : liveVerse ? `Live | ${verseId(liveVerse)}` : "Output clear"}
            </span>
            <span className="text-muted-foreground">
              Next | {preview ? verseId(preview) : nextUp ? verseId(nextUp) : "—"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`${btn} bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 flex items-center`}
            onClick={() => setShowGuide(true)}
            title="Interactive Guide & Tutorial"
          >
            <HelpCircle className="mr-1 inline h-3.5 w-3.5" />
            Tutorial Guide
          </button>
          <button type="button" className={btn} onClick={() => setShowShortcuts(true)}>
            <Keyboard className="mr-1 inline h-3.5 w-3.5" />
            Shortcuts
          </button>
          <button type="button" className={btn} onClick={openOutput}>
            <Monitor className="mr-1 inline h-3.5 w-3.5" />
            {outputOpen ? "Re-open output" : "Open output screen"}
          </button>
          <AppearanceMenu />
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-px overflow-auto bg-border lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.6fr)_minmax(300px,1fr)] lg:overflow-hidden">
        {/* LEFT — search */}
        <section className="flex min-h-0 flex-col bg-background p-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Bible or enter a reference..."
              autoFocus
              className="w-full rounded-lg border border-border bg-card py-3 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <select
              value={version}
              onChange={(e) => {
                const id = e.target.value;
                setVersion(id);
                bible.load(id).catch((err: Error) => setStatus(err.message));
              }}
              className="rounded-md border border-border bg-card px-2 py-1.5 text-xs"
            >
              {bible.versions().map((v) => (
                <option key={v.id} value={v.id}>
                  {v.abbreviation}
                  {v.available ? "" : " (not installed)"}
                </option>
              ))}
            </select>
            <p className="truncate text-xs text-muted-foreground">{status}</p>
          </div>

          <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {results.map((v) => (
              <li key={verseId(v)}>
                <button
                  type="button"
                  onClick={() => setPreview(v)}
                  className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                    preview && verseId(preview) === verseId(v)
                      ? "border-primary bg-accent"
                      : "border-transparent hover:bg-accent/60"
                  }`}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {v.book} {v.chapter}:{v.verse}
                  </span>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{v.text}</p>
                </button>
              </li>
            ))}
            {!results.length && (
              <li className="px-1 py-6 text-sm text-muted-foreground">
                Try <span className="text-foreground">John 3:16</span>, <span className="text-foreground">Rom 8 28</span>{" "}
                or a phrase like <span className="text-foreground">for God so loved</span>.
              </li>
            )}
          </ul>
        </section>

        {/* CENTER — preview + controls */}
        <section className="flex min-h-0 flex-col bg-background p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Preview</p>
          <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg border border-border">
            <VerseCanvas
              verse={preview}
              settings={settings}
              seq={preview ? seq + 1 : 0}
              placeholder="Select a verse to preview"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={display}
              disabled={!preview}
              className="col-span-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-40"
            >
              Display
            </button>
            <button type="button" className={btn} onClick={clearOutput}>
              <MonitorX className="mr-1 inline h-3.5 w-3.5" />
              Clear
            </button>
            <button type="button" className={`${btn} ${black ? "bg-foreground text-background" : ""}`} onClick={toggleBlack}>
              <Moon className="mr-1 inline h-3.5 w-3.5" />
              Black
            </button>
            <button type="button" className={btn} onClick={() => void step(-1)}>
              Previous
            </button>
            <button type="button" className={btn} onClick={() => void step(1)}>
              Next
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => updateSettings({ fontSize: Math.max(1.6, settings.fontSize - 0.2) })}
            >
              Font −
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => updateSettings({ fontSize: Math.min(7, settings.fontSize + 0.2) })}
            >
              Font +
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => {
                if (outputWindow.current && !outputWindow.current.closed) {
                  outputWindow.current.focus();
                  setStatus("Focus the output window and press F11 for fullscreen.");
                } else {
                  openOutput();
                }
              }}
            >
              Fullscreen
            </button>
            <button
              type="button"
              className={btn}
              disabled={!preview}
              onClick={() => preview && addToSession(preview)}
            >
              <ListPlus className="mr-1 inline h-3.5 w-3.5" />
              Add to service
            </button>
            <label className="flex items-center justify-center gap-2 rounded-md border border-border px-2 text-[11px] uppercase tracking-[0.12em]">
              <input
                type="checkbox"
                checked={autoDisplay}
                onChange={(e) => setAutoDisplay(e.target.checked)}
                className="accent-[var(--primary)]"
              />
              Follow live
            </label>
          </div>
        </section>

        {/* RIGHT — session, recent, output settings */}
        <aside className="min-h-0 space-y-6 overflow-y-auto bg-background p-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Today's service</p>
              <div className="flex items-center gap-1">
                <button type="button" title="Export service list" className="p-1 text-muted-foreground hover:text-foreground" onClick={exportSession}>
                  <Download className="h-4 w-4" />
                </button>
                <label title="Import service list" className="cursor-pointer p-1 text-muted-foreground hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && importSession(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            <ul className="mt-2 space-y-1">
              {session.map((item, i) => {
                const isLive = liveVerse && verseId(liveVerse) === verseId(item.verse);
                const isNext = !isLive && nextUp && verseId(nextUp) === verseId(item.verse);
                return (
                  <li
                    key={item.id}
                    className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm ${
                      isLive ? "border-live bg-live/10" : isNext ? "border-primary/60" : "border-border"
                    }`}
                  >
                    <span className="w-4 text-xs text-muted-foreground">{isLive ? "●" : item.done ? "✓" : "○"}</span>
                    <button type="button" className="flex-1 truncate text-left" onClick={() => setPreview(item.verse)}>
                      {verseId(item.verse)}
                    </button>
                    <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => move(i, -1)} aria-label="Move up">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => move(i, 1)} aria-label="Move down">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => mutateSession((prev) => prev.filter((s) => s.id !== item.id))}
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
              {!session.length && (
                <li className="text-sm text-muted-foreground">Add verses from the preview to build a service list.</li>
              )}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Recent</p>
              {recent.length > 0 && (
                <button
                  type="button"
                  className="p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setRecent([]);
                    writeLocal("recent", []);
                  }}
                  aria-label="Clear recent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {recent.map((v) => (
                <button
                  key={verseId(v)}
                  type="button"
                  onClick={() => setPreview(v)}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent"
                >
                  {verseId(v)}
                </button>
              ))}
              {!recent.length && <p className="text-sm text-muted-foreground">Verses you display appear here.</p>}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Output appearance</p>
            <DisplaySettingsPanel settings={settings} onChange={updateSettings} />
          </div>

          <p className="border-t border-border pt-4 text-[11px] text-muted-foreground">
            Selah · Built by Raven · Dunamis Pegi Media Department
          </p>
        </aside>
      </main>

      {showShortcuts && <ShortcutsDialog onClose={() => setShowShortcuts(false)} />}
      <InteractiveGuide open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}