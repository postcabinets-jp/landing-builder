import { getCollections, createCollection, deleteCollection } from '@/app/actions/cms'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
import { Database, Plus, Trash2, ChevronRight } from 'lucide-react'

interface CMSPageProps {
  params: Promise<{ siteId: string }>
}

export default async function CMSPage({ params }: CMSPageProps) {
  const { siteId } = await params
  const collections = await getCollections(siteId)

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <h1 className="font-semibold text-slate-900">CMSコレクション</h1>
        <Dialog>
          <DialogTrigger className={cn(buttonVariants({ size: 'sm' }), 'gap-2 bg-slate-900 hover:bg-slate-800')}>
            <Plus size={14} />
            コレクション追加
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しいコレクション</DialogTitle>
              <DialogDescription>コンテンツの種類を追加します（例：ブログ記事、製品一覧）</DialogDescription>
            </DialogHeader>
            <form action={createCollection.bind(null, siteId) as unknown as (formData: FormData) => Promise<void>} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="collection-name">コレクション名</Label>
                <Input id="collection-name" name="name" placeholder="例: ブログ記事" required />
              </div>
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">作成</Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 p-6">
        {collections.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
            <Database className="mx-auto mb-4 text-slate-300" size={40} />
            <h2 className="text-lg font-medium text-slate-600 mb-2">コレクションがありません</h2>
            <p className="text-slate-400 text-sm">ブログ記事や製品情報などのコレクションを追加しましょう。</p>
          </div>
        ) : (
          <div className="space-y-2">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center justify-between group hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{collection.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{collection.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/dashboard/${siteId}/cms/${collection.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs hover:bg-slate-800 transition-colors"
                  >
                    管理
                    <ChevronRight size={12} />
                  </Link>
                  <form action={deleteCollection.bind(null, collection.id, siteId)}>
                    <button type="submit" className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors">
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
