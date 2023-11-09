import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
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
      credentials: {
        publicKey: { label: 'Public Key', type: 'text' },
        accountId: { label: 'Account', type: 'text' },
        signature: { label: 'Signature', type: 'boolean' },
      },
      async authorize(credentials) {
        if (!credentials?.signature) {
          throw new Error('user can not be authenticated')
        }

        try {
          console.log('aquiaaa')

          const response = await axios.get(
            process.env.NODE_ENV === 'production'
              ? `https://tutu-monster.vercel.app/api/user?publickey=${credentials?.publicKey}`
              : `http://localhost:3000/api/user?publickey=${credentials?.publicKey}`,
          )

          if (response.status == 200 && response.data) {
            const dbUser = response.data

            return { ...dbUser, name: credentials?.accountId }
          }

          throw new Error('user can not be authenticated')
        } catch (e: unknown) {
          console.log('aqui falhou')

          if (e instanceof AxiosError) {
            if (e.response?.status === 404) {
              const res = await axios.post(
                process.env.NODE_ENV === 'production'
                  ? `https://tutu-monster.vercel.app/api/user`
                  : `http://localhost:3000/api/user`,
                {
                  publicKey: credentials?.publicKey,
                  accountId: credentials?.accountId,
                },
              )

              const newUser = await res.data

              return { ...newUser, name: credentials?.accountId }
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
            ? `https://tutu-monster.vercel.app/api/user?publickey=${token.name}`
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
