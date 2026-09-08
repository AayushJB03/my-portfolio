import {
  FavoritesSectionSkeleton,
  PublicPageSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton>
      <FavoritesSectionSkeleton />
    </PublicPageSkeleton>
  )
}
