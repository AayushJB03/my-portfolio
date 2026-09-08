"use client"

import GradualBlur from "@/components/ui/gradual-blur"

export function SiteGradualBlur() {
  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="clamp(4rem, 9vh, 6.25rem)"
      mobileHeight="4.25rem"
      tabletHeight="5.25rem"
      strength={1.65}
      divCount={7}
      curve="bezier"
      exponential
      opacity={0.72}
      animated
      duration="0.35s"
      easing="ease-out"
      responsive
      zIndex={-70}
    />
  )
}
