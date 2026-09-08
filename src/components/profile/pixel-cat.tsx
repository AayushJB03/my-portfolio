"use client"

import { playRandomCuteSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type CatFrame = "sleep" | "alert" | "blink" | "paw"
type CatAnimation = "sleeping" | "waking"

const CAT_IMAGES: Record<CatFrame, string> = {
  sleep: "/assets/pixel-cat-sleep.png",
  alert: "/assets/pixel-cat-alert.png",
  blink: "/assets/pixel-cat-blink.png",
  paw: "/assets/pixel-cat-paw.png",
}

const SLEEPING_FRAMES: CatFrame[] = ["sleep", "sleep", "blink", "sleep"]
const WAKING_FRAMES: CatFrame[] = ["alert", "paw", "alert", "blink"]

export const PixelCat = () => {
  const catRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<CatAnimation>("sleeping")
  const frameRequestRef = useRef<number | null>(null)
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null)
  const [animation, setAnimation] = useState<CatAnimation>("sleeping")
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    Object.values(CAT_IMAGES).forEach((src) => {
      const image = new window.Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const updateAnimation = () => {
      frameRequestRef.current = null

      const cat = catRef.current
      const pointer = latestPointerRef.current
      if (!cat || !pointer) return

      const rect = cat.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const distance = Math.hypot(pointer.x - x, pointer.y - y)
      const nextAnimation = distance < 170 ? "waking" : "sleeping"

      if (animationRef.current !== nextAnimation) {
        animationRef.current = nextAnimation
        setAnimation(nextAnimation)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      latestPointerRef.current = { x: event.clientX, y: event.clientY }

      if (frameRequestRef.current === null) {
        frameRequestRef.current = window.requestAnimationFrame(updateAnimation)
      }
    }

    const handlePointerLeave = () => {
      latestPointerRef.current = null
      animationRef.current = "sleeping"
      setAnimation("sleeping")
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)

      if (frameRequestRef.current !== null) {
        window.cancelAnimationFrame(frameRequestRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setFrameIndex(0)
  }, [animation])

  useEffect(() => {
    const interval = window.setInterval(
      () => {
        setFrameIndex((index) => (index + 1) % 4)
      },
      animation === "sleeping" ? 900 : 220
    )

    return () => window.clearInterval(interval)
  }, [animation])

  const frames = animation === "sleeping" ? SLEEPING_FRAMES : WAKING_FRAMES
  const imageFrame = frames[frameIndex]

  return (
    <div
      ref={catRef}
      className="relative h-16 w-16 select-none sm:h-[72px] sm:w-[72px]"
      role="button"
      tabIndex={0}
      aria-label="Sleeping pixel cat — click to hear it"
      onClick={playRandomCuteSound}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          playRandomCuteSound()
        }
      }}
    >
      <span
        className={cn(
          "font-bitcount absolute -top-1 right-2 z-10 text-[11px] font-bold text-zinc-600 transition-opacity duration-150",
          animation === "waking" && "opacity-0"
        )}
      >
        zZ
      </span>

      <Image
        src={CAT_IMAGES[imageFrame]}
        alt=""
        width={256}
        height={256}
        draggable={false}
        priority={false}
        className={cn(
          "h-full w-full object-contain opacity-95 transition duration-150 [image-rendering:pixelated]",
          animation === "waking" && "-translate-y-0.5"
        )}
      />
    </div>
  )
}
