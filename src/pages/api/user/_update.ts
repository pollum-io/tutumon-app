import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { findUserHandler } from './find/_[publickey]'

export const updateUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { publickey } = req.query
  const userData = req.body

  const user = await findUserHandler(req, res)

  if (!publickey) {
    return res.status(400).json({ message: 'Public key is required' })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: String(user?.id),
      },
      data: {
        ...userData,
        updatedDate: new Date(),
      },
    })

    return res.status(200).json(updatedUser)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred while updating the user', error })
  }
}
