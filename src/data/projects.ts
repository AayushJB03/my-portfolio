import { createClient } from "@/lib/supabase/server"

export type Project = {
  id: string
  title: string
  href: string
  description: string
  image: string
  darkModeImage: string
  githubLink: string
  liveLink: string
  skills: string[]
  descriptionList: string[]
  createdAt: string
}

type ProjectRow = {
  id: string
  name: string
  coverimage: string
  description: string
  githuburl: string
  previewurl: string | null
  tools: string[] | null
  created_at: string
}

const slugifyProject = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

const trimText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text
  }

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}.`
}

const sentenceCase = (text: string) => {
  const cleanText = text.trim()

  if (!cleanText) {
    return "Built as a focused product experience with practical utility."
  }

  const firstLetter = cleanText.charAt(0).toUpperCase()
  const rest = cleanText.slice(1)
  const sentence = `${firstLetter}${rest}`

  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`
}

const buildProjectBrief = (project: ProjectRow) => {
  const tools = project.tools?.filter(Boolean) ?? []
  const primaryTools = tools.slice(0, 3).join(", ")
  const firstSentence = project.description.split(/[.!?]/)[0] ?? ""

  return [
    trimText(sentenceCase(firstSentence), 130),
    primaryTools
      ? `Built with ${primaryTools}${tools.length > 3 ? ", and more" : ""}.`
      : "Built with a practical, product-first engineering stack.",
    project.previewurl
      ? "Includes a live preview or write-up with source code reference."
      : "Includes source code reference and implementation details.",
  ]
}

const mapProject = (project: ProjectRow): Project => {
  const title = project.name || "Untitled Project"
  const image = project.coverimage || "/assets/portfolio-light.png"

  return {
    id: project.id,
    title,
    href: `/projects/${slugifyProject(title) || project.id}`,
    description: trimText(
      sentenceCase(project.description || "A focused product project."),
      170
    ),
    image,
    darkModeImage: image,
    githubLink: project.githuburl || "https://github.com/AayushJB03",
    liveLink:
      project.previewurl ||
      project.githuburl ||
      "https://github.com/AayushJB03",
    skills: project.tools?.filter(Boolean) ?? [],
    descriptionList: buildProjectBrief(project),
    createdAt: project.created_at,
  }
}

export const getProjects = async (limit?: number) => {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("projects")
      .select(
        "id, name, coverimage, description, githuburl, previewurl, tools, created_at"
      )
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query.returns<ProjectRow[]>()

    if (error || !data) {
      return []
    }

    return data.map(mapProject)
  } catch (err) {
    console.error("Failed to fetch projects:", err)
    return []
  }
}

export const getProjectByHref = async (href: string) => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, name, coverimage, description, githuburl, previewurl, tools, created_at"
      )
      .returns<ProjectRow[]>()

    if (error || !data) {
      return null
    }

    const projects = data.map(mapProject)
    return (
      projects.find((project) => project.href.endsWith(`/${href}`)) ?? null
    )
  } catch (err) {
    console.error("Failed to fetch project:", err)
    return null
  }
}
