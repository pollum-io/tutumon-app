import { Metaplex, Nft, Sft } from '@metaplex-foundation/js'
import { useQuery } from '@tanstack/react-query'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { isNotNullable } from '@/utils'
import axios from 'axios'

export function useHoldings(publicKey: string | undefined) {
  const fetchNFTs = async (publicKey = '') => {
    try {
      const endpoint = 'https://graph.mintbase.xyz/mainnet'
      const apiKey = 'anon'
      // const name = 'thomgabriel.near';
      const name = 'kaue.near'
      // const name = 'astark.near';
  
      const query = `query MyQuery {
          mb_views_nft_tokens(
            limit: 30
            where: {owner: {_eq: "${name}"}, _and: {burned_timestamp: {_is_null: true}, last_transfer_timestamp: {_is_null: false}}}
          ) {
            nft_contract_id
            title
            description
            media
            base_uri
            reference
          }
        }`
  
      const response = await axios.post(
        endpoint,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'mb-api-key': apiKey,
          },
        },
      )
  
      const data = response.data.data.mb_views_nft_tokens
  
      let valid_nfts: any[] = [];
  
      data.forEach(
        (
          token: {
            media: string | string[]
            base_uri: string
            url: string | string[]
          },
          idx: string | number,
        ) => {
          if (token.media.length !== 0 && !token.media.includes('https://')) {
            data[idx].media = token.base_uri + '/' + token.media
          }
  
          if (
            token.media.includes('https://')
          ) {
            valid_nfts.push({
              title: data[idx].title,
              description: data[idx].description,
              image_link: data[idx].media
            });
          }
        },
      )
  
      // console.log('data', valid_nfts);
  
      return data
      } catch (error) {
      console.error('Error:', error)
    }
  }

  return useQuery(['holdings'], async () => await fetchNFTs(publicKey), {
    enabled: !!publicKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, //  5 minutes
  })
}
