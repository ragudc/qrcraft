"use client"

import { useAuth }      from '@/hooks/useAuth'
import { signInWithGoogle, signOut } from '@/lib/supabase/auth-actions'
import { Button }       from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, LogOut, LayoutDashboard, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserMenu() {
  const { user, loading, isAuthenticated, userAvatar, userName } =
    useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <form action={signInWithGoogle}>
        <Button variant="outline" size="sm" type="submit" className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign in
        </Button>
      </form>
    )
  }

  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full h-8 w-8 p-0 inline-flex items-center justify-center outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userAvatar} alt={userName ?? 'User'} />
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium leading-none">
              {userName ?? 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => router.push('/dashboard')}
        >
          <LayoutDashboard className="h-4 w-4" />
          My QR Codes
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
