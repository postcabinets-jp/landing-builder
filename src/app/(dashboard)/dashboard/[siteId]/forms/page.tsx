import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Json } from '@/types/database'

interface FormsPageProps {
  params: Promise<{ siteId: string }>
}

export default async function FormsPage({ params }: FormsPageProps) {
  const { siteId } = await params
  const supabase = await createClient()

  const { data: submissions } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })

  const groups: Record<string, typeof submissions> = {}
  submissions?.forEach((s) => {
    if (!groups[s.form_name]) groups[s.form_name] = []
    groups[s.form_name]!.push(s)
  })

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <h1 className="font-semibold text-slate-900">フォーム送信</h1>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Download size={14} />
          CSV エクスポート
        </Button>
      </header>

      <main className="flex-1 p-6">
        {!submissions || submissions.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
            <MessageSquare className="mx-auto mb-4 text-slate-300" size={40} />
            <h2 className="text-lg font-medium text-slate-600 mb-2">送信がありません</h2>
            <p className="text-slate-400 text-sm">フォームブロックをページに追加すると、送信内容がここに表示されます。</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([formName, items]) => (
              <div key={formName}>
                <h2 className="text-sm font-semibold text-slate-700 mb-3">{formName} <span className="text-slate-400 font-normal">({items?.length}件)</span></h2>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  {items?.map((submission) => {
                    const data = submission.data as Record<string, Json>
                    return (
                      <div key={submission.id} className="px-4 py-4 border-b border-slate-100 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-wrap gap-4">
                            {Object.entries(data).map(([key, val]) => (
                              <div key={key}>
                                <p className="text-xs text-slate-400 capitalize">{key}</p>
                                <p className="text-sm text-slate-700">{String(val)}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-slate-400 flex-shrink-0">
                            {new Date(submission.created_at).toLocaleString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
