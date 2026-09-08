"use client"

import Image from "next/image"
import { PackageOpen } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

type BrandMark = {
  alt: string
  src: string
  invertOnDark?: boolean
}

const simpleIcon = (slug: string): string =>
  `https://cdn.simpleicons.org/${slug}`

const devicon = (name: string, variant = "original"): string =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`

const favicon = (domain: string): string =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const UTILITY_ICONS: Record<string, BrandMark[]> = {
  linux: [{ alt: "Linux", src: simpleIcon("linux") }],
  "arch-linux": [{ alt: "Arch Linux", src: simpleIcon("archlinux") }],
  "windows-11": [{ alt: "Windows 11", src: devicon("windows11") }],
  warp: [{ alt: "Warp", src: simpleIcon("warp") }],
  "github-cli": [
    { alt: "GitHub", src: simpleIcon("github"), invertOnDark: true },
  ],
  git: [{ alt: "Git", src: simpleIcon("git") }],
  "bash-powershell": [
    { alt: "GNU Bash", src: simpleIcon("gnubash") },
    { alt: "PowerShell", src: devicon("powershell") },
  ],
  "windows-terminal": [
    { alt: "Windows Terminal", src: favicon("learn.microsoft.com") },
  ],
  "vs-code": [{ alt: "Visual Studio Code", src: devicon("vscode") }],
  cursor: [{ alt: "Cursor", src: simpleIcon("cursor"), invertOnDark: true }],
  docker: [{ alt: "Docker", src: simpleIcon("docker") }],
  "github-desktop": [
    { alt: "GitHub", src: simpleIcon("github"), invertOnDark: true },
  ],
  "vercel-netlify": [
    { alt: "Vercel", src: simpleIcon("vercel"), invertOnDark: true },
    { alt: "Netlify", src: simpleIcon("netlify") },
  ],
  typescript: [{ alt: "TypeScript", src: simpleIcon("typescript") }],
  prettier: [{ alt: "Prettier", src: simpleIcon("prettier") }],
  tableplus: [{ alt: "TablePlus", src: favicon("tableplus.com") }],
  nodejs: [{ alt: "Node.js", src: simpleIcon("nodedotjs") }],
  supabase: [{ alt: "Supabase", src: simpleIcon("supabase") }],
  postman: [{ alt: "Postman", src: simpleIcon("postman") }],
  npm: [{ alt: "npm", src: simpleIcon("npm") }],
  "antigravity-code": [{ alt: "Google", src: simpleIcon("google") }],
  "codex-cli": [{ alt: "OpenAI", src: favicon("openai.com") }],
  "claude-cli": [
    { alt: "Anthropic", src: simpleIcon("anthropic"), invertOnDark: true },
  ],
  "figma-canva": [
    { alt: "Figma", src: simpleIcon("figma") },
    { alt: "Canva", src: favicon("canva.com") },
  ],
  notion: [{ alt: "Notion", src: simpleIcon("notion"), invertOnDark: true }],
  obsidian: [{ alt: "Obsidian", src: simpleIcon("obsidian") }],
  linear: [{ alt: "Linear", src: simpleIcon("linear") }],
  grammarly: [{ alt: "Grammarly", src: simpleIcon("grammarly") }],
  browsers: [
    { alt: "Google Chrome", src: simpleIcon("googlechrome") },
    { alt: "Arc", src: simpleIcon("arc") },
    { alt: "Brave", src: simpleIcon("brave") },
  ],
  chat: [
    { alt: "Telegram", src: simpleIcon("telegram") },
    { alt: "Zoom", src: simpleIcon("zoom") },
    { alt: "Discord", src: simpleIcon("discord") },
    { alt: "Slack", src: favicon("slack.com") },
  ],
  "entertainment-music": [
    { alt: "Spotify", src: simpleIcon("spotify") },
    { alt: "Amazon Music", src: favicon("music.amazon.com") },
  ],
}

const BrandImage = ({ mark, size }: { mark: BrandMark; size: number }) => {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="bg-muted text-muted-foreground flex items-center justify-center rounded-sm text-[9px] font-bold"
        style={{ width: size, height: size }}
      >
        {mark.alt.charAt(0)}
      </span>
    )
  }

  return (
    <Image
      unoptimized
      src={mark.src}
      alt={mark.alt}
      width={size}
      height={size}
      className={cn(
        "size-full object-contain",
        mark.invertOnDark && "dark:invert"
      )}
      onError={() => setFailed(true)}
    />
  )
}

export const UtilityIcon = ({
  name,
  className,
  size = 24,
}: {
  name: string
  className?: string
  size?: number
}) => {
  const marks = UTILITY_ICONS[name]

  if (!marks?.length) {
    return (
      <PackageOpen
        aria-hidden="true"
        size={size}
        className={cn("text-muted-foreground", className)}
      />
    )
  }

  const markSize =
    marks.length === 1
      ? size
      : marks.length === 2
        ? Math.round(size * 0.72)
        : Math.round(size * 0.58)

  return (
    <span
      className={cn(
        "flex items-center justify-center",
        marks.length > 1 && "-space-x-1",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={marks.map((mark) => mark.alt).join(", ")}
      role="img"
    >
      {marks.map((mark) => (
        <span
          key={mark.alt}
          className={cn(
            "relative flex shrink-0 items-center justify-center",
            marks.length > 1 &&
              "border-background bg-card rounded-full border p-0.5"
          )}
          style={{ width: markSize, height: markSize }}
        >
          <BrandImage mark={mark} size={markSize} />
        </span>
      ))}
    </span>
  )
}
