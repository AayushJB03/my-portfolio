import { NextResponse } from "next/server"

// Memory cache to serve stale data in case of TMDB transient connection resets
interface CachedData {
  movies: TMDBItem[]
  webSeries: TMDBItem[]
  anime: TMDBItem[]
  timestamp: number
}

interface TMDBItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  overview?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

let memoryCache: CachedData | null = null
const CACHE_TTL = 3600 * 1000 // 1 hour in milliseconds

async function fetchTMDBList(listId: string) {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.error("TMDB_API_KEY is not defined in environment variables.")
    return []
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 seconds timeout

    const res = await fetch(
      `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
      {
        signal: controller.signal,
        next: { revalidate: 3600 }, // Cache in Next.js fetch cache for 1 hour
      }
    )
    clearTimeout(timeoutId)

    if (!res.ok) {
      console.error(`Failed to fetch TMDB list ${listId}: Status ${res.status}`)
      return []
    }

    const data = await res.json()
    return data.items || []
  } catch (err) {
    console.error(`TMDB fetch error for list ${listId}:`, err)
    return []
  }
}

export async function GET() {
  const now = Date.now()

  // 1. If we have a cached copy and it's fresh (less than 1 hour old), return it immediately
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL) {
    return NextResponse.json({
      movies: memoryCache.movies,
      webSeries: memoryCache.webSeries,
      anime: memoryCache.anime,
      cachedAt: memoryCache.timestamp,
    })
  }

  const moviesListId = process.env.TMDB_FAV_MOVIES_LIST_ID || "8661052"
  const webSeriesListId = process.env.TMDB_FAV_WEB_SERIES_LIST_ID || "8661054"
  const animeListId = process.env.TMDB_FAV_ANIME_LIST_ID || ""

  // 2. Fetch live data
  const [movies, webSeries, anime] = await Promise.all([
    fetchTMDBList(moviesListId),
    fetchTMDBList(webSeriesListId),
    animeListId ? fetchTMDBList(animeListId) : Promise.resolve([]),
  ])

  // 3. Fallback: if fetches returned empty results (e.g. network/TLS error) and we have a cache (even if expired), use it
  if (movies.length === 0 && webSeries.length === 0 && anime.length === 0 && memoryCache) {
    console.warn(
      "TMDB fetch returned empty arrays. Serving stale cache fallback."
    )
    return NextResponse.json({
      movies: memoryCache.movies,
      webSeries: memoryCache.webSeries,
      anime: memoryCache.anime,
      cachedAt: memoryCache.timestamp,
      stale: true,
    })
  }

  // 4. Update the memory cache with any non-empty results we received
  if (movies.length > 0 || webSeries.length > 0 || anime.length > 0) {
    const finalMovies = movies.length > 0 ? movies : memoryCache?.movies || []
    const finalWebSeries =
      webSeries.length > 0 ? webSeries : memoryCache?.webSeries || []
    const finalAnime = anime.length > 0 ? anime : memoryCache?.anime || []

    memoryCache = {
      movies: finalMovies,
      webSeries: finalWebSeries,
      anime: finalAnime,
      timestamp: now,
    }
  }

  return NextResponse.json({
    movies: memoryCache?.movies || [],
    webSeries: memoryCache?.webSeries || [],
    anime: memoryCache?.anime || [],
    cachedAt: memoryCache?.timestamp || now,
  })
}
