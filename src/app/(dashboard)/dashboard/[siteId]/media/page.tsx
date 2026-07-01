import { createClient } from '@/lib/supabase/server'
import { Image as ImageIcon, UploadCloud } from 'lucide-react'

interface MediaPageProps {
  params: Promise<{ siteId: string }>
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { siteId } = await params
  const supabase = await createClient()

  const { data: assets } = await supabase
    .from('media_assets')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <h1 className="font-semibold text-slate-900">メディアライブラリ</h1>
        <label
          htmlFor="media-upload"
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <UploadCloud size={14} />
          アップロード
          <input id="media-upload" type="file" accept="image/*" className="hidden" multiple />
        </label>
      </header>

      <main className="flex-1 p-6">
        {!assets || assets.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
            <ImageIcon className="mx-auto mb-4 text-slate-300" size={40} />
            <h2 className="text-lg font-medium text-slate-600 mb-2">メディアがありません</h2>
            <p className="text-slate-400 text-sm">画像をアップロードしてサイトで使用できます。</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.map((asset) => (
              <div key={asset.id} className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 hover:border-blue-400 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.storage_path}
                  alt={asset.alt_text ?? asset.file_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-white text-xs truncate">{asset.file_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
