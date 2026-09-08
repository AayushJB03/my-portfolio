"use client"

import { useEffect } from "react"

export function HapticFeedback() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleGlobalClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null

      while (target && target !== document.body) {
        const tagName = target.tagName.toLowerCase()
        const isInteractive =
          tagName === "a" ||
          tagName === "button" ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("cursor-pointer") ||
          tagName === "input" ||
          tagName === "select" ||
          tagName === "textarea"

        if (isInteractive) {
          if ("vibrate" in navigator) {
            try {
              navigator.vibrate(12)
            } catch {
              // Ignore potential security restrictions
            }
          }
          break
        }
        target = target.parentElement
      }
    }

    document.addEventListener("click", handleGlobalClick, { capture: true })
    return () => {
      document.removeEventListener("click", handleGlobalClick, {
        capture: true,
      })
    }
  }, [])

  return null
}
