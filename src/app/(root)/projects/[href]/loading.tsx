import {
  ProjectDetailSkeleton,
  PublicPageSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton backLabelWidth="w-24">
      <ProjectDetailSkeleton />
    </PublicPageSkeleton>
  )
}
