import type { ReactNode } from "react"
import { USER } from "@/data"
import { ProfileImageCard } from "./profile-image-card"

export const ABOUT_HIGHLIGHTS = {
  lilac: {
    label: "Lilac",
    className:
      "bg-violet-200 text-violet-950 dark:bg-violet-400/80 dark:text-violet-950",
    swatchClassName: "bg-violet-300",
  },
  mint: {
    label: "Mint",
    className:
      "bg-emerald-200 text-emerald-950 dark:bg-emerald-400/80 dark:text-emerald-950",
    swatchClassName: "bg-emerald-300",
  },
  lemon: {
    label: "Lemon",
    className:
      "bg-yellow-200 text-yellow-950 dark:bg-yellow-300/85 dark:text-yellow-950",
    swatchClassName: "bg-yellow-300",
  },
  coral: {
    label: "Coral",
    className:
      "bg-orange-200 text-orange-950 dark:bg-orange-400/80 dark:text-orange-950",
    swatchClassName: "bg-orange-300",
  },
} as const

export type AboutHighlightTone = keyof typeof ABOUT_HIGHLIGHTS

const inlinePatternSource =
  "(==(?:(lilac|mint|lemon|coral):)?([^=]+)==|\\[([^\\]]+)\\]\\(([^)]+)\\)|`([^`]+)`|\\*\\*([^*]+)\\*\\*|\\*([^*]+)\\*)"

const isSafeHref = (href: string) => {
  if (href.startsWith("/") || href.startsWith("#")) {
    return true
  }

  try {
    const url = new URL(href)
    return ["http:", "https:", "mailto:"].includes(url.protocol)
  } catch {
    return false
  }
}

const renderInline = (text: string, keyPrefix: string): ReactNode[] => {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const inlinePattern = new RegExp(inlinePatternSource, "g")

  while ((match = inlinePattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const [
      ,
      raw,
      highlightTone,
      highlighted,
      linkLabel,
      linkHref,
      code,
      bold,
      italic,
    ] = match
    const key = `${keyPrefix}-${match.index}`

    if (highlighted) {
      const tone = (highlightTone || "lemon") as AboutHighlightTone

      nodes.push(
        <mark
          key={key}
          className={`${ABOUT_HIGHLIGHTS[tone].className} rounded-[0.2em] box-decoration-clone px-[0.22em] py-[0.06em]`}
        >
          {renderInline(highlighted, `${key}-highlight`)}
        </mark>
      )
    } else if (linkLabel && linkHref && isSafeHref(linkHref.trim())) {
      nodes.push(
        <a
          key={key}
          href={linkHref.trim()}
          target={
            linkHref.startsWith("/") || linkHref.startsWith("#")
              ? undefined
              : "_blank"
          }
          rel={
            linkHref.startsWith("/") || linkHref.startsWith("#")
              ? undefined
              : "noopener noreferrer"
          }
          className="text-primary hover:text-primary/70 font-medium underline underline-offset-4 transition-colors"
        >
          {renderInline(linkLabel, `${key}-label`)}
        </a>
      )
    } else if (code) {
      nodes.push(
        <code
          key={key}
          className="border-edge bg-accent/40 rounded border px-1 py-0.5 font-mono text-[0.85em]"
        >
          {code}
        </code>
      )
    } else if (bold) {
      nodes.push(
        <strong key={key} className="text-primary font-semibold">
          {renderInline(bold, `${key}-bold`)}
        </strong>
      )
    } else if (italic) {
      nodes.push(
        <em key={key} className="text-primary/90 italic">
          {renderInline(italic, `${key}-italic`)}
        </em>
      )
    } else {
      nodes.push(raw)
    }

    lastIndex = match.index + raw.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

const getHeadingLevel = (line: string) => {
  const match = /^(#{2,4})\s+(.+)$/.exec(line)
  if (!match) {
    return null
  }

  return {
    level: match[1].length,
    text: match[2].trim(),
  }
}

const isProfileImageBlock = (line: string) =>
  /^<ProfileImage(?:\s+[^>]*)?\s*\/>$/.test(line)

export function AboutRichText({
  markdown,
  profileAvatarUrl = USER.avatar,
}: {
  markdown: string
  profileAvatarUrl?: string
}) {
  const lines = markdown.split(/\r?\n/)
  const blocks: ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return
    }

    const text = paragraph.join(" ").trim()
    const index = blocks.length

    blocks.push(
      <p
        key={`paragraph-${index}`}
        className="text-primary/90 text-sm leading-relaxed sm:text-base"
      >
        {renderInline(text, `paragraph-${index}`)}
      </p>
    )
    paragraph = []
  }

  const flushList = () => {
    if (list.length === 0) {
      return
    }

    const index = blocks.length

    blocks.push(
      <ul
        key={`list-${index}`}
        className="text-primary/90 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed sm:text-base"
      >
        {list.map((item, itemIndex) => (
          <li key={`${index}-${itemIndex}`}>
            {renderInline(item, `list-${index}-${itemIndex}`)}
          </li>
        ))}
      </ul>
    )
    list = []
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushList()
      return
    }

    if (isProfileImageBlock(line)) {
      flushParagraph()
      flushList()
      blocks.push(
        <ProfileImageCard
          key={`profile-image-${blocks.length}`}
          avatarUrl={profileAvatarUrl}
        />
      )
      return
    }

    const heading = getHeadingLevel(line)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push(
        <h3
          key={`heading-${blocks.length}`}
          className="font-pixelify text-primary pt-1 text-lg font-bold sm:text-xl"
        >
          {renderInline(heading.text, `heading-${blocks.length}`)}
        </h3>
      )
      return
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph()
      list.push(line.slice(2).trim())
      return
    }

    if (line.startsWith("> ")) {
      flushParagraph()
      flushList()
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="border-edge text-muted-foreground border-l-2 pl-3 text-sm leading-relaxed italic sm:text-base"
        >
          {renderInline(line.slice(2).trim(), `quote-${blocks.length}`)}
        </blockquote>
      )
      return
    }

    flushList()
    paragraph.push(line)
  })

  flushParagraph()
  flushList()

  return <div className="space-y-3">{blocks}</div>
}
