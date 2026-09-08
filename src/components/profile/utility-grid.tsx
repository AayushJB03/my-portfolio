"use client"

import React from "react"
import type { UtilityCategory, UtilityItem } from "@/data/content"
import { UtilityIcon } from "./utility-icons"
import { Separator } from "./separator"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const UtilityCard = ({ item }: { item: UtilityItem }) => {
  const isLink = !!item.url
  const Component = isLink ? "a" : "div"

  const commonProps = {
    className: cn(
      "group relative flex items-start gap-3.5 rounded-lg border border-edge bg-card/20 p-3.5 transition-all duration-200",
      isLink ? "hover:bg-accent/40 hover:border-muted-foreground/30 hover:shadow-sm" : ""
    ),
    ...(isLink
      ? {
          href: item.url,
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {}),
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Component {...(commonProps as any)}>
      {/* Icon Wrapper */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-edge bg-accent/20 transition-colors duration-200 group-hover:bg-accent/30">
        <UtilityIcon
          name={item.key}
          size={22}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 pr-4">
        <h4 className="font-pixelify text-sm font-semibold text-primary leading-tight">
          {item.name}
        </h4>
        <p className="text-[11px] leading-relaxed text-muted-foreground/90">
          {item.description}
        </p>
      </div>

      {/* External Link Indicator */}
      {isLink && (
        <span className="absolute top-2.5 right-2.5 text-muted-foreground/30 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight size={13} />
        </span>
      )}

      {/* Bottom accent bar */}
      <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-primary/40 transition-all duration-200 group-hover:w-[85%]" />
    </Component>
  )
}

export const UtilityGrid: React.FC<{
  initialCategories: UtilityCategory[]
}> = ({ initialCategories }) => {
  return (
    <div className="w-full">
      {initialCategories.map((category, index) => (
        <React.Fragment key={category.id}>
          <article className="w-full">
            {/* Category Header */}
            <div className="border-edge full-bleed-border-b flex flex-col justify-center bg-accent/5 px-4 py-3 border-b-[1px]">
              <h3 className="font-pixelify text-[15px] font-bold text-primary tracking-wide">
                {category.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Grid of items */}
            <div className="grid w-full grid-cols-1 gap-2.5 p-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <UtilityCard key={item.key} item={item} />
              ))}
            </div>
          </article>

          {/* Separator between categories */}
          {index < initialCategories.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  )
}
