"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { LoaderAnimation } from "@/components/ui/loader-animation"
import { cn } from "@/lib/utils"

const GREETING_COUNT = 12
const INTERVAL_MS = 170

type PreloaderProps = {
  className?: string
  /** Fired once when the loader finishes (exit animation starts). */
  onComplete?: () => void
}

export function Preloader({ className, onComplete }: PreloaderProps) {
  const [done, setDone] = React.useState(false)
  const shouldReduceMotion = useReducedMotion()
  const onCompleteRef = React.useRef(onComplete)

  React.useEffect(() => {
    onCompleteRef.current = onComplete
  })

  React.useEffect(() => {
    if (done) onCompleteRef.current?.()
  }, [done])

  const totalMs = React.useMemo(
    () =>
      shouldReduceMotion ? 400 : GREETING_COUNT * INTERVAL_MS,
    [shouldReduceMotion]
  )

  React.useEffect(() => {
    if (done) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"

    const timer = window.setTimeout(() => setDone(true), totalMs)

    return () => {
      root.style.overflow = previousOverflow
      window.clearTimeout(timer)
    }
  }, [done, totalMs])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          id="preloader"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading"
          onClick={() => setDone(true)}
          className={cn(
            "fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-background select-none",
            className
          )}
          initial={{ y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0.3 } }
              : {
                  y: "-100%",
                  transition: {
                    duration: 0.7,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }
          }
        >
          <div className="flex flex-col items-center gap-6">
            <LoaderAnimation intervalMs={INTERVAL_MS} />

            <div
              className="h-px w-40 overflow-hidden rounded-full bg-foreground/15"
              aria-hidden="true"
            >
              <motion.div
                className="h-full bg-foreground/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: totalMs / 1000,
                  ease: "linear",
                }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
