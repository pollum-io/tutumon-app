/* eslint-disable @next/next/no-img-element */
'use client'

import Head from 'next/head'

import {
  FindNftsByOwnerOutput,
  Metadata,
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from '@metaplex-foundation/js'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

import { getSession, useSession } from 'next-auth/react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useHoldings } from '@/hooks/onUser'
import { NftGrid } from '@/components/NftGrid'
import { Layout } from '@/layouts'

export default function Home() {
  // const { publicKey } = useWallet()
  const { data: session, update } = useSession()
  const holdings = useHoldings(session?.user?.name || '')

  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentView, setCurrentView] = useState<
    (Nft | Sft | SftWithToken | NftWithToken)[]
  >([])
  const [selectedNft, setSelectedNft] = useState<Metadata | Nft | Sft>()
  const [custom, setCustom] = useState({ mirror: false })
  const perPage = 16

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage

  // Calculate the total number of pages
  const totalPages = Math.ceil((holdings.data?.length || 0) / perPage)

  const selectNft = useCallback(
    (nft: FindNftsByOwnerOutput[number]) => {
      if (selectedNft?.address === nft.address) {
        setSelectedNft(undefined)
        return
      }
      return setSelectedNft(nft)
    },
    [selectedNft?.address],
  )

  // const changeCurrentPage = (operation: string) => {
  //   if (operation === 'next') {
  //     setCurrentPage((prevValue) => prevValue + 1)
  //   } else {
  //     setCurrentPage((prevValue) => (prevValue > 1 ? prevValue - 1 : 1))
  //   }
  // }

  const updateUser = async () => {
    if (!session) return
    setIsUpdateLoading(true)

    const updatedData = {
      image: selectedNft?.json?.image,
      imgConfig: custom,
      mintId: selectedNft?.address,
    }

    try {
      await axios.put(`/api/user?publickey=${session.user?.name}`, updatedData)
    } catch (error) {
      console.error(error)
    } finally {
      await update()
      setIsUpdateLoading(false)
      window.location.reload()
    }
  }

  return (
    <Layout.App>
      <div className="flex justify-between">
        <p className="mb-4 text-3xl font-bold">Select your Pal</p>
        <Button variant="ghost" className="min-w-[100px]" onClick={updateUser}>
          {!isUpdateLoading ? 'Save' : 'Loading...'}
        </Button>
      </div>
      <div>
        {holdings.isLoading ? (
          // {true ? (
          <p className="min-w-[576px]"> Loading...</p>
        ) : (
          holdings.data !== undefined && (
            <NftGrid
              selectedNft={selectedNft}
              nfts={holdings.data}
              onClick={selectNft}
            />
          )
        )}
      </div>
      {/* <div
        className={`absolute right-0 row-start-1 ml-8 aspect-square h-64 w-64 overflow-hidden rounded-md ${
          custom.mirror ? '-scale-x-100 transform' : 'scale-x-100 transform'
        } ${selectedNft === undefined ? 'hidden' : ''}`}
      >
        <p>Selected Image</p>
        <img
          className={'h-full w-full object-cover'}
          src={selectedNft?.json?.image || '/solpal.png'}
          alt="Pal image"
        />
      </div> */}
    </Layout.App>
  )

  {
    /* <div className="flex flex-col items-center gap-y-10">
        <h2 className="text-3xl font-bold">Customize your Pal</h2>

        <div
          className={`aspect-square h-64 w-64 overflow-hidden rounded-md ${
            custom.mirror ? '-scale-x-100 transform' : 'scale-x-100 transform'
          }`}
        >
          <img
            className={'h-full w-full object-cover'}
            src={selectedNft?.json?.image || '/solpal.png'}
            alt="Pal image"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="airplane-mode">Mirror:</Label>
          <Switch
            id="airplane-mode"
            checked={custom.mirror}
            onCheckedChange={() =>
              setCustom((prev) => {
                return { mirror: !prev.mirror }
              })
            }
          />
        </div>
        <Button variant="ghost" className="min-w-[100px]" onClick={updateUser}>
          {!isUpdateLoading ? 'Done' : 'loading...'}
        </Button>
      </div> */
  }
}
