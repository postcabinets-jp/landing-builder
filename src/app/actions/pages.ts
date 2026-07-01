'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'

export async function getPages(siteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function createPage(siteId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const path = formData.get('path') as string

  const { data, error } = await supabase
    .from('pages')
    .insert({ site_id: siteId, title, path })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Create initial empty page version
  await supabase.from('page_versions').insert({
    page_id: data.id,
    content: { blocks: [] },
    label: 'Initial',
    created_by: user.id,
  })

  revalidatePath(`/dashboard/${siteId}`)
  return data
}

export async function savePage(pageId: string, siteId: string, content: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('page_versions').insert({
    page_id: pageId,
    content: content as Json,
    label: `Saved ${new Date().toLocaleString('ja-JP')}`,
    created_by: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}/pages/${pageId}/editor`)
}

export async function togglePagePublish(pageId: string, siteId: string, isPublished: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('pages')
    .update({ is_published: isPublished })
    .eq('id', pageId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}`)
}

export async function deletePage(pageId: string, siteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('pages').delete().eq('id', pageId)
  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}`)
}

export async function getPageVersions(pageId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('page_versions')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw new Error(error.message)
  return data
}
