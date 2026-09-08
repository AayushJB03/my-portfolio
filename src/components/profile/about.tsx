import { ArrowUpRight } from "lucide-react"
import { getAboutContent, getProfileContent } from "@/data/content"
import { Badge } from "../ui/badge"
import { AboutRichText } from "./about-rich-text"
import { HeaderTitle } from "./header-title"

const isSafeHref = (href: string) => {
  if (href.startsWith("/") || href.startsWith("#")) {
    return true
  }

  try {
    const url = new URL(href)
    return ["http:", "https:", "mailto:"].includes(url.protocol)
  } catch {
    return false
  }
}

export const About = async () => {
  const [about, profile] = await Promise.all([
    getAboutContent(),
    getProfileContent(),
  ])
  const showPrimaryLink = about.resumeUrl && isSafeHref(about.resumeUrl)
  const showSecondaryLink =
    about.secondaryLinkUrl &&
    about.secondaryLinkLabel &&
    isSafeHref(about.secondaryLinkUrl)

  return (
    <section className="w-full">
      <HeaderTitle title="About" />
      <div className="space-y-3 px-3 pt-4 pb-3 sm:px-4">
        <AboutRichText
          markdown={about.markdown}
          profileAvatarUrl={profile.avatarUrl}
        />
        {about.focusAreas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {about.focusAreas.map((area) => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="full-bleed-border-t flex min-h-10 flex-wrap items-center gap-3 px-3 py-2">
        <span className="border-edge h-px flex-1 border-t border-dotted" aria-hidden />
        {showPrimaryLink && (
          <a
            href={about.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary group font-pixelify inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 transition-colors sm:text-sm"
          >
            {about.resumeLabel}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-4" />
          </a>
        )}
        {showSecondaryLink && (
          <a
            href={about.secondaryLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary group font-pixelify inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 transition-colors sm:text-sm"
          >
            {about.secondaryLinkLabel}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-4" />
          </a>
        )}
        <span className="border-edge h-px flex-1 border-t border-dotted" aria-hidden />
      </div>
    </section>
  )
}
