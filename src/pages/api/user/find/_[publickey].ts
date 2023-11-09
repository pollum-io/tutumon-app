import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma' // Import the Prisma Client from your library
import { ApiError } from 'next/dist/server/api-utils'

export async function findUserHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { publickey } = req.query // Assuming the publicKey comes in the request body

  if (!publickey) {
    throw new ApiError(400, 'Invalid public key')
  }

  try {
    // Find the wallet using the publicKey
    const wallet = await prisma.wallet.findUnique({
      where: {
        publicKey: publickey as string,
      },
    })

    if (!wallet) {
      throw new ApiError(404, 'Wallet not found')
    }

    // Find the user associated with the wallet
    const user = await prisma.user.findUnique({
      where: {
        id: wallet.userId,
      },
    })

    console.log('user', user)

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    return user
  } catch (e) {
    throw e
  }
}
