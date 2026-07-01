'use client'

import { useState, useCallback } from 'react'
import { savePage } from '@/app/actions/pages'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  Type,
  Square,
  Image,
  Minus,
  ChevronDown,
  GripVertical,
  Trash2,
  Plus,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'

type BlockType = 'heading' | 'paragraph' | 'button' | 'image' | 'separator' | 'spacer' | 'section'

interface Block {
  id: string
  type: BlockType
  text?: string
  level?: number
  href?: string
  src?: string
  alt?: string
  height?: number
  style?: Record<string, string | number>
  children?: Block[]
}

interface EditorClientProps {
  siteId: string
  pageId: string
  pageTitle: string
  initialContent: { blocks: Block[] }
}

const BLOCK_TEMPLATES: Record<BlockType, Omit<Block, 'id'>> = {
  heading: { type: 'heading', text: '新しい見出し', level: 2, style: { fontSize: 32, fontWeight: 700, color: '#1e293b' } },
  paragraph: { type: 'paragraph', text: 'テキストを入力してください。ここに説明文を書きます。', style: { fontSize: 16, color: '#475569', lineHeight: 1.7 } },
  button: { type: 'button', text: 'ボタン', href: '#', style: { backgroundColor: '#0f172a', color: '#fff', borderRadius: 6, paddingX: 24, paddingY: 12 } },
  image: { type: 'image', src: '', alt: '画像の説明', style: { width: '100%', borderRadius: 8 } },
  separator: { type: 'separator', style: { borderColor: '#e2e8f0', marginY: 32 } },
  spacer: { type: 'spacer', height: 48 },
  section: { type: 'section', style: { backgroundColor: '#f8fafc', padding: 48 }, children: [] },
}

function generateId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function BlockRenderer({ block, isSelected, onSelect }: {
  block: Block
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const style = block.style ?? {}

  return (
    <div
      onClick={() => onSelect(block.id)}
      className={cn(
        'relative group cursor-pointer border-2 transition-colors rounded',
        isSelected ? 'border-blue-500' : 'border-transparent hover:border-blue-200'
      )}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded capitalize z-10">
          {block.type}
        </div>
      )}
      {block.type === 'heading' && (
        <div style={{ fontSize: style.fontSize as number, fontWeight: style.fontWeight as number, color: style.color as string, lineHeight: style.lineHeight as number }}>
          {block.text}
        </div>
      )}
      {block.type === 'paragraph' && (
        <p style={{ fontSize: style.fontSize as number, color: style.color as string, lineHeight: style.lineHeight as number }}>
          {block.text}
        </p>
      )}
      {block.type === 'button' && (
        <div className="inline-block">
          <span style={{
            backgroundColor: style.backgroundColor as string,
            color: style.color as string,
            borderRadius: style.borderRadius as number,
            padding: `${style.paddingY ?? 12}px ${style.paddingX ?? 24}px`,
            display: 'inline-block',
            fontWeight: 500,
          }}>
            {block.text}
          </span>
        </div>
      )}
      {block.type === 'image' && (
        <div style={{ width: style.width as string, borderRadius: style.borderRadius as number, overflow: 'hidden' }}>
          {block.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={block.alt ?? ''} className="w-full" />
          ) : (
            <div className="bg-slate-100 flex items-center justify-center" style={{ height: 200 }}>
              <Image size={32} className="text-slate-300" />
              <span className="text-slate-400 text-sm ml-2">画像を選択</span>
            </div>
          )}
        </div>
      )}
      {block.type === 'separator' && (
        <hr style={{ borderColor: style.borderColor as string, margin: `${style.marginY ?? 32}px 0` }} />
      )}
      {block.type === 'spacer' && (
        <div style={{ height: block.height ?? 48 }} className="bg-slate-50 border border-dashed border-slate-200 rounded flex items-center justify-center">
          <span className="text-slate-300 text-xs">スペーサー {block.height ?? 48}px</span>
        </div>
      )}
      {block.type === 'section' && (
        <div style={{ backgroundColor: style.backgroundColor as string, padding: style.padding as number }} className="rounded-lg">
          {block.children?.length === 0 && (
            <div className="text-center text-slate-300 text-sm py-8">セクションにブロックを追加</div>
          )}
        </div>
      )}
    </div>
  )
}

