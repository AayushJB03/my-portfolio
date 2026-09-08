import { Separator } from "@/components/profile/separator"
import { ContainerWrapper } from "@/components/site/container"
import { SkeletonBlock } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function HeaderTitleSkeleton({ className }: { className?: string }) {
  return (
    <div className="full-bleed-border-b border-edge flex h-10 w-full items-center border-b-[1px] px-2">
      <SkeletonBlock className={cn("h-6 w-36 rounded-sm", className)} />
    </div>
  )
}

export function BackButtonSkeleton() {
  return (
    <div className="flex h-10 items-center px-3 sm:h-12">
      <SkeletonBlock className="h-4 w-20 rounded-sm" />
    </div>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="relative flex min-h-[250px] justify-center sm:justify-between">
      <div className="absolute inset-x-0 top-0 h-[45%] overflow-hidden sm:h-[50%]">
        <SkeletonBlock className="h-full w-full rounded-none" />
      </div>
      <div className="z-10 mt-10 grid w-full grid-cols-1 gap-y-4 px-4 sm:grid-cols-3">
        <div className="col-span-2 space-y-3">
          <div className="flex justify-center sm:justify-start">
            <SkeletonBlock className="size-30 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <SkeletonBlock className="h-8 w-36 rounded-sm" />
            <SkeletonBlock className="h-5 w-[min(22rem,80vw)] rounded-sm" />
          </div>
        </div>
        <div className="mx-2 my-2 flex flex-col items-end justify-end gap-2">
          <div className="grid w-full grid-cols-3 sm:w-52">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock
                key={index}
                className="border-edge h-12 rounded-none border-l first:border-l-0"
              />
            ))}
          </div>
          <SkeletonBlock className="h-4 w-40 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export function AboutSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-20" />
      <div className="space-y-3 px-3 pt-4 pb-3 sm:px-4">
        <SkeletonBlock className="h-4 w-11/12 rounded-sm" />
        <SkeletonBlock className="h-4 w-10/12 rounded-sm" />
        <SkeletonBlock className="h-4 w-8/12 rounded-sm" />
        <div className="flex gap-1.5 pt-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="full-bleed-border-t flex min-h-10 items-center gap-3 px-3 py-2">
        <span className="border-edge h-px flex-1 border-t border-dotted" aria-hidden />
        <SkeletonBlock className="h-4 w-24 rounded-sm" />
        <span className="border-edge h-px flex-1 border-t border-dotted" aria-hidden />
      </div>
    </section>
  )
}

export function TotalViewsSkeleton() {
  return (
    <section className="flex min-h-10 w-full items-center px-3 py-1.5 sm:px-4">
      <SkeletonBlock className="h-4 w-48 rounded-sm" />
      <span className="border-edge ml-3 h-px flex-1 border-t border-dotted sm:ml-4" aria-hidden />
    </section>
  )
}

export function ListeningSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-48" />
      <div className="flex items-center gap-3 p-3">
        <SkeletonBlock className="size-10 shrink-0 rounded" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-44 rounded-sm" />
          <SkeletonBlock className="h-3 w-28 rounded-sm" />
        </div>
      </div>
    </section>
  )
}

export function TechStackSkeleton({ count = 12 }: { count?: number }) {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-32" />
      <div className="my-2 grid w-full grid-cols-4 gap-2 p-2 lg:grid-cols-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-start"
          >
            <SkeletonBlock className="size-8 rounded-sm" />
            <SkeletonBlock className="hidden h-4 w-16 rounded-sm sm:block" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function GitHubActivitySkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-44" />
      <div className="space-y-3 p-2">
        <div className="border-edge bg-background/60 space-y-4 rounded-[10px] border p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-56 rounded-sm" />
              <SkeletonBlock className="h-3 w-40 rounded-sm" />
            </div>
            <SkeletonBlock className="h-3 w-24 rounded-sm" />
          </div>
          <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-[3px] sm:grid-cols-[repeat(52,minmax(0,1fr))]">
            {Array.from({ length: 182 }).map((_, index) => (
              <SkeletonBlock key={index} className="aspect-square rounded-[2px]" />
            ))}
          </div>
          <div className="flex justify-between gap-3">
            <SkeletonBlock className="h-3 w-40 rounded-sm" />
            <SkeletonBlock className="h-3 w-24 rounded-sm" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProjectGridSkeleton({
  count = 4,
  compact = false,
}: {
  count?: number
  compact?: boolean
}) {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "border-edge relative z-10 border-b-[1px] p-3 md:[&:nth-last-child(-n+2)]:border-b-0",
            compact && index === 3 ? "hidden border-b-0 sm:block" : undefined
          )}
        >
          <div className="flex w-full flex-col gap-2">
            <div className="border-edge rounded-[10px] border p-[4px]">
              <SkeletonBlock className="h-[200px] rounded-[6px] sm:h-[170px] md:h-[200px]" />
            </div>
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between gap-4">
                <SkeletonBlock className="h-5 w-3/5 rounded-sm" />
                <SkeletonBlock className="h-4 w-14 rounded-sm" />
              </div>
              <SkeletonBlock className="h-4 w-full rounded-sm" />
              <SkeletonBlock className="h-4 w-10/12 rounded-sm" />
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  <SkeletonBlock className="size-6 rounded-sm" />
                  <SkeletonBlock className="size-6 rounded-sm" />
                </div>
                <SkeletonBlock className="h-4 w-20 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProjectsSectionSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-28" />
      <ProjectGridSkeleton compact={compact} />
    </section>
  )
}

