// Multi-display bridge.
//
// The operator panel and the fullscreen output route run in separate windows
// (the second window is dragged onto the projector). They stay in sync through
// BroadcastChannel, with a localStorage mirror so a window opened later — or a
// browser without BroadcastChannel — still picks up the current live state.

import type { LiveState } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { readLocalRaw, writeLocal } from "./storage";

const CHANNEL = "selah-live";
const KEY = "live";

export const EMPTY_LIVE: LiveState = {
  verse: null,
  black: false,
  settings: DEFAULT_SETTINGS,
  seq: 0,
};

export function readLive(): LiveState {
  const state = readLocalRaw<LiveState>(KEY, EMPTY_LIVE);
  return { ...EMPTY_LIVE, ...state, settings: { ...DEFAULT_SETTINGS, ...state.settings } };
}

export function publishLive(state: LiveState) {
  writeLocal(KEY, state);
  try {
    const ch = new BroadcastChannel(CHANNEL);
    ch.postMessage(state);
    ch.close();
  } catch {
    /* BroadcastChannel unsupported — the storage event still syncs windows */
  }
}

export function subscribeLive(cb: (state: LiveState) => void): () => void {
  let ch: BroadcastChannel | null = null;
  try {
    ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = (e) => cb(e.data as LiveState);
  } catch {
    ch = null;
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === "selah:live") cb(readLive());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    ch?.close();
    window.removeEventListener("storage", onStorage);
  };
}