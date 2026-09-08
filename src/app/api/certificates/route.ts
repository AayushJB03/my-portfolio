import { getCertificates } from "@/data/certificates"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await getCertificates()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API error fetching certificates:", error)
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    )
  }
}
