"use client"

import { useEffect, useState } from "react"
import { SOUNDLIST } from "@/data/currently-listening"
import { TextScramble } from "@/components/ui/text-scramble"
import { SkeletonBlock } from "@/components/ui/skeleton"
import Image from "next/image"

export function CurrentlyListening() {
  const [songIndex, setSongIndex] = useState(0)
  const [, setCurrentTime] = useState(0)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [coverLoading, setCoverLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Seed a random song on mount
  useEffect(() => {
    setSongIndex(Math.floor(Math.random() * SOUNDLIST.length))
    setMounted(true)
  }, [])

  const currentSong = SOUNDLIST[songIndex] || SOUNDLIST[0]

  // Dynamic Cover Art Fetching from our local API route
  useEffect(() => {
    if (!mounted) return

    let active = true
    async function fetchCoverArt() {
      setCoverLoading(true)
      try {
        const res = await fetch(
          `/api/cover-art?title=${encodeURIComponent(currentSong.title)}&artist=${encodeURIComponent(currentSong.artist)}`
        )
        if (!res.ok) throw new Error("Local cover-art API failed")
        const data = await res.json()
        if (active) {
          setCoverUrl(data.coverUrl)
        }
      } catch (err) {
        console.error("Failed to fetch artwork from local API:", err)
        if (active) {
          setCoverUrl(null)
        }
      } finally {
        if (active) {
          setCoverLoading(false)
        }
      }
    }

    fetchCoverArt()
    return () => {
      active = false
    }
  }, [songIndex, currentSong, mounted])

  // Background auto-play track timer (keeps playing tracks sequentially)
  useEffect(() => {
    if (!mounted) return

    const ticker = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= currentSong.durationSeconds) {
          setSongIndex((prevIndex) => (prevIndex + 1) % SOUNDLIST.length)
          return 0
        }

        return prev + 1
      })
    }, 1000)

    return () => {
      clearInterval(ticker)
    }
  }, [currentSong.durationSeconds, mounted])

  // Reset progress when track changes
  useEffect(() => {
    setCurrentTime(0)
  }, [songIndex])

  if (!mounted) {
    return (
      <section className="border-edge w-full animate-pulse border-b-[1px] p-2">
        <div className="bg-muted h-10 rounded-md" />
      </section>
    )
  }

  return (
    <section className="w-full">
      {/* Header Bar: Match design of HeaderTitle component */}
      <div className="border-edge full-bleed-border-b flex h-10 w-full items-center justify-between border-b-[1px] px-2">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary/90 size-5 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
              fill="currentColor"
            />
          </svg>
          <TextScramble
            as="h2"
            className="font-pixelify text-primary/90 text-xl font-bold md:text-2xl"
            id="currently-listening"
          >
            Currently Listening
          </TextScramble>
        </div>

        <div className="mr-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-500 sm:text-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          LIVE
        </div>
      </div>

      {/* Click-to-Play Content Link */}
      <a
        href={currentSong.youtubeMusicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:bg-accent/40 group flex items-center gap-3 rounded-md p-3 transition-colors"
      >
        {/* Cover Art Wrapper */}
        <div className="border-edge relative size-10 shrink-0 overflow-hidden rounded border bg-muted shadow-sm">
          {coverLoading ? (
            <SkeletonBlock className="size-full rounded-none" />
          ) : coverUrl ? (
            <Image
              src={coverUrl}
              alt={`${currentSong.title} album cover`}
              width={40}
              height={40}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="40px"
            />
          ) : (
            /* Fallback spinning vinyl record */
            <div className="relative flex size-full animate-[spin_6s_linear_infinite] items-center justify-center rounded-full border border-zinc-900 bg-zinc-950">
              <div className="absolute inset-0.5 rounded-full border border-zinc-800/30" />
              <div className="bg-primary/20 absolute flex size-2.5 items-center justify-center rounded-full">
                <div className="size-0.5 rounded-full bg-zinc-950" />
              </div>
            </div>
          )}
        </div>

        {/* Track Details */}
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Track metadata */}
          <div className="flex min-w-0 flex-col">
            <h3 className="font-pixelify text-primary decoration-primary/50 line-clamp-1 text-sm leading-normal font-bold decoration-1 underline-offset-2 group-hover:underline">
              {currentSong.title}
            </h3>
            <p className="text-muted-foreground line-clamp-1 text-[10px] leading-none sm:text-xs">
              by {currentSong.artist}
            </p>
          </div>
        </div>
      </a>
    </section>
  )
}
