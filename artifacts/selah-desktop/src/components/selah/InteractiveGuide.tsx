import { useState, useEffect } from "react";
import {
  HelpCircle,
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Monitor,
  Tv,
  Keyboard,
  ListOrdered,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { SelahLogo } from "./SelahLogo";

interface InteractiveGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORAGE_KEY = "selah:dismiss_tutorial_guide";

const STEPS = [
  {
    title: "Welcome to SELAH Studio",
    subtitle: "Fast, distraction-free Scripture presentation for church operators",
    icon: Sparkles,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          SELAH Studio is built specifically for church media operators and worship teams who need to find, preview, and project Bible verses in seconds.
        </p>
        <div className="rounded-lg border border-border bg-card p-3.5">
          <h4 className="font-semibold text-foreground">Core Workflow:</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            <strong className="text-foreground">1. Search</strong> (Type verse or keyword) &rarr;{" "}
            <strong className="text-foreground">2. Preview</strong> (Verify layout on stage canvas) &rarr;{" "}
            <strong className="text-foreground">3. Display</strong> (Send to congregation projector screen)
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "1 | Rapid Scripture Search",
    subtitle: "Locate any passage instantly with smart reference parsing",
    icon: Search,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold text-foreground">Ctrl + F</kbd> anytime to jump to the search bar.
        </p>
        <ul className="space-y-2 text-xs">
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">&bull;</span>
            <span><strong>Reference search:</strong> Type <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">John 3:16</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">Rom 8 28</code>, or <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">Ps 23</code>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">&bull;</span>
            <span><strong>Keyword search:</strong> Type phrases like <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">for God so loved</code>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">&bull;</span>
            <span><strong>Offline King James:</strong> Preloaded locally into browser storage; works with zero internet required.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "2 | Live Stage Preview",
    subtitle: "Inspect exact typography, line wrapping, and font scaling",
    icon: Tv,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Clicking any search result loads it into the central <strong>Preview Canvas</strong>.
        </p>
        <div className="rounded-lg border border-border bg-card p-3 text-xs space-y-1.5">
          <p><strong>Aspect Ratio:</strong> Renders in standard 16:9 widescreen format matching your church displays.</p>
          <p><strong>Instant Font Resizing:</strong> Use the <strong className="text-foreground">Font +</strong> and <strong className="text-foreground">Font &minus;</strong> buttons (or press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-foreground">+</kbd> / <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-foreground">-</kbd> on your keyboard) to adjust reading size on the fly.</p>
        </div>
      </div>
    ),
  },
  {
    title: "3 | Live Presentation Controls",
    subtitle: "Send to screen, step through chapters, or blackout instantly",
    icon: Monitor,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border bg-card p-2.5">
            <p className="font-semibold text-foreground">Spacebar / Display</p>
            <p className="mt-0.5 text-muted-foreground">Pushes preview verse live to projector screen.</p>
          </div>
          <div className="rounded-md border border-border bg-card p-2.5">
            <p className="font-semibold text-foreground">Esc / Clear</p>
            <p className="mt-0.5 text-muted-foreground">Clears scripture off the live screen cleanly.</p>
          </div>
          <div className="rounded-md border border-border bg-card p-2.5">
            <p className="font-semibold text-foreground">B / Blackout</p>
            <p className="mt-0.5 text-muted-foreground">Blanks output to solid black during transitions.</p>
          </div>
          <div className="rounded-md border border-border bg-card p-2.5">
            <p className="font-semibold text-foreground">&uarr; / &darr; Arrows</p>
            <p className="mt-0.5 text-muted-foreground">Steps sequentially to next or previous verse.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "4 | Service Order & Session Staging",
    subtitle: "Prepare scriptures in advance for sermons and service sets",
    icon: ListOrdered,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Use the right-hand panel to build your service list. Click <strong className="text-foreground">+ Service</strong> on any verse to stage it.
        </p>
        <ul className="space-y-1.5 text-xs">
          <li className="flex items-center gap-1.5">
            <span className="font-bold text-primary">&bull;</span>
            <span><strong>Reorder:</strong> Use Up/Down arrows to arrange scriptures in preaching order.</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="font-bold text-primary">&bull;</span>
            <span><strong>Save & Export:</strong> Export your session as a <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">.json</code> file to share with team members.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "5 | Dual-Monitor Projector Setup",
    subtitle: "Dedicated clean output window for congregation screens",
    icon: Monitor,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Click <strong className="text-foreground">Open Output Screen</strong> in the top bar to launch the dedicated display window.
        </p>
        <div className="rounded-lg border border-border bg-card p-3 text-xs space-y-1.5">
          <p className="font-semibold text-foreground">Two-step display placement:</p>
          <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
            <li>Drag the newly opened output window onto your church TV/projector display.</li>
            <li>Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-foreground">F11</kbd> (or click on the window) to enter clean, borderless fullscreen.</li>
          </ol>
        </div>
      </div>
    ),
  },
];

