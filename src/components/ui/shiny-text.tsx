"use client"

import { motion, type MotionStyle, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type ShinyTextProps = {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
  spread?: number
  direction?: "left" | "right"
  underline?: boolean
}

export function ShinyText({
  text,
  disabled = false,
  speed = 1.35,
  className,
  color = "color-mix(in oklab, currentColor 68%, var(--background))",
  shineColor = "var(--foreground)",
  spread = 110,
  direction = "left",
  underline = false,
}: ShinyTextProps) {
  const shouldReduceMotion = useReducedMotion()

  if (disabled || shouldReduceMotion) {
    return (
      <span
        className={cn(
          "inline-block",
          underline && "underline underline-offset-4",
          className
        )}
      >
        {text}
      </span>
    )
  }

  const gradientStyle = {
    display: "inline-block",
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 14%, ${shineColor} 30%, #ffffff 42%, #ffffff 58%, ${shineColor} 70%, ${color} 86%, ${color} 100%)`,
    backgroundSize: "340% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "inherit",
    filter:
      "drop-shadow(0 0 0.18rem color-mix(in oklab, currentColor 40%, transparent))",
  } satisfies MotionStyle

  const motionInitial = {
    backgroundPosition: direction === "left" ? "180% center" : "-80% center",
  }
  const motionAnimate = {
    backgroundPosition: direction === "left" ? "-80% center" : "180% center",
  }
  const motionTransition = {
    duration: speed,
    ease: "linear" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  }

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      style={gradientStyle}
      initial={motionInitial}
      animate={motionAnimate}
      transition={motionTransition}
    >
      {text}
      {underline && (
        <motion.span
          aria-hidden="true"
          className="absolute right-0 bottom-[0.06em] left-0 h-px"
          style={{
            backgroundImage: gradientStyle.backgroundImage,
            backgroundSize: gradientStyle.backgroundSize,
          }}
          initial={motionInitial}
          animate={motionAnimate}
          transition={motionTransition}
        />
      )}
    </motion.span>
  )
}
