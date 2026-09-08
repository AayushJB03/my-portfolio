"use client"

import * as React from "react"

import { Preloader } from "@/components/site/preloader"
import { cn } from "@/lib/utils"

type SiteBootProps = {
  children: React.ReactNode
}

export function SiteBoot({ children }: SiteBootProps) {
  const [booted, setBooted] = React.useState(false)
  const [prepared, setPrepared] = React.useState(false)

  React.useEffect(() => {
    // Prepare the site behind the loader at low priority so the loader
    // animation stays smooth: idle callback defers the work until the
    // main thread is free, and startTransition marks the render as
    // non-urgent so loader updates always win.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(
        () => React.startTransition(() => setPrepared(true)),
        { timeout: 1000 }
      )
      return () => window.cancelIdleCallback(id)
    }

    const timeout = window.setTimeout(
      () => React.startTransition(() => setPrepared(true)),
      250
    )
    return () => window.clearTimeout(timeout)
  }, [])

  const finish = React.useCallback(() => {
    setPrepared(true)
    setBooted(true)
  }, [])

  return (
    <>
      <Preloader onComplete={finish} />
      <div
        aria-hidden={!booted}
        inert={!booted}
        className={cn(
          booted ? "visible" : "invisible pointer-events-none select-none"
        )}
      >
        {prepared ? children : null}
      </div>
    </>
  )
}

export default SiteBoot
