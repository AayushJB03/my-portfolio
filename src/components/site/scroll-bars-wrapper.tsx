"use client"

import dynamic from "next/dynamic"

const AnimatingScrollBars = dynamic(
  () => import("./scroll-bars").then((mod) => mod.AnimatingScrollBars),
  { ssr: false }
)

export function AnimatingScrollBarsWrapper() {
  return <AnimatingScrollBars />
}
