import { getSite } from '@/app/actions/sites'
import { Sidebar } from '@/components/layout/sidebar'
import { notFound } from 'next/navigation'

interface SiteLayoutProps {
  children: React.ReactNode
  params: Promise<{ siteId: string }>
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { siteId } = await params

  let site
  try {
    site = await getSite(siteId)
  } catch {
    notFound()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar siteId={siteId} siteName={site.name} />
      <div className="flex-1 flex flex-col bg-slate-50">
        {children}
      </div>
    </div>
  )
}
