"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

interface SearchContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

const SearchDialog = dynamic(
  () =>
    import("@/components/site/search-dialog").then((mod) => mod.SearchDialog),
  { ssr: false }
)

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K to toggle search dialog
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }

      // Shift+Arrow to go to the top
      if (e.shiftKey && e.key.startsWith("Arrow")) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }

      // Ctrl+P to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault()
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme])

  return (
    <SearchContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      {isOpen && (
        <SearchDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
