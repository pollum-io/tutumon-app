'use client'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { providers, utils } from 'near-api-js'
import type {
  AccountView,
  CodeResult,
} from 'near-api-js/lib/providers/provider'
import type {
  SignedMessage,
  SignMessageParams,
} from '@near-wallet-selector/core'
import { verifyFullKeyBelongsToUser } from '@near-wallet-selector/core'
import { verifySignature } from '@near-wallet-selector/core'
import BN from 'bn.js'
import type { Account, Message } from '@/interfaces'
import { useWalletSelector } from '@/context/WalletSelectorContext'
import { CONTRACT_ID } from '@/constants'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

type Submitted = SubmitEvent & {
  target: { elements: { [key: string]: HTMLInputElement } }
}

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = utils.format.parseNearAmount('0.00000000003')!

interface GetAccountBalanceProps {
  provider: providers.Provider
  accountId: string
}

const getAccountBalance = async ({
  provider,
  accountId,
}: GetAccountBalanceProps) => {
  try {
    const { amount } = await provider.query<AccountView>({
      request_type: 'view_account',
      finality: 'final',
      account_id: accountId,
    })
    const bn = new BN(amount)
    return { hasBalance: !bn.isZero() }
  } catch {
    return { hasBalance: false }
  }
}

const Content: React.FC = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector()
  const [account, setAccount] = useState<Account | null>(null)
  const [messages, setMessages] = useState<Array<Message>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { data: session } = useSession()

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null
    }

    const { network } = selector.options
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })

    const { hasBalance } = await getAccountBalance({
      provider,
      accountId,
    })

    if (!hasBalance) {
      window.alert(
        `Account ID: ${accountId} has not been founded. Please send some NEAR into this account.`,
      )
      const wallet = await selector.wallet()
      await wallet.signOut()
      return null
    }

    return provider
      .query<AccountView>({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }))
  }, [accountId, selector])

  const getMessages = useCallback(() => {
    const { network } = selector.options
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })

    return provider
      .query<CodeResult>({
        request_type: 'call_function',
        account_id: CONTRACT_ID,
        method_name: 'getMessages',
        args_base64: '',
        finality: 'optimistic',
      })
      .then((res) => JSON.parse(Buffer.from(res.result).toString()))
  }, [selector])

  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    getMessages().then(setMessages)

    const timeoutId = setTimeout(() => {
      verifyMessageBrowserWallet()
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!accountId) {
      return setAccount(null)
    }

    setLoading(true)

    getAccount().then((nextAccount) => {
      setAccount(nextAccount)
      setLoading(false)
    })
  }, [accountId, getAccount])

  const handleSignIn = () => {
    modal.show()
  }

  const handleSignOut = async () => {
    const wallet = await selector.wallet()

    wallet.signOut().catch((err) => {
      console.log('Failed to sign out')
      console.error(err)
    })
  }

  const handleSwitchWallet = () => {
    modal.show()
  }

  const handleSwitchAccount = () => {
    const currentIndex = accounts.findIndex((x) => x.accountId === accountId)
    const nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0

    const nextAccountId = accounts[nextIndex].accountId

    selector.setActiveAccount(nextAccountId)

    alert('Switched account to ' + nextAccountId)
  }

  const verifyMessage = async (
    message: SignMessageParams,
    signedMessage: SignedMessage,
  ) => {
    const verifiedSignature = verifySignature({
      message: message.message,
      nonce: message.nonce,
      recipient: message.recipient,
      publicKey: signedMessage.publicKey,
      signature: signedMessage.signature,
      callbackUrl: message.callbackUrl,
    })
    const verifiedFullKeyBelongsToUser = await verifyFullKeyBelongsToUser({
      publicKey: signedMessage.publicKey,
      accountId: signedMessage.accountId,
      network: selector.options.network,
    })

    const isMessageVerified = verifiedFullKeyBelongsToUser && verifiedSignature

    // const alertMessage = isMessageVerified
    //   ? 'Successfully verified'
    //   : 'Failed to verify'

    // alert(
    //   `${alertMessage} signed message: '${
    //     message.message
    //   }': \n ${JSON.stringify(signedMessage)}`,
    // )

    console.log('msg verified', isMessageVerified)

    return isMessageVerified
  }

  const verifyMessageBrowserWallet = useCallback(async () => {
    console.log('verify message browser wallet')

    const urlParams = new URLSearchParams(
      window.location.hash.substring(1), // skip the first char (#)
    )
    const accId = urlParams.get('accountId') as string
    const publicKey = urlParams.get('publicKey') as string
    const signature = urlParams.get('signature') as string

    if (!accId && !publicKey && !signature) {
      return
    }

    const message: SignMessageParams = JSON.parse(
      localStorage.getItem('message')!,
    )

    const signedMessage = {
      accountId: accId,
      publicKey,
      signature,
    }

    const result = await verifyMessage(message, signedMessage)

    console.log('result', result)

    await signIn('credentials', {
      publicKey: signedMessage.publicKey,
      accountId: signedMessage.accountId,
      signature: result,
    })

    const url = new URL(location.href)
    url.hash = ''
    url.search = ''
    window.history.replaceState({}, document.title, url)
    localStorage.removeItem('message')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignMessage = async () => {
    const wallet = await selector.wallet()

    const message = 'test message to sign'
    const nonce = Buffer.from(Array.from(Array(32).keys()))
    const recipient = 'undefined'

    if (wallet.type === 'browser') {
      localStorage.setItem(
        'message',
        JSON.stringify({
          message,
          nonce: [...nonce],
          recipient,
          callbackUrl: location.href,
        }),
      )
    }

    try {
      const signedMessage = await wallet.signMessage({
        message,
        nonce,
        recipient,
      })

      if (signedMessage) {
        const result = await verifyMessage(
          { message, nonce, recipient },
          signedMessage,
        )
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong'
      alert(errMsg)
    }
  }

  if (loading) {
    return null
  }

  if (!account) {
    return (
      <button className="h-fit border p-6" onClick={handleSignIn}>
        Log in
      </button>
    )
  }

  if (session?.user)
    return (
      <>
        <Link
          href={'/profile'}
          className="h-fit rounded-lg border border-[#FF7DA1] bg-[#FF7DA1] p-3 text-black hover:brightness-110"
        >
          Launch App
        </Link>
      </>
    )
  return (
    <Fragment>
      <div className="flex h-fit flex-col gap-4  px-3 py-6 text-black ">
        {/* <button onClick={handleVerifyOwner}>Verify Owner</button> */}
        <button
          onClick={handleSignMessage}
          className="rounded-lg border border-[#FF7DA1] bg-[#FF7DA1] p-3 hover:brightness-110"
        >
          Sign Message
        </button>
        <button
          onClick={handleSwitchWallet}
          className="rounded-lg border border-[#FF7DA1] bg-[#FF7DA1] p-3 hover:brightness-110"
        >
          Switch Wallet
        </button>
        {accounts.length > 1 && (
          <button
            onClick={handleSwitchAccount}
            className="rounded-lg border border-[#FF7DA1] bg-[#FF7DA1] p-3 hover:brightness-110"
          >
            Switch Account
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-[#FF7DA1] bg-[#FF7DA1] p-3 hover:brightness-110"
        >
          Log out
        </button>
      </div>
      {/* <Form
        account={account}
        onSubmit={(e) => handleSubmit(e as unknown as Submitted)}
      /> */}
      {/* <Messages messages={messages} /> */}
    </Fragment>
  )
}

export default Content
