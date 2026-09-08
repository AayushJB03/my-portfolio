"use client"

import { useEffect, useState } from "react"

import type { Experience as ExperienceType } from "@/data/experience"
import { ExperienceItem } from "./experience-item"

const getExperienceKey = (item: ExperienceType) =>
  item.id ?? `${item.company}-${item.title}`

export function ExperienceList({
  initialExperience,
}: {
  initialExperience: ExperienceType[]
}) {
  const [activeExperienceKey, setActiveExperienceKey] = useState<string | null>(
    null
  )
  const [hasHoverPointer, setHasHoverPointer] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const updateHoverPointer = () => {
      setHasHoverPointer(mediaQuery.matches)

      if (!mediaQuery.matches) {
        setActiveExperienceKey(null)
      }
    }

    updateHoverPointer()
    mediaQuery.addEventListener("change", updateHoverPointer)

    return () => mediaQuery.removeEventListener("change", updateHoverPointer)
  }, [])

  return (
    <div
      className="grid w-full"
      onMouseLeave={() => {
        if (hasHoverPointer) {
          setActiveExperienceKey(null)
        }
      }}
    >
      {initialExperience.map((item) => {
        const experienceKey = getExperienceKey(item)

        return (
          <ExperienceItem
            key={experienceKey}
            experience={item}
            {...(hasHoverPointer
              ? {
                  isOpen: activeExperienceKey === experienceKey,
                  onHover: () => setActiveExperienceKey(experienceKey),
                  onOpenChange: (open: boolean) =>
                    setActiveExperienceKey(open ? experienceKey : null),
                }
              : {})}
          />
        )
      })}
    </div>
  )
}
