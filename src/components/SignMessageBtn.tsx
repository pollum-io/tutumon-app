import { useWallet } from '@solana/wallet-adapter-react'
import axios from 'axios'
import React, { FC, useCallback } from 'react'
import { sign } from 'tweetnacl'
// import { useProfile } from '@/hooks/onUser'
import baseX from 'base-x'
import { signIn, useSession, signOut } from 'next-auth/react'

const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export default function SignMessageButton({
  className,
}: {
  className?: string
}) {
  const { data: session } = useSession()
  const { publicKey, signMessage } = useWallet()
  //   const profile = useProfile()
  const bs58 = baseX(alphabet)

  const onClick = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error('Wallet not connected!')
      // `signMessage` will be undefined if the wallet doesn't support it
      if (!signMessage)
        throw new Error('Wallet does not support message signing!')

      const response = await axios.get(`/api/login/nonce`)

      if (response.status != 200)
        throw new Error('nonce could not be retrieved')

      const { nonce }: { nonce: string } = await response.data

      // Encode anything as bytes

      const message = new TextEncoder().encode(
        `Sign this message for authenticating with your wallet. Nonce: ${nonce}`,
      )
      // Sign the bytes using the wallet
      const signature = await signMessage(message)

      // Verify that the bytes were signed using the private key that matches the known public key
      if (!sign.detached.verify(message, signature, publicKey.toBytes()))
        throw new Error('Invalid signature!')

      const signature58 = bs58.encode(signature)

      await signIn('credentials', {
        nonce: nonce,
        publicKey: publicKey,
        signature: signature58,
        callbackUrl: `${window.location.origin}/profile`,
      })
    } catch (error: any) {
      alert(`Signing failed: ${error}`)
    }
  }, [bs58, publicKey, signMessage])

  if (!session)
    return (
      <button className={className} onClick={onClick} disabled={!publicKey}>
        Sign Message
      </button>
    )

  return (
    <button className={className} onClick={() => signOut()}>
      Sign Out
    </button>
  )
}
