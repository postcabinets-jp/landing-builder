import { getSite, updateSite, deleteSite } from '@/app/actions/sites'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { notFound } from 'next/navigation'

interface SettingsPageProps {
  params: Promise<{ siteId: string }>
}

async function UpdateSiteAction(siteId: string, formData: FormData) {
  'use server'
  await updateSite(siteId, {
    name: formData.get('name') as string,
    custom_domain: (formData.get('custom_domain') as string) || undefined,
  })
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { siteId } = await params

  let site
  try {
    site = await getSite(siteId)
  } catch {
    notFound()
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center">
        <h1 className="font-semibold text-slate-900">サイト設定</h1>
      </header>

      <main className="flex-1 p-6 max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本設定</CardTitle>
            <CardDescription>サイト名とURLの設定</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={UpdateSiteAction.bind(null, siteId)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">サイト名</Label>
                <Input id="site-name" name="name" defaultValue={site.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">スラッグ</Label>
                <Input id="slug" value={site.slug} disabled className="font-mono text-sm bg-slate-50" />
                <p className="text-xs text-slate-400">スラッグは変更できません</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-domain">カスタムドメイン <span className="text-slate-400 text-xs">(省略可)</span></Label>
                <Input
                  id="custom-domain"
                  name="custom_domain"
                  defaultValue={site.custom_domain ?? ''}
                  placeholder="example.com"
                  type="text"
                />
                <p className="text-xs text-slate-400">お名前.comやCloudflareでDNSを設定してください</p>
              </div>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800">変更を保存</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base text-red-700">危険な操作</CardTitle>
            <CardDescription>この操作は取り消せません</CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">サイトを削除</p>
                <p className="text-xs text-slate-500">すべてのページ・CMS・メディアが削除されます</p>
              </div>
              <form action={deleteSite.bind(null, siteId)}>
                <Button type="submit" variant="destructive" size="sm">
                  サイトを削除
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
