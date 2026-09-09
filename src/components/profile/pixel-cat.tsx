"use client"

import { playRandomCuteSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion, useMotionValue, useSpring } from "motion/react"
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

// How long the cursor has to sit still before the cat dozes off again.
const IDLE_TIMEOUT_MS = 1800
// Trails a little behind/below the pointer tip rather than sitting on it —
// reads as "following" instead of "stuck to the cursor".
const OFFSET_X = 18
const OFFSET_Y = 22

export const PixelCat = () => {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [animation, setAnimation] = useState<CatAnimation>("sleeping")
  const [frameIndex, setFrameIndex] = useState(0)
  const animationRef = useRef<CatAnimation>("sleeping")
  const idleTimeoutRef = useRef<number | null>(null)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 220, damping: 20, mass: 0.4 })
  const springY = useSpring(cursorY, { stiffness: 220, damping: 20, mass: 0.4 })
  const lastSoundAtRef = useRef(0)

  useEffect(() => {
    Object.values(CAT_IMAGES).forEach((src) => {
      const image = new window.Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    setEnabled(!isCoarsePointer && !prefersReducedMotion)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const wake = () => {
      if (animationRef.current !== "waking") {
        animationRef.current = "waking"
        setAnimation("waking")

        // Rare + cooled-down, not on every single wake — this fires on
        // nearly every mouse movement across the whole site, so playing a
        // sound every time would get old fast. ~1 in 6 wakes, at most once
        // every 6s.
        const now = performance.now()
        if (now - lastSoundAtRef.current > 6000 && Math.random() < 1 / 6) {
          lastSoundAtRef.current = now
          playRandomCuteSound()
        }
      }
    }

    const scheduleSleep = () => {
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current)
      }
      idleTimeoutRef.current = window.setTimeout(() => {
        animationRef.current = "sleeping"
        setAnimation("sleeping")
      }, IDLE_TIMEOUT_MS)
    }

    const handlePointerMove = (event: PointerEvent) => {
      cursorX.set(event.clientX + OFFSET_X)
      cursorY.set(event.clientY + OFFSET_Y)
      setVisible(true)
      wake()
      scheduleSleep()
    }

    const handlePointerLeave = () => {
      setVisible(false)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerleave", handlePointerLeave)
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current)
      }
    }
  }, [enabled, cursorX, cursorY])

  useEffect(() => {
    setFrameIndex(0)
  }, [animation])

  useEffect(() => {
    if (!enabled) return
    const interval = window.setInterval(
      () => {
        setFrameIndex((index) => (index + 1) % 4)
      },
      animation === "sleeping" ? 900 : 220
    )

    return () => window.clearInterval(interval)
  }, [animation, enabled])

  if (!enabled) return null

  const frames = animation === "sleeping" ? SLEEPING_FRAMES : WAKING_FRAMES
  const imageFrame = frames[frameIndex]

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-50 h-12 w-12 -translate-x-1/2 select-none transition-opacity duration-300 sm:h-14 sm:w-14",
        visible ? "opacity-95" : "opacity-0"
      )}
    >
      <span
        className={cn(
          "font-bitcount absolute -top-1 right-1 text-[10px] font-bold text-zinc-600 transition-opacity duration-150",
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
          "h-full w-full object-contain [image-rendering:pixelated]",
          animation === "waking" && "-translate-y-0.5"
        )}
      />
    </motion.div>
  )
}
