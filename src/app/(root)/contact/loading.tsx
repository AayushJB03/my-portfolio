import {
  ContactFormSkeleton,
  PublicPageSkeleton,
} from "@/components/site/skeletons"

export default function Loading() {
  return (
    <PublicPageSkeleton backLabelWidth="w-16">
      <ContactFormSkeleton />
    </PublicPageSkeleton>
  )
}
