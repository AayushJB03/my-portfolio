import { getCertificates, type Certificate } from "@/data/certificates"
import {
  FALLBACK_ABOUT,
  FALLBACK_PROFILE,
  FALLBACK_TEXT_TAGS,
  type AboutContent,
  type Achievement,
  type ProfileContent,
  type TextTag,
  type UtilityCategory,
  getAboutContent,
  getAchievements,
  getProfileContent,
  getUtilities,
} from "@/data/content"
import { getExperience, type Experience } from "@/data/experience"
import { getPhotographyPhotos, type PhotographyPhoto } from "@/data/photography"
import { getProjects, type Project } from "@/data/projects"
import { getTechStack, type TechStack } from "@/data/tech-stack"
import { createClient } from "@/lib/supabase/server"

export type AdminContentBundle = {
  profile: ProfileContent
  about: AboutContent
  textTags: TextTag[]
  achievements: Achievement[]
  projects: Project[]
  techStack: TechStack[]
  experience: Experience[]
  certificates: Certificate[]
  utilities: UtilityCategory[]
  photography: PhotographyPhoto[]
}

const getAdminTextTags = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("text_tags")
      .select("id, text, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .returns<TextTag[]>()

    if (error || !data || data.length === 0) {
      return FALLBACK_TEXT_TAGS.map((text, index) => ({
        id: `fallback-tag-${index}`,
        text,
        sort_order: index,
      }))
    }

    return data
  } catch {
    return FALLBACK_TEXT_TAGS.map((text, index) => ({
      id: `fallback-tag-${index}`,
      text,
      sort_order: index,
    }))
  }
}

export const getAdminContent = async (): Promise<AdminContentBundle> => {
  const [
    profile,
    about,
    textTags,
    achievements,
    projects,
    techStack,
    experience,
    certificates,
    utilities,
    photography,
  ] = await Promise.all([
    getProfileContent(),
    getAboutContent(),
    getAdminTextTags(),
    getAchievements(),
    getProjects(),
    getTechStack(),
    getExperience(),
    getCertificates(),
    getUtilities(),
    getPhotographyPhotos(),
  ])

  const bundle = {
    profile: profile ?? FALLBACK_PROFILE,
    about: about ?? FALLBACK_ABOUT,
    textTags,
    achievements,
    projects,
    techStack,
    experience,
    certificates,
    utilities,
    photography,
  }

  return JSON.parse(JSON.stringify(bundle)) as AdminContentBundle
}
