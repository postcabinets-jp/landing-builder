import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface HeaderProps {
  title?: string
  actions?: React.ReactNode
}

async function UserMenu() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-slate-700 text-white text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-xs text-slate-500 truncate">{user?.email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          ダッシュボード
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOut} className="w-full">
            <button type="submit" className="w-full text-left text-red-600">
              ログアウト
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Header({ title, actions }: HeaderProps) {
  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2">
        {title && <h1 className="font-semibold text-slate-900">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <UserMenu />
      </div>
    </header>
  )
}
