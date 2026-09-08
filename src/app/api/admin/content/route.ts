import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAdminContent } from "@/lib/admin/content"
import { isValidAdminPassword } from "@/lib/admin/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSimpleIconSlug, getSimpleIconUrl } from "@/lib/tech-icons"

type AdminSection =
  | "about"
  | "textTags"
  | "projects"
  | "techStack"
  | "achievements"
  | "experience"
  | "certificates"
  | "photography"
  | "utilityCategories"
  | "utilityItems"

const jsonError = (message: string, status = 400) => {
  return NextResponse.json({ error: message }, { status })
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }

  return fallback
}

const ensureUtilitiesInitialized = async (
  supabase: ReturnType<typeof createAdminClient>
) => {
  const { count, error: countError } = await supabase
    .from("utility_categories")
    .select("id", { count: "exact", head: true })

  if (countError) throw countError
  if ((count ?? 0) > 0) return

  const { UTILITIES } = await import("@/data/utilities")
  const categories = UTILITIES.map((category, index) => ({
    id: category.id,
    title: category.title,
    description: category.description,
    sort_order: index,
  }))
  const items = UTILITIES.flatMap((category) =>
    category.items.map((item, index) => ({
      category_id: category.id,
      key: item.key,
      name: item.name,
      description: item.description,
      url: item.url ?? null,
      sort_order: index,
    }))
  )

  const { error: categoriesError } = await supabase
    .from("utility_categories")
    .upsert(categories, { onConflict: "id" })

  if (categoriesError) throw categoriesError

  const { error: itemsError } = await supabase
    .from("utility_items")
    .upsert(items, { onConflict: "category_id,key" })

  if (itemsError) throw itemsError
}

type PhotographyPhotoRecord = {
  id: string
  image_url: string
  sort_order: number
  created_at: string
}

const isPhotographyPhotoRecord = (
  photo: unknown
): photo is PhotographyPhotoRecord =>
  Boolean(
    photo &&
      typeof photo === "object" &&
      "id" in photo &&
      "image_url" in photo &&
      "sort_order" in photo &&
      "created_at" in photo &&
      typeof photo.id === "string" &&
      typeof photo.image_url === "string" &&
      typeof photo.sort_order === "number" &&
      typeof photo.created_at === "string"
  )

const getPhotographyPhotos = async (
  supabase: ReturnType<typeof createAdminClient>
): Promise<PhotographyPhotoRecord[]> => {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "photography")
    .maybeSingle()

  if (error) throw error

  const value = data?.value
  const photos: unknown[] =
    value &&
    typeof value === "object" &&
    "photos" in value &&
    Array.isArray(value.photos)
      ? value.photos
      : []

  return photos.filter(isPhotographyPhotoRecord)
}

