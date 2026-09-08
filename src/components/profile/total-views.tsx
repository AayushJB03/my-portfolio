import { getTotalViews, getTotalVisitors } from "@/lib/google-analytics"
import { Eye } from "lucide-react"

export async function TotalViews() {
  const [totalViews, totalVisitors] = await Promise.all([
    getTotalViews(),
    getTotalVisitors(),
  ])

  return (
    <section
      className="flex min-h-10 w-full items-center justify-start px-3 py-1.5 sm:px-4"
      aria-label="Website views and visitors"
    >
      <div className="text-muted-foreground flex shrink-0 items-center gap-1.5">
        <Eye
          className="size-3.5 shrink-0"
          aria-hidden="true"
        />
        <span className="font-pixelify text-primary/90 text-xs leading-none font-medium sm:text-sm">
          You are the{" "}
          <span className="text-primary inline-flex items-start font-mono text-xs leading-none font-semibold tabular-nums sm:text-sm">
            {totalVisitors === null
              ? "—"
              : totalVisitors.toLocaleString("en-US")}
            {totalVisitors !== null && (
              <sup className="text-primary/70 ml-px translate-y-[-0.2em] font-pixelify text-[7px] leading-none font-semibold sm:text-[8px]">
                th
              </sup>
            )}
          </span>
          {" "}visitor...!
        </span>
        <span
          className="border-primary/25 h-3 border-l border-dotted"
          aria-hidden="true"
        />
        <span className="font-pixelify text-primary/90 text-xs leading-none font-medium sm:text-sm">
          <span className="text-primary inline-flex items-baseline font-mono text-xs leading-none font-semibold tabular-nums sm:text-sm">
            {totalViews === null ? "—" : totalViews.toLocaleString("en-US")}
          </span>{" "}
          views
        </span>
      </div>
      <span className="border-primary/25 ml-3 h-px flex-1 border-t border-dotted sm:ml-4" aria-hidden="true" />
    </section>
  )
}
