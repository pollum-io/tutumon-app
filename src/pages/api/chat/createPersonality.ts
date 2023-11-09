// Seu arquivo de índice atual

import { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'
import { ApiError } from 'next/dist/server/api-utils'
import {
  createPersonality,
  getOpenAiResponse,
  getTrainedAiResponse,
} from './response'
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

    if (req.method === 'POST') {
      const response = await createPersonality(req.body)

      const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

      // Crie o cookie
      const serializedCookie = cookie.serialize('persona', response, {
        httpOnly: true,
        maxAge: ONE_YEAR, // maxAge é definido em segundos
        path: '/',
        sameSite: 'strict', // Esta opção reforça a segurança do cookie
      })

      // Setar o cabeçalho 'Set-Cookie' com o cookie serializado
      res.setHeader('Set-Cookie', serializedCookie)

      return res.status(200).json(response)
    }

    return res.status(405).json({ message: 'Method Not Allowed' })
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({ message: e.message })
    }
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
  }
}
