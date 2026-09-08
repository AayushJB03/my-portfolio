import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminContent } from "@/lib/admin/content"

export const metadata = {
  title: "Admin Board",
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const content = await getAdminContent()

  return <AdminDashboard initialContent={content} />
}
