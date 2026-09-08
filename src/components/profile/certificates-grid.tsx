"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SkeletonBlock } from "@/components/ui/skeleton"
import type { Certificate } from "@/data/certificates"
import Image from "next/image"

const CertificateCardSkeleton = () => {
  return (
    <div className="border-edge flex min-h-[170px] flex-col items-center justify-between gap-3 rounded-md border p-4 sm:min-h-[190px]">
      <SkeletonBlock className="size-12 rounded border sm:size-14" />
      <div className="flex w-full flex-grow flex-col items-center justify-center gap-2">
        <SkeletonBlock className="h-3 w-16 rounded-sm" />
        <SkeletonBlock className="h-4 w-10/12 rounded-sm" />
        <SkeletonBlock className="h-4 w-8/12 rounded-sm" />
      </div>
      <SkeletonBlock className="h-3 w-24 rounded-sm" />
    </div>
  )
}

export function CertificatesGrid({
  initialCertificates,
}: {
  initialCertificates: Certificate[]
}) {
  const [certificates, setCertificates] =
    useState<Certificate[]>(initialCertificates)
  const [loading, setLoading] = useState(false)
  const [isAllLoaded, setIsAllLoaded] = useState(initialCertificates.length < 6)

  const handleLoadAll = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/certificates")
      if (!res.ok) {
        throw new Error("Failed to fetch all certificates")
      }
      const data = (await res.json()) as Certificate[]
      setCertificates(data)
      setIsAllLoaded(true)
    } catch (error) {
      console.error("Error fetching all certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-2.5 p-3 md:grid-cols-3 lg:grid-cols-4">
          {certificates.map((cert, index) => {
            const isNew = index >= initialCertificates.length
            return (
              <motion.div
                key={cert.id}
                initial={isNew ? { opacity: 0, y: 15 } : false}
                animate={isNew ? { opacity: 1, y: 0 } : false}
                transition={{
                  duration: 0.25,
                  delay: isNew
                    ? (index - initialCertificates.length) * 0.05
                    : 0,
                }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border-edge hover:bg-accent/40 relative flex min-h-[170px] flex-col items-center justify-between gap-3 rounded-md border p-4 text-center transition-all duration-200 sm:min-h-[190px]"
                    >
                      {/* Cover Logo Container */}
                      <div className="border-edge relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted/40 p-2 transition-transform duration-200 group-hover:scale-105 sm:size-14">
                        {cert.orglogo ? (
                          <Image
                            src={cert.orglogo}
                            alt={`${cert.orgname} logo`}
                            width={56}
                            height={56}
                            className="size-full object-contain brightness-95 filter group-hover:brightness-100"
                            loading="lazy"
                            unoptimized
                          />
                        ) : (
                          <span className="font-pixelify text-muted-foreground text-[10px] uppercase">
                            {cert.orgname.substring(0, 3)}
                          </span>
                        )}
                      </div>

                      {/* Track info and Title */}
                      <div className="flex min-w-0 flex-grow flex-col items-center justify-center gap-1">
                        <span className="text-muted-foreground line-clamp-1 font-mono text-[9px] tracking-wider uppercase">
                          {cert.orgname}
                        </span>
                        <h3 className="font-pixelify text-primary line-clamp-2 text-xs leading-tight font-bold sm:text-sm">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Issued Date */}
                      <div className="text-muted-foreground/75 mt-auto font-mono text-[9px] sm:text-[10px]">
                        Issued: {cert.issueddate}
                      </div>

                      {/* Hover underline indicator */}
                      <span className="bg-primary/60 absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-200 group-hover:w-3/4" />
                    </a>
                  </TooltipTrigger>

                  <TooltipContent className="border-edge bg-popover text-popover-foreground font-pixelify rounded-md border px-2.5 py-1.5 text-[10px] shadow-md">
                    <div className="flex items-center gap-1">
                      <span>Verify Certificate</span>
                      <svg
                        viewBox="0 0 24 24"
                        className="size-3 fill-current opacity-70"
                        aria-hidden="true"
                      >
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                      </svg>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )
          })}
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <CertificateCardSkeleton key={`loading-${index}`} />
            ))}
        </div>

        {!isAllLoaded && (
          <div className="full-bleed-border-t mt-6 flex h-14 items-center justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={handleLoadAll}
              className="font-pixelify text-muted-foreground hover:text-primary border-edge cursor-pointer rounded-md border bg-muted/40 px-8 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Loading..." : "All"}
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
