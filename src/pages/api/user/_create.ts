import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Import the Prisma Client from your library



export async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ message: 'Invalid wallet public key' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        wallets: {
          create: {
            publicKey: publicKey,
          
          },
        },
        // Add other fields as needed
      },
    });
    return user;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: e.message, code: e.code });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
