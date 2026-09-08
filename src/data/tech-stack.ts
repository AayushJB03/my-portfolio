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

// ponytail: kept in sync with supabase/admin_content_schema.sql's
// tech_stack_items seed — this is what renders when Supabase isn't
// reachable (e.g. env vars not yet set on a deploy target), so it must
// match, not just the seed data.
export const TECH_STACK: TechStack[] = [
  {
    key: "python",
    title: "Python",
    icon: getSimpleIconUrl("Python"),
  },
  {
    key: "pytorch",
    title: "PyTorch",
    icon: getSimpleIconUrl("PyTorch"),
  },
  {
    key: "openai",
    title: "OpenAI",
    icon: getSimpleIconUrl("OpenAI"),
  },
  {
    key: "huggingface",
    title: "Hugging Face",
    icon: getSimpleIconUrl("Hugging Face"),
  },
  {
    key: "fastapi",
    title: "FastAPI",
    icon: getSimpleIconUrl("FastAPI"),
  },
  {
    key: "numpy",
    title: "NumPy",
    icon: getSimpleIconUrl("NumPy"),
  },
  {
    key: "pandas",
    title: "Pandas",
    icon: getSimpleIconUrl("Pandas"),
  },
  {
    key: "jupyter",
    title: "Jupyter",
    icon: getSimpleIconUrl("Jupyter"),
  },
  {
    key: "postgresql",
    title: "PostgreSQL",
    icon: getSimpleIconUrl("PostgreSQL"),
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
    key: "github",
    title: "GitHub",
    icon: getSimpleIconUrl("GitHub"),
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
