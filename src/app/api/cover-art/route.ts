import { NextRequest, NextResponse } from "next/server"

// Simple server-side memory cache for searched tracks
const coverCache: Record<string, string | null> = {}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")
  const artist = searchParams.get("artist")

  if (!title || !artist) {
    return NextResponse.json({ coverUrl: null })
  }

  const cacheKey = `${title.toLowerCase()}-${artist.toLowerCase()}`
  if (cacheKey in coverCache) {
    return NextResponse.json({ coverUrl: coverCache[cacheKey] })
  }

  try {
    const query = `${title} ${artist}`
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`,
      { next: { revalidate: 86400 } }
    )

    if (!res.ok) {
      throw new Error(`iTunes search failed with status ${res.status}`)
    }

    const data = await res.json()

    if (data.results && data.results.length > 0) {
      const artworkUrl = data.results[0].artworkUrl100
      const highResUrl = artworkUrl.replace("100x100bb.jpg", "300x300bb.jpg")
      coverCache[cacheKey] = highResUrl
      return NextResponse.json({ coverUrl: highResUrl })
    }

    coverCache[cacheKey] = null
    return NextResponse.json({ coverUrl: null })
  } catch (error) {
    console.error("Error in cover-art API route:", error)
    return NextResponse.json({ coverUrl: null })
  }
}
