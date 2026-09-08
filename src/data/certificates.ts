import { createClient } from "@/lib/supabase/server"

export interface Certificate {
  id: string
  title: string
  issueddate: string
  orgname: string
  orglogo: string
  url: string
  pinned: boolean
  created_at: string
}

export const getCertificates = async (limit?: number) => {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("certificates")
      .select(
        "id, title, issueddate, orgname, orglogo, url, pinned, created_at"
      )
      .order("issueddate", { ascending: false })
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching certificates from Supabase:", error)
      return []
    }

    return (data || []) as Certificate[]
  } catch (err) {
    console.error("Failed to fetch certificates:", err)
    return []
  }
}
