import { createClient } from '@/lib/supabase/server'
import { getItems, createItem, deleteItem, toggleItemPublish } from '@/app/actions/cms'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { notFound } from 'next/navigation'
import { Plus, Trash2, Eye, EyeOff, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { Json } from '@/types/database'

interface Field {
  name: string
  label: string
  type: 'text' | 'richtext' | 'image' | 'date' | 'boolean' | 'number' | 'reference'
  required: boolean
}

interface CMSItemPageProps {
  params: Promise<{ siteId: string; collectionId: string }>
}

async function CreateItemAction(collectionId: string, siteId: string, formData: FormData) {
  'use server'
  const fields = Object.fromEntries(formData.entries()) as Record<string, unknown>
  await createItem(collectionId, siteId, fields)
}

export default async function CMSItemPage({ params }: CMSItemPageProps) {
  const { siteId, collectionId } = await params
  const supabase = await createClient()

  type CollectionRow = {
    id: string; site_id: string; name: string; slug: string;
    fields: unknown; created_at: string; updated_at: string;
  }

  const { data: rawCollection } = await supabase
    .from('cms_collections')
    .select('*')
    .eq('id', collectionId)
    .single() as { data: CollectionRow | null }

  if (!rawCollection) notFound()

  const collection = rawCollection as CollectionRow
  const items = await getItems(collectionId)
  const fields = (collection.fields as Field[]) ?? []

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/${siteId}/cms`} className="text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronLeft size={18} />
          </Link>
          <h1 className="font-semibold text-slate-900">{collection.name}</h1>
          <Badge variant="secondary" className="text-xs">{items.length}件</Badge>
        </div>
        <Dialog>
          <DialogTrigger className={cn(buttonVariants({ size: 'sm' }), 'gap-2 bg-slate-900 hover:bg-slate-800')}>
            <Plus size={14} />
            新規アイテム
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>新規 {collection.name}</DialogTitle>
            </DialogHeader>
            <form action={CreateItemAction.bind(null, collectionId, siteId)} className="space-y-4 mt-2">
              {fields.length === 0 ? (
                <p className="text-sm text-slate-500">フィールドが定義されていません。コレクション設定でフィールドを追加してください。</p>
              ) : (
                fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <Label htmlFor={field.name} className="text-sm">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === 'richtext' ? (
                      <Textarea id={field.name} name={field.name} required={field.required} rows={4} className="text-sm" />
                    ) : field.type === 'number' ? (
                      <Input id={field.name} name={field.name} type="number" required={field.required} className="text-sm h-8" />
                    ) : field.type === 'date' ? (
                      <Input id={field.name} name={field.name} type="date" required={field.required} className="text-sm h-8" />
                    ) : (
                      <Input id={field.name} name={field.name} required={field.required} className="text-sm h-8" />
                    )}
                  </div>
                ))
              )}
              {fields.length > 0 && (
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">作成</Button>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 p-6">
        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 text-sm">アイテムがありません。「新規アイテム」から追加してください。</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {fields.slice(0, 3).map((f) => (
                    <th key={f.name} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {f.label}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">状態</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">作成日</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const data = item.data as Record<string, Json>
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 group">
                      {fields.slice(0, 3).map((f) => (
                        <td key={f.name} className="px-4 py-3 text-slate-700 max-w-48 truncate">
                          {String(data[f.name] ?? '—')}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <Badge variant={item.is_published ? 'default' : 'secondary'} className="text-xs">
                          {item.is_published ? '公開' : '下書き'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <form action={toggleItemPublish.bind(null, item.id, siteId, collectionId, !item.is_published)}>
                            <button type="submit" className="p-1.5 text-slate-400 hover:text-slate-700 rounded" title={item.is_published ? '非公開' : '公開'}>
                              {item.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </form>
                          <form action={deleteItem.bind(null, item.id, siteId, collectionId)}>
                            <button type="submit" className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                              <Trash2 size={14} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
