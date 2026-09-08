"use client"

import {
  type ComponentType,
  type ElementType,
  type JSX,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, type MotionProps, useReducedMotion } from "motion/react"
import { usePathname } from "next/navigation"

type TextScrambleProps = {
  children: string
  duration?: number
  speed?: number
  characterSet?: string
  as?: ElementType
  className?: string
  trigger?: boolean
  onScrambleComplete?: () => void
} & MotionProps &
  Record<string, unknown>

type MotionTagProps = {
  className?: string
  children?: ReactNode
} & MotionProps

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export function TextScramble({
  children,
  duration = 0.7,
  speed = 0.035,
  characterSet = defaultChars,
  className,
  as: Component = "span",
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const pathname = usePathname()
  const MotionComponent = useMemo(
    () =>
      motion.create(
        Component as keyof JSX.IntrinsicElements
      ) as ComponentType<MotionTagProps>,
    [Component]
  )
  const [displayText, setDisplayText] = useState(children)
  const isAnimating = useRef(false)
  const hasScrambled = useRef(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setDisplayText(children)
    hasScrambled.current = false
  }, [children, pathname])

  useEffect(() => {
    if (!trigger || isAnimating.current || hasScrambled.current) return

    if (shouldReduceMotion) {
      hasScrambled.current = true
      onScrambleComplete?.()
      return
    }

    hasScrambled.current = true
    isAnimating.current = true

    const steps = Math.max(1, Math.ceil(duration / speed))
    let step = 0

    const interval = window.setInterval(() => {
      const progress = step / steps
      let scrambled = ""

      for (let index = 0; index < children.length; index++) {
        if (!children[index].trim()) {
          scrambled += children[index]
          continue
        }

        if (progress * children.length > index) {
          scrambled += children[index]
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)]
        }
      }

      setDisplayText(scrambled)
      step++

      if (step > steps) {
        window.clearInterval(interval)
        setDisplayText(children)
        isAnimating.current = false
        onScrambleComplete?.()
      }
    }, speed * 1000)

    return () => {
      window.clearInterval(interval)
      isAnimating.current = false
    }
  }, [
    characterSet,
    children,
    duration,
    onScrambleComplete,
    shouldReduceMotion,
    speed,
    trigger,
    pathname,
  ])

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  )
}
