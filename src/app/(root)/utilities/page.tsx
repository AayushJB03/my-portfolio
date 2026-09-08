import { HeaderTitle } from "@/components/profile/header-title"
import { UtilityGrid } from "@/components/profile/utility-grid"
import { Separator } from "@/components/profile/separator"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { getUtilities } from "@/data/content"
import { generateMetaData } from "@/lib/utils"

export const metadata = generateMetaData(
  "Utilities",
  "A detailed overview of Aayush Bhadbhade's systems, terminal workflows, development workspace, AI stack, and productivity tools.",
  { path: "/utilities" }
)

const UtilitiesPage = async () => {
  const utilities = await getUtilities()

  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />

      <section className="w-full">
        <HeaderTitle title="Utilities" />
        <UtilityGrid initialCategories={utilities} />
      </section>

      <Separator />
    </ContainerWrapper>
  )
}

export default UtilitiesPage
