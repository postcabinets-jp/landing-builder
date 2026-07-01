import { signUp, signInWithGoogle } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">アカウント作成</CardTitle>
        <CardDescription>
          無料で始めましょう。クレジットカード不要。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="w-full gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Googleで登録
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">または</span>
          </div>
        </div>

        <form action={signUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">お名前</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="田中 拓也"
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          <p className="text-xs text-slate-400">
            登録することで、
            <a href="#" className="underline">利用規約</a>と
            <a href="#" className="underline">プライバシーポリシー</a>に同意したものとみなされます。
          </p>
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
            無料でアカウント作成
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-slate-500">
          すでにアカウントをお持ちの方は{' '}
          <a href="/login" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            ログイン
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
