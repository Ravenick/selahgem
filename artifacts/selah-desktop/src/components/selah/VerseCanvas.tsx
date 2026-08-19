// Single renderer used by BOTH the operator preview and the projector output,
// so what the operator sees is exactly what the congregation sees.
// Type scales with the container width (cqw) instead of the viewport, so the
// small preview pane is a true miniature of the 1920x1080 output.

import type { CSSProperties } from "react";
import type { DisplaySettings } from "@/lib/selah/types";
import type { Verse } from "@/lib/bible/types";

interface Props {
  verse: Verse | null;
  settings: DisplaySettings;
  black?: boolean;
  seq?: number;
  placeholder?: string;
  className?: string;
}

export function VerseCanvas({ verse, settings, black, seq, placeholder, className }: Props) {
  const style: CSSProperties = {
    background: black ? "#000" : settings.background,
    color: settings.textColor,
    fontFamily: settings.fontFamily,
    textAlign: settings.align,
    containerType: "inline-size",
  };

  const anim =
    settings.transition === "fade"
      ? "selah-fade"
      : settings.transition === "slide"
        ? "selah-slide"
        : undefined;

  return (
    <div
      className={`relative flex h-full w-full items-center overflow-hidden ${
        settings.align === "left" ? "justify-start" : settings.align === "right" ? "justify-end" : "justify-center"
      } ${className ?? ""}`}
      style={style}
    >
      {settings.theme === "cinematic" && !black && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(80% 60% at 50% 120%, rgba(120,160,255,0.10), transparent 60%)",
          }}
        />
      )}
      {settings.theme === "classic" && !black && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(100% 80% at 50% 50%, rgba(255,214,150,0.08), transparent 70%)" }}
        />
      )}
      {!black && (verse || placeholder) && (
        <div key={seq} className={`relative w-full px-[7cqw] ${anim ?? ""}`}>
          {verse ? (
            <>
              <p
                style={{
                  fontSize: `${settings.fontSize}cqw`,
                  lineHeight: settings.lineHeight,
                  margin: 0,
                  textWrap: "balance",
                }}
              >
                {verse.text}
              </p>
              {settings.showReference && (
                <p
                  style={{
                    fontSize: `${settings.fontSize * 0.5}cqw`,
                    marginTop: "2.5cqw",
                    letterSpacing: "0.14em",
                    opacity: 0.72,
                    textTransform: "uppercase",
                  }}
                >
                  {verse.book} {verse.chapter}:{verse.verse} · {verse.version.toUpperCase()}
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: `${settings.fontSize * 0.5}cqw`, opacity: 0.35, margin: 0 }}>{placeholder}</p>
          )}
        </div>
      )}
    </div>
  );
}