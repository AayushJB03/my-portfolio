import { HeaderTitle } from "@/components/profile/header-title"
import { ProjectGrid } from "@/components/profile/projects"
import { Separator } from "@/components/profile/separator"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { getProjects } from "@/data/projects"
import { generateMetaData } from "@/lib/utils"

export const metadata = generateMetaData(
  "Projects",
  "Explore Aayush Bhadbhade's latest AI, LLM, and AI agent projects.",
  { path: "/projects" }
)

const ProjectsPage = async () => {
  const projects = await getProjects()

  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />
      <section className="w-full">
        <HeaderTitle title="Projects" />
        <ProjectGrid projects={projects} />
      </section>
      <Separator />
    </ContainerWrapper>
  )
}

export default ProjectsPage
