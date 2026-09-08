import { createClient } from "@/lib/supabase/server"
import { USER } from "@/data/user"

export type ProfileContent = {
  avatarUrl: string
}

export type AboutContent = {
  markdown: string
  paragraphs: string[]
  focusAreas: string[]
  resumeUrl: string
  resumeLabel: string
  secondaryLinkUrl: string
  secondaryLinkLabel: string
}

export type TextTag = {
  id: string
  text: string
  sort_order: number
}

export type Achievement = {
  id?: string
  title: string
  year: string
  issuer?: string | null
  sort_order?: number
}

export interface UtilityItem {
  id?: string
  key: string
  name: string
  description: string
  url?: string | null
  sort_order?: number
}

export interface UtilityCategory {
  id: string
  title: string
  description: string
  sort_order?: number
  items: UtilityItem[]
}

export const FALLBACK_ABOUT: AboutContent = {
  markdown: [
    "I'm **Aayush**, larping into tech with AI.",
    "",
    "I build with Python, LLMs & AI agents, and RAG pipelines — turning \"what if\" ideas into working systems.",
    "",
    "- Python-first",
    "- AI agents & LLM workflows",
    "- RAG pipelines",
  ].join("\n"),
  paragraphs: [
    "I'm Aayush, larping into tech with AI.",
    "I build with Python, LLMs & AI agents, and RAG pipelines.",
    "I care about turning ideas into working systems, one prototype at a time.",
  ],
  focusAreas: ["AI Agents", "LLMs", "RAG"],
  // ponytail: no resume link yet — about.tsx hides the button when this is empty
  resumeUrl: "",
  resumeLabel: "See my resume",
  secondaryLinkUrl: "",
  secondaryLinkLabel: "",
}

export const FALLBACK_TEXT_TAGS = [
  "Building with LLMs",
  "Shipping AI agents",
  "RAG pipelines that actually retrieve",
  "Python, daily",
  "Turning prompts into products",
  "Learning in public",
]

export const FALLBACK_PROFILE: ProfileContent = {
  avatarUrl: USER.avatar,
}

// ponytail: no verified achievements yet for Aayush — populate via /admin
// (achievements table) instead of guessing. Empty list renders nothing.
export const FALLBACK_ACHIEVEMENTS: Achievement[] = []

const toAboutContent = (value: unknown): AboutContent => {
  if (!value || typeof value !== "object") {
    return FALLBACK_ABOUT
  }

  const about = value as Partial<AboutContent>
  const paragraphs = Array.isArray(about.paragraphs)
    ? about.paragraphs.filter(
        (item): item is string => typeof item === "string"
      )
    : FALLBACK_ABOUT.paragraphs
  const markdown =
    typeof about.markdown === "string" && about.markdown.trim()
      ? about.markdown
      : paragraphs.join("\n\n")
  const focusAreas = Array.isArray(about.focusAreas)
    ? about.focusAreas.filter(
        (item): item is string => typeof item === "string"
      )
    : FALLBACK_ABOUT.focusAreas

  return {
    markdown,
    paragraphs: paragraphs.length > 0 ? paragraphs : FALLBACK_ABOUT.paragraphs,
    focusAreas,
    resumeUrl:
      typeof about.resumeUrl === "string" && about.resumeUrl.trim()
        ? about.resumeUrl
        : FALLBACK_ABOUT.resumeUrl,
    resumeLabel:
      typeof about.resumeLabel === "string" && about.resumeLabel.trim()
        ? about.resumeLabel
        : FALLBACK_ABOUT.resumeLabel,
    secondaryLinkUrl:
      typeof about.secondaryLinkUrl === "string"
        ? about.secondaryLinkUrl.trim()
        : "",
    secondaryLinkLabel:
      typeof about.secondaryLinkLabel === "string"
        ? about.secondaryLinkLabel.trim()
        : "",
  }
}

const toProfileContent = (value: unknown): ProfileContent => {
  if (!value || typeof value !== "object") {
    return FALLBACK_PROFILE
  }

  const profile = value as Partial<ProfileContent>

  return {
    avatarUrl:
      typeof profile.avatarUrl === "string" && profile.avatarUrl.trim()
        ? profile.avatarUrl.trim()
        : FALLBACK_PROFILE.avatarUrl,
  }
}

export const getProfileContent = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "profile")
      .maybeSingle()
      .returns<{ value: unknown } | null>()

    if (error || !data) {
      return FALLBACK_PROFILE
    }

    return toProfileContent(data.value)
  } catch {
    return FALLBACK_PROFILE
  }
}

export const getAboutContent = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "about")
      .single()
      .returns<{ value: unknown }>()

    if (error || !data) {
      return FALLBACK_ABOUT
    }

    return toAboutContent(data.value)
  } catch {
    return FALLBACK_ABOUT
  }
}

export const getTextTags = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("text_tags")
      .select("id, text, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .returns<TextTag[]>()

    if (error || !data || data.length === 0) {
      return FALLBACK_TEXT_TAGS
    }

    return data.map((item) => item.text).filter(Boolean)
  } catch {
    return FALLBACK_TEXT_TAGS
  }
}

export const getAchievements = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("achievements")
      .select("id, title, year, issuer, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .returns<Achievement[]>()

    if (error || !data || data.length === 0) {
      return FALLBACK_ACHIEVEMENTS
    }

    return data
  } catch {
    return FALLBACK_ACHIEVEMENTS
  }
}

export const getUtilities = async () => {
  try {
    const supabase = await createClient()
    const { data: categories, error: categoriesError } = await supabase
      .from("utility_categories")
      .select("id, title, description, sort_order")
      .order("sort_order", { ascending: true })
      .returns<Omit<UtilityCategory, "items">[]>()

    if (categoriesError || !categories || categories.length === 0) {
      const { UTILITIES } = await import("./utilities")
      return UTILITIES
    }

    const { data: items, error: itemsError } = await supabase
      .from("utility_items")
      .select("id, category_id, key, name, description, url, sort_order")
      .order("sort_order", { ascending: true })
      .returns<(UtilityItem & { category_id: string })[]>()

    if (itemsError || !items) {
      return categories.map((category) => ({ ...category, items: [] }))
    }

    return categories.map((category) => ({
      ...category,
      items: items
        .filter((item) => item.category_id === category.id)
        .map((item) => ({
          id: item.id,
          key: item.key,
          name: item.name,
          description: item.description,
          url: item.url,
          sort_order: item.sort_order,
        })),
    }))
  } catch {
    const { UTILITIES } = await import("./utilities")
    return UTILITIES
  }
}
