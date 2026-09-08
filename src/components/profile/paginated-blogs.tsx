"use client"

import { useState } from "react"
import type { Blog } from "@/data/blogs"
import { BlogList } from "./blog-list"

const BLOGS_PER_PAGE = 6

export const PaginatedBlogs = ({ blogs }: { blogs: Blog[] }) => {
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE)
  const visibleBlogs = blogs.slice(0, visibleCount)
  const canLoadMore = visibleCount < blogs.length

  return (
    <>
      <BlogList blogs={visibleBlogs} />
      {canLoadMore && (
        <div className="full-bleed-border-t border-edge flex h-10 w-full items-center justify-center border-t-[1px] sm:h-12">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + BLOGS_PER_PAGE)}
            className="text-muted-foreground hover:text-primary cursor-pointer text-xs font-medium underline underline-offset-4 transition-colors sm:text-sm"
          >
            Load more blogs
          </button>
        </div>
      )}
    </>
  )
}
