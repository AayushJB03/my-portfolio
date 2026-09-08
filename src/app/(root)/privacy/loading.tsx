import {
  PrivacySectionSkeleton,
  PublicPageSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton>
      <PrivacySectionSkeleton />
    </PublicPageSkeleton>
  )
}
