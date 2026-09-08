import type { Blog } from "@/data/blogs"
import Link from "next/link"
import { BlogList } from "./blog-list"
import { HeaderTitle } from "./header-title"

export const Blogs = async ({ initialBlogs }: { initialBlogs: Blog[] }) => {
  return (
    <>
      <section className="w-full">
        <HeaderTitle title="Blogs" />
        <BlogList blogs={initialBlogs} />
      </section>
    </>
  )
}

export const BlogsCta = () => {
  return (
    <div className="flex h-10 w-full items-center justify-center sm:h-12">
      <Link
        href="/blogs"
        className="text-muted-foreground hover:text-primary text-xs font-medium underline underline-offset-4 transition-colors sm:text-sm"
      >
        See all blogs
      </Link>
    </div>
  )
}
