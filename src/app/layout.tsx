import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CBR AI Discovery Assessment',
  description: 'AI Readiness Discovery Assessment Tool by Canberra AI Agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
