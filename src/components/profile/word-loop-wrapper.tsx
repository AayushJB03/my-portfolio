"use client"

import dynamic from "next/dynamic"

const WordLoop = dynamic(
  () => import("./word-loop").then((mod) => mod.WordLoop),
  { ssr: false }
)

export { WordLoop }