const savePhotographyPhotos = async (
  supabase: ReturnType<typeof createAdminClient>,
  photos: PhotographyPhotoRecord[]
) => {
  const { error } = await supabase.from("site_content").upsert({
    key: "photography",
    value: { photos },
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

const refreshContent = async () => {
  revalidatePath("/")
  revalidatePath("/projects")
  revalidatePath("/certificates")
  revalidatePath("/photography")
  revalidatePath("/utilities")
  return NextResponse.json(await getAdminContent())
}

const toStringList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const assertPassword = (password: unknown) => {
  if (!isValidAdminPassword(password)) {
    throw new Error("Unauthorized")
  }
}

export async function GET() {
  try {
    return NextResponse.json(await getAdminContent())
  } catch (error) {
    console.error("Admin content GET failed:", error)
    return jsonError(getErrorMessage(error, "Failed to load content."), 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      password?: string
      section?: AdminSection
      data?: Record<string, unknown>
    }
    assertPassword(body.password)

    const section = body.section
    const data = body.data ?? {}
    const supabase = createAdminClient()

    if (section === "about") {
      const markdown = String(data.markdown ?? "").trim()
      const paragraphs = toStringList(data.paragraphs)
      const resumeUrl = String(data.resumeUrl ?? "").trim()
      const resumeLabel = String(data.resumeLabel ?? "").trim()
      const secondaryLinkUrl = String(data.secondaryLinkUrl ?? "").trim()
      const secondaryLinkLabel = String(data.secondaryLinkLabel ?? "").trim()

      const { error } = await supabase.from("site_content").upsert({
        key: "about",
        value: {
          markdown,
          paragraphs:
            paragraphs.length > 0 ? paragraphs : toStringList(markdown),
          focusAreas: toStringList(data.focusAreas),
          resumeUrl,
          resumeLabel,
          secondaryLinkUrl,
          secondaryLinkLabel,
        },
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "textTags") {
      const { error } = await supabase.from("text_tags").insert({
        text: String(data.text ?? "").trim(),
        sort_order: Number(data.sort_order ?? 0),
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "projects") {
      const { error } = await supabase.from("projects").insert({
        name: String(data.name ?? "").trim(),
        coverimage: String(data.coverimage ?? "").trim(),
        description: String(data.description ?? "").trim(),
        githuburl: String(data.githuburl ?? "").trim(),
        previewurl: String(data.previewurl ?? "").trim() || null,
        tools: toStringList(data.tools),
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "techStack") {
      const name = String(data.name ?? "").trim()

      if (!name) {
        return jsonError("Tech stack name is required.")
      }

      const { error } = await supabase.from("tech_stack_items").insert({
        name,
        slug: getSimpleIconSlug(name),
        icon_url: getSimpleIconUrl(name),
        sort_order: Number(data.sort_order ?? 0),
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "achievements") {
      const { error } = await supabase.from("achievements").insert({
        title: String(data.title ?? "").trim(),
        year: String(data.year ?? "").trim(),
        issuer: String(data.issuer ?? "").trim() || null,
        sort_order: Number(data.sort_order ?? 0),
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "experience") {
      const { error } = await supabase.from("experience_items").insert({
        title: String(data.title ?? "").trim(),
        company: String(data.company ?? "").trim(),
        type: String(data.type ?? "Experience").trim(),
        logo: String(data.logo ?? "").trim() || null,
        from_date: String(data.from_date ?? "").trim(),
        to_date: String(data.to_date ?? "").trim() || null,
        description_list: toStringList(data.description_list),
        skills: toStringList(data.skills),
        is_expanded: Boolean(data.is_expanded),
        sort_order: Number(data.sort_order ?? 0),
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "certificates") {
      const { error } = await supabase.from("certificates").insert({
        title: String(data.title ?? "").trim(),
        issueddate: String(data.issueddate ?? "").trim(),
        orgname: String(data.orgname ?? "").trim(),
        orglogo: String(data.orglogo ?? "").trim(),
        url: String(data.url ?? "").trim(),
        pinned: Boolean(data.pinned),
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "photography") {
      const imageUrl = String(data.image_url ?? "").trim()

      if (!imageUrl) {
        return jsonError("Photo image is required.")
      }

      const photos = await getPhotographyPhotos(supabase)
      await savePhotographyPhotos(supabase, [
        {
          image_url: imageUrl,
          sort_order: Number(data.sort_order ?? 0),
          created_at: new Date().toISOString(),
          id: crypto.randomUUID(),
        },
        ...photos,
      ])
      return refreshContent()
    }

    if (section === "utilityCategories") {
      const { error } = await supabase.from("utility_categories").insert({
        id: String(data.id ?? "").trim(),
        title: String(data.title ?? "").trim(),
        description: String(data.description ?? "").trim(),
        sort_order: Number(data.sort_order ?? 0),
      })

      if (error) throw error
      return refreshContent()
    }

    if (section === "utilityItems") {
      await ensureUtilitiesInitialized(supabase)

      const { error } = await supabase.from("utility_items").insert({
        category_id: String(data.category_id ?? "").trim(),
        key: String(data.key ?? "").trim(),
        name: String(data.name ?? "").trim(),
        description: String(data.description ?? "").trim(),
        url: String(data.url ?? "").trim() || null,
        sort_order: Number(data.sort_order ?? 0),
      })

      if (error) throw error
      return refreshContent()
    }

    return jsonError("Unknown admin section.")
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return jsonError("Invalid admin password.", 401)
    }

    console.error("Admin content POST failed:", error)
    return jsonError(getErrorMessage(error, "Failed to save content."), 500)
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as {
      password?: string
      section?: Exclude<AdminSection, "about">
      id?: string
    }
    assertPassword(body.password)

    if (!body.id) {
      return jsonError("Missing item id.")
    }

    const supabase = createAdminClient()
    if (
      body.section === "utilityCategories" ||
      body.section === "utilityItems"
    ) {
      await ensureUtilitiesInitialized(supabase)
    }

    if (body.section === "photography") {
      const photos = await getPhotographyPhotos(supabase)
      await savePhotographyPhotos(
        supabase,
        photos.filter((photo) => photo.id !== body.id)
      )
      return refreshContent()
    }

    const tables: Record<
      Exclude<AdminSection, "about" | "photography">,
      string
    > = {
      textTags: "text_tags",
      projects: "projects",
      techStack: "tech_stack_items",
      achievements: "achievements",
      experience: "experience_items",
      certificates: "certificates",
      utilityCategories: "utility_categories",
      utilityItems: "utility_items",
    }

    const table = body.section ? tables[body.section] : null

    if (!table) {
      return jsonError("Unknown admin section.")
    }

    const { error } = await supabase.from(table).delete().eq("id", body.id)

    if (error) throw error
    return refreshContent()
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return jsonError("Invalid admin password.", 401)
    }

    console.error("Admin content DELETE failed:", error)
    return jsonError(getErrorMessage(error, "Failed to delete content."), 500)
  }
}
