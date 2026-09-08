"use client"

import { cn } from "@/lib/utils"
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import styles from "./gradual-blur.module.css"

type BlurPosition = "top" | "bottom" | "left" | "right"
type BlurCurve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out"
type BlurTarget = "parent" | "page"
type BlurAnimation = boolean | "scroll"
type BlurPreset =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "subtle"
  | "intense"
  | "smooth"
  | "sharp"
  | "header"
  | "footer"
  | "sidebar"
  | "page-header"
  | "page-footer"

type GradualBlurConfig = {
  position: BlurPosition
  strength: number
  height: string
  width?: string
  divCount: number
  exponential: boolean
  zIndex: number
  animated: BlurAnimation
  duration: string
  easing: string
  opacity: number
  curve: BlurCurve
  responsive: boolean
  target: BlurTarget
  className: string
  style: CSSProperties
  hoverIntensity?: number
  mobileHeight?: string
  tabletHeight?: string
  desktopHeight?: string
  mobileWidth?: string
  tabletWidth?: string
  desktopWidth?: string
  onAnimationComplete?: () => void
}

export type GradualBlurProps = Partial<GradualBlurConfig> & {
  preset?: BlurPreset
}

const DEFAULT_CONFIG: GradualBlurConfig = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
  className: "",
  style: {},
}

const PRESETS: Record<BlurPreset, Partial<GradualBlurConfig>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": {
    position: "top",
    height: "10rem",
    target: "page",
    strength: 3,
  },
  "page-footer": {
    position: "bottom",
    height: "10rem",
    target: "page",
    strength: 3,
  },
}

const CURVE_FUNCTIONS: Record<BlurCurve, (progress: number) => number> = {
  linear: (progress) => progress,
  bezier: (progress) => progress * progress * (3 - 2 * progress),
  "ease-in": (progress) => progress * progress,
  "ease-out": (progress) => 1 - Math.pow(1 - progress, 2),
  "ease-in-out": (progress) =>
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2,
}

const getGradientDirection = (position: BlurPosition) =>
  (
    ({
      top: "to top",
      bottom: "to bottom",
      left: "to left",
      right: "to right",
    }) as const
  )[position]

const debounce = (fn: () => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

const getResponsiveOverride = (
  config: GradualBlurConfig,
  key: "height" | "width"
) => {
  const suffix = key[0].toUpperCase() + key.slice(1)
  const viewportWidth = window.innerWidth

  if (viewportWidth <= 480) {
    return config[`mobile${suffix}` as "mobileHeight" | "mobileWidth"]
  }

  if (viewportWidth <= 768) {
    return config[`tablet${suffix}` as "tabletHeight" | "tabletWidth"]
  }

  if (viewportWidth <= 1024) {
    return config[`desktop${suffix}` as "desktopHeight" | "desktopWidth"]
  }
}

const useResponsiveDimension = (
  responsive: boolean,
  config: GradualBlurConfig,
  key: "height" | "width"
) => {
  const [value, setValue] = useState(config[key])

  useEffect(() => {
    if (!responsive) {
      setValue(config[key])
      return
    }

    const calculate = () =>
      setValue(getResponsiveOverride(config, key) ?? config[key])
    const debouncedCalculate = debounce(calculate, 100)

    calculate()
    window.addEventListener("resize", debouncedCalculate)

    return () => window.removeEventListener("resize", debouncedCalculate)
  }, [responsive, config, key])

  return responsive ? value : config[key]
}

const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve = false
) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve)

  useEffect(() => {
    if (!shouldObserve || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, shouldObserve])

  return isVisible
}

function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const config = useMemo<GradualBlurConfig>(() => {
    const presetConfig = props.preset ? PRESETS[props.preset] : {}

    return {
      ...DEFAULT_CONFIG,
      ...presetConfig,
      ...props,
      style: {
        ...DEFAULT_CONFIG.style,
        ...presetConfig.style,
        ...props.style,
      },
    }
  }, [props])

  const responsiveHeight = useResponsiveDimension(
    config.responsive,
    config,
    "height"
  )
  const responsiveWidth = useResponsiveDimension(
    config.responsive,
    config,
    "width"
  )
  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === "scroll"
  )

  const blurDivs = useMemo(() => {
    const divs = []
    const increment = 100 / config.divCount
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength
    const curveFunc = CURVE_FUNCTIONS[config.curve] ?? CURVE_FUNCTIONS.linear

    for (let index = 1; index <= config.divCount; index++) {
      let progress = index / config.divCount
      progress = curveFunc(progress)

      const blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * config.divCount + 1) * currentStrength

      const p1 = Math.round((increment * index - increment) * 10) / 10
      const p2 = Math.round(increment * index * 10) / 10
      const p3 = Math.round((increment * index + increment) * 10) / 10
      const p4 = Math.round((increment * index + increment * 2) * 10) / 10

      let gradient = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`

      const direction = getGradientDirection(config.position)
      const divStyle: CSSProperties = {
        position: "absolute",
        inset: "0",
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      }

      divs.push(<div key={index} style={divStyle} />)
    }

    return divs
  }, [config, isHovered])

  const containerStyle = useMemo<CSSProperties>(() => {
    const isVertical = config.position === "top" || config.position === "bottom"
    const isHorizontal =
      config.position === "left" || config.position === "right"
    const isPageTarget = config.target === "page"
    const baseStyle: CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated
        ? `opacity ${config.duration} ${config.easing}`
        : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    }

    if (isVertical) {
      baseStyle.height = responsiveHeight
      baseStyle.width = responsiveWidth ?? "100%"
      baseStyle[config.position] = 0
      baseStyle.left = 0
      baseStyle.right = 0
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth ?? responsiveHeight
      baseStyle.height = "100%"
      baseStyle[config.position] = 0
      baseStyle.top = 0
      baseStyle.bottom = 0
    }

    return baseStyle
  }, [config, responsiveHeight, responsiveWidth, isVisible])

  useEffect(() => {
    if (
      isVisible &&
      config.animated === "scroll" &&
      config.onAnimationComplete
    ) {
      const timeout = setTimeout(
        () => config.onAnimationComplete?.(),
        parseFloat(config.duration) * 1000
      )

      return () => clearTimeout(timeout)
    }
  }, [isVisible, config])

  return (
    <div
      ref={containerRef}
      className={cn(
        styles.gradualBlur,
        config.target === "page"
          ? styles.gradualBlurPage
          : styles.gradualBlurParent,
        config.className
      )}
      style={containerStyle}
      onMouseEnter={
        config.hoverIntensity ? () => setIsHovered(true) : undefined
      }
      onMouseLeave={
        config.hoverIntensity ? () => setIsHovered(false) : undefined
      }
    >
      <div className={styles.gradualBlurInner}>{blurDivs}</div>
    </div>
  )
}

const GradualBlurMemo = memo(GradualBlur)
GradualBlurMemo.displayName = "GradualBlur"

export default GradualBlurMemo
