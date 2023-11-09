'use client'

import { raleway } from '@/fonts'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Aside() {
  return (
    <aside className="grid basis-1/4 grid-flow-row auto-rows-[2rem]">
      <h1 className={`text-5xl font-bold text-[#0FF089] ${raleway.className}`}>
        Tutumon
      </h1>
      <Navbar />
    </aside>
  )
}

function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="row-start-4 row-end-auto px-4 text-2xl">
      <ul className="flex flex-col gap-y-6">
        <NavbarItem
          name="chat"
          route="/dashboard"
          disabled
          active={'/dashboard' === pathname}
        />
        <NavbarItem
          name="profile"
          route="/profile"
          active={'/profile' === pathname}
        />
      </ul>
    </nav>
  )
}

function NavbarItem({
  name,
  route,
  active,
  disabled,
}: {
  name: string
  route: string
  active: boolean
  disabled?: boolean
}) {
  return (
    <li>
      <Link
        className={`relative flex items-center gap-x-2 ${
          active ? 'text-[#eee]' : 'text-[#6f6f6f]'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
        href={disabled ? '' : route}
      >
        {active && (
          <span className="absolute left-0 aspect-square w-1.5 -translate-x-3 translate-y-0.5 rounded-full bg-[#0FF089]" />
        )}
        {name}
      </Link>
    </li>
  )
}
