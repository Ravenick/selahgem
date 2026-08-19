const SHORTCUTS: [string, string][] = [
  ["Ctrl / ⌘ + F", "Focus the search box"],
  ["Enter", "Load the first (or highlighted) result into preview"],
  ["↑ / ↓", "Previous / next verse in preview"],
  ["Space", "Display the previewed verse"],
  ["B", "Black screen on / off"],
  ["Esc", "Clear the output screen"],
  ["+ / -", "Increase / decrease font size"],
  ["F11", "Fullscreen (browser permitting)"],
];

export function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-extrabold text-xl font-['Manrope'] text-foreground">SELAH | Keyboard Shortcuts</h2>
        <dl className="mt-4 space-y-2 text-sm">
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <dt className="rounded border border-border bg-surface px-2 py-1 font-mono text-xs">{key}</dt>
              <dd className="text-right text-muted-foreground">{desc}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Close
        </button>
      </div>
    </div>
  );
}