export function BlogListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border-edge w-full border-b-[1px] p-1 last:border-b-0">
          <div className="flex gap-3 rounded-[10px] p-2">
            <SkeletonBlock className="hidden aspect-[16/10] w-28 shrink-0 rounded-md sm:block" />
            <div className="min-w-0 flex-1 space-y-3">
              <SkeletonBlock className="h-5 w-11/12 rounded-sm" />
              <div className="flex items-center justify-between pb-1">
                <SkeletonBlock className="h-4 w-28 rounded-sm" />
                <SkeletonBlock className="size-4 rounded-sm" />
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((__, badgeIndex) => (
                  <SkeletonBlock key={badgeIndex} className="h-5 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BlogsSectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-20" />
      <BlogListSkeleton count={count} />
    </section>
  )
}

export function AchievementsSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-64" />
      <div className="grid w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border-edge space-y-2 border-b-[1px] px-2 py-2.5 last:border-b-0">
            <SkeletonBlock className="h-5 w-10/12 rounded-sm" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-4 w-12 rounded-full" />
              <SkeletonBlock className="h-4 w-24 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ExperienceSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-28" />
      <div className="grid w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border-edge space-y-3 border-b-[1px] p-3 last:border-b-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-44 rounded-sm" />
                <SkeletonBlock className="h-4 w-32 rounded-sm" />
              </div>
              <SkeletonBlock className="h-4 w-20 rounded-sm" />
            </div>
            <SkeletonBlock className="h-4 w-full rounded-sm" />
            <SkeletonBlock className="h-4 w-9/12 rounded-sm" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function CertificateGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 p-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <CertificateCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function CertificateCardSkeleton() {
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

export function CertificatesSectionSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-36" />
      <CertificateGridSkeleton />
    </section>
  )
}

export function UtilityGridSkeleton() {
  return (
    <div className="w-full">
      {Array.from({ length: 2 }).map((_, categoryIndex) => (
        <div key={categoryIndex}>
          <article className="w-full">
            <div className="border-edge full-bleed-border-b space-y-2 border-b-[1px] bg-accent/5 px-4 py-3">
              <SkeletonBlock className="h-5 w-44 rounded-sm" />
              <SkeletonBlock className="h-3 w-10/12 rounded-sm" />
            </div>
            <div className="grid w-full grid-cols-1 gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((__, itemIndex) => (
                <div key={itemIndex} className="border-edge flex gap-3.5 rounded-lg border bg-card/20 p-3.5">
                  <SkeletonBlock className="size-10 shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-28 rounded-sm" />
                    <SkeletonBlock className="h-3 w-full rounded-sm" />
                    <SkeletonBlock className="h-3 w-9/12 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          </article>
          {categoryIndex === 0 && <Separator />}
        </div>
      ))}
    </div>
  )
}

export function UtilitiesSectionSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-24" />
      <UtilityGridSkeleton />
    </section>
  )
}

export function FavoritesSectionSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-28" />
      {["Formula 1", "Movies"].map((section, sectionIndex) => (
        <div key={section}>
          <div className="border-edge full-bleed-border-b flex items-center gap-3 border-b-[1px] px-3 py-2.5">
            <SkeletonBlock className="h-4 w-9 rounded-sm" />
            <SkeletonBlock className="h-5 w-32 rounded-sm" />
          </div>
          <div className="grid w-full grid-cols-1 md:grid-cols-2">
            {Array.from({ length: sectionIndex === 0 ? 4 : 2 }).map((_, index) => (
              <article key={index} className="border-edge border-b-[1px] p-3 md:border-r-[1px] md:last:border-r-0">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-36 rounded-sm" />
                    <SkeletonBlock className="h-3 w-56 rounded-sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }).map((__, itemIndex) => (
                      <div key={itemIndex} className="flex flex-col items-center gap-2 rounded-md p-3">
                        <SkeletonBlock className="size-14 rounded-full" />
                        <SkeletonBlock className="h-3 w-12 rounded-sm" />
                        <SkeletonBlock className="h-3 w-16 rounded-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {sectionIndex === 0 && <Separator />}
        </div>
      ))}
    </section>
  )
}

export function PrivacySectionSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-20" />
      <article className="space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <SkeletonBlock className="h-3 w-48 rounded-sm" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <SkeletonBlock className="h-4 w-full rounded-sm" />
            <SkeletonBlock className="h-4 w-11/12 rounded-sm" />
            <SkeletonBlock className="h-4 w-9/12 rounded-sm" />
          </div>
        ))}
      </article>
    </section>
  )
}

