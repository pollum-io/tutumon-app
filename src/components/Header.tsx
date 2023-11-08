'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import WalletConnect from './WalletConnect'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

function ThemeIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5-8a5 5 0 0 0 5 5V7a5 5 0 0 0-5 5Z"
      />
    </svg>
  )
}

export function Header() {
  let [mounted, setMounted] = useState(false)
  let { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()
  let otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="right-4 top-4 z-50 -m-2.5 hidden px-8 pt-4 text-black lg:absolute lg:flex">
      {pathname === '/' ? (
        <Link
          href={'/profile'}
          className="wallet-adapter-button-trigger flex items-center justify-center rounded-lg bg-transparent font-bold text-black"
        >
          Launch App
        </Link>
      ) : (
        <WalletConnect />
      )}
      {/* <button
        type="button"
        className="group  p-2.5"
        onClick={() => setTheme(otherTheme)}
      >
        <span className="sr-only">Switch to {otherTheme} theme</span>
        <ThemeIcon className="h-6 w-6 fill-white opacity-50 transition-opacity group-hover:opacity-100 lg:fill-gray-900 lg:dark:fill-white" />
      </button> */}
    </div>
  )
}
