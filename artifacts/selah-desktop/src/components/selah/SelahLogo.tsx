export function SelahLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="SELAH Studio Logo"
      className={`inline-block object-contain select-none shrink-0 ${className}`}
    />
  );
}
