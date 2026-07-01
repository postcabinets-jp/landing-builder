'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'

export async function getSites() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getSite(siteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createSite(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const rawSlug = (formData.get('slug') as string) || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { data, error } = await supabase
    .from('sites')
    .insert({ user_id: user.id, name, slug: rawSlug })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Create a default home page
  await supabase.from('pages').insert({
    site_id: data.id,
    title: 'Home',
    path: '/',
    seo_meta: { title: name, description: '', ogImage: '' },
  })

  revalidatePath('/dashboard')
  redirect(`/dashboard/${data.id}`)
}

export async function updateSite(siteId: string, updates: {
  name?: string
  custom_domain?: string
  global_styles?: Json
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('sites')
    .update(updates)
    .eq('id', siteId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}`)
}

export async function toggleSitePublish(siteId: string, isPublished: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('sites')
    .update({ is_published: isPublished })
    .eq('id', siteId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${siteId}`)
}

export async function deleteSite(siteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', siteId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
