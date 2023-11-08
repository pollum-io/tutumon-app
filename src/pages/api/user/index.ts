// Seu arquivo de índice atual
import { NextApiRequest, NextApiResponse } from 'next'
import { createUserHandler } from './_create'
import { findUserHandler } from './find/_[publickey]'
import { updateUserHandler } from './_update' // Importe o novo manipulador aqui
import { prisma } from '@/lib/prisma'
import { ApiError } from 'next/dist/server/api-utils'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { publickey } = req.query

    if (req.method === 'GET' && publickey) {
      req.query.publickey = publickey
      const user = await findUserHandler(req, res)
      return res.status(200).json(user)
    }

    if (req.method === 'POST') {
      const user = await createUserHandler(req, res)
      return res.status(200).json(user)
    }

    if (req.method === 'PUT' && publickey) {
      req.query.publickey = publickey
      const user = await updateUserHandler(req, res)
      return res.status(200).json(user)
    }

    return res.status(405).json({ message: 'Method Not Allowed' })
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({ message: e.message })
    }
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    await prisma.$disconnect()
  }
}
