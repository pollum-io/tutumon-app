import { type Metadata } from 'next'
import { Inter, Open_Sans, Raleway } from 'next/font/google'
import localFont from 'next/font/local'
import clsx from 'clsx'

import { Providers } from '@/app/providers'
import '@/styles/tailwind.css'
import '@/styles/wallet.css'
import { Aside } from '@/components/Aside'
import { openSans } from '@/fonts'

export const metadata: Metadata = {
  title: 'SolPal',
  description:
    'Explore Solana with SolPal, the AI Chrome extension that simplifies Solana knowledge in a click.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(' antialiased', openSans.className)}
      suppressHydrationWarning
    >
      <body className="mx-auto flex h-full min-h-screen max-w-6xl justify-center py-16 dark:bg-gray-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
