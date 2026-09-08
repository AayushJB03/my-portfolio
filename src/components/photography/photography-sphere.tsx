"use client"

import { useEffect, useMemo, useRef } from "react"
import { Camera, MousePointer2 } from "lucide-react"
import type { PhotographyPhoto } from "@/data/photography"
import { ImageSphere } from "@/lib/image-sphere/engine"

export function PhotographySphere({ photos }: { photos: PhotographyPhoto[] }) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const urls = useMemo(
    () => photos.map((photo) => photo.image_url).filter(Boolean),
    [photos]
  )

  useEffect(() => {
    const host = hostRef.current
    if (!host || urls.length === 0) return

    const compact = host.clientWidth < 640
    const sphere = new ImageSphere(host, urls, {
      distance: compact ? 460 : 500,
      focusFill: compact ? 0.58 : 0.62,
      fov: 25,
      planeSize: compact ? 30 : 36,
      radius: compact ? 118 : 140,
    })
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!prefersReducedMotion) {
      sphere.start()
    } else {
      sphere.renderStill()
    }

    return () => sphere.destroy()
  }, [urls])

  if (photos.length === 0) {
    return (
      <div className="full-bleed-border-b grid min-h-[24rem] place-items-center border-b bg-background px-4 py-12 text-center text-foreground sm:min-h-[30rem]">
        <div className="grid max-w-md gap-3">
          <div className="border-edge bg-secondary dark:bg-secondary mx-auto flex size-12 items-center justify-center rounded-md border">
            <Camera className="size-5" />
          </div>
          <h3 className="font-pixelify text-primary text-2xl font-bold">
            Photography is warming up
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Upload photos from the admin board and they will orbit here in a
            draggable 3D sphere.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="full-bleed-border-b relative min-h-[24rem] overflow-hidden border-b bg-background text-foreground sm:min-h-[30rem]">
      <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-3 sm:bottom-4 sm:px-4">
        <div className="border-edge bg-background/75 text-muted-foreground inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium whitespace-nowrap backdrop-blur">
          <MousePointer2 className="size-3.5 shrink-0" />
          Drag to spin. Click a photo to focus.
        </div>
      </div>
      <div
        ref={hostRef}
        className="absolute inset-0"
        aria-label="Interactive 3D photography sphere"
        role="img"
      />
    </section>
  )
}
