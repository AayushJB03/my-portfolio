import { getCertificates } from "@/data/certificates"
import { CertificatesGrid } from "@/components/profile/certificates-grid"
import { HeaderTitle } from "@/components/profile/header-title"
import { Separator } from "@/components/profile/separator"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { generateMetaData } from "@/lib/utils"

export const metadata = generateMetaData(
  "Certificates",
  "A comprehensive list of Aayush Bhadbhade's professional certifications and virtual internship completions.",
  { path: "/certificates" }
)

export const dynamic = "force-dynamic"

const CertificatesPage = async () => {
  // Fetch only the first 6 certificates server-side for initial render
  const initialCertificates = await getCertificates(6)

  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />

      <section className="w-full">
        <HeaderTitle title="Certificates" />
        <CertificatesGrid initialCertificates={initialCertificates} />
      </section>

      <Separator />
    </ContainerWrapper>
  )
}

export default CertificatesPage
