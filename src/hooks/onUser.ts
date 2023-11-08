import { Metaplex, Nft, Sft } from '@metaplex-foundation/js'
import { useQuery } from '@tanstack/react-query'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { isNotNullable } from '@/utils'

const connection = new Connection(
  'https://rpc.hellomoon.io/a6748921-a8a4-47fc-8f49-d48f2d988c43',
)
const mx = Metaplex.make(connection)

export function useHoldings(publicKey: string | undefined) {
  const fetchNFTs = async (publicKey = '') => {
    try {
      const list = await mx
        .nfts()
        .findAllByOwner({ owner: new PublicKey(publicKey || '') })
      const promises = list.map((metadata) => {
        if ('mintAddress' in metadata) {
          return mx.nfts().load({ metadata })
        } else {
          return Promise.resolve(metadata)
        }
      })

      // Using Promise.allSettled instead of Promise.all
      return Promise.allSettled(promises).then((results) => {
        return results
          .map((result) => {
            if (result.status === 'fulfilled') {
              return result.value
            }
          })
          .filter(isNotNullable)
      })
    } catch (e) {
      console.error(e)
    }
  }

  return useQuery(['holdings'], async () => await fetchNFTs(publicKey), {
    enabled: !!publicKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, //  5 minutes
  })
}
