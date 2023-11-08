'use client'
import SignMessageButton from '@/components/SignMessageBtn'
import WalletConnect from '@/components/WalletConnect'
import { useWallet } from '@solana/wallet-adapter-react'

export default function SignInPage() {
  const { publicKey } = useWallet()
  return (
    <div className=" flex w-screen flex-col items-center justify-center text-black">
      <div className="border-brand-green flex w-full flex-col items-center justify-center gap-8 rounded-xl border bg-transparent px-6 py-12 transition-all  lg:max-w-xs ">
        <h2 className="text-center text-4xl font-bold text-white">Login</h2>
        <WalletConnect />
        {publicKey ? (
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center ">
              <div className="bg-brand-green h-2/3 w-3/5 animate-ping rounded-lg opacity-100 "></div>
            </div>
            <SignMessageButton className="wallet-adapter-button-trigger z-10 items-center justify-center rounded-lg bg-transparent font-bold" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
