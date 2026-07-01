import { resetPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">パスワードをリセット</CardTitle>
        <CardDescription>
          登録済みのメールアドレスを入力してください。リセットリンクを送信します。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={resetPassword} className="space-y-4">
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
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
            リセットリンクを送信
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <a href="/login" className="text-sm text-slate-500 hover:text-slate-900 underline-offset-4 hover:underline">
          ログインに戻る
        </a>
      </CardFooter>
    </Card>
  )
}
