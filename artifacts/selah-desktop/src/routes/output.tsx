// Projector / congregation output.
//
// Deliberately contains NO operator controls: it mirrors the live state
// published by the panel via BroadcastChannel. Open it in a second window,
// drag that window onto the projector and press fullscreen (or F11).
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { VerseCanvas } from "@/components/selah/VerseCanvas";
import { EMPTY_LIVE, readLive, subscribeLive } from "@/lib/selah/live";
import type { LiveState } from "@/lib/selah/types";

export const Route = createFileRoute("/output")({
  head: () => ({
    meta: [
      { title: "SELAH | Live Output" },
      { name: "description", content: "Fullscreen Scripture output screen for the congregation display." },
      { property: "og:title", content: "SELAH | Live Output" },
      { property: "og:description", content: "Fullscreen Scripture output screen for the congregation display." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Output,
});

function Output() {
  const [live, setLive] = useState<LiveState>(EMPTY_LIVE);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    setLive(readLive());
    const unsub = subscribeLive(setLive);
    const t = window.setTimeout(() => setHint(false), 6000);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, []);

  const goFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {
      /* permission denied — operator can still press F11 */
    });
  };

  return (
    <div className="h-screen w-screen cursor-none overflow-hidden bg-black">
      <VerseCanvas verse={live.verse} settings={live.settings} black={live.black} seq={live.seq} />
      {hint && !live.verse && (
        <button
          type="button"
          onClick={goFullscreen}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur"
        >
          Move this window to the projector · click for fullscreen
        </button>
      )}
    </div>
  );
}