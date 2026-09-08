import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"

const shimmer =
  "animate-pulse bg-gradient-to-r from-muted/55 via-muted to-muted/55"

export function SkeletonBlock({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(shimmer, "rounded-md", className)}
      style={style}
    />
  )
}
