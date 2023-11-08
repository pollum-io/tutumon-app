import { NextApiRequest, NextApiResponse } from 'next'

import { getAllFromPublicKey } from './[publickey]'

export { getAllFromPublicKey } from './[publickey]'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // find user
    return await getAllFromPublicKey(req, res)
  }

  if (req.method === 'POST') {
    // create user NFTs
    // return await createUserNftsHandler(req, res)
  }

  return res.status(405).json({ message: 'Method Not allowed' })
}
