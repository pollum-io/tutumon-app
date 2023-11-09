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
        const endpoint = 'https://graph.mintbase.xyz/mainnet';
        const apiKey = 'anon';
        // const name = 'thomgabriel.near';
        // const name = 'kaue.near';
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
        }`;
    
        const response = await axios.post(
          endpoint,
          { query },
          {
            headers: {
              'Content-Type': 'application/json',
              'mb-api-key': apiKey,
            },
          }
        );
    
        const data = response.data.data.mb_views_nft_tokens;
    
        let invalid_nfts = [];
    
        data.forEach((token, idx) => {
          if (token.media.length !== 0 && !token.media.includes('https://')) {
            data[idx].url = token.base_uri + "/" + token.media;
          } 
    
          if (!token.media.includes('https://') && !token.url.includes('https://')) {
            invalid_nfts.push(idx);
          }
          // console.log(data[idx]?.url, data[idx]?.media)
        });
    
        // we can update this to pass a bool value if has valid img or not
        for (let index = 0; index < invalid_nfts.length; index++) {
          // console.log(data[index].url, data[index].media)
          data.splice(invalid_nfts[index], 1);
        }
        // console.log('data', data);

        return data;
    
      } catch (error) {
        console.error('Error:', error);
      }
  }

  return useQuery(['holdings'], async () => await fetchNFTs(publicKey), {
    enabled: !!publicKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, //  5 minutes
  })
}
