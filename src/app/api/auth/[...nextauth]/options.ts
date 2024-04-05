import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../prismaClient';
import bcrypt from 'bcrypt'

const prismaAdapter = PrismaAdapter(prisma)

export const authOptions: NextAuthOptions = {
    adapter: prismaAdapter,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text', placeholder: 'email' },
                password: { label: 'password', type: 'password', placeholder: 'password' },
            },
            async authorize(credentials) {
                // //TODO testing: 
                // const userTest = { id: '1', name: 'testname', email: credentials?.email }
                // return userTest;

                //TODO finish password checking logic 
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({ where: { email: credentials?.email, } });
                if (!user || !user.hashedPassword) return null;
                
                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)
                if (!passwordMatch) return null;

                return user
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
    ],
    callbacks: {
        session({ session, token }) {
            session.user.id = token.userId;
            console.log("session: ", session)
            return session;
        },
        jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.userId = user.id;
            }
            console.log("token", token)
            return token;
        }
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
}
