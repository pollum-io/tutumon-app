'use client'
import '@/global'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React, { FC, useMemo, useEffect } from 'react'

import { clusterApiUrl } from '@solana/web3.js'

// Default styles that can be overridden by your app
// import '@solana/wallet-adapter-react-ui/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletSelectorContextProvider } from '@/context/WalletSelectorContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WalletSelectorContextProvider>
        <SessionProvider>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </WalletSelectorContextProvider>
    </QueryClientProvider>
  )
}
