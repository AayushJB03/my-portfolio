"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type DitherColorName =
  | "default"
  | "purple"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "lime"
  | "yellow"
  | "amber"
  | "orange"
  | "red"
  | "rose"
  | "pink"
  | "fuchsia"
  | "violet"
  | "indigo"
  | "sky"
  | "emerald"
  | "mint"
  | "coral"

export type DitherPalette = {
  name: DitherColorName
  label: string
  light: {
    waveColor: [number, number, number]
  }
  dark: {
    waveColor: [number, number, number]
  }
}

export const DITHER_COLORS: DitherPalette[] = [
  {
    name: "default",
    label: "Default",
    light: { waveColor: [0.06, 0.06, 0.07] },
    dark: { waveColor: [0.52, 0.52, 0.54] },
  },
  {
    name: "purple",
    label: "Purple",
    light: { waveColor: [0.35, 0.18, 0.65] },
    dark: { waveColor: [0.55, 0.38, 0.9] },
  },
  {
    name: "blue",
    label: "Blue",
    light: { waveColor: [0.15, 0.35, 0.78] },
    dark: { waveColor: [0.3, 0.55, 1.0] },
  },
  {
    name: "cyan",
    label: "Cyan",
    light: { waveColor: [0.05, 0.48, 0.68] },
    dark: { waveColor: [0.15, 0.75, 0.95] },
  },
  {
    name: "teal",
    label: "Teal",
    light: { waveColor: [0.06, 0.48, 0.48] },
    dark: { waveColor: [0.2, 0.75, 0.72] },
  },
  {
    name: "green",
    label: "Green",
    light: { waveColor: [0.08, 0.5, 0.18] },
    dark: { waveColor: [0.25, 0.75, 0.35] },
  },
  {
    name: "lime",
    label: "Lime",
    light: { waveColor: [0.32, 0.52, 0.08] },
    dark: { waveColor: [0.55, 0.8, 0.2] },
  },
  {
    name: "yellow",
    label: "Yellow",
    light: { waveColor: [0.62, 0.52, 0.05] },
    dark: { waveColor: [0.95, 0.85, 0.15] },
  },
  {
    name: "amber",
    label: "Amber",
    light: { waveColor: [0.62, 0.42, 0.05] },
    dark: { waveColor: [0.95, 0.7, 0.15] },
  },
  {
    name: "orange",
    label: "Orange",
    light: { waveColor: [0.68, 0.32, 0.05] },
    dark: { waveColor: [1.0, 0.55, 0.15] },
  },
  {
    name: "red",
    label: "Red",
    light: { waveColor: [0.68, 0.08, 0.08] },
    dark: { waveColor: [1.0, 0.25, 0.25] },
  },
  {
    name: "rose",
    label: "Rose",
    light: { waveColor: [0.62, 0.12, 0.28] },
    dark: { waveColor: [0.95, 0.3, 0.5] },
  },
  {
    name: "pink",
    label: "Pink",
    light: { waveColor: [0.68, 0.22, 0.42] },
    dark: { waveColor: [1.0, 0.4, 0.65] },
  },
  {
    name: "fuchsia",
    label: "Fuchsia",
    light: { waveColor: [0.58, 0.15, 0.62] },
    dark: { waveColor: [0.85, 0.35, 0.95] },
  },
  {
    name: "violet",
    label: "Violet",
    light: { waveColor: [0.42, 0.15, 0.72] },
    dark: { waveColor: [0.65, 0.35, 1.0] },
  },
  {
    name: "indigo",
    label: "Indigo",
    light: { waveColor: [0.22, 0.18, 0.68] },
    dark: { waveColor: [0.4, 0.35, 0.95] },
  },
  {
    name: "sky",
    label: "Sky",
    light: { waveColor: [0.08, 0.38, 0.72] },
    dark: { waveColor: [0.25, 0.6, 1.0] },
  },
  {
    name: "emerald",
    label: "Emerald",
    light: { waveColor: [0.04, 0.52, 0.32] },
    dark: { waveColor: [0.15, 0.85, 0.55] },
  },
  {
    name: "mint",
    label: "Mint",
    light: { waveColor: [0.1, 0.62, 0.45] },
    dark: { waveColor: [0.3, 0.95, 0.7] },
  },
  {
    name: "coral",
    label: "Coral",
    light: { waveColor: [0.78, 0.32, 0.28] },
    dark: { waveColor: [1.0, 0.55, 0.45] },
  },
]

const STORAGE_KEY = "dither-color-index"

const DEFAULT_COLOR_INDEX = Math.max(
  0,
  DITHER_COLORS.findIndex((c) => c.name === "blue")
)

type DitherThemeContextType = {
  colorIndex: number
  colorName: DitherColorName
  setColor: (index: number) => void
  cycleColor: () => void
}

const DitherThemeContext = createContext<DitherThemeContextType | null>(null)

export function DitherThemeProvider({ children }: { children: ReactNode }) {
  const [colorIndex, setColorIndex] = useState(DEFAULT_COLOR_INDEX)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      const idx = parseInt(stored, 10)
      if (idx >= 0 && idx < DITHER_COLORS.length) {
        setColorIndex(idx)
      }
    }
  }, [])

  const setColor = useCallback((index: number) => {
    const idx = Math.max(0, Math.min(index, DITHER_COLORS.length - 1))
    setColorIndex(idx)
    localStorage.setItem(STORAGE_KEY, String(idx))
  }, [])

  const cycleColor = useCallback(() => {
    setColorIndex((prev) => {
      const next = (prev + 1) % DITHER_COLORS.length
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  if (!mounted) {
    return (
      <DitherThemeContext.Provider
        value={{
          colorIndex: DEFAULT_COLOR_INDEX,
          colorName: "blue",
          setColor: () => {},
          cycleColor: () => {},
        }}
      >
        {children}
      </DitherThemeContext.Provider>
    )
  }

  return (
    <DitherThemeContext.Provider
      value={{
        colorIndex,
        colorName: DITHER_COLORS[colorIndex].name,
        setColor,
        cycleColor,
      }}
    >
      {children}
    </DitherThemeContext.Provider>
  )
}

export function useDitherTheme() {
  const ctx = useContext(DitherThemeContext)
  if (!ctx) {
    throw new Error("useDitherTheme must be used within DitherThemeProvider")
  }
  return ctx
}
