import { ACCENTS } from "@/lib/selah/appearance";
import { FONTS, THEMES, type DisplaySettings, type ThemeId, type TransitionId, type AlignId } from "@/lib/selah/types";

interface Props {
  settings: DisplaySettings;
  onChange: (patch: Partial<DisplaySettings>) => void;
}

const label = "text-[11px] uppercase tracking-[0.16em] text-muted-foreground";
const field =
  "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function DisplaySettingsPanel({ settings, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className={label}>Theme</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                onChange({ theme: id, background: THEMES[id].background, textColor: THEMES[id].textColor })
              }
              className={`rounded-md border px-2 py-1.5 text-xs transition-colors ${
                settings.theme === id ? "border-primary bg-accent" : "border-border hover:bg-accent/60"
              }`}
            >
              {THEMES[id].label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={label}>Font</p>
        <select
          className={`${field} mt-2`}
          value={settings.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className={label}>Size {settings.fontSize.toFixed(1)}</p>
          <input
            type="range"
            min={1.6}
            max={7}
            step={0.1}
            value={settings.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="mt-2 w-full accent-[var(--primary)]"
          />
        </div>
        <div>
          <p className={label}>Line spacing {settings.lineHeight.toFixed(2)}</p>
          <input
            type="range"
            min={1}
            max={2}
            step={0.05}
            value={settings.lineHeight}
            onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
            className="mt-2 w-full accent-[var(--primary)]"
          />
        </div>
      </div>

      <div>
        <p className={label}>Alignment</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {(["left", "center", "right"] as AlignId[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onChange({ align: a })}
              className={`rounded-md border px-2 py-1.5 text-xs capitalize ${
                settings.align === a ? "border-primary bg-accent" : "border-border hover:bg-accent/60"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className={label}>Background</p>
          <input
            type="color"
            value={settings.background}
            onChange={(e) => onChange({ background: e.target.value })}
            className="mt-2 h-8 w-full cursor-pointer rounded-md border border-border bg-background"
          />
        </div>
        <div>
          <p className={label}>Text colour</p>
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="mt-2 h-8 w-full cursor-pointer rounded-md border border-border bg-background"
          />
        </div>
      </div>

      <div>
        <p className={label}>Transition</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {(["instant", "fade", "slide"] as TransitionId[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ transition: t })}
              className={`rounded-md border px-2 py-1.5 text-xs capitalize ${
                settings.transition === t ? "border-primary bg-accent" : "border-border hover:bg-accent/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.showReference}
          onChange={(e) => onChange({ showReference: e.target.checked })}
          className="accent-[var(--primary)]"
        />
        Show reference on output
      </label>

      <p className="text-[11px] text-muted-foreground">
        Accent colours for this interface: {ACCENTS.map((a) => a.label).join(", ")} — change them in the header.
      </p>
    </div>
  );
}