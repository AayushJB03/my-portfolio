const SIMPLE_ICON_ALIASES: Record<string, string> = {
  aws: "amazonwebservices",
  "amazon web services": "amazonwebservices",
  bash: "gnubash",
  "c++": "cplusplus",
  csharp: "csharp",
  "c#": "csharp",
  express: "express",
  "express.js": "express",
  "framer motion": "framer",
  go: "go",
  golang: "go",
  "github actions": "githubactions",
  js: "javascript",
  "mongo db": "mongodb",
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  "node.js": "nodedotjs",
  nodejs: "nodedotjs",
  postgres: "postgresql",
  postgresql: "postgresql",
  "react native": "react",
  "tailwind css": "tailwindcss",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  ts: "typescript",
  "vue.js": "vuedotjs",
  vuejs: "vuedotjs",
  shadcnui: "shadcn",
  "socket.io": "socketdotio",
  socketio: "socketdotio",
  fastapi: "fastapi",
  hono: "hono",
  bun: "bun",
  elysia: "elysia",
  zustand: "zustand",
  redux: "redux",
  angular: "angular",
  sqlite: "sqlite",
  redis: "redis",
  prisma: "prisma",
  drizzle: "drizzle",
  cloudflare: "cloudflare",
  postman: "postman",
  cloudinary: "cloudinary",
  vercel: "vercel",
  ffmpeg: "ffmpeg",
  flask: "flask",
}

export const getSimpleIconSlug = (name: string) => {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/\s+/g, " ")

  return (
    SIMPLE_ICON_ALIASES[normalized] ??
    normalized.replace(/\.js$/g, "dotjs").replace(/[^a-z0-9]/g, "")
  )
}

export const getSimpleIconUrl = (name: string) => {
  return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${getSimpleIconSlug(name)}.svg`
}
