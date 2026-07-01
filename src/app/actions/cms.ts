'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'

// ---- Collections ----

export async function getCollections(siteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('cms_collections')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function createCollection(siteId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { data, error } = await supabase
    .from('cms_collections')
    .insert({ site_id: siteId, name, slug, fields: [] })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}`)
  return data
}

export async function updateCollectionFields(
  collectionId: string,
  siteId: string,
  fields: Array<{ name: string; label: string; type: string; required: boolean }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('cms_collections')
    .update({ fields })
    .eq('id', collectionId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}/cms/${collectionId}`)
}

export async function deleteCollection(collectionId: string, siteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('cms_collections')
    .delete()
    .eq('id', collectionId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}`)
  redirect(`/dashboard/${siteId}`)
}

// ---- Items ----

export async function getItems(collectionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('cms_items')
    .select('*')
    .eq('collection_id', collectionId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createItem(collectionId: string, siteId: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = (data.title as string) || (data.name as string) || ''
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || Date.now().toString()

  const { error } = await supabase
    .from('cms_items')
    .insert({ collection_id: collectionId, data: data as Json, slug })

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}/cms/${collectionId}`)
}

export async function updateItem(itemId: string, siteId: string, collectionId: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('cms_items')
    .update({ data: data as Json })
    .eq('id', itemId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}/cms/${collectionId}`)
}

export async function toggleItemPublish(itemId: string, siteId: string, collectionId: string, isPublished: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('cms_items')
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq('id', itemId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}/cms/${collectionId}`)
}

export async function deleteItem(itemId: string, siteId: string, collectionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('cms_items').delete().eq('id', itemId)
  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}/cms/${collectionId}`)
}
