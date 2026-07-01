import { getSite, toggleSitePublish } from '@/app/actions/sites'
import { getPages, createPage, deletePage, togglePagePublish } from '@/app/actions/pages'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
import Link from 'next/link'
import { Plus, FileText, Globe, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { notFound } from 'next/navigation'

interface SitePageProps {
  params: Promise<{ siteId: string }>
}

export default async function SitePage({ params }: SitePageProps) {
  const { siteId } = await params

  let site, pages
  try {
    ;[site, pages] = await Promise.all([getSite(siteId), getPages(siteId)])
  } catch {
    notFound()
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-slate-900">ページ</h1>
          <Badge variant={site.is_published ? 'default' : 'secondary'} className="text-xs">
            {site.is_published ? '公開中' : '下書き'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <form action={toggleSitePublish.bind(null, siteId, !site.is_published)}>
            <Button type="submit" variant="outline" size="sm" className="gap-2">
              {site.is_published ? <EyeOff size={14} /> : <Globe size={14} />}
              {site.is_published ? '非公開にする' : 'サイトを公開'}
            </Button>
          </form>
          <Dialog>
            <DialogTrigger className={cn(buttonVariants({ size: 'sm' }), 'gap-2 bg-slate-900 hover:bg-slate-800')}>
              <Plus size={14} />
              ページ追加
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しいページを作成</DialogTitle>
                <DialogDescription>ページのタイトルとURLパスを設定してください。</DialogDescription>
              </DialogHeader>
              <form action={createPage.bind(null, siteId) as unknown as (formData: FormData) => Promise<void>} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="page-title">ページタイトル</Label>
                  <Input id="page-title" name="title" placeholder="例: About" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-path">URLパス</Label>
                  <Input id="page-path" name="path" placeholder="例: /about" required pattern="\/.*" />
                  <p className="text-xs text-slate-400">/ から始まるパスを入力してください</p>
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">作成</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 p-6">
        {pages.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
            <FileText className="mx-auto mb-4 text-slate-300" size={40} />
            <h2 className="text-lg font-medium text-slate-600 mb-2">ページがありません</h2>
            <p className="text-slate-400 text-sm">「ページ追加」ボタンから最初のページを作成しましょう。</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <div key={page.id} className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center justify-between group hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} className="text-slate-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{page.title}</p>
                    <p className="text-xs text-slate-400 font-mono">{page.path}</p>
                  </div>
                  {page.is_template && (
                    <Badge variant="outline" className="text-xs ml-2">テンプレート</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant={page.is_published ? 'default' : 'secondary'} className="text-xs">
                    {page.is_published ? '公開' : '下書き'}
                  </Badge>
                  <form action={togglePagePublish.bind(null, page.id, siteId, !page.is_published)}>
                    <button type="submit" className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors" title={page.is_published ? '非公開にする' : '公開する'}>
                      {page.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </form>
                  <Link
                    href={`/dashboard/${siteId}/pages/${page.id}/editor`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs hover:bg-slate-800 transition-colors"
                  >
                    <Pencil size={12} />
                    編集
                  </Link>
                  <form action={deletePage.bind(null, page.id, siteId)}>
                    <button type="submit" className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors" title="削除">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
