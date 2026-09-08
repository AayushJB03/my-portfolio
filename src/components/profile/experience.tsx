import type { Experience as ExperienceType } from "@/data/experience"
import { ExperienceList } from "./experience-list"
import { HeaderTitle } from "./header-title"

export const Experience = async ({
  initialExperience,
}: {
  initialExperience: ExperienceType[]
}) => {
  return (
    <>
      <section className="w-full">
        <HeaderTitle title="Experience" />
        <ExperienceList initialExperience={initialExperience} />
      </section>
    </>
  )
}
