"use client"

import React, { useState, useEffect, useRef } from "react"
import { flushSync } from "react-dom"
import { useRouter } from "next/navigation"
import {
  Search,
  X,
  Rss,
  Package,
  Heart,
  Camera,
  Award,
  Shield,
  FileText,
  Sun,
  Moon,
  Mail,
  Palette,
} from "lucide-react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useDitherTheme, DITHER_COLORS } from "@/components/providers/dither-theme-provider"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"
import { switchTheme, toggleTheme } from "@/lib/theme-transition"
import { SITE_INFO } from "@/data/site-info"

interface SearchItem {
  id: string
  title: string
  section: "Ask AI" | "Navigation" | "Features"
  icon: React.ReactNode
  action: () => void
}

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

const SciraIcon = () => (
  <svg
    viewBox="0 0 910 934"
    className="h-5 w-5 shrink-0 text-foreground"
    fill="none"
    aria-hidden
  >
    <path
      d="M647.66 197.78C569.13 189.05 525.5 145.42 516.77 66.88C508.05 145.42 464.42 189.05 385.88 197.78C464.42 206.5 508.05 250.13 516.77 328.67C525.5 250.13 569.13 206.5 647.66 197.78Z"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <path
      d="M516.77 304.22C510.3 275.49 498.21 252.09 480.34 234.21C462.46 216.34 439.06 204.25 410.33 197.78C439.06 191.3 462.46 179.21 480.34 161.34C498.21 143.46 510.3 120.06 516.77 91.33C523.25 120.06 535.34 143.46 553.21 161.34C571.09 179.21 594.49 191.3 623.22 197.78C594.49 204.25 571.09 216.34 553.21 234.21C535.34 252.09 523.25 275.49 516.77 304.22Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <path
      d="M857.5 508.12C763.26 497.64 710.9 445.29 700.43 351.05C689.96 445.29 637.61 497.64 543.36 508.12C637.61 518.59 689.96 570.94 700.43 665.18C710.9 570.94 763.26 518.59 857.5 508.12Z"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinejoin="round"
    />
    <path
      d="M700.43 615.96C691.85 589.05 678.58 566.36 660.38 548.17C642.19 529.97 619.5 516.7 592.59 508.12C619.5 499.53 642.19 486.26 660.38 468.07C678.58 449.87 691.85 427.18 700.43 400.27C709.02 427.18 722.29 449.87 740.48 468.07C758.67 486.26 781.37 499.53 808.27 508.12C781.37 516.7 758.67 529.97 740.48 548.17C722.29 566.36 709.02 589.05 700.43 615.96Z"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinejoin="round"
    />
    <path
      d="M889.95 121.24C831.05 114.69 798.33 81.97 791.78 23.07C785.24 81.97 752.52 114.69 693.61 121.24C752.52 127.78 785.24 160.5 791.78 219.4C798.33 160.5 831.05 127.78 889.95 121.24Z"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <path
      d="M791.78 196.8C786.7 176.94 777.87 160.57 765.16 147.86C752.45 135.15 736.08 126.32 716.23 121.24C736.08 116.15 752.45 107.32 765.16 94.62C777.87 81.91 786.7 65.54 791.78 45.68C796.87 65.54 805.7 81.91 818.4 94.62C831.11 107.32 847.48 116.15 867.34 121.24C847.48 126.32 831.11 135.15 818.4 147.86C805.69 160.57 796.87 176.94 791.78 196.8Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <path
      d="M760.63 764.34C720.72 814.62 669.84 855.1 611.87 882.69C553.91 910.29 490.4 924.26 426.21 923.53C362.02 922.81 298.85 907.42 241.52 878.53C184.19 849.64 134.23 808.03 95.45 756.86C56.68 705.7 30.12 646.35 17.81 583.34C5.5 520.34 7.76 455.35 24.43 393.36C41.09 331.36 71.71 274 113.95 225.66C156.18 177.32 208.92 139.27 268.12 114.44"
      stroke="currentColor"
      strokeWidth="30"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChatGPTIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 shrink-0"
    fill="#10a37f"
    aria-hidden
  >
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zM3.6023 17.2138a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.0331a4.4992 4.4992 0 0 1-6.1377-1.8193zM2.3818 7.9966a4.485 4.485 0 0 1 2.3656-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3818 7.9966zm17.1366 4.0252L13.6744 8.668l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4018-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0974-2.3616l2.602-1.5016 2.6069 1.5016v3.0032L12.0046 15l-2.6021-1.4968z" />
  </svg>
)


const ClaudeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 shrink-0"
    fill="#D97757"
    aria-hidden
  >
    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
  </svg>
)

