import { PaginatedBlogs } from "@/components/profile/paginated-blogs"
import { Separator } from "@/components/profile/separator"
import { HeaderTitle } from "@/components/profile/header-title"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { getBlogs } from "@/data/blogs"
import { generateMetaData } from "@/lib/utils"

export const metadata = generateMetaData(
  "Blogs",
  "Read Aayush Bhadbhade's latest Dev.to writing on AI, LLMs, AI agents, and RAG.",
  { path: "/blogs" }
)

const BlogsPage = async () => {
  const blogs = await getBlogs()

  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />
      <section className="w-full">
        <HeaderTitle title="Blogs" />
        <PaginatedBlogs blogs={blogs} />
      </section>
      <Separator />
    </ContainerWrapper>
  )
}

export default BlogsPage
