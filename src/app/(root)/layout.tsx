import { SiteFooter } from "@/components/site/site-footer"
import { SiteGradualBlur } from "@/components/site/site-gradual-blur"
import { SiteHeader } from "@/components/site/site-header"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="w-full flex-1 flex flex-col overflow-x-hidden">
        {children}
      </main>
      <SiteFooter />
      <SiteGradualBlur />
    </div>
  )
}
