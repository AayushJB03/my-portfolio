import { createClient } from "@/lib/supabase/server"
import { getSimpleIconUrl } from "@/lib/tech-icons"

export type TechStack = {
  id?: string
  key: string
  title: string
  icon: string
  sort_order?: number
}

type TechStackRow = {
  id: string
  name: string
  slug: string
  icon_url: string | null
  sort_order: number
}

export const TECH_STACK: TechStack[] = [
  {
    key: "typescript",
    title: "TypeScript",
    icon: getSimpleIconUrl("TypeScript"),
  },
  {
    key: "javascript",
    title: "JavaScript",
    icon: getSimpleIconUrl("JavaScript"),
  },
  {
    key: "python",
    title: "Python",
    icon: getSimpleIconUrl("Python"),
  },
  {
    key: "go",
    title: "Go",
    icon: getSimpleIconUrl("Go"),
  },
  {
    key: "nodejs",
    title: "Node.js",
    icon: getSimpleIconUrl("Node.js"),
  },
  {
    key: "bun",
    title: "Bun",
    icon: getSimpleIconUrl("Bun"),
  },
  {
    key: "elysia",
    title: "Elysia",
    icon: getSimpleIconUrl("Elysia"),
  },
  {
    key: "express",
    title: "Express",
    icon: getSimpleIconUrl("Express"),
  },
  {
    key: "hono",
    title: "Hono",
    icon: getSimpleIconUrl("Hono"),
  },
  {
    key: "fastapi",
    title: "FastAPI",
    icon: getSimpleIconUrl("FastAPI"),
  },
  {
    key: "flask",
    title: "Flask",
    icon: getSimpleIconUrl("Flask"),
  },
  {
    key: "socketio",
    title: "Socket.io",
    icon: getSimpleIconUrl("Socket.io"),
  },
  {
    key: "react",
    title: "React",
    icon: getSimpleIconUrl("React"),
  },
  {
    key: "nextjs",
    title: "Next.js",
    icon: getSimpleIconUrl("Next.js"),
  },
  {
    key: "angular",
    title: "Angular",
    icon: getSimpleIconUrl("Angular"),
  },
  {
    key: "redux",
    title: "Redux",
    icon: getSimpleIconUrl("Redux"),
  },
  {
    key: "zustand",
    title: "Zustand",
    icon: getSimpleIconUrl("Zustand"),
  },
  {
    key: "shadcnui",
    title: "ShadcnUI",
    icon: getSimpleIconUrl("shadcnui"),
  },
  {
    key: "tailwindcss",
    title: "TailwindCSS",
    icon: getSimpleIconUrl("Tailwind CSS"),
  },
  {
    key: "framer-motion",
    title: "FramerMotion",
    icon: getSimpleIconUrl("Framer"),
  },
  {
    key: "ffmpeg-wasm",
    title: "FfmpegWASM",
    icon: getSimpleIconUrl("FFmpeg"),
  },
  {
    key: "mongodb",
    title: "MongoDB",
    icon: getSimpleIconUrl("MongoDB"),
  },
  {
    key: "postgresql",
    title: "PostgreSQL",
    icon: getSimpleIconUrl("PostgreSQL"),
  },
  {
    key: "sqlite",
    title: "SQLite",
    icon: getSimpleIconUrl("SQLite"),
  },
  {
    key: "redis",
    title: "Redis",
    icon: getSimpleIconUrl("Redis"),
  },
  {
    key: "prisma",
    title: "Prisma",
    icon: getSimpleIconUrl("Prisma"),
  },
  {
    key: "drizzle",
    title: "Drizzle",
    icon: getSimpleIconUrl("Drizzle"),
  },
  {
    key: "cloudflare",
    title: "Cloudflare",
    icon: getSimpleIconUrl("Cloudflare"),
  },
  {
    key: "docker",
    title: "Docker",
    icon: getSimpleIconUrl("Docker"),
  },
  {
    key: "git",
    title: "Git",
    icon: getSimpleIconUrl("Git"),
  },
  {
    key: "postman",
    title: "Postman",
    icon: getSimpleIconUrl("Postman"),
  },
  {
    key: "cloudinary",
    title: "Cloudinary",
    icon: getSimpleIconUrl("Cloudinary"),
  },
  {
    key: "vercel",
    title: "Vercel",
    icon: getSimpleIconUrl("Vercel"),
  },
]

const mapTechStackRow = (item: TechStackRow): TechStack => ({
  id: item.id,
  key: item.slug,
  title: item.name,
  icon: item.icon_url || getSimpleIconUrl(item.name),
  sort_order: item.sort_order,
})

export const getTechStack = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("tech_stack_items")
      .select("id, name, slug, icon_url, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .returns<TechStackRow[]>()

    if (error || !data || data.length === 0) {
      return TECH_STACK
    }

    return data.map(mapTechStackRow)
  } catch {
    return TECH_STACK
  }
}
