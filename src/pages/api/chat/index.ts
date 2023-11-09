// Seu arquivo de índice atual

import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { getOpenAiResponse, getTrainedAiResponse } from './response'
import NextCors from 'nextjs-cors'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await NextCors(req, res, {
      // Options
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
    // if (req.method === 'GET') {
    //   return res.status(200).json(?)
    // }

    if (req.method === 'POST') {
      // const response = await getOpenAiResponse(req.body)
      const response = await getTrainedAiResponse(req.body)

      return res.status(200).json(response)
    }

    // if (req.method === 'PUT') {

    //   return res.status(200).json(?)
    // }
    return res.status(405).json({ message: 'Method Not Allowed' })
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({ message: e.message })
    }
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
  }
}
