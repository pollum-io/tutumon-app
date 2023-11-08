// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto'
import { serialize } from 'cookie'

import { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  nonce: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {

  if (req.method === 'GET') {
    const nonce = crypto.randomBytes(16).toString('base64')

    res.setHeader(
      'Set-Cookie',
      serialize('auth-nonce', nonce, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        path: '/',
      }),
    )

    return res.status(200).json({ nonce })
  }

  res.status(405)
}