export function InteractiveGuide({ open, onOpenChange }: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [viewMode, setViewMode] = useState<"tour" | "static">("tour");

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY) === "true";
    if (isDismissed) {
      setDontShowAgain(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    onOpenChange(false);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  if (!open) return null;

  const step = STEPS[currentStep] ?? STEPS[0]!;
  const StepIcon = step.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm selah-fade"
    >
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-background p-6 shadow-2xl transition-all">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <SelahLogo className="h-8 w-8" />
            <div>
              <h3 className="font-extrabold text-lg tracking-wide text-foreground">
                SELAH Studio <span className="text-muted-foreground font-normal text-sm">| Guide &amp; Tutorial</span>
              </h3>
              <p className="text-xs text-muted-foreground">SELAH Studio Operator Quick-Start &amp; Reference Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border p-0.5 bg-muted text-xs">
              <button
                type="button"
                onClick={() => setViewMode("tour")}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  viewMode === "tour" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Interactive Tour
              </button>
              <button
                type="button"
                onClick={() => setViewMode("static")}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  viewMode === "static" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Static Guide
              </button>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Close guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mode 1: Interactive Tour */}
        {viewMode === "tour" ? (
          <div className="mt-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-between pb-3 text-xs text-muted-foreground">
              <span className="font-medium">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <div className="flex gap-1">
                {STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStep ? "w-6 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground"
                    }`}
                    aria-label={`Jump to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Step Header */}
            <div className="mt-2 flex items-start gap-3.5">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <StepIcon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
              </div>
            </div>

            {/* Step Content */}
            <div className="mt-4 min-h-[160px] rounded-lg bg-card/60 p-4 border border-border">
              {step.content}
            </div>

            {/* Footer Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                Don't show automatically on startup
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-30"
                >
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {currentStep === STEPS.length - 1 ? (
                    <>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Mode 2: Static Cheat Sheet & How to Use Reference */
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
            <div className="rounded-lg border border-border bg-card p-3.5 space-y-2">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                How to Use SELAH Studio Operator Panel
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                SELAH Studio runs entirely offline in your browser or desktop window. All Scripture searches are performed instantaneously against the bundled King James Version database.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
                <h5 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-primary" />
                  Search Syntax
                </h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&bull; <strong className="text-foreground">Book + Chapter + Verse:</strong> <code className="bg-muted px-1 py-0.5 rounded">John 3:16</code>, <code className="bg-muted px-1 py-0.5 rounded">2 Cor 5:17</code></li>
                  <li>&bull; <strong className="text-foreground">Chapter:</strong> <code className="bg-muted px-1 py-0.5 rounded">Psalm 23</code>, <code className="bg-muted px-1 py-0.5 rounded">Gen 1</code></li>
                  <li>&bull; <strong className="text-foreground">Keyword search:</strong> <code className="bg-muted px-1 py-0.5 rounded">faith hope love</code></li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
                <h5 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Keyboard className="h-3.5 w-3.5 text-primary" />
                  Key Shortcuts
                </h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&bull; <kbd className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">Space</kbd> : Display preview verse live</li>
                  <li>&bull; <kbd className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">Esc</kbd> : Clear screen immediately</li>
                  <li>&bull; <kbd className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">B</kbd> : Toggle blackout curtain</li>
                  <li>&bull; <kbd className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">&uarr; / &darr;</kbd> : Step verse back / forward</li>
                  <li>&bull; <kbd className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">+ / &minus;</kbd> : Increase / decrease font size</li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
              <h5 className="font-semibold text-foreground flex items-center gap-1.5">
                <Tv className="h-3.5 w-3.5 text-primary" />
                Projector &amp; Second Screen Setup
              </h5>
              <p className="text-muted-foreground">
                Click <strong>Open output screen</strong> in the header bar. Drag the output window onto your church projector or television, then press <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">F11</kbd> for fullscreen. Changes made on this operator panel will immediately synchronize via BroadcastChannel.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                  setViewMode("tour");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
              >
                <Play className="h-3.5 w-3.5" />
                Launch Interactive Walkthrough
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Close Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
