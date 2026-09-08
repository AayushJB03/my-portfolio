import { SITE_INFO, USER } from "@/data"
import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMonthYear = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export const generateMetaData = (
  title: string,
  description: string,
  options: {
    path?: string
    imageUrl?: string
  } = {}
): Metadata => {
  const path = options.path ?? "/"
  const ogImg = options.imageUrl ?? SITE_INFO.ogImage

  return {
    metadataBase: new URL(SITE_INFO.url),
    title,
    description,
    alternates: {
      canonical: path,
    },
    authors: [
      {
        name: USER.fullName,
        url: SITE_INFO.url,
      },
    ],
    creator: USER.fullName,
    openGraph: {
      title,
      description,
      siteName: SITE_INFO.siteName,
      url: path,
      type: "website",
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: title,
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
      title,
      description,
      images: [ogImg],
    },
  }
}
