import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAdminContent } from "@/lib/admin/content"
import { isValidAdminPassword } from "@/lib/admin/auth"
import { createAdminClient } from "@/lib/supabase/admin"

const BUCKET = "profile-images"
const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_FILE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
])

const jsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status })

const getStoredPath = (url: string) => {
  try {
    const pathname = new URL(url).pathname
    const marker = `/storage/v1/object/public/${BUCKET}/`
    const markerIndex = pathname.indexOf(marker)

    if (markerIndex === -1) {
      return null
    }

    return decodeURIComponent(pathname.slice(markerIndex + marker.length))
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const password = formData.get("password")
    const file = formData.get("file")

    if (!isValidAdminPassword(password)) {
      return jsonError("Invalid admin password.", 401)
    }

    if (!(file instanceof File)) {
      return jsonError("Choose an image to upload.")
    }

    const extension = ALLOWED_FILE_TYPES.get(file.type)

    if (!extension) {
      return jsonError("Use a JPG, PNG, WebP, or AVIF image.")
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError("Profile pictures must be 2 MB or smaller.")
    }

    const supabase = createAdminClient()
    const objectPath = `avatar-${crypto.randomUUID()}.${extension}`
    const { data: currentProfile } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "profile")
      .maybeSingle()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, await file.arrayBuffer(), {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(objectPath)
    const avatarUrl = publicUrlData.publicUrl

    const { error: saveError } = await supabase.from("site_content").upsert({
      key: "profile",
      value: { avatarUrl },
      updated_at: new Date().toISOString(),
    })

    if (saveError) {
      await supabase.storage.from(BUCKET).remove([objectPath])
      throw saveError
    }

    const previousValue = currentProfile?.value
    const previousUrl =
      previousValue &&
      typeof previousValue === "object" &&
      "avatarUrl" in previousValue &&
      typeof previousValue.avatarUrl === "string"
        ? previousValue.avatarUrl
        : ""
    const previousPath = getStoredPath(previousUrl)

    if (previousPath && previousPath !== objectPath) {
      await supabase.storage.from(BUCKET).remove([previousPath])
    }

    revalidatePath("/", "layout")
    revalidatePath("/admin")

    return NextResponse.json(await getAdminContent())
  } catch (error) {
    console.error("Profile image upload failed:", error)
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to update the profile picture.",
      500
    )
  }
}
