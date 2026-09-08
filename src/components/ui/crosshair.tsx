import { cn } from "@/lib/utils"

export const CrosshairMark = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      "pointer-events-none absolute z-30 select-none",
      className
    )}
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-muted-foreground"
    >
      <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.2" />
      <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  </span>
)
