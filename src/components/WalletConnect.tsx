'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import SignMessageButton from './SignMessageBtn'

const WalletModalButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletModalButton,
  { ssr: false },
)
interface WalletProps {
  children?: React.ReactNode
}

export function truncatePublicKey(publicKey: string | null | undefined) {
  if (!publicKey) return null

  return publicKey.slice(0, 4) + '..' + publicKey.slice(-4)
}

export default function WalletConnect({ children }: WalletProps) {
  const [dropdownActive, setDropdownActive] = useState(false)
  const { publicKey, wallet, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  const truncatedWalletAddress = useMemo(() => {
    return truncatePublicKey(publicKey?.toBase58())
  }, [publicKey])

  const openDropdown = useCallback(() => {
    setDropdownActive(true)
  }, [])

  const closeDropdown = useCallback(() => {
    setDropdownActive(false)
  }, [])

  const disconnectWallet = useCallback(() => {
    disconnect()
    setDropdownActive(false)
  }, [disconnect])

  const changeWallet = useCallback(() => {
    setDropdownActive(false)
    setVisible(true)
  }, [setVisible])

  if (!wallet || !publicKey)
    return (
      <WalletModalButtonDynamic>
        {children ? children : <>Connect Wallet</>}
      </WalletModalButtonDynamic>
    )

  return (
    <div className="wallet-adapter-dropdown" onBlur={closeDropdown}>
      <button
        onClick={openDropdown}
        className={`wallet-adapter-button-trigger items-center justify-center rounded-lg bg-transparent `}
      >
        <span>{truncatedWalletAddress}</span>
      </button>
      <ul
        className={`wallet-adapter-dropdown-list ${
          dropdownActive && 'wallet-adapter-dropdown-list-active'
        }`}
      >
        <button
          className="wallet-adapter-dropdown-list-item"
          onClick={disconnectWallet}
        >
          <span>Disconnect Wallet</span>
        </button>
        <SignMessageButton className="wallet-adapter-dropdown-list-item" />
      </ul>
    </div>
  )
}