function PropertyPanel({ block, onChange }: { block: Block | null; onChange: (updated: Block) => void }) {
  if (!block) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm">
        ブロックをクリックしてプロパティを編集
      </div>
    )
  }

  const updateStyle = (key: string, value: string | number) => {
    onChange({ ...block, style: { ...block.style, [key]: value } })
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{block.type}</p>

      {(block.type === 'heading' || block.type === 'paragraph' || block.type === 'button') && (
        <div className="space-y-2">
          <Label className="text-xs">テキスト</Label>
          <Input
            value={block.text ?? ''}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            className="text-sm h-8"
          />
        </div>
      )}

      {block.type === 'button' && (
        <div className="space-y-2">
          <Label className="text-xs">リンク先</Label>
          <Input
            value={block.href ?? ''}
            onChange={(e) => onChange({ ...block, href: e.target.value })}
            className="text-sm h-8"
            placeholder="https://..."
          />
        </div>
      )}

      {block.type === 'image' && (
        <>
          <div className="space-y-2">
            <Label className="text-xs">画像URL</Label>
            <Input
              value={block.src ?? ''}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              className="text-sm h-8"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Alt テキスト</Label>
            <Input
              value={block.alt ?? ''}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              className="text-sm h-8"
            />
          </div>
        </>
      )}

      {block.type === 'spacer' && (
        <div className="space-y-2">
          <Label className="text-xs">高さ (px)</Label>
          <Input
            type="number"
            value={block.height ?? 48}
            onChange={(e) => onChange({ ...block, height: Number(e.target.value) })}
            className="text-sm h-8"
            min={8}
            max={400}
            step={8}
          />
        </div>
      )}

      {block.style && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">スタイル</p>

          {block.type !== 'separator' && block.type !== 'spacer' && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">文字色</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={(block.style?.color as string) ?? '#1e293b'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    className="h-8 w-12 rounded border border-slate-200 cursor-pointer"
                  />
                  <Input
                    value={(block.style?.color as string) ?? '#1e293b'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                </div>
              </div>

              {(block.type === 'button' || block.type === 'section') && (
                <div className="space-y-1.5">
                  <Label className="text-xs">背景色</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={(block.style?.backgroundColor as string) ?? '#0f172a'}
                      onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                      className="h-8 w-12 rounded border border-slate-200 cursor-pointer"
                    />
                    <Input
                      value={(block.style?.backgroundColor as string) ?? '#0f172a'}
                      onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function EditorClient({ siteId, pageId, pageTitle, initialContent }: EditorClientProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialContent.blocks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null

  const addBlock = (type: BlockType) => {
    const newBlock: Block = { id: generateId(), ...BLOCK_TEMPLATES[type] } as Block
    setBlocks((prev) => [...prev, newBlock])
    setSelectedId(newBlock.id)
  }

  const updateBlock = useCallback((updated: Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
  }, [])

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    setSelectedId(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await savePage(pageId, siteId, { blocks })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const canvasWidth = viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px'

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Top toolbar */}
      <div className="h-12 bg-slate-900 flex items-center px-4 gap-4 flex-shrink-0">
        <Link href={`/dashboard/${siteId}`} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm">
          <ChevronLeft size={16} />
          {pageTitle}
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-1 bg-slate-800 rounded-md p-1">
          {(['desktop', 'tablet', 'mobile'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={cn(
                'p-1.5 rounded transition-colors',
                viewport === v ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              {v === 'desktop' ? <Monitor size={14} /> : v === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'gap-2 h-8 text-xs',
            saved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          )}
        >
          <Save size={12} />
          {saving ? '保存中...' : saved ? '保存完了' : '保存'}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — Elements */}
        <div className="w-52 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">要素を追加</p>
          </div>
          <div className="p-3 space-y-1">
            {([
              { type: 'heading' as BlockType, label: '見出し', icon: Type },
              { type: 'paragraph' as BlockType, label: 'テキスト', icon: Type },
              { type: 'button' as BlockType, label: 'ボタン', icon: Square },
              { type: 'image' as BlockType, label: '画像', icon: Image },
              { type: 'separator' as BlockType, label: '区切り線', icon: Minus },
              { type: 'spacer' as BlockType, label: 'スペーサー', icon: ChevronDown },
              { type: 'section' as BlockType, label: 'セクション', icon: Square },
            ]).map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors text-left"
              >
                <Icon size={14} className="text-slate-400" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-8">
          <div
            className="bg-white shadow-lg rounded-lg transition-all duration-300"
            style={{ width: canvasWidth, minHeight: 600 }}
          >
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                <Plus size={32} className="mb-3" />
                <p className="text-sm">左パネルから要素を追加してください</p>
              </div>
            ) : (
              <div className="p-8 space-y-4">
                {blocks.map((block) => (
                  <div key={block.id} className="relative group">
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      <GripVertical size={14} className="text-slate-300 cursor-grab" />
                    </div>
                    <BlockRenderer
                      block={block}
                      isSelected={selectedId === block.id}
                      onSelect={setSelectedId}
                    />
                    {selectedId === block.id && (
                      <button
                        onClick={() => deleteBlock(block.id)}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Properties */}
        <div className="w-56 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-3 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">プロパティ</p>
          </div>
          <PropertyPanel
            block={selectedBlock}
            onChange={updateBlock}
          />
        </div>
      </div>
    </div>
  )
}
