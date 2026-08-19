import { SelahLogo } from "./SelahLogo";

export function SelahFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-10">
        <div className="flex items-center gap-3">
          <SelahLogo className="h-8 w-8" />
          <div>
            <p className="font-extrabold text-xl tracking-wider font-['Manrope'] text-foreground">
              SELAH <span className="text-primary font-normal text-sm">Canyon</span>
            </p>
            <p className="text-sm text-muted-foreground">SELAH Studio · Quick Scripture Presentation | Offline Ready</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">
          <p>Built by Raven</p>
          <p>Dunamis Pegi Media Department</p>
        </div>
      </div>
    </footer>
  );
}