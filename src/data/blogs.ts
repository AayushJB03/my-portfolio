export type Blog = {
  id: number
  title: string
  url: string
  date: Date
  tags: string[]
  coverImage: string | null
}

type DevToArticle = {
  id: number
  title: string
  url: string
  published_at: string
  tag_list: string[] | string
  cover_image: string | null
  social_image: string | null
}

// ponytail: no Dev.to handle given yet — set this once you have one
const DEVTO_USERNAME = ""
const DEVTO_REVALIDATE_SECONDS = 60 * 30

const normalizeTags = (tags: DevToArticle["tag_list"]) => {
  if (Array.isArray(tags)) {
    return tags
  }

  if (!tags) {
    return []
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

const mapArticle = (article: DevToArticle): Blog => ({
  id: article.id,
  title: article.title,
  url: article.url,
  date: new Date(article.published_at),
  tags: normalizeTags(article.tag_list).slice(0, 5),
  coverImage: article.cover_image ?? article.social_image ?? null,
})

const fetchDevToArticles = async (limit?: number) => {
  try {
    const params = new URLSearchParams({
      per_page: String(limit ?? 30),
    })
    const token = process.env.DEVTO_API_KEY?.trim()
    if (!token && !DEVTO_USERNAME) {
      return []
    }
    const endpoint = token
      ? "https://dev.to/api/articles/me/published"
      : "https://dev.to/api/articles"

    if (!token) {
      params.set("username", DEVTO_USERNAME)
    }

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: token ? { "api-key": token } : undefined,
      next: {
        revalidate: DEVTO_REVALIDATE_SECONDS,
      },
    })

    if (!response.ok) {
      return []
    }

    const articles = (await response.json()) as DevToArticle[]

    if (!Array.isArray(articles)) {
      return []
    }

    return articles
      .filter((article) => article.id && article.title && article.url)
      .map(mapArticle)
  } catch {
    return []
  }
}

export const getBlogs = async (limit?: number) => {
  return fetchDevToArticles(limit)
}
