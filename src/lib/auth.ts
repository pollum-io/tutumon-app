import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { PrismaAdapter } from '@auth/prisma-adapter'
import axios, { AxiosError } from 'axios'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 12 * 30 * 24 * 60 * 60, // 1 year
  },

  providers: [
    CredentialsProvider({
      name: 'Wallet',
      credentials: {
        publicKey: { label: 'Public Key', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        nonce: { label: 'Nonce', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('user can not be authenticated')
        const message = `Sign this message for authenticating with your wallet. Nonce: ${credentials.nonce}`
        const messageBytes = new TextEncoder().encode(message)

        const publicKeyBytes = bs58.decode(credentials.publicKey)

        const signatureBytes = bs58.decode(credentials.signature)

        const result = nacl.sign.detached.verify(
          messageBytes,
          signatureBytes,
          publicKeyBytes,
        )

        if (!result) {
          throw new Error('user can not be authenticated')
        }

        try {
          const response = await axios.get(
            process.env.NODE_ENV === 'production'
              ? `https://www.solpal.org/api/user?publickey=${credentials.publicKey}`
              : `http://localhost:3000/api/user?publickey=${credentials.publicKey}`,
          )

          if (response.status == 200 && response.data) {
            const dbUser = response.data

            return { ...dbUser, name: credentials.publicKey }
          }

          throw new Error('user can not be authenticated')
        } catch (e: unknown) {
          if (e instanceof AxiosError) {
            if (e.response?.status === 404) {
              const res = await axios.post(
                process.env.NODE_ENV === 'production'
                  ? `https://www.solpal.org/api/user`
                  : `http://localhost:3000/api/user`,
                {
                  publicKey: credentials.publicKey,
                },
              )

              const newUser = await res.data

              return { ...newUser, name: credentials.publicKey }
            }
          }
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      try {
        const response = await axios.get(
          process.env.NODE_ENV === 'production'
            ? `https://www.solpal.org/api/user?publickey=${token.name}`
            : `http://localhost:3000/api/user?publickey=${token.name}`,
        )

        const dbUser = await response.data

        if (user) {
          token.user = { ...user, dbUser }
        }
      } catch (e) {
        // console.log('e', e);
        return token
      } finally {
        return token
      }
    },
    async session({ session, user, token }) {
      if (token.user) {
        session.user = { ...token.user, ...session.user }
      }
      return session
    },
  },

  pages: {
    signIn: '/signin',
  },
}
