// Local persistence. No account, no database — everything lives on the
// operator's machine so Selah works with zero network.

export function readLocalRaw<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(`selah:${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`selah:${key}`, JSON.stringify(value));
  } catch {
    /* quota / private mode — non-fatal */
  }
}