"use client"

import type { TechStack as TechStackItem } from "@/data/tech-stack"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useRef, useState } from "react"
import { HeaderTitle } from "./header-title"

type TechStackRow = {
  id: string
  name: string
  slug: string
  icon_url: string | null
  sort_order: number
}

const mapTechStackRow = (item: TechStackRow): TechStackItem => ({
  id: item.id,
  key: item.slug,
  title: item.name,
  icon: item.icon_url || `https://cdn.simpleicons.org/${encodeURIComponent(item.name)}`,
  sort_order: item.sort_order,
})

export const TechStack: React.FC<{ initialTechStack: TechStackItem[] }> = ({
  initialTechStack,
}) => {
  const [techStack, setTechStack] = useState<TechStackItem[]>(initialTechStack)

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>
    try {
      supabase = createClient()
    } catch (err) {
      console.error("Failed to connect to Supabase for tech stack updates:", err)
      return
    }

    const channel = supabase
      .channel("tech-stack-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tech_stack_items" },
        async () => {
          const { data } = await supabase
            .from("tech_stack_items")
            .select("id, name, slug, icon_url, sort_order")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true })

          if (data) {
            setTechStack(data.map(mapTechStackRow))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const specsRef = useRef<{ period: number; phase: number }[]>([])
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    specsRef.current = Array.from({ length: techStack.length }, () => ({
      period: 2.0 + Math.random() * 1.4,
      phase: Math.random(),
    }))

    const fadeIn = 0.07
    const hold = 0.05
    const fadeOut = 0.07
    const duty = fadeIn + hold + fadeOut

    const tick = (now: number) => {
      const t = now / 1000
      specsRef.current.forEach((spec, index) => {
        const el = overlayRefs.current[index]
        if (!el) {
          return
        }

        const x = (t / spec.period + spec.phase) % 1
        let opacity = 0
        if (x < fadeIn) {
          opacity = x / fadeIn
        } else if (x < fadeIn + hold) {
          opacity = 1
        } else if (x < duty) {
          opacity = 1 - (x - fadeIn - hold) / fadeOut
        }
        el.style.opacity = String(opacity)
      })
      requestAnimationFrame(tick)
    }

    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [techStack.length])

  return (
    <>
      <section className="w-full">
        <HeaderTitle title="Skills" />
        <div className="flex flex-wrap border-l-2 border-t-2 border-dotted border-black/35 dark:border-white/20">
          {techStack.map((item, index) => (
            <div
              key={item.key}
              style={{ flex: "1 1 auto" }}
              className="relative flex min-w-0 items-center justify-center gap-2 border-r-2 border-b-2 border-dotted border-black/35 bg-transparent px-3 py-2 dark:border-white/20"
            >
              <img
                src={item.icon}
                alt={item.title}
                width={16}
                height={16}
                className="h-4 w-4 object-contain dark:brightness-0 dark:invert"
              />
              <span className="truncate text-sm text-neutral-800 dark:text-neutral-300">{item.title}</span>
              <div
                ref={(el) => {
                  overlayRefs.current[index] = el
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border-2 border-dotted border-black opacity-0 dark:border-white"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
