import {
  ProjectsSectionSkeleton,
  PublicPageSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton>
      <ProjectsSectionSkeleton />
    </PublicPageSkeleton>
  )
}
