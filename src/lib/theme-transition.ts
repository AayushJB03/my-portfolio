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

export const toggleTheme = (apply: () => void) => {
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

  document.startViewTransition(() => apply())
}