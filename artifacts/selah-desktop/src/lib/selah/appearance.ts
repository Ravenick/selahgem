// App chrome appearance (dark/light + customizable accent hue).
// Kept out of React state so it can be applied before first paint.
import { readLocalRaw, writeLocal } from "./storage";

export interface Appearance {
  mode: "dark" | "light";
  accent: string; // accent hue in oklch degrees
}

export const ACCENTS = [
  { label: "Gold", value: "42" },
  { label: "Amber", value: "70" },
  { label: "Sage", value: "150" },
  { label: "Teal", value: "195" },
  { label: "Sky", value: "245" },
  { label: "Violet", value: "300" },
  { label: "Rose", value: "10" },
];

export const DEFAULT_APPEARANCE: Appearance = { mode: "dark", accent: "42" };

export function readAppearance(): Appearance {
  return { ...DEFAULT_APPEARANCE, ...readLocalRaw<Partial<Appearance>>("appearance", {}) };
}

export function applyAppearance(a: Appearance) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", a.mode === "dark");
  document.documentElement.style.setProperty("--accent-h", a.accent);
  writeLocal("appearance", a);
}