export const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { colorIndex, cycleColor } = useDitherTheme()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isKeyboardNav = useRef(false)

  // Clear query and reset selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
      isKeyboardNav.current = false
      // Small timeout to ensure input gets focus
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const items: SearchItem[] = [
    {
      id: "scira",
      title: "Open in Scira",
      section: "Ask AI",
      icon: <SciraIcon />,
      action: () => {
        window.open(
          `https://scira.app/search?q=Summarize+${SITE_INFO.url}`,
          "_blank"
        )
        onClose()
      },
    },
    {
      id: "chatgpt",
      title: "Open in ChatGPT",
      section: "Ask AI",
      icon: <ChatGPTIcon />,
      action: () => {
        window.open(
          `https://chatgpt.com/?q=Summarize+${SITE_INFO.url}`,
          "_blank"
        )
        onClose()
      },
    },
    {
      id: "claude",
      title: "Open in Claude",
      section: "Ask AI",
      icon: <ClaudeIcon />,
      action: () => {
        window.open(
          `https://claude.ai/new?q=Summarize+${SITE_INFO.url}`,
          "_blank"
        )
        onClose()
      },
    },
    {
      id: "markdown",
      title: "Open in Markdown",
      section: "Ask AI",
      icon: <FileText className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        window.open("/llms.txt", "_blank")
        onClose()
      },
    },
    {
      id: "toggle-theme",
      title: "Toggle Light/Dark Mode",
      section: "Features",
      icon:
        resolvedTheme === "dark" ? (
          <Sun className="h-4.5 w-4.5 shrink-0" />
        ) : (
          <Moon className="h-4.5 w-4.5 shrink-0" />
        ),
      action: () => {
        const next = resolvedTheme === "dark" ? "light" : "dark"
        playSound(next === "dark" ? "tickOff" : "tickOn")
        toggleTheme(() => {
          switchTheme()
          flushSync(() => setTheme(next))
        })
        onClose()
      },
    },
    {
      id: "cycle-dither-color",
      title: `Cycle Dither Color (${DITHER_COLORS[colorIndex].label})`,
      section: "Features",
      icon: <Palette className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        cycleColor()
        onClose()
      },
    },
    {
      id: "close-palette",
      title: "Close Command Palette",
      section: "Features",
      icon: <X className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        onClose()
      },
    },
    {
      id: "home",
      title: "Home",
      section: "Navigation",
      icon: (
        <span className="flex h-5.5 w-5.5 items-center justify-center rounded bg-zinc-200 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          NK
        </span>
      ),
      action: () => {
        router.push("/")
        onClose()
      },
    },
    {
      id: "blogs",
      title: "Blogs",
      section: "Navigation",
      icon: <Rss className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        router.push("/blogs")
        onClose()
      },
    },
    {
      id: "projects",
      title: "Projects",
      section: "Navigation",
      icon: <Package className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        router.push("/projects")
        onClose()
      },
    },
    {
      id: "favorites",
      title: "Favorites",
      section: "Navigation",
      icon: <Heart className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        router.push("/favorites")
        onClose()
      },
    },
    {
      id: "photography",
      title: "Photography",
      section: "Navigation",
      icon: <Camera className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        router.push("/photography")
        onClose()
      },
    },
    {
      id: "certificates",
      title: "Certificates",
      section: "Navigation",
      icon: <Award className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        router.push("/certificates")
        onClose()
      },
    },
    {
      id: "contact",
      title: "Contact",
      section: "Navigation",
      icon: <Mail className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        router.push("/contact")
        onClose()
      },
    },
    {
      id: "privacy",
      title: "Privacy",
      section: "Navigation",
      icon: <Shield className="h-4.5 w-4.5 shrink-0" />,
      action: () => {
        router.push("/privacy")
        onClose()
      },
    },
  ]

  // Filter items based on query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  // Reset selectedIndex when query changes and reset scroll
  useEffect(() => {
    setSelectedIndex(0)
    isKeyboardNav.current = false
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [query])

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        isKeyboardNav.current = true
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        isKeyboardNav.current = true
        setSelectedIndex((prev) =>
          filteredItems.length > 0
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : 0
        )
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredItems.length > 0 && filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, onClose])

  // Scroll active item into view (only if controlled by keyboard)
  useEffect(() => {
    if (!isKeyboardNav.current || !listRef.current) return
    const container = listRef.current
    const selectedElement = container.querySelector(
      '[data-active="true"]'
    ) as HTMLElement
    if (!selectedElement) return

    const containerTop = container.scrollTop
    const containerBottom = containerTop + container.clientHeight
    const elemTop = selectedElement.offsetTop
    const elemBottom = elemTop + selectedElement.clientHeight

    if (elemTop < containerTop) {
      container.scrollTop = elemTop
    } else if (elemBottom > containerBottom) {
      container.scrollTop = elemBottom - container.clientHeight
    }
  }, [selectedIndex])

  // Group filtered items by section
  const askAiItems = filteredItems.filter((i) => i.section === "Ask AI")
  const featuresItems = filteredItems.filter((i) => i.section === "Features")
  const navigationItems = filteredItems.filter(
    (i) => i.section === "Navigation"
  )

  // Flattened mapping for index references
  let flatIndex = 0
  const renderedAskAi = askAiItems.map((item) => {
    const currentIdx = flatIndex++
    const isActive = selectedIndex === currentIdx
    return (
      <div
        key={item.id}
        data-active={isActive}
        onClick={item.action}
        onMouseEnter={() => {
          isKeyboardNav.current = false
          setSelectedIndex(currentIdx)
        }}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-zinc-100 text-zinc-900 shadow-xs dark:bg-zinc-800/80 dark:text-white dark:shadow-sm"
            : "text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-transparent dark:hover:text-zinc-200"
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center">
          {item.icon}
        </div>
        <span>{item.title}</span>
      </div>
    )
  })

  const renderedFeatures = featuresItems.map((item) => {
    const currentIdx = flatIndex++
    const isActive = selectedIndex === currentIdx
    return (
      <div
        key={item.id}
        data-active={isActive}
        onClick={item.action}
        onMouseEnter={() => {
          isKeyboardNav.current = false
          setSelectedIndex(currentIdx)
        }}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-zinc-100 text-zinc-900 shadow-xs dark:bg-zinc-800/80 dark:text-white dark:shadow-sm"
            : "text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-transparent dark:hover:text-zinc-200"
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center">
          {item.icon}
        </div>
        <span className="flex-1">{item.title}</span>
        {item.id === "toggle-theme" && (
          <div className="flex items-center gap-1">
            <kbd className="inline-flex h-5 items-center rounded border border-zinc-200 bg-zinc-100 px-1.5 font-sans text-[10px] font-medium text-zinc-500 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              Ctrl
            </kbd>
            <kbd className="inline-flex h-5 items-center rounded border border-zinc-200 bg-zinc-100 px-1.5 font-sans text-[10px] font-medium text-zinc-500 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              P
            </kbd>
          </div>
        )}
        {item.id === "cycle-dither-color" && (
          <div className="flex items-center gap-1">
            <kbd className="inline-flex h-5 items-center rounded border border-zinc-200 bg-zinc-100 px-1.5 font-sans text-[10px] font-medium text-zinc-500 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              Ctrl
            </kbd>
            <kbd className="inline-flex h-5 items-center rounded border border-zinc-200 bg-zinc-100 px-1.5 font-sans text-[10px] font-medium text-zinc-500 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              B
            </kbd>
          </div>
        )}
      </div>
    )
  })

  const renderedNavigation = navigationItems.map((item) => {
    const currentIdx = flatIndex++
    const isActive = selectedIndex === currentIdx
    return (
      <div
        key={item.id}
        data-active={isActive}
        onClick={item.action}
        onMouseEnter={() => {
          isKeyboardNav.current = false
          setSelectedIndex(currentIdx)
        }}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-zinc-100 text-zinc-900 shadow-xs dark:bg-zinc-800/80 dark:text-white dark:shadow-sm"
            : "text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-transparent dark:hover:text-zinc-200"
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center">
          {item.icon}
        </div>
        <span>{item.title}</span>
      </div>
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-zinc-900/40 px-4 pt-[15vh] backdrop-blur-md dark:bg-black/60 md:pt-[20vh]"
      onClick={(e) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          onClose()
        }
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 text-zinc-900 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-[#0c0c0e]/95 dark:text-zinc-100"
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/60">
          <Search className="h-4.5 w-4.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 border-0 bg-transparent p-0 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-0 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="relative">
          {/* Top Scroll Fade */}
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-5 bg-gradient-to-b from-white/95 to-transparent dark:from-[#0c0c0e]/95 dark:to-transparent" />

          <div
            ref={listRef}
            className="command-menu-scrollbar max-h-[340px] flex-1 space-y-1.5 overflow-y-auto overscroll-contain p-2 pr-1.5"
          >
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-sm font-medium text-zinc-400 dark:text-zinc-500">
                No results found.
              </div>
            ) : (
              <>
                {askAiItems.length > 0 && (
                  <div>
                    <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                      Ask AI
                    </div>
                    <div className="space-y-0.5">{renderedAskAi}</div>
                  </div>
                )}

                {featuresItems.length > 0 && (
                  <div>
                    <div className="px-3 pt-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                      Features
                    </div>
                    <div className="space-y-0.5">{renderedFeatures}</div>
                  </div>
                )}

                {navigationItems.length > 0 && (
                  <div>
                    <div className="px-3 pt-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                      Navigation
                    </div>
                    <div className="space-y-0.5">{renderedNavigation}</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom Scroll Fade */}
          <div className="pointer-events-none absolute bottom-0 right-0 left-0 z-10 h-5 bg-gradient-to-t from-white/95 to-transparent dark:from-[#0c0c0e]/95 dark:to-transparent" />
        </div>

        {/* Footer */}
        <div className="flex min-h-10 items-center justify-end gap-2 border-t border-zinc-200/80 bg-zinc-50/90 px-3 py-2.5 text-xs font-medium text-zinc-500 dark:border-zinc-800/60 dark:bg-[#09090b]/80 dark:text-zinc-500 sm:px-4">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline">Go to Page</span>
              <kbd className="inline-flex items-center rounded border border-zinc-200 bg-zinc-100 px-1 text-[10px] leading-none text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                ↵
              </kbd>
            </div>
            <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline">Exit</span>
              <kbd className="inline-flex items-center rounded border border-zinc-200 bg-zinc-100 px-1 text-[10px] leading-none text-zinc-400">
                Esc
              </kbd>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
