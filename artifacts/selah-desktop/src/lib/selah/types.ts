import type { Verse } from "../bible/types";

export type ThemeId = "minimal" | "classic" | "cinematic" | "light";
export type TransitionId = "instant" | "fade" | "slide";
export type AlignId = "left" | "center" | "right";

export interface DisplaySettings {
  theme: ThemeId;
  fontFamily: string;
  fontSize: number; // relative units (vw scaling factor)
  lineHeight: number;
  align: AlignId;
  showReference: boolean;
  background: string;
  textColor: string;
  transition: TransitionId;
}

export interface LiveState {
  verse: Verse | null;
  black: boolean;
  settings: DisplaySettings;
  /** bumped on every send so the output can retrigger transitions */
  seq: number;
}

export interface SessionItem {
  id: string;
  verse: Verse;
  done: boolean;
}

export const FONTS = [
  { label: "Inter Tight (Sans)", value: "'Outfit', system-ui, sans-serif" },
  { label: "Cormorant (Serif)", value: "'Cormorant Garamond', Georgia, serif" },
  { label: "Georgia (System serif)", value: "Georgia, 'Times New Roman', serif" },
  { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
];

export const THEMES: Record<ThemeId, { label: string; background: string; textColor: string }> = {
  minimal: { label: "Minimal", background: "#000000", textColor: "#ffffff" },
  classic: { label: "Classic", background: "#161311", textColor: "#f5e9d0" },
  cinematic: { label: "Cinematic", background: "#0a0f17", textColor: "#eaf1fb" },
  light: { label: "Light", background: "#f7f5f0", textColor: "#14161a" },
};

export const DEFAULT_SETTINGS: DisplaySettings = {
  theme: "minimal",
  fontFamily: FONTS[0]!.value,
  fontSize: 3.4,
  lineHeight: 1.35,
  align: "center",
  showReference: true,
  background: "#000000",
  textColor: "#ffffff",
  transition: "instant",
};