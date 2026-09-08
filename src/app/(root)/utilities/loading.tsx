import {
  PublicPageSkeleton,
  UtilitiesSectionSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton>
      <UtilitiesSectionSkeleton />
    </PublicPageSkeleton>
  )
}
