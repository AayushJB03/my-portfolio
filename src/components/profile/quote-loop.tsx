"use client"

import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { WordLoop } from "./word-loop"

const QUOTES = [
  {
    text: '"I was not born with natural talent... but I work hard and never give up."',
    author: "Rock Lee",
  },
  {
    text: '"Fall seven times and stand up eight."',
    author: "Japanese Proverb",
  },
  {
    text: '"Stay hungry. Stay foolish."',
    author: "Steve Jobs",
  },
  {
    text: '"Hard work beats talent when talent does not work hard."',
    author: "Tim Notke",
  },
]

export const QuoteLoop = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <blockquote className="font-pixelify min-h-[4.4rem] text-base leading-[1.45] font-medium text-balance text-zinc-800 sm:min-h-[4.9rem] sm:text-xl md:min-h-[5.3rem] md:text-2xl dark:text-zinc-100">
        <WordLoop
          texts={QUOTES.map((quote) => quote.text)}
          interval={4.5}
          wordStagger={0.035}
          onIndexChange={setActiveIndex}
          className="justify-center"
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        />
      </blockquote>

      <div className="mt-5 flex items-center gap-3">
        <span className="h-px w-10 bg-zinc-300 dark:bg-zinc-700" aria-hidden />
        <cite className="min-w-28 text-center font-sans text-xs font-semibold tracking-wide text-zinc-500 uppercase not-italic dark:text-zinc-400">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={QUOTES[activeIndex].author}
              initial={{ y: 6, opacity: 0, filter: "blur(3px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -6, opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="inline-block"
            >
              {QUOTES[activeIndex].author}
            </motion.span>
          </AnimatePresence>
        </cite>
        <span className="h-px w-10 bg-zinc-300 dark:bg-zinc-700" aria-hidden />
      </div>
    </>
  )
}
