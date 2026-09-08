import { NextResponse } from "next/server"
import { getTotalViews, getTotalVisitors } from "@/lib/google-analytics"

export const dynamic = "force-dynamic"

export async function GET() {
  const [totalViews, totalVisitors] = await Promise.all([
    getTotalViews(),
    getTotalVisitors(),
  ])

  return NextResponse.json(
    { totalViews, totalVisitors },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
