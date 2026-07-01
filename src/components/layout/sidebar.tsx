'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Globe,
  Database,
  Image,
  MessageSquare,
  Settings,
  ChevronLeft,
} from 'lucide-react'

interface SidebarProps {
  siteId: string
  siteName: string
}

const navItems = (siteId: string) => [
  { label: 'ページ', href: `/dashboard/${siteId}`, icon: LayoutDashboard },
  { label: 'CMS', href: `/dashboard/${siteId}/cms`, icon: Database },
  { label: 'メディア', href: `/dashboard/${siteId}/media`, icon: Image },
  { label: 'フォーム', href: `/dashboard/${siteId}/forms`, icon: MessageSquare },
  { label: '設定', href: `/dashboard/${siteId}/settings`, icon: Settings },
]

export function Sidebar({ siteId, siteName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors">
          <ChevronLeft size={14} />
          すべてのサイト
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
            <Globe size={12} />
          </div>
          <span className="font-medium text-sm truncate">{siteName}</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems(siteId).map((item) => {
          const isActive =
            item.href === `/dashboard/${siteId}`
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
