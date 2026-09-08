import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"

import { ArrowRight, GithubIcon, LinkIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CardDescription } from "../ui/card"
import { HeaderTitle } from "./header-title"

export const Projects = async ({
  initialProjects,
}: {
  initialProjects: Project[]
}) => {
  return (
    <>
      <section className="w-full">
        <HeaderTitle title="Projects" />
        <ProjectGrid projects={initialProjects} compact />
      </section>
    </>
  )
}

export const ProjectsCta = () => {
  return (
    <div className="flex h-10 w-full items-center justify-center sm:h-12">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-primary text-xs font-medium underline underline-offset-4 transition-colors sm:text-sm"
      >
        See all projects
      </Link>
    </div>
  )
}

export const ProjectGrid = ({
  projects,
  compact = false,
}: {
  projects: Project[]
  compact?: boolean
}) => {
  if (projects.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-sm">
          Projects will appear here once they are available.
        </p>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2">
      {projects.map((item, index) => {
        return (
          <SingleProject
            key={item.id}
            project={item}
            className={cn(
              "border-edge border-b-[1px] md:[&:nth-last-child(-n+2)]:border-b-0",
              compact && index === 3 ? "hidden border-b-0 sm:block" : undefined
            )}
          />
        )
      })}
    </div>
  )
}

export const SingleProject: React.FC<{
  project: Project
  className?: string
}> = ({ project, className }) => {
  return (
    <>
      <div className={cn("relative z-10 p-3", className)}>
        {/* Link */}
        <div className="group flex w-full cursor-pointer flex-col gap-2">
          <Link
            href={project.href}
            className="border-edge rounded-[10px] border p-[4px]"
          >
            <div
              className={cn(
                "bg-muted border-edge relative h-[200px] w-full overflow-hidden rounded-[6px] border select-none sm:h-[170px] md:h-[200px]",
                "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] transition-all duration-300 [--pattern-foreground:var(--color-edge)]/0 group-hover:[--pattern-foreground:var(--color-border)]/90"
              )}
            >
              <h1 className="text-muted-foreground absolute top-2 left-2 text-xs font-medium transition-all duration-300 group-hover:left-1/2 group-hover:-translate-x-1/2">
                {project.title}
              </h1>
              <div className="bg-background absolute bottom-0 left-1/2 h-[80%] w-[80%] -translate-x-1/2 rounded-t-[6px] p-[2px] pb-0 transition-all duration-300 group-hover:h-[75%]">
                <div className="h-full w-full overflow-hidden rounded-t-[4px]">
                  <div className="hidden dark:block">
                    <Image
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                      width="1000"
                      height="1000"
                      decoding="async"
                      data-nimg="1"
                      className="h-full w-full object-cover"
                      sizes="(min-width: 768px) 25rem, calc(100vw - 3rem)"
                      src={project.darkModeImage}
                    />
                  </div>
                  <div className="block dark:hidden">
                    <Image
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                      width="1000"
                      height="1000"
                      decoding="async"
                      data-nimg="1"
                      className="h-full w-full object-cover"
                      sizes="(min-width: 768px) 25rem, calc(100vw - 3rem)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <div className="flex flex-col gap-1 px-2">
            <Link href={project.href}>
              <div className="flex items-center justify-between">
                <h3 className="text-primary/95 mb-1 text-sm leading-snug font-medium text-balance sm:text-base">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1 select-none">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping bg-green-500 group-hover:hidden"></div>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="relative z-10 text-green-500"
                      height="14"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
                    </svg>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Live
                  </p>
                </div>
              </div>
              <CardDescription className="text-muted-foreground min-h-[40px] text-sm">
                {project.description}
              </CardDescription>
            </Link>

            <div className="flex items-center justify-between gap-1 py-1 select-none">
              <div className="flex gap-x-2">
                <Tooltip>
                  <TooltipTrigger>
                    <a
                      className="text-muted-foreground hover:text-foreground flex size-6 shrink-0 items-center justify-center"
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener"
                    >
                      <LinkIcon className="pointer-events-none size-4" />
                      <span className="sr-only">Open Project Link</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Open Project Link</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <a
                      className="text-muted-foreground hover:text-foreground flex size-6 shrink-0 items-center justify-center"
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener"
                    >
                      <GithubIcon className="ring-muted-foreground pointer-events-none size-4" />
                      <span className="sr-only">Open GitHub Link</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Open GitHub Link</TooltipContent>
                </Tooltip>
              </div>
              <Link href={project.href} className="flex">
                <p className="text-foreground text-xs transition-colors duration-300">
                  View Project
                </p>
                <ArrowRight className="text-foreground ml-1 size-3 -rotate-45 transition-all duration-300 group-hover:rotate-0 sm:size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
