"use client"

import { ChevronDownIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ShinyText } from "@/components/ui/shiny-text"
import { ContainerWrapper } from "./container"
import MobileNavbar from "./mobile-nav"
import ThemeSwitcher from "./theme-switcher"

import { useSearch } from "@/components/providers/search-provider"

const DESKTOP_LINKS = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Projects",
    href: "/projects",
  },
]

const MORE_LINKS = [
  {
    name: "Blogs",
    href: "/blogs",
  },
  {
    name: "Favorites",
    href: "/favorites",
  },
  {
    name: "Photography",
    href: "/photography",
  },
  {
    name: "Certificates",
    href: "/certificates",
  },
  {
    name: "Utilities",
    href: "/utilities",
  },
  {
    name: "Contact",
    href: "/contact",
  },
]

const SHINY_MORE_HREFS = new Set(["/favorites", "/photography"])

const LogoMark = () => {
  return (
    <span
      className="text-primary font-pixelify inline-flex h-7 items-center text-xl font-bold md:h-8 md:text-2xl"
      aria-label="Aayush Bhadbhade"
    >
      AB
    </span>
  )
}

const SearchButton = ({ compact = false }: { compact?: boolean }) => {
  const { setIsOpen } = useSearch()

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className={cn(
        "border-edge bg-background/70 text-muted-foreground hover:text-primary inline-flex shrink-0 cursor-pointer items-center rounded-full border transition-colors",
        compact
          ? "h-8 gap-2 px-3 text-sm font-medium max-[380px]:h-7 max-[380px]:px-2.5 max-[380px]:text-xs"
          : "h-8 gap-2 pr-2.5 pl-3.5 text-sm"
      )}
      aria-label="Search"
    >
      <SearchIcon
        className={compact ? "size-4 max-[380px]:size-3.5" : "size-4"}
      />
      {compact ? (
        <span>Search</span>
      ) : (
        <span className="flex items-center gap-1">
          <kbd className="border-edge bg-muted text-muted-foreground rounded-md border px-1.5 py-0.5 font-sans text-[10px] leading-none font-medium">
            Ctrl
          </kbd>
          <kbd className="border-edge bg-muted text-muted-foreground rounded-md border px-1.5 py-0.5 font-sans text-[10px] leading-none font-medium">
            K
          </kbd>
        </span>
      )}
    </button>
  )
}

const MoreMenuLink = ({
  item,
  activeUrl,
}: {
  item: (typeof MORE_LINKS)[number]
  activeUrl: string
}) => {
  const isActive = activeUrl === item.href
  const hasShinyText = SHINY_MORE_HREFS.has(item.href)

  return (
    <Link
      href={item.href}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground block rounded-sm px-3 py-2 text-sm transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {hasShinyText ? (
        <ShinyText text={item.name} speed={1.35} spread={110} />
      ) : (
        item.name
      )}
    </Link>
  )
}

export const SiteHeader = () => {
  const pathname = usePathname()
  const activeUrl = pathname
    ? pathname === "/"
      ? "/"
      : `/${pathname.split("/")[1]}`
    : "/"
  const isMoreActive = MORE_LINKS.some((item) => item.href === activeUrl)

  return (
    <header className="border-edge bg-background/80 sticky top-0 z-[500] h-14 w-full border-b-[1px] backdrop-blur-md md:h-16">
      <ContainerWrapper crosshairs="bottom">
        <nav className="flex h-full w-full items-center justify-between pr-2 pl-6 sm:pr-1 sm:pl-8">
          <Link
            href="/"
            className="flex h-full items-center"
            aria-label="Go to home page"
          >
            <LogoMark />
          </Link>

          <div className="hidden h-full items-center gap-4 md:flex">
            <ul className="flex items-center gap-4">
              {DESKTOP_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeUrl === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <li className="group relative">
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium transition-colors",
                    isMoreActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  More
                  <ChevronDownIcon className="size-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute top-full right-0 pt-4 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="border-edge bg-background min-w-32 rounded-md border p-1 shadow-sm">
                    {MORE_LINKS.map((item) => (
                      <MoreMenuLink
                        key={item.href}
                        item={item}
                        activeUrl={activeUrl}
                      />
                    ))}
                  </div>
                </div>
              </li>
            </ul>

            <div className="flex items-center gap-2">
              <SearchButton />
              <div className="bg-edge h-5 w-px" aria-hidden="true" />
              <ThemeSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-2 max-[380px]:gap-1.5 md:hidden">
            <SearchButton compact />
            <div className="bg-edge h-5 w-px" aria-hidden="true" />
            <ThemeSwitcher />
            <MobileNavbar activeUrl={activeUrl} />
          </div>
        </nav>
      </ContainerWrapper>
    </header>
  )
}
