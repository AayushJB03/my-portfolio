export const switchTheme = () => {
  const el = document.documentElement
  el.classList.toggle("dark")
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light")
}

const getActiveTransition = () =>
  (
    document as Document & {
      getActiveTransition?: () => { skipTransition: () => void } | null
    }
  ).getActiveTransition?.()

export const toggleTheme = (
  apply: () => void,
  origin?: { x: number; y: number }
) => {
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    apply()
    return
  }

  const active = getActiveTransition()
  if (active) {
    active.skipTransition()
  }

  // Anchors the circle-blur reveal (globals.css) to the click origin instead
  // of the viewport center. Falls back to center (CSS default) when omitted,
  // e.g. the "d" keyboard shortcut in theme-shortcut.tsx has no button to
  // anchor to.
  const root = document.documentElement
  if (origin) {
    root.style.setProperty("--theme-x", `${origin.x}px`)
    root.style.setProperty("--theme-y", `${origin.y}px`)
  } else {
    root.style.removeProperty("--theme-x")
    root.style.removeProperty("--theme-y")
  }

  document.startViewTransition(() => apply())
}