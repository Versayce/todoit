import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from "../../prismaClient";
import { NextApiRequest } from 'next';

const prismaAdapter = PrismaAdapter(prisma)

export const authOptions = NextAuth({
    adapter: prismaAdapter,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "email", type: "text", placeholder: "" },
                password: {  label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                return null
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development"
})
