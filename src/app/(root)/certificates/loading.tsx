import {
  CertificatesSectionSkeleton,
  PublicPageSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton>
      <CertificatesSectionSkeleton />
    </PublicPageSkeleton>
  )
}
