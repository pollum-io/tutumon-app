import { SHA256 as sha256 } from 'crypto-js'
// We impot our prisma client
import { prisma } from '@/lib/prisma'
// Prisma will help handle and catch errors
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    await createUserHandler(req.body)
  } else {
    return res.status(405).json({ message: 'Method Not allowed' })
  }
}

export async function createUserHandler(nfts: any[]) {
  if (!nfts.length) {
    throw new Error('No nfts found')
  }
  try {
    const newNfts = await prisma.user.create({
        
      data: nfts,
    })
    return newNfts
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (e.code === 'P2002') {
    //     return res.status(400).json({ message: e.message, code: e.code })
    //   }
    //   return res.status(400).json({ message: e.message })
    // }
  }
}
