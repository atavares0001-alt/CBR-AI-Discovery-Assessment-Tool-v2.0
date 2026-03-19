import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CBR AI Agency Discovery Assessment',
  description: 'AI Readiness Discovery Assessment by CBR AI Agency — Canberra\'s leading AI agency for small business automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="noise-overlay min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
