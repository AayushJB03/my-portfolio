"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"
import { switchTheme, toggleTheme } from "@/lib/theme-transition"

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === "dark"

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark"
    const rect = event.currentTarget.getBoundingClientRect()
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    playSound(next === "dark" ? "tickOff" : "tickOn")
    toggleTheme(() => {
      switchTheme()
      flushSync(() => setTheme(next))
    }, origin)
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className={cn(
        "text-muted-foreground hover:text-primary inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors",
        className
      )}
    >
      {isDark ? (
        <Sun className="size-4 md:size-4.5" />
      ) : (
        <Moon className="size-4 md:size-4.5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export default ThemeSwitcher