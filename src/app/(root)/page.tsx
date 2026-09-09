import { getProjects } from "@/data/projects"
import { getBlogs } from "@/data/blogs"
import { getExperience } from "@/data/experience"
import { getAchievements } from "@/data/content"
import { getTechStack } from "@/data/tech-stack"
import { Suspense } from "react"
import { About } from "@/components/profile/about"
import { Achievements } from "@/components/profile/achievements"
import { AgentTrace } from "@/components/profile/agent-trace"
import { DesignTokens } from "@/components/profile/design-tokens"
import { Blogs, BlogsCta } from "@/components/profile/blogs"
import { CurrentlyListening } from "@/components/profile/currently-listening"
import { ContactCta } from "@/components/profile/contact-cta"
import { Experience } from "@/components/profile/experience"
import { GitHubActivity } from "@/components/profile/github-activity"
import { PageEnding } from "@/components/profile/page-ending"
import { ProfileHeader } from "@/components/profile/profile-header"
import { Projects, ProjectsCta } from "@/components/profile/projects"
import { Separator } from "@/components/profile/separator"
import { TechStack } from "@/components/profile/tech-stack"
import { TotalViews } from "@/components/profile/total-views"
import { ContainerWrapper } from "@/components/site/container"
import {
  AboutSkeleton,
  AchievementsSkeleton,
  BlogsSectionSkeleton,
  ExperienceSkeleton,
  GitHubActivitySkeleton,
  ProjectsSectionSkeleton,
  ProfileHeaderSkeleton,
  TechStackSkeleton,
  TotalViewsSkeleton,
} from "@/components/site/skeletons"

async function TechStackSection() {
  const techStack = await getTechStack()

  return <TechStack initialTechStack={techStack} />
}

async function ProjectsSection() {
  const projects = await getProjects(4)

  return <Projects initialProjects={projects} />
}

async function BlogsSection() {
  const blogs = await getBlogs(2)

  return <Blogs initialBlogs={blogs} />
}

async function AchievementsSection() {
  const achievements = await getAchievements()

  return <Achievements initialAchievements={achievements} />
}

async function ExperienceSection() {
  const experience = await getExperience()

  return <Experience initialExperience={experience} />
}

export default function Page() {
  return (
    <ContainerWrapper className="">
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader />
      </Suspense>
      <Separator />

      <Suspense fallback={<AboutSkeleton />}>
        <About />
      </Suspense>
      <Separator />

      <AgentTrace />
      <Separator />

      <DesignTokens />
      <Separator />

      <Suspense fallback={<GitHubActivitySkeleton />}>
        <GitHubActivity />
      </Suspense>
      <Separator />

      <Suspense fallback={<ProjectsSectionSkeleton compact />}>
        <ProjectsSection />
      </Suspense>
      <Separator />

      <ProjectsCta />
      <Separator />

      <Suspense fallback={<TechStackSkeleton />}>
        <TechStackSection />
      </Suspense>
      <Separator />

      <Suspense fallback={<BlogsSectionSkeleton count={2} />}>
        <BlogsSection />
      </Suspense>
      <Separator />

      <BlogsCta />
      <Separator />

      <Suspense fallback={<ExperienceSkeleton />}>
        <ExperienceSection />
      </Suspense>
      <Separator />

      <Suspense fallback={<AchievementsSkeleton />}>
        <AchievementsSection />
      </Suspense>
      <Separator />

      <CurrentlyListening />
      <Separator />

      <ContactCta />
      <Separator />

      <Suspense fallback={<TotalViewsSkeleton />}>
        <TotalViews />
      </Suspense>
      <Separator />

      <PageEnding />
      <Separator />
    </ContainerWrapper>
  )
}
