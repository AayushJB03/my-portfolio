"use client"

import { useState } from "react"
import type { Achievement } from "@/data/content"
import { HeaderTitle } from "./header-title"
import { Badge } from "../ui/badge"
import { Separator } from "./separator"

export const Achievements = ({
  initialAchievements,
}: {
  initialAchievements: Achievement[]
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const visibleAchievements = isExpanded
    ? initialAchievements
    : initialAchievements.slice(0, 3)

  return (
    <>
      <section className="w-full">
        <HeaderTitle title="Honors & Achievements" />
        <div className="grid w-full">
          {visibleAchievements.map((item, index) => (
            <div
              key={item.id ?? `${item.title}-${index}`}
              className="border-edge hover:bg-accent/40 flex w-full flex-col justify-center border-b-[1px] px-2 py-2.5 transition-colors last:border-b-0"
            >
              <h3 className="text-primary/95 mb-1 text-sm leading-snug font-medium sm:text-base">
                {item.title}
              </h3>
              <div className="flex flex-row items-center gap-2">
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 py-0 text-[10px] sm:text-xs"
                >
                  {item.year}
                </Badge>
                {item.issuer && (
                  <span className="text-muted-foreground text-[10px] sm:text-xs">
                    {item.issuer}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {initialAchievements.length > 3 && (
        <>
          <Separator />
          <div className="flex h-10 w-full items-center justify-center sm:h-12">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-primary cursor-pointer text-xs font-medium underline underline-offset-4 transition-colors sm:text-sm"
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          </div>
        </>
      )}
    </>
  )
}
