import { cn } from "@/lib/utils"
import { CrosshairMark } from "@/components/ui/crosshair"

export const ContainerWrapper = ({
  children,
  className,
  crosshairs,
}: {
  children: React.ReactNode
  className?: string
  crosshairs?: "top" | "bottom" | "both"
}) => {
  const showTop = crosshairs === "top" || crosshairs === "both"
  const showBottom = crosshairs === "bottom" || crosshairs === "both"

  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full max-w-4xl flex-1 flex-col",
        className
      )}
    >
      <div
        className={cn(
          "border-edge relative mx-2 flex h-full flex-1 flex-col border-x-[1px]"
        )}
      >
        {showTop && (
          <>
            {/* Centered exactly on the top-left rail intersection */}
            <CrosshairMark className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
            <CrosshairMark className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
          </>
        )}
        {showBottom && (
          <>
            {/* Centered exactly on the bottom-left rail intersection */}
            <CrosshairMark className="bottom-0 left-0 -translate-x-1/2 translate-y-[calc(50%+1px)]" />
            <CrosshairMark className="bottom-0 right-0 translate-x-1/2 translate-y-[calc(50%+1px)]" />
          </>
        )}
        {children}
      </div>
    </div>
  )
}
