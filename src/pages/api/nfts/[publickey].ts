//WIP

import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    //Get all NFTs from public key
    await getAllFromPublicKey(req, res)
  } else {
    return res.status(405).json({ message: 'Method Not allowed' })
  }
}

export async function getAllFromPublicKey(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { publickey } = req.query
  const customRpcUrl =
    'https://rpc.hellomoon.io/a6748921-a8a4-47fc-8f49-d48f2d988c43' // Replace with your custom RPC URL
  const connection = new Connection(customRpcUrl, 'confirmed') // Use custom RPC URL here
  const keypair = Keypair.generate()

  const metaplex = new Metaplex(connection)
  metaplex.use(keypairIdentity(keypair))

  const owner = new PublicKey(publickey as string)
  const allNFTs = await metaplex.nfts().findAllByOwner({ owner })


}
