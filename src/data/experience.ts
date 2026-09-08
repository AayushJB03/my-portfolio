import { createClient } from "@/lib/supabase/server"

export type Experience = {
  id?: string
  company: string
  title: string
  type: string
  logo: string
  from: string
  to: string | null
  descriptionList: string[]
  skills: string[]
  isExpanded: boolean
  sort_order?: number
}

type ExperienceRow = {
  id: string
  company: string
  title: string
  type: string
  logo: string | null
  from_date: string
  to_date: string | null
  description_list: string[] | null
  skills: string[] | null
  is_expanded: boolean
  sort_order: number
}

type LinkedInDate = {
  day?: number | null
  month?: number | null
  year?: number | null
}

type LinkedInJobTitle = {
  title?: string | null
  starts_at?: LinkedInDate | null
  ends_at?: LinkedInDate | null
  description?: string | null
}

type LinkedInExperience = {
  company?: string | null
  logo_url?: string | null
  job_titles?: LinkedInJobTitle[] | null
}

type LinkedInProfile = {
  experiences?: LinkedInExperience[] | null
  skills?: string[] | null
}

type UserDataRow = {
  value: LinkedInProfile | null
}

const FALLBACK_EXPERIENCE: Experience[] = [
  {
    title: "AI Powered Interview Platform Developer",
    company: "GCOERC & Dsource",
    logo: "https://dsource.co.in/images/logo.png",
    isExpanded: false,
    descriptionList: [
      "Developed and deployed InterviewXpert with Docker and GitHub Actions on AWS EC2.",
      "Managed IAM, security groups, and backend services for reliable CI/CD workflows.",
    ],
    from: "2025-08-01",
    to: null,
    type: "Experience",
    skills: ["AWS", "Docker", "GitHub Actions", "CI/CD"],
  },
  {
    title: "Web Technology Intern",
    company: "Gurado India Private Limited",
    logo: "https://cdn-int.gurado.de/fileadmin/images/gurado-logo.svg",
    isExpanded: false,
    descriptionList: [
      "Configured AWS EC2, IAM, S3, EBS, Elastic IP, and secure SSH access.",
      "Implemented Docker containers and Auto Scaling Groups for scalable environments.",
    ],
    from: "2024-12-01",
    to: "2025-01-31",
    type: "Internship",
    skills: ["AWS", "Docker", "Linux", "Auto Scaling"],
  },
  {
    title: "Industrial Automation Virtual Internship",
    company: "AICTE EduSkills",
    logo: "https://eduskillsfoundation.org/login/logo-BNp4wELk.png",
    isExpanded: false,
    descriptionList: [
      "Completed a 10-week industrial automation internship supported by AICTE and EduSkills.",
    ],
    from: "2025-07-01",
    to: "2025-09-30",
    type: "Internship",
    skills: ["Automation", "Industrial Systems"],
  },
]

const toDateString = (date?: LinkedInDate | null) => {
  if (!date?.year || !date.month) {
    return null
  }

  const day = date.day || 1
  const month = String(date.month).padStart(2, "0")
  const paddedDay = String(day).padStart(2, "0")

  return `${date.year}-${month}-${paddedDay}`
}

const toDescriptionList = (description?: string | null) => {
  if (!description?.trim()) {
    return [
      "Contributed to practical engineering work across product and infrastructure workflows.",
    ]
  }

  return description
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)
}

const inferType = (title: string) => {
  return /intern/i.test(title) ? "Internship" : "Experience"
}

const inferSkills = (
  title: string,
  description: string,
  profileSkills: string[] = []
) => {
  const searchableText = `${title} ${description}`.toLowerCase()

  const matchedSkills = profileSkills.filter((skill) =>
    searchableText.includes(skill.toLowerCase())
  )

  return matchedSkills.length > 0
    ? matchedSkills.slice(0, 6)
    : ["Python", "LLMs", "AI Agents"]
}

const mapLinkedInExperience = (
  item: LinkedInExperience,
  profileSkills: string[],
  index: number
): Experience | null => {
  const job = item.job_titles?.[0]
  const title = job?.title?.trim()
  const company = item.company?.trim()

  if (!title || !company) {
    return null
  }

  const description = job?.description ?? ""
  const from = toDateString(job?.starts_at) ?? "2024-01-01"

  return {
    title,
    company,
    logo: item.logo_url?.trim() ?? "",
    isExpanded: index === 0,
    descriptionList: toDescriptionList(description),
    from,
    to: toDateString(job?.ends_at),
    type: inferType(title),
    skills: inferSkills(title, description, profileSkills),
  }
}

const getDashboardExperience = async () => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("experience_items")
      .select(
        "id, company, title, type, logo, from_date, to_date, description_list, skills, is_expanded, sort_order"
      )
      .order("sort_order", { ascending: true })
      .order("from_date", { ascending: false })
      .returns<ExperienceRow[]>()

    if (error || !data || data.length === 0) {
      return null
    }

    return data.map((item) => ({
      id: item.id,
      company: item.company,
      title: item.title,
      type: item.type,
      logo: item.logo ?? "",
      from: item.from_date,
      to: item.to_date,
      descriptionList: item.description_list ?? [],
      skills: item.skills ?? [],
      isExpanded: item.is_expanded,
      sort_order: item.sort_order,
    }))
  } catch (err) {
    console.error("Failed to fetch dashboard experience:", err)
    return null
  }
}

const getLinkedInOrFallbackExperience = async () => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_data")
      .select("value")
      .eq("key", "linkedin")
      .single()
      .returns<UserDataRow>()

    if (error || !data?.value?.experiences) {
      return [...FALLBACK_EXPERIENCE]
    }

    const profileSkills = data.value.skills?.filter(Boolean) ?? []
    const mapped = data.value.experiences
      .map((item, index) => mapLinkedInExperience(item, profileSkills, index))
      .filter((item): item is Experience => Boolean(item))

    return mapped.length > 0 ? mapped : [...FALLBACK_EXPERIENCE]
  } catch (err) {
    console.error("Failed to fetch LinkedIn experience:", err)
    return [...FALLBACK_EXPERIENCE]
  }
}

const getExperienceKey = (experience: Experience) =>
  [
    experience.company,
    experience.title,
    experience.from,
    experience.to ?? "present",
  ]
    .join("|")
    .toLowerCase()

const sortExperience = (a: Experience, b: Experience) => {
  const aOrder = a.sort_order ?? Number.MAX_SAFE_INTEGER
  const bOrder = b.sort_order ?? Number.MAX_SAFE_INTEGER

  if (aOrder !== bOrder) {
    return aOrder - bOrder
  }

  return new Date(b.from).getTime() - new Date(a.from).getTime()
}

const mergeExperience = (
  dashboardExperience: Experience[] | null,
  legacyExperience: Experience[]
) => {
  const experienceByKey = new Map<string, Experience>()

  for (const item of dashboardExperience ?? []) {
    experienceByKey.set(getExperienceKey(item), item)
  }

  for (const item of legacyExperience) {
    const key = getExperienceKey(item)

    if (!experienceByKey.has(key)) {
      experienceByKey.set(key, item)
    }
  }

  return Array.from(experienceByKey.values()).sort(sortExperience)
}

export const getExperience = async () => {
  const [dashboardExperience, legacyExperience] = await Promise.all([
    getDashboardExperience(),
    getLinkedInOrFallbackExperience(),
  ])

  return mergeExperience(dashboardExperience, legacyExperience)
}
