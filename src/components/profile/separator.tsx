import { cn } from "@/lib/utils"

export function Separator({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative left-1/2 flex h-6 w-screen -translate-x-1/2 overflow-hidden",
        "border-[color-mix(in_oklab,var(--edge)_40%,transparent)] border-y",
        "bg-[repeating-linear-gradient(-45deg,color-mix(in_oklab,var(--edge)_30%,transparent)_0_2px,transparent_2px_10px)]",
        className
      )}
    />
  )
}
