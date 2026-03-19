'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

interface HeaderProps {
  showAuth?: boolean
}

export function Header({ showAuth = false }: HeaderProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-glass-border bg-bg/80 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        <nav className="flex items-center gap-4">
          {showAuth && user ? (
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : showAuth ? (
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Consultant Login
              </Button>
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
