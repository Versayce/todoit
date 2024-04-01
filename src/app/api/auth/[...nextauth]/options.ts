import NextAuth, { SessionStrategy } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from "../../prismaClient";

const prismaAdapter = PrismaAdapter(prisma)

export const authOptions = {
    adapter: prismaAdapter,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "email", type: "text", placeholder: "" },
                password: {  label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await prisma.user.findUnique({where: {email: credentials?.username}})
                if (!user) {
                    return null;
                }
                const { email, hashedPassword } = user;
                return null
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
    ],
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development"
}
