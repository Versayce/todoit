import type { NextAuthOptions } from 'next-auth'
import { CredentialsProvider } from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import { prisma } from "../../prismaClient.js";
import PrismaAdapter from '@auth/prisma-adapter'

export const oprtions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Github({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_ID as string
        }),
    ],

}
