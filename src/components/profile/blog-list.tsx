"use client"

import { ArrowRight, CalendarIcon } from "lucide-react"
import NextImage from "next/image"
import Link from "next/link"
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { Blog } from "@/data/blogs"
import { formatMonthYear } from "@/lib/utils"
import { SkeletonBlock } from "../ui/skeleton"
import { SkillBadgeList } from "./experience-item"

type PreviewBlog = {
  id: number
  coverImage: string
}

export const BlogList = ({ blogs }: { blogs: Blog[] }) => {
  const [activeBlog, setActiveBlog] = useState<PreviewBlog | null>(null)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const previewRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const currentPositionRef = useRef({ x: 0, y: 0 })

  const imageUrls = useMemo(
    () => blogs.map((blog) => blog.coverImage).filter(Boolean) as string[],
    [blogs]
  )

  useEffect(() => {
    imageUrls.forEach((imageUrl) => {
      if (loadedImages.has(imageUrl)) {
        return
      }

      const image = new window.Image()
      image.decoding = "async"
      image.src = imageUrl
      image.onload = () => {
        setLoadedImages((current) => {
          if (current.has(imageUrl)) {
            return current
          }

          const next = new Set(current)
          next.add(imageUrl)
          return next
        })
      }
    })
  }, [imageUrls, loadedImages])

  const updateTargetPosition = useCallback((x: number, y: number) => {
    const preview = previewRef.current
    if (!preview) {
      return
    }

    const offset = 22
    const width = preview.offsetWidth
    const height = preview.offsetHeight
    const maxX = window.innerWidth - width - 12
    const maxY = window.innerHeight - height - 12
    const nextX = Math.min(x + offset, Math.max(12, maxX))
    const nextY = Math.min(y + offset, Math.max(12, maxY))

    targetPositionRef.current = { x: nextX, y: nextY }
  }, [])

  const animatePreview = useCallback(() => {
    const preview = previewRef.current
    if (!preview) {
      frameRef.current = null
      return
    }

    const current = currentPositionRef.current
    const target = targetPositionRef.current
    const easing = 0.28
    const nextX = current.x + (target.x - current.x) * easing
    const nextY = current.y + (target.y - current.y) * easing

    currentPositionRef.current = { x: nextX, y: nextY }
    preview.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`

    if (Math.abs(target.x - nextX) < 0.35 && Math.abs(target.y - nextY) < 0.35) {
      currentPositionRef.current = target
      preview.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      frameRef.current = null
      return
    }

    frameRef.current = window.requestAnimationFrame(animatePreview)
  }, [])

  const startPreviewAnimation = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(animatePreview)
    }
  }, [animatePreview])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      updateTargetPosition(event.clientX, event.clientY)
      startPreviewAnimation()
    },
    [startPreviewAnimation, updateTargetPosition]
  )

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  if (blogs.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-sm">
          Blogs will appear here once they are available.
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setActiveBlog(null)
        setIsPreviewVisible(false)
      }}
    >
      {blogs.map((blog) => (
        <SingleBlog
          key={blog.id}
          blog={blog}
          onPreviewStart={(nextBlog, event) => {
            updateTargetPosition(event.clientX, event.clientY)
            if (!isPreviewVisible) {
              currentPositionRef.current = targetPositionRef.current
            }
            setActiveBlog(nextBlog)
            setIsPreviewVisible(Boolean(nextBlog))
            startPreviewAnimation()
          }}
          onPreviewEnd={() => {
            setIsPreviewVisible(false)
          }}
        />
      ))}

      <BlogCoverCursorPreview
        ref={previewRef}
        blog={activeBlog}
        isLoaded={activeBlog ? loadedImages.has(activeBlog.coverImage) : false}
        isVisible={isPreviewVisible}
      />
    </div>
  )
}

const SingleBlog: React.FC<{
  blog: Blog
  onPreviewStart: (blog: PreviewBlog | null, event: React.PointerEvent) => void
  onPreviewEnd: () => void
}> = ({ blog, onPreviewStart, onPreviewEnd }) => {
  const previewBlog = blog.coverImage
    ? {
        id: blog.id,
        coverImage: blog.coverImage,
      }
    : null

  return (
    <Link
      href={blog.url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          onPreviewStart(previewBlog, event)
        }
      }}
      onPointerLeave={onPreviewEnd}
      onFocus={() => undefined}
      onBlur={onPreviewEnd}
      className="border-edge group w-full border-b-[1px] p-1 last:border-b-0 hover:cursor-pointer"
    >
      <div className="hover:bg-accent flex w-full flex-col gap-y-1 rounded-[10px] p-2">
        <div>
          <h3 className="text-primary/95 mb-1 text-sm leading-snug font-medium text-balance sm:text-base">
            {blog.title}
          </h3>
        </div>
        <div className="flex flex-row items-center justify-between pb-1">
          <div className="flex flex-row items-center">
            <CalendarIcon className="text-muted-foreground size-3 sm:size-4" />
            <span className="ml-2 text-[14px]">
              {formatMonthYear(blog.date)}
            </span>
          </div>
          <div>
            <ArrowRight className="text-muted-foreground size-3 -rotate-45 transition-all duration-300 group-hover:rotate-0 sm:size-4" />
          </div>
        </div>
        <div>
          <SkillBadgeList skills={blog.tags} />
        </div>
      </div>
    </Link>
  )
}

const BlogCoverCursorPreview = forwardRef<
  HTMLDivElement,
  {
  blog: PreviewBlog | null
  isLoaded: boolean
  isVisible: boolean
  }
>(({ blog, isLoaded, isVisible }, ref) => {
  if (!blog) {
    return null
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={[
        "pointer-events-none fixed top-0 left-0 z-50 hidden w-[220px] overflow-hidden rounded-md border border-white/15 bg-background/90 shadow-2xl shadow-black/25 backdrop-blur md:block",
        "transition-[opacity,scale] duration-150 ease-out will-change-transform",
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {!isLoaded && (
          <div className="absolute inset-0">
            <SkeletonBlock className="h-full w-full rounded-none" />
          </div>
        )}
        <NextImage
          key={`${blog.id}-${blog.coverImage}`}
          src={blog.coverImage}
          alt=""
          fill
          sizes="220px"
          className={[
            "object-cover transition-opacity duration-150",
            isLoaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      </div>
    </div>
  )
})

BlogCoverCursorPreview.displayName = "BlogCoverCursorPreview"
