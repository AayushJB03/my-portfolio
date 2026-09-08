"use client"

import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { useDitherTheme, DITHER_COLORS } from "@/components/providers/dither-theme-provider"

const DitherCanvas = dynamic(() => import("../ui/dither"), {
  ssr: false,
})

const BASE_CONFIG = {
  dark: {
    baseColor: [0.02, 0.02, 0.02] as [number, number, number],
    colorNum: 4,
    ditherBias: 0.2,
  },
  light: {
    baseColor: [0.93, 0.93, 0.94] as [number, number, number],
    colorNum: 4,
    ditherBias: 0.22,
  },
} as const

export function Dither() {
  const { resolvedTheme } = useTheme()
  const { colorIndex } = useDitherTheme()
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted])

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setOpacity(1), 50)
      return () => clearTimeout(timer)
    } else {
      setOpacity(0)
    }
  }, [inView])

  if (!mounted) {
    return (
      <div
        className="h-full w-full bg-[var(--header-dither-base)]"
        aria-hidden
      />
    )
  }

  const theme = resolvedTheme === "light" ? "light" : "dark"
  const palette = DITHER_COLORS[colorIndex]
  const baseConfig = BASE_CONFIG[theme]

  return (
    <div ref={containerRef} className="h-full w-full">
      <div
        className="h-full w-full transition-opacity duration-700 ease-in-out"
        style={{ opacity }}
      >
        {inView ? (
          <DitherCanvas
            baseColor={baseConfig.baseColor}
            waveColor={palette[theme].waveColor}
            colorNum={baseConfig.colorNum}
            ditherBias={baseConfig.ditherBias}
            disableAnimation={false}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.25}
            pixelSize={2}
          />
        ) : (
          <div
            className="h-full w-full bg-[var(--header-dither-base)]"
            aria-hidden
          />
        )}
      </div>
    </div>
  )
}
