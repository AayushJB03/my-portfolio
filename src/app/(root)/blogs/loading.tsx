import {
  BlogsSectionSkeleton,
  PublicPageSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton>
      <BlogsSectionSkeleton count={6} />
    </PublicPageSkeleton>
  )
}
