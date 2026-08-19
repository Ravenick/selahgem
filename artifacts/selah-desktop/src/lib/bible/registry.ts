// Provider registry — the app only ever talks to `bible`, never to a
// concrete implementation. Replace/extend here to add an API provider.
import { localBibleProvider } from "./localProvider";
import type { BibleProvider } from "./types";

export const bible: BibleProvider = localBibleProvider;
export { UnavailableTranslationError } from "./localProvider";