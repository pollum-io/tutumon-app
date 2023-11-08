import { Aside } from '@/components/Aside'
import { Header } from '@/components/Header'
import clsx from 'clsx'

export function App({
  children,
}: {
  children: React.ReactNode | React.ReactNode[]
}) {
  return (
    <body className="w-full dark:bg-gray-950">
      <Header />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl justify-center pt-8">
        <Aside />
        <main className="grid basis-2/4 grid-flow-row grid-rows-[4rem,1fr]">
          {children}
        </main>
      </div>
    </body>
  )
}
