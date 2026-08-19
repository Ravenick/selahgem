import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Download,
  Monitor,
  Globe,
  Tv,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Layers,
  ArrowRight,
  Sliders,
  Maximize2,
  Keyboard,
  Laptop,
} from "lucide-react";
import { SelahLogo } from "@/components/selah/SelahLogo";
import {
  APP_VERSION,
  WINDOWS_DOWNLOAD_URL,
  BRAND_NAME,
  PRODUCT_NAME,
  ANNOUNCEMENT_PHRASE,
} from "@/lib/selah/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SELAH Canyon | SELAH Studio — Quick Scripture Presentation" },
      {
        name: "description",
        content:
          "SELAH Canyon presents SELAH Studio: fast, distraction-free Scripture presentation for church media operators and worship teams. Available now on Windows and Web.",
      },
      {
        property: "og:title",
        content: "SELAH Canyon | SELAH Studio — Quick Scripture Presentation",
      },
      {
        property: "og:description",
        content:
          "Download SELAH Studio for Windows or use the web studio. Instant Scripture search, stage preview, and live congregation output.",
      },
    ],
  }),
  component: LandingPage,
});

const DEMO_VERSES = [
  {
    ref: "John 3:16",
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    theme: "Love & Salvation",
  },
  {
    ref: "Psalm 23:1-2",
    text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    theme: "Comfort & Peace",
  },
  {
    ref: "Romans 8:28",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    theme: "Providence & Hope",
  },
  {
    ref: "Isaiah 40:31",
    text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    theme: "Strength & Renewal",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [demoFontSize, setDemoFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [isBlackout, setIsBlackout] = useState(false);

  // If running inside the Tauri native desktop app, go straight to the operator panel
  useEffect(() => {
    if (typeof window !== "undefined" && ("__TAURI_INTERNALS__" in window || "__TAURI__" in window)) {
      navigate({ to: "/selahstudio" });
    }
  }, [navigate]);

  const activeVerse = DEMO_VERSES[selectedDemoIndex]!;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // accounts for fixed navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* ----------------- Top Navigation Bar ----------------- */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <SelahLogo className="h-8 w-8 shadow-sm" />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-foreground leading-none">
                  SELAH <span className="text-primary font-normal text-sm">Canyon</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Studio Edition
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 md:flex text-xs font-medium text-muted-foreground">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "features")}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              Features
            </a>
            <a
              href="#preview-demo"
              onClick={(e) => handleSmoothScroll(e, "preview-demo")}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              Live Preview
            </a>
            <a
              href="#windows-app"
              onClick={(e) => handleSmoothScroll(e, "windows-app")}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              Windows App
            </a>
            <a
              href="#web-studio"
              onClick={(e) => handleSmoothScroll(e, "web-studio")}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              Web Studio
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/selahstudio"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-accent hover:border-border/80 shadow-sm"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Use</span> Web
            </Link>
            <a
              href={WINDOWS_DOWNLOAD_URL}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
              <span className="hidden sm:inline">for Windows</span>
            </a>
          </div>
        </div>
      </header>

      {/* ----------------- Hero Section ----------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow ambient background aura */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[480px] w-[650px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Version / Status Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-card/80 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm shadow-sm transition-all hover:border-primary/40">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-semibold text-foreground">SELAH Studio for Windows</span>
            <span className="text-muted-foreground">·</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-mono font-bold text-primary">
              v{APP_VERSION} Available Now
            </span>
          </div>

          {/* Sub-brand / Announcement Phrase */}
          <div className="mt-4">
            <p className="text-xs font-semibold tracking-wide uppercase text-primary/90">
              {ANNOUNCEMENT_PHRASE}
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="mt-4 font-extrabold text-3xl tracking-tight text-foreground sm:text-5xl md:text-6xl font-['Manrope']">
            Effortless Scripture Presentation.
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
              Built for Sanctuary Moments.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Search Scripture in seconds, preview typography on a live 16:9 stage canvas, and project seamlessly to congregation screens. Free, distraction-free, and offline ready.
          </p>

          {/* Main CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={WINDOWS_DOWNLOAD_URL}
              className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.99] sm:w-auto"
            >
              <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download SELAH Studio</span>
              <span className="rounded bg-black/20 px-1.5 py-0.5 text-[11px] font-mono text-primary-foreground/90">
                .exe
              </span>
            </a>

            <Link
              to="/selahstudio"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card/90 px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:border-border/80 sm:w-auto"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span>Use Web Version</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>

          {/* Platform note below CTAs */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Laptop className="h-3.5 w-3.5 text-primary" />
              Available for Windows 10/11 (64-bit)
            </span>
            <span>·</span>
            <span>Zero install web version also available</span>
            <span>·</span>
            <span>100% Free &amp; Offline KJV bundled</span>
          </div>
        </div>

        {/* ----------------- Interactive Sanctuary Preview Simulator ----------------- */}
        <div id="preview-demo" className="mx-auto mt-14 max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 rounded-full bg-live animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Live Stage Output Simulator
                </span>
                <span className="hidden rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline">
                  16:9 Sanctuary Canvas
                </span>
              </div>

              {/* Sample Passage Selectors */}
              <div className="flex flex-wrap gap-1.5">
                {DEMO_VERSES.map((v, i) => (
                  <button
                    key={v.ref}
                    type="button"
                    onClick={() => {
                      setSelectedDemoIndex(i);
                      setIsBlackout(false);
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedDemoIndex === i && !isBlackout
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v.ref}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Canvas Rendering */}
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-inner">
              {isBlackout ? (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground/60 font-mono">
                  [ SCREEN BLACKOUT ACTIVE — PRESS RESTORE TO DISPLAY ]
                </div>
              ) : (
                <div className="flex h-full w-full flex-col justify-between p-6 sm:p-10 md:p-12 text-center text-white">
                  <div />
                  {/* Scripture Text */}
                  <div className="mx-auto max-w-3xl">
                    <p
                      className={`leading-relaxed tracking-normal transition-all font-['Manrope'] ${
                        demoFontSize === "normal"
                          ? "text-base sm:text-2xl md:text-3xl font-medium"
                          : demoFontSize === "large"
                            ? "text-lg sm:text-3xl md:text-4xl font-semibold"
                            : "text-xl sm:text-4xl md:text-5xl font-bold"
                      }`}
                    >
                      “{activeVerse.text}”
                    </p>
                    <p className="mt-4 font-bold text-xs sm:text-sm tracking-widest uppercase text-primary font-mono">
                      — {activeVerse.ref} (KJV)
                    </p>
                  </div>

                  {/* Sanctuary Footer Indicator */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>SELAH STUDIO OUTPUT</span>
                    <span className="hidden sm:inline">THEME: {activeVerse.theme}</span>
                    <span>1080P WIDESCREEN</span>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Canvas Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Font Scale:</span>
                <button
                  type="button"
                  onClick={() => setDemoFontSize("normal")}
                  className={`rounded px-2 py-1 ${demoFontSize === "normal" ? "bg-accent text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Regular
                </button>
                <button
                  type="button"
                  onClick={() => setDemoFontSize("large")}
                  className={`rounded px-2 py-1 ${demoFontSize === "large" ? "bg-accent text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Large
                </button>
                <button
                  type="button"
                  onClick={() => setDemoFontSize("xlarge")}
                  className={`rounded px-2 py-1 ${demoFontSize === "xlarge" ? "bg-accent text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Extra Large
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBlackout(!isBlackout)}
                  className={`rounded-md border border-border px-3 py-1 font-medium transition-colors ${
                    isBlackout
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isBlackout ? "Restore Output (B)" : "Blackout Output (B)"}
                </button>

                <Link
                  to="/selahstudio"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Launch Full Panel
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Features Grid (Bento Style) ----------------- */}
      <section id="features" className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Engineered for Sanctuary Flow
            </span>
            <h2 className="mt-2 font-extrabold text-2xl tracking-tight text-foreground sm:text-4xl font-['Manrope']">
              Everything church media operators need.
              <br />
              Nothing to slow you down.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Built with love for Dunamis Pegi Media Department and worship teams worldwide.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30">
              <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-base text-foreground">Rapid Scripture Lookup</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Type reference abbreviations like <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">Jn 3:16</code>, <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">Rom 8 28</code>, or search keywords directly. Instantaneous offline filtering.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30">
              <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <Tv className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-base text-foreground">Dedicated Projector Window</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                One-click <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">/output</code> display route opens a clean, borderless congregation screen. Drag to projector and press F11 for fullscreen.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30">
              <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <Keyboard className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-base text-foreground">Lightning Keyboard Hotkeys</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Trigger live verse with <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">Space</kbd>, clear with <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">Esc</kbd>, blackout with <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">B</kbd>, and step verses with arrow keys.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30">
              <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-base text-foreground">Service Order Staging</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Prepare sermon points and service scripture setlists in advance. Reorder on the fly, export to JSON, or import shared sets from pastors.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30">
              <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-base text-foreground">100% Offline Resilience</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                No internet connection required in the sanctuary booth. The complete King James Version is pre-cached locally into browser storage and native desktop binaries.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30">
              <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-base text-foreground">Sanctuary Typography Tuning</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Adjust font scales dynamically (+ / -), customize margins, toggle high-contrast display palettes, and ensure legibility from the back pews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Windows Desktop App Section ----------------- */}
      <section id="windows-app" className="border-t border-border py-20 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-card to-background p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-md bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  <Laptop className="h-3.5 w-3.5" />
                  Native Windows Application Available Now
                </div>

                <h3 className="font-extrabold text-2xl sm:text-3xl text-foreground font-['Manrope']">
                  Download SELAH Studio for Windows
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Install the dedicated desktop application on your media team's PC. Features multi-window output, lightweight native footprint with zero background bloat, and automatic window state persistence.
                </p>

                <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Self-contained 64-bit installer (<code className="font-mono text-foreground">SELAH_0.1.0_x64-setup.exe</code>)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Works completely offline with pre-packaged local Bible databases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Compatible with Windows 10 and Windows 11</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={WINDOWS_DOWNLOAD_URL}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download for Windows (v{APP_VERSION})</span>
                  </a>
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-xs rounded-xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-sm text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <SelahLogo className="h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground">SELAH Studio v{APP_VERSION}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Windows NSIS Package</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-left font-mono text-[11px] text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Architecture:</span>
                      <span className="text-foreground">x64 (64-bit)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target OS:</span>
                      <span className="text-foreground">Win 10 / 11</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installer Type:</span>
                      <span className="text-foreground">Native NSIS</span>
                    </div>
                  </div>
                  <a
                    href={WINDOWS_DOWNLOAD_URL}
                    className="block w-full rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm text-center"
                  >
                    Get Windows Installer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Web Studio Choice Section ----------------- */}
      <section id="web-studio" className="border-t border-border bg-card/20 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-foreground">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Zero Installation Required
              </div>
              <h3 className="font-extrabold text-2xl text-foreground font-['Manrope']">
                Prefer running in the browser?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Launch the SELAH Studio Web Operator Panel instantly in Chrome, Edge, or Firefox. Uses modern Web BroadcastChannel to sync live screens between tabs or monitors.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Link
                to="/selahstudio"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-xs font-bold text-background transition-all hover:bg-foreground/90 shadow-md"
              >
                <span>Open Web Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Footer ----------------- */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border pb-8">
            <div className="flex items-center gap-3">
              <SelahLogo className="h-9 w-9" />
              <div>
                <span className="font-extrabold text-lg tracking-wider text-foreground">
                  {BRAND_NAME}
                </span>
                <p className="text-xs text-muted-foreground">
                  {PRODUCT_NAME} · Quick Scripture Presentation
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, "features")}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                Features
              </a>
              <a
                href="#preview-demo"
                onClick={(e) => handleSmoothScroll(e, "preview-demo")}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                Live Preview
              </a>
              <a
                href="#windows-app"
                onClick={(e) => handleSmoothScroll(e, "windows-app")}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                Windows Download
              </a>
              <Link to="/selahstudio" className="hover:text-foreground transition-colors">
                Web Studio
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} {BRAND_NAME}. {ANNOUNCEMENT_PHRASE}
            </p>
            <p>
              Built by Raven · Dunamis Pegi Media Department
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
