'use client'

import { Header } from './Header'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header showAuth />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6">
        {children}
      </main>
    </div>
  )
}
