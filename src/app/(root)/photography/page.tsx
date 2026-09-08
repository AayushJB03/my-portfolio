import { getPhotographyPhotos } from "@/data/photography"
import { PhotographySphere } from "@/components/photography/photography-sphere"
import { HeaderTitle } from "@/components/profile/header-title"
import { Separator } from "@/components/profile/separator"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { generateMetaData } from "@/lib/utils"

export const metadata = generateMetaData(
  "Photography",
  "A living orbit of Aayush Bhadbhade's latest photography.",
  { path: "/photography" }
)

export const dynamic = "force-dynamic"

const PhotographyPage = async () => {
  const photos = await getPhotographyPhotos()

  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />

      <section className="w-full">
        <HeaderTitle title="Photography" />
        <PhotographySphere photos={photos} />
      </section>

      <Separator />
    </ContainerWrapper>
  )
}

export default PhotographyPage
