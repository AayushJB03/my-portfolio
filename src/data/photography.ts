import { createClient } from "@/lib/supabase/server"

export interface PhotographyPhoto {
  id: string
  image_url: string
  sort_order: number
  created_at: string
}

const isPhotographyPhoto = (photo: unknown): photo is PhotographyPhoto =>
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

export const getPhotographyPhotos = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "photography")
      .maybeSingle()

    if (error) {
      console.error("Error fetching photography photos from Supabase:", error)
      return []
    }

    const value = data?.value
    const photos: unknown[] =
      value &&
      typeof value === "object" &&
      "photos" in value &&
      Array.isArray(value.photos)
        ? value.photos
        : []

    return photos.filter(isPhotographyPhoto).sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  } catch (err) {
    console.error("Failed to fetch photography photos:", err)
    return []
  }
}
