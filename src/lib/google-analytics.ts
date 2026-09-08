import "server-only"

import { BetaAnalyticsDataClient, protos } from "@google-analytics/data"
import { unstable_noStore as noStore } from "next/cache"
import { unstable_rethrow } from "next/navigation"

let analyticsClient: BetaAnalyticsDataClient | null = null

function getAnalyticsClient() {
  if (!analyticsClient) {
    const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    )

    if (!clientEmail || !privateKey) {
      throw new Error("Google Analytics credentials are not configured")
    }

    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })
  }

  return analyticsClient
}

async function fetchTotalViews() {
  noStore()

  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

  if (!propertyId) {
    throw new Error("Google Analytics property ID is not configured")
  }

  const [report] = await getAnalyticsClient().runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
    metrics: [{ name: "screenPageViews" }],
    metricAggregations: [
      protos.google.analytics.data.v1beta.MetricAggregation.TOTAL,
    ],
  })

  const totalViews =
    report.totals?.[0]?.metricValues?.[0]?.value ??
    report.rows?.[0]?.metricValues?.[0]?.value

  return Number(totalViews ?? 0)
}

async function fetchTotalVisitors() {
  noStore()

  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

  if (!propertyId) {
    throw new Error("Google Analytics property ID is not configured")
  }

  const [report] = await getAnalyticsClient().runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
    metrics: [{ name: "sessions" }],
    metricAggregations: [
      protos.google.analytics.data.v1beta.MetricAggregation.TOTAL,
    ],
  })

  const totalVisitors =
    report.totals?.[0]?.metricValues?.[0]?.value ??
    report.rows?.[0]?.metricValues?.[0]?.value

  return Number(totalVisitors ?? 0)
}

export async function getTotalViews() {
  try {
    return await fetchTotalViews()
  } catch (error) {
    unstable_rethrow(error)
    console.error("Unable to load Google Analytics view count:", error)
    return null
  }
}

export async function getTotalVisitors() {
  try {
    return await fetchTotalVisitors()
  } catch (error) {
    unstable_rethrow(error)
    console.error("Unable to load Google Analytics visitor count:", error)
    return null
  }
}