export function ContactCtaSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-24" />
      <div className="space-y-3 px-4 py-4 sm:px-6">
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-11/12 rounded-sm" />
          <SkeletonBlock className="h-4 w-8/12 rounded-sm" />
        </div>
        <div className="flex items-center gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="size-4 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactFormSkeleton() {
  return (
    <section className="w-full">
      <HeaderTitleSkeleton className="w-24" />
      <div className="w-full">
        <div className="border-edge border-b px-4 py-4">
          <SkeletonBlock className="h-3 w-24 rounded-sm" />
          <SkeletonBlock className="mt-6 h-4 w-44 rounded-sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="border-edge border-b px-4 py-4 sm:last:border-l"
            >
              <SkeletonBlock className="h-3 w-16 rounded-sm" />
              <SkeletonBlock className="mt-6 h-4 w-36 rounded-sm" />
            </div>
          ))}
        </div>
        <div className="border-edge border-b px-4 py-4">
          <SkeletonBlock className="h-3 w-20 rounded-sm" />
          <SkeletonBlock className="mt-6 h-4 w-9/12 rounded-sm" />
        </div>
        <div className="flex justify-end px-4 py-4">
          <SkeletonBlock className="size-6 rounded-sm" />
        </div>
      </div>
    </section>
  )
}

export function ProjectDetailSkeleton() {
  return (
    <>
      <div className="p-2 md:p-4">
        <div className="border-edge rounded-lg border p-2">
          <SkeletonBlock className="h-[200px] rounded-[6px] sm:h-[400px] md:h-[500px]" />
        </div>
      </div>
      <div className="flex w-full gap-x-4 p-2 md:p-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-16 w-1/2 rounded-sm" />
        ))}
      </div>
      <Separator />
      <div className="space-y-3 p-2 sm:p-4">
        <SkeletonBlock className="h-7 w-64 rounded-sm" />
        <SkeletonBlock className="h-4 w-full rounded-sm" />
        <SkeletonBlock className="h-4 w-10/12 rounded-sm" />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </>
  )
}

export function PublicPageSkeleton({
  children,
  backLabelWidth = "w-20",
}: {
  children: React.ReactNode
  backLabelWidth?: string
}) {
  return (
    <ContainerWrapper>
      <Separator />
      <div className="flex h-10 items-center px-3 sm:h-12">
        <SkeletonBlock className={cn("h-4 rounded-sm", backLabelWidth)} />
      </div>
      <Separator />
      {children}
      <Separator />
    </ContainerWrapper>
  )
}

export function PhotographySphereSkeleton() {
  return (
    <section className="full-bleed-border-b relative min-h-[24rem] overflow-hidden border-b bg-white sm:min-h-[30rem] dark:bg-black">
      {/* Top overlay badges */}
      <div className="absolute top-3 right-3 left-3 z-10 flex flex-wrap items-center justify-between gap-2 sm:top-4 sm:right-4 sm:left-4">
        <SkeletonBlock className="h-8 w-56 rounded-md" />
        <SkeletonBlock className="h-8 w-20 rounded-md" />
      </div>
    </section>
  )
}

export function PhotographyPageSkeleton() {
  return (
    <PublicPageSkeleton>
      <section className="w-full">
        <HeaderTitleSkeleton className="w-36" />
        <PhotographySphereSkeleton />
      </section>
    </PublicPageSkeleton>
  )
}

export function HomePageSkeleton() {
  return (
    <ContainerWrapper>
      <ProfileHeaderSkeleton />
      <Separator />
      <AboutSkeleton />
      <Separator />
      <GitHubActivitySkeleton />
      <Separator />
      <ProjectsSectionSkeleton compact />
      <Separator />
      <div className="flex h-10 w-full items-center justify-center sm:h-12">
        <SkeletonBlock className="h-4 w-24 rounded-sm" />
      </div>
      <Separator />
      <TechStackSkeleton />
      <Separator />
      <BlogsSectionSkeleton count={2} />
      <Separator />
      <div className="flex h-10 w-full items-center justify-center sm:h-12">
        <SkeletonBlock className="h-4 w-20 rounded-sm" />
      </div>
      <Separator />
      <AchievementsSkeleton />
      <Separator />
      <ExperienceSkeleton />
      <Separator />
      <ListeningSkeleton />
      <Separator />
      <ContactCtaSkeleton />
      <Separator />
      <TotalViewsSkeleton />
      <Separator />
    </ContainerWrapper>
  )
}
