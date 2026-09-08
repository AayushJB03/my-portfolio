"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"
import { flushSync } from "react-dom"
import { useDitherTheme } from "@/components/providers/dither-theme-provider"
import { playSound } from "@/lib/sounds"
import { switchTheme, toggleTheme } from "@/lib/theme-transition"

export function ThemeShortcut() {
  const { resolvedTheme, setTheme } = useTheme()
  const { cycleColor } = useDitherTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, or contenteditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      if (e.key === "d" || e.key === "D") {
        const next = resolvedTheme === "dark" ? "light" : "dark"
        playSound(next === "dark" ? "lampOff" : "lampOn")
        toggleTheme(() => {
          switchTheme()
          flushSync(() => setTheme(next))
        })
      }

      if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault()
        cycleColor()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme, cycleColor])

  return null
}
