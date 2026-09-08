import { SITE_INFO } from "@/data"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "Anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "cohere-ai",
    "FacebookBot",
    "Applebot-Extended",
    "Bytespider",
    "CCBot",
    "Diffbot",
    "YouBot",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/_next"],
      },
      {
        userAgent: aiCrawlers,
        allow: "/",
        disallow: ["/admin", "/api", "/_next"],
      },
    ],
    sitemap: `${SITE_INFO.url}/sitemap.xml`,
    host: SITE_INFO.url,
  }
}
