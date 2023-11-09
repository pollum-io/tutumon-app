import { FindNftsByOwnerOutput } from '@metaplex-foundation/js'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'

interface NftGridProps {
  nfts: any[]
  selectedNft?: any[number]
  onClick?(args: unknown): unknown
}

export function NftGrid(props: NftGridProps) {
  const [viewIndex, setViewIndex] = useState(0)

  const { data: session } = useSession()

  const views = useMemo(() => {
    const itemsPerView = 9

    return props.nfts.chunk(itemsPerView)
  }, [props.nfts])

  return (
    <>
      <div className="flex justify-end">
        <ViewController
          views={views}
          onChange={(value) => {
            setViewIndex(value)
          }}
        />
      </div>
      <div className="mt-4 grid w-full auto-rows-fr grid-cols-3 items-start gap-4">
        {views.length !== 0 &&
          views[viewIndex].map((nft: any, index) => {
            if (!nft) return
            return (
              <button
                key={index}
                className={`rounded-lg outline-1 hover:brightness-110 ${props.selectedNft?.reference === nft.reference
                  ? 'outline outline-[#FF7DA1]'
                  : ''
                  }`}
                onClick={() => {
                  props.onClick !== undefined && props.onClick(nft)
                }}
              >
                <Nft
                  name={nft.title}
                  src={nft.url || nft.media}
                  symbol={nft.symbol}
                />
              </button>
            )
          })}
      </div>
    </>
  )
}

interface NftProps
  extends Pick<FindNftsByOwnerOutput[number], 'name' | 'symbol'> {
  src: string | undefined
}

export function Nft({ name, symbol, src }: NftProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1f1f1f]">
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          className={'h-full w-full object-cover'}
          src={src || '/c'}
          alt=""
        />
      </div>
      <p className="truncate whitespace-nowrap px-4 py-3 text-left text-sm text-[#aaa]">
        {name || symbol}
      </p>
    </div>
  )
}

interface ViewControllerProps<T> {
  views: T[]
  onChange(args: number): unknown
}

const ViewController = memo(function ViewController<T>(
  props: ViewControllerProps<T>,
) {
  const numberOfViews = props.views.length
  const [viewIndex, setViewIndex] = useState(0)

  const changeView = useCallback(
    (action: 'back' | 'forward') => () => {
      switch (action) {
        case 'forward':
          setViewIndex((currentView) => {
            const nextView = currentView + 1
            return nextView < numberOfViews ? nextView : currentView
          })
          break
        case 'back':
          setViewIndex((currentView) => {
            const nextView = currentView - 1
            return nextView >= 0 ? nextView : currentView
          })
      }
    },
    [numberOfViews],
  )

  useEffect(() => {
    props.onChange(viewIndex)
  }, [props, viewIndex])

  return (
    <div className={'flex items-center gap-x-2 border-[#aaa] text-[#aaa]'}>
      <button
        disabled={viewIndex === 0}
        className={'rounded-md border border-inherit p-2 disabled:opacity-50'}
        onClick={changeView('back')}
      >
        <BiArrowBack />
      </button>
      <button
        disabled={viewIndex === numberOfViews - 1}
        className={'rounded-md border border-inherit p-2 disabled:opacity-50'}
        onClick={changeView('forward')}
      >
        <div className="-scale-x-100 ">
          <BiArrowBack />
        </div>
      </button>
    </div>
  )
})

{
  /* <div className={'flex flex-col gap-y-8'}>
  <h2 className="text-3xl font-bold">Select your Pal</h2>

  {holdings.isLoading ? (
    <p className="min-w-[576px]"> Loading...</p>
  ) : (
    <div>
      <div className="grid min-w-[576px] grid-cols-4 gap-4">
        {holdings.data &&
          holdings.data &&
          holdings.data.slice(startIndex, endIndex).map((nft, index) => {
            if (!nft) return
            return (
              <button
                key={index}
                className={`rounded-sm border-2 hover:border-[#1cf8ef] ${
                  selectedNft?.address === nft.address
                    ? 'border-[#1cf8ef]'
                    : 'border-slate-500'
                }`}
                onClick={() => {
                  if (selectedNft?.address === nft.address) {
                    setSelectedNft(undefined)
                    return
                  }
                  return setSelectedNft(nft)
                }}
              >
                <h1>{nft.name || nft.symbol}</h1>

                <div className="aspect-square h-32 w-32 overflow-hidden">
                  <img
                    className={'h-full w-full object-cover'}
                    src={nft?.json?.image || '/fallbackImage.jpg'}
                    alt="The downloaded illustration of the provided NFT address."
                  />
                </div>
              </button>
            )
          })}{' '}
      </div>
    </div>
  )}
  {currentView && (
    <div className={'flex items-center justify-center gap-x-8'}>
      <button
        disabled={currentPage === 1}
        className={'disabled:opacity-50'}
        onClick={() => changeCurrentPage('prev')}
      >
        Prev
      </button>
      <button
        disabled={currentPage === totalPages}
        className={'disabled:opacity-50'}
        onClick={() => changeCurrentPage('next')}
      >
        Next
      </button>
    </div>
  )}
</div> */
}
