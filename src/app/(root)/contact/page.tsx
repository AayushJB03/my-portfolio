import { Contact } from "@/components/profile/contact"
import { Separator } from "@/components/profile/separator"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { generateMetaData } from "@/lib/utils"

export const metadata = generateMetaData(
  "Contact",
  "Send a direct message to Aayush Bhadbhade about AI engineering, LLMs, AI agents, or collaborations.",
  { path: "/contact" }
)

export default function ContactPage() {
  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />

      <Contact />
      <Separator className="mt-auto" />
    </ContainerWrapper>
  )
}
