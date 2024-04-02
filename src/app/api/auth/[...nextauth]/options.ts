import { NextAuthOptions, SessionStrategy } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from "../../prismaClient";

const bcrypt = require('bcrypt')
const prismaAdapter = PrismaAdapter(prisma)

export const authOptions: NextAuthOptions = {
    adapter: prismaAdapter,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "email", type: "text", placeholder: "Username" },
                password: {  label: "password", type: "password" },
            },
            async authorize(credentials) {
                // if (!credentials?.username || !credentials?.password) return null;

                // const user = await prisma.user.findUnique({
                //     where: {
                //         email: credentials?.username,
                //     }
                // });

                // if (!user) return null;
                
                // const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)
                // if (!passwordMatch) return null;

                // return user

                //TODO test below 
                const user = { id: '1', name: 'Alex', email: 'test@test.com'}
                return user;
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
    ],
    callbacks: {
        session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
        jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = user.id;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development"
}
