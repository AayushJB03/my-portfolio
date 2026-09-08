import { useState } from "react"
import { ShinyText } from "@/components/ui/shiny-text"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { NAV_ITEMS } from "@/data/nav-items"
import { cn } from "@/lib/utils"
import { MenuIcon, XIcon } from "lucide-react"
import Link from "next/link"

const SHINY_MORE_HREFS = new Set(["/favorites", "/photography"])

const MobileNavbar = ({ activeUrl }: { activeUrl: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary size-8 hover:bg-transparent"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="border-edge mb-8">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="border-edge border-b text-left">
            <DrawerTitle className="text-primary text-base font-semibold">
              Navigation
            </DrawerTitle>
          </DrawerHeader>
          <ul className="flex flex-col px-4 py-4">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.href}
                className="border-edge border-b last:border-b-0"
              >
                <DrawerClose asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex w-full items-center justify-between py-3 text-sm font-medium transition-colors",
                      activeUrl === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {SHINY_MORE_HREFS.has(item.href) ? (
                      <ShinyText text={item.name} speed={1.35} spread={110} />
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </Link>
                </DrawerClose>
              </li>
            ))}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNavbar
