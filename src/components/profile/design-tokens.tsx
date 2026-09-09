"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "motion/react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { HeaderTitle } from "./header-title"

type Token = {
  name: string
  variable: string
  role: string
}

// The actual signature tokens from globals.css — hex-valued in both themes,
// so what's displayed here is always a real, copyable color, not oklch math.
const TOKENS: Token[] = [
  { name: "Background", variable: "--background", role: "Page canvas" },
  { name: "Surface", variable: "--card", role: "Cards & panels" },
  { name: "Accent", variable: "--header-dither-wave", role: "Header shader" },
  { name: "Accent Secondary", variable: "--footer-shader-front", role: "Footer shader" },
]

const TYPE_SAMPLES = [
  { label: "Display", className: "font-pixelify", sample: "Aa" },
  { label: "Body", className: "font-sans", sample: "Aa" },
  { label: "Code", className: "font-mono", sample: "Aa" },
]

const readTokens = () => {
  if (typeof window === "undefined") return []
  const style = getComputedStyle(document.documentElement)
  return TOKENS.map((token) => ({
    ...token,
    value: style.getPropertyValue(token.variable).trim(),
  }))
}

export function DesignTokens() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [tokens, setTokens] = useState<Array<Token & { value: string }>>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Re-read on theme flips — the same variable resolves to a different hex
  // in light vs dark, since these are set per-theme in globals.css.
  useEffect(() => {
    if (!mounted) return
    setTokens(readTokens())
  }, [mounted, resolvedTheme])

  const copyValue = async (variable: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(variable)
      setTimeout(() => setCopied((current) => (current === variable ? null : current)), 1400)
    } catch {
      // clipboard API unavailable (permissions, non-secure context) — no-op
    }
  }

  if (!mounted) return null

  return (
    <section className="w-full">
      <HeaderTitle title="Design System" />
      <div className="space-y-4 px-4 py-4 sm:px-6">
        <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm">
          The actual CSS custom properties powering this page right now,
          read live from <code className="font-mono">getComputedStyle</code> —
          not a mockup. Toggle the theme and watch these update. Click a
          swatch to copy its hex.
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tokens.map((token) => (
            <button
              key={token.variable}
              type="button"
              onClick={() => copyValue(token.variable, token.value)}
              className="border-edge group flex flex-col overflow-hidden rounded-md border text-left transition-transform hover:-translate-y-0.5"
            >
              <span
                className="block h-14 w-full"
                style={{ backgroundColor: token.value || "transparent" }}
                aria-hidden="true"
              />
              <span className="flex flex-col gap-0.5 p-2">
                <span className="font-pixelify text-primary flex items-center justify-between gap-1 text-[11px] font-semibold">
                  {token.name}
                  {copied === token.variable ? (
                    <Check className="size-3 shrink-0" />
                  ) : (
                    <Copy className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
                  )}
                </span>
                <span className="text-muted-foreground font-mono text-[10px]">
                  {token.value || "…"}
                </span>
                <span className="text-muted-foreground/70 text-[10px]">
                  {token.role}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="border-edge flex flex-wrap gap-4 rounded-md border p-3">
          {TYPE_SAMPLES.map((t) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-1"
            >
              <span className={cn("text-primary text-2xl", t.className)}>
                {t.sample}
              </span>
              <span className="text-muted-foreground font-mono text-[10px]">
                {t.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
