import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditorClient } from './editor-client'

interface EditorPageProps {
  params: Promise<{ siteId: string; pageId: string }>
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { siteId, pageId } = await params
  const supabase = await createClient()

  const [{ data: page }, { data: versions }] = await Promise.all([
    supabase.from('pages').select('*').eq('id', pageId).single(),
    supabase
      .from('page_versions')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  if (!page) notFound()

  const latestContent = versions?.[0]?.content ?? { blocks: [] }

  return (
    <EditorClient
      siteId={siteId}
      pageId={pageId}
      pageTitle={page.title}
      initialContent={latestContent as unknown as Parameters<typeof EditorClient>[0]['initialContent']}
    />
  )
}

interface Block {
  id: string
  type: string
  [key: string]: unknown
}
