import Link from "next/link"

import { HeaderTitle } from "@/components/profile/header-title"
import { Separator } from "@/components/profile/separator"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { USER } from "@/data"
import { generateMetaData } from "@/lib/utils"

export const metadata = generateMetaData(
  "Privacy",
  "A short privacy note for Aayush Bhadbhade's portfolio, contact form, analytics, and external links.",
  { path: "/privacy" }
)

const lastUpdated = "July 12, 2026"

const InlineLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  const isExternal = href.startsWith("http")

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-primary hover:text-primary/70 font-medium underline underline-offset-4 transition-colors"
    >
      {children}
    </Link>
  )
}

const PrivacyPage = () => {
  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />

      <section className="w-full">
        <HeaderTitle title="Privacy" />

        <article className="text-primary/90 space-y-5 px-4 py-6 text-sm leading-relaxed sm:px-6 sm:py-8 sm:text-base">
          <p className="text-muted-foreground font-mono text-xs leading-normal font-medium tracking-[0.18em] uppercase">
            Last updated {lastUpdated}
          </p>

          <p>
            This portfolio does not use accounts, payments, or newsletter
            signups. If you send a message through the contact form, I receive
            the details you enter, such as your name, email, optional phone
            number, and message. The form is handled through{" "}
            <InlineLink href="https://formspree.io/legal/privacy-policy/">
              Formspree
            </InlineLink>
            .
          </p>

          <p>
            I use{" "}
            <InlineLink href="https://support.google.com/analytics/answer/7318509">
              Google Analytics
            </InlineLink>{" "}
            and <InlineLink href="https://umami.is/privacy">Umami</InlineLink>{" "}
            to understand page views, fix broken flows, and improve the site. I
            do not sell personal information or share contact messages for
            advertising.
          </p>

          <p>
            External links on this portfolio may open GitHub, LinkedIn, X,
            project demos, or documentation. Once you leave this site, that
            service&apos;s own privacy policy applies.
          </p>

          <p>
            For privacy questions, or if you want a message corrected or
            deleted, email me at{" "}
            <InlineLink href={`mailto:${USER.email}`}>{USER.email}</InlineLink>.
          </p>
        </article>
      </section>

      <Separator className="mt-auto" />
    </ContainerWrapper>
  )
}

export default PrivacyPage
