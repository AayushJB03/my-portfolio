import { ThemeProvider } from "@/components/providers/theme-provider"
import { ThemeShortcut } from "@/components/providers/theme-shortcut"
import { HapticFeedback } from "@/components/providers/haptic-feedback"
import { SearchProvider } from "@/components/providers/search-provider"
import { DitherThemeProvider } from "@/components/providers/dither-theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HireMe } from "@/core/hire-me"
import { PixelCat } from "@/components/profile/pixel-cat"
import { SiteBoot } from "@/components/site/site-boot"
import { SITE_INFO, USER } from "@/data"
import { getProfileContent } from "@/data/content"
import type { Metadata } from "next"
import {
  Bitcount_Grid_Double,
  Geist,
  Geist_Mono,
  Pixelify_Sans,
} from "next/font/google"
import Script from "next/script"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
})

const bitcountGridDouble = Bitcount_Grid_Double({
  variable: "--font-bitcount",
  subsets: ["latin"],
  adjustFontFallback: false,
})

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: "/",
  },
  title: {
    template: `%s | ${SITE_INFO.siteName}`,
    default: SITE_INFO.siteTitle,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: USER.fullName,
      url: SITE_INFO.url,
    },
  ],
  creator: USER.fullName,
  publisher: USER.fullName,
  category: "technology",
  applicationName: SITE_INFO.siteName,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    siteName: SITE_INFO.siteName,
    url: "/",
    type: "profile",
    title: SITE_INFO.siteTitle,
    description: SITE_INFO.description,
    firstName: USER.firstName,
    lastName: USER.lastName,
    username: USER.username,
    gender: USER.gender,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    creator: USER.twitterUsername,
    title: SITE_INFO.siteTitle,
    description: SITE_INFO.description,
    images: [SITE_INFO.ogImage],
  },
  icons: {
    icon: [{ url: "/nav-logo.svg", type: "image/svg+xml" }],
    shortcut: "/nav-logo.svg",
    apple: "/nav-logo.svg",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getProfileContent()
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_INFO.url}/#person`,
        name: USER.fullName,
        alternateName: USER.username,
        url: SITE_INFO.url,
        image: profile.avatarUrl,
        jobTitle: "AI Engineer",
        description: SITE_INFO.description,
        email: `mailto:${USER.email}`,
        sameAs: USER.socials.map((social) => social.href),
        knowsAbout: [
          "Artificial Intelligence",
          "Large Language Models",
          "AI Agents",
          "Retrieval-Augmented Generation (RAG)",
          "Python",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_INFO.url}/#website`,
        url: SITE_INFO.url,
        name: SITE_INFO.siteTitle,
        description: SITE_INFO.description,
        inLanguage: "en-US",
        author: {
          "@id": `${SITE_INFO.url}/#person`,
        },
      },
    ],
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelifySans.variable} ${bitcountGridDouble.variable}`}
      suppressHydrationWarning
    >
      <body className="w-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <TooltipProvider>
          <DitherThemeProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              <SiteBoot>
                <SearchProvider>{children}</SearchProvider>
                <ThemeShortcut />
                <HapticFeedback />
                <HireMe />
                <PixelCat />
              </SiteBoot>
            </ThemeProvider>
          </DitherThemeProvider>
        </TooltipProvider>
        {process.env.NODE_ENV !== "development" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
