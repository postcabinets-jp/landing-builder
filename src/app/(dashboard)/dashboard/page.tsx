import { getSites } from '@/app/actions/sites'
import { createSite, deleteSite } from '@/app/actions/sites'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Globe, Plus, MoreHorizontal, ExternalLink, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export default async function DashboardPage() {
  const sites = await getSites()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="font-semibold text-slate-900">landing-builder</span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-700 text-white text-xs">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-slate-500 truncate">{user?.email}</div>
                <DropdownMenuItem>
                  <form action={signOut} className="w-full">
                    <button type="submit" className="w-full text-left text-red-600">
                      ログアウト
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">あなたのサイト</h1>
            <p className="text-slate-500 text-sm mt-1">{sites.length}件のサイト</p>
          </div>
          <Dialog>
            <DialogTrigger className={cn(buttonVariants(), 'gap-2 bg-slate-900 hover:bg-slate-800')}>
              <Plus size={16} />
              新規サイト作成
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しいサイトを作成</DialogTitle>
                <DialogDescription>
                  サイト名を入力してください。後から変更できます。
                </DialogDescription>
              </DialogHeader>
              <form action={createSite} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="site-name">サイト名</Label>
                  <Input id="site-name" name="name" placeholder="例: 田中デザインスタジオ" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-slug">URL スラッグ <span className="text-slate-400 text-xs">(省略可)</span></Label>
                  <Input id="site-slug" name="slug" placeholder="例: tanaka-design" pattern="[a-z0-9-]+" />
                  <p className="text-xs text-slate-400">半角英数とハイフンのみ</p>
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">作成</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-xl">
            <Globe className="mx-auto mb-4 text-slate-300" size={48} />
            <h2 className="text-lg font-medium text-slate-600 mb-2">まだサイトがありません</h2>
            <p className="text-slate-400 text-sm mb-6">最初のサイトを作成して、ビジュアル編集を始めましょう。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => (
              <Card key={site.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold truncate">{site.name}</CardTitle>
                      <CardDescription className="text-xs mt-1 font-mono">{site.slug}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100">
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem render={<Link href={`/dashboard/${site.id}/settings`} />}>
                          設定
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <form action={deleteSite.bind(null, site.id)} className="w-full">
                            <button type="submit" className="w-full text-left text-red-600 flex items-center gap-2">
                              <Trash2 size={14} />
                              削除
                            </button>
                          </form>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={site.is_published ? 'default' : 'secondary'} className="text-xs">
                      {site.is_published ? '公開中' : '下書き'}
                    </Badge>
                    <div className="flex gap-2">
                      {site.is_published && (
                        <a
                          href={site.custom_domain ?? `#`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <Link href={`/dashboard/${site.id}`} className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'h-7 text-xs px-3')}>
                        編集
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
