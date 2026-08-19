import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { ACCENTS, applyAppearance, readAppearance, type Appearance } from "@/lib/selah/appearance";

/** Dark/light toggle + customizable accent colour. */
export function AppearanceMenu() {
  const [appearance, setAppearance] = useState<Appearance | null>(null);

  useEffect(() => setAppearance(readAppearance()), []);

  const update = (next: Appearance) => {
    setAppearance(next);
    applyAppearance(next);
  };

  if (!appearance) return <div className="h-9 w-24" aria-hidden />;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-full border border-border px-2 py-1.5">
        {ACCENTS.map((a) => (
          <button
            key={a.value}
            type="button"
            title={`${a.label} accent`}
            aria-label={`${a.label} accent`}
            onClick={() => update({ ...appearance, accent: a.value })}
            className={`h-3.5 w-3.5 rounded-full transition-transform ${
              appearance.accent === a.value ? "scale-125 ring-2 ring-ring ring-offset-1 ring-offset-background" : ""
            }`}
            style={{ background: `oklch(0.7 0.15 ${a.value})` }}
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Toggle dark mode"
        onClick={() => update({ ...appearance, mode: appearance.mode === "dark" ? "light" : "dark" })}
        className="rounded-full border border-border p-2 transition-colors hover:bg-accent"
      >
        {appearance.mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}