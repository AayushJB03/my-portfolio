"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function DitherHint() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setMounted(true)
    const fadeIn = setTimeout(() => setOpacity(1), 100)
    const fadeOut = setTimeout(() => setOpacity(0), 6000)
    return () => {
      clearTimeout(fadeIn)
      clearTimeout(fadeOut)
    }
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"
  const color = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)"
  const textColor = isDark ? "text-white/55" : "text-black/55"

  return (
    <div
      className="pointer-events-none absolute top-[25%] right-0 z-50 hidden -translate-y-1/2 translate-x-full transition-opacity duration-1000 sm:block"
      style={{ opacity }}
    >
      <div className="flex items-center gap-0 pl-2 lg:pl-3">
        <svg
          width="80"
          height="36"
          viewBox="0 0 80 36"
          fill="none"
          className="h-8 w-[70px] lg:h-9 lg:w-[80px]"
        >
          <path
            d="M6 26 C16 22, 22 10, 44 12 C60 14, 68 20, 74 18"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M69 13 L76 18 L69 23"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className={`font-mono text-[11px] font-medium tracking-tight lg:text-xs ${textColor}`}
        >
          Press{" "}
          <kbd className="rounded border border-current/25 px-1.5 py-0.5 text-[10px] lg:text-[11px]">
            Ctrl+B
          </kbd>
        </span>
      </div>
    </div>
  )
}
