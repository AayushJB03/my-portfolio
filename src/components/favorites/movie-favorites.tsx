"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface TMDBMediaItem {
  id: number
  title?: string
  name?: string
  media_type: "movie" | "tv"
  poster_path?: string
  release_date?: string
  first_air_date?: string
}

const MediaCard = ({ item }: { item: TMDBMediaItem }) => {
  const title = item.title || item.name || "Untitled"
  const dateStr = item.release_date || item.first_air_date || ""
  const year = dateStr ? dateStr.split("-")[0] : ""
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
    : null
  const tmdbUrl = `https://www.themoviedb.org/${item.media_type}/${item.id}`

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={tmdbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex flex-col items-center gap-2 rounded-md p-3 transition-all duration-200",
            "hover:bg-accent/50"
          )}
        >
          {/* Poster Image */}
          <div
            className={cn(
              "relative h-20 w-14 overflow-hidden rounded-md sm:h-24 sm:w-16",
              "border-edge border bg-muted",
              "transition-transform duration-200 group-hover:scale-105"
            )}
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${title} poster`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-[9px] text-muted-foreground">
                No Photo
              </div>
            )}
          </div>

          {/* Media Info */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="font-pixelify text-primary text-xs leading-tight font-semibold sm:text-sm">
              {title}
            </span>
            {year && (
              <span className="text-muted-foreground/80 font-mono text-[9px] sm:text-[10px]">
                {year}
              </span>
            )}
          </div>

          {/* Hover underline indicator */}
          <span className="bg-primary/60 absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-200 group-hover:w-3/4" />
        </a>
      </TooltipTrigger>
      <TooltipContent className="border-edge bg-popover text-popover-foreground rounded-md border px-2.5 py-1.5 text-[11px] shadow-md">
        <div className="font-pixelify flex items-center gap-1.5">
          <span>TMDB Profile</span>
          <svg
            viewBox="0 0 24 24"
            className="size-3 fill-current opacity-70"
            aria-hidden="true"
          >
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md p-3">
      {/* Poster Skeleton */}
      <div className="bg-muted h-20 w-14 animate-pulse rounded-md sm:h-24 sm:w-16" />
      {/* Title & Year Skeleton */}
      <div className="mt-1 flex w-full flex-col items-center gap-1.5">
        <div className="bg-muted h-3.5 w-16 animate-pulse rounded" />
        <div className="bg-muted h-2.5 w-8 animate-pulse rounded" />
      </div>
    </div>
  )
}

export function MovieFavorites() {
  const [movies, setMovies] = useState<TMDBMediaItem[]>([])
  const [webSeries, setWebSeries] = useState<TMDBMediaItem[]>([])
  const [anime, setAnime] = useState<TMDBMediaItem[]>([])
  const [loading, setLoading] = useState(true)

  const [isMobile, setIsMobile] = useState(false)
  const [showAllMovies, setShowAllMovies] = useState(false)
  const [showAllWebSeries, setShowAllWebSeries] = useState(false)
  const [showAllAnime, setShowAllAnime] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    let active = true

    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites")
        if (!res.ok) {
          throw new Error("Failed to fetch favorites from API route")
        }
        const data = await res.json()
        if (active) {
          setMovies(data.movies || [])
          setWebSeries(data.webSeries || [])
          setAnime(data.anime || [])
        }
      } catch (err) {
        console.error("Error fetching TMDB favorites:", err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchFavorites()
    return () => {
      active = false
    }
  }, [])

  const moviesToRender =
    isMobile && !showAllMovies ? movies.slice(0, 3) : movies

  const webSeriesToRender =
    isMobile && !showAllWebSeries ? webSeries.slice(0, 3) : webSeries

  const animeToRender =
    isMobile && !showAllAnime ? anime.slice(0, 3) : anime

  const movieSkeletonsCount = isMobile && !showAllMovies ? 3 : 6
  const webSeriesSkeletonsCount = isMobile && !showAllWebSeries ? 3 : 6
  const animeSkeletonsCount = isMobile && !showAllAnime ? 3 : 6

  return (
    <TooltipProvider>
      <div className="grid w-full grid-cols-1 md:grid-cols-3">
        {/* Movies */}
        <article className="border-edge border-b-[1px] p-3 md:border-r-[1px]">
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-0.5">
              <h3 className="font-pixelify text-primary text-lg font-semibold">
                Movies
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Cinematic experiences that stayed with me.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:grid-cols-3">
              {loading
                ? Array.from({ length: movieSkeletonsCount }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                  ))
                : moviesToRender.map((movie) => (
                    <MediaCard key={movie.id} item={movie} />
                  ))}
            </div>

            {isMobile && !loading && movies.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllMovies(!showAllMovies)}
                className="font-pixelify text-muted-foreground hover:text-primary mt-1.5 cursor-pointer self-center text-xs underline"
              >
                {showAllMovies ? "See Less" : "Load More"}
              </button>
            )}
          </div>
        </article>

        {/* Web Series */}
        <article className="border-edge border-b-[1px] p-3 md:border-r-[1px]">
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-0.5">
              <h3 className="font-pixelify text-primary text-lg font-semibold">
                Web Series
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Bingeworthy shows with great writing and characters.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:grid-cols-3">
              {loading
                ? Array.from({ length: webSeriesSkeletonsCount }).map(
                    (_, i) => <MovieCardSkeleton key={i} />
                  )
                : webSeriesToRender.map((show) => (
                    <MediaCard key={show.id} item={show} />
                  ))}
            </div>

            {isMobile && !loading && webSeries.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllWebSeries(!showAllWebSeries)}
                className="font-pixelify text-muted-foreground hover:text-primary mt-1.5 cursor-pointer self-center text-xs underline"
              >
                {showAllWebSeries ? "See Less" : "Load More"}
              </button>
            )}
          </div>
        </article>

        {/* Anime */}
        <article className="border-edge border-b-[1px] p-3">
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-0.5">
              <h3 className="font-pixelify text-primary text-lg font-semibold">
                Anime
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Series and films I keep coming back to.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:grid-cols-3">
              {loading
                ? Array.from({ length: animeSkeletonsCount }).map(
                    (_, i) => <MovieCardSkeleton key={i} />
                  )
                : animeToRender.map((show) => (
                    <MediaCard key={show.id} item={show} />
                  ))}
            </div>

            {isMobile && !loading && anime.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllAnime(!showAllAnime)}
                className="font-pixelify text-muted-foreground hover:text-primary mt-1.5 cursor-pointer self-center text-xs underline"
              >
                {showAllAnime ? "See Less" : "Load More"}
              </button>
            )}
          </div>
        </article>
      </div>
    </TooltipProvider>
  )
}
