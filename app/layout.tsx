import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TreeHeal',
  description: 'Next.js application with CSS modules',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
