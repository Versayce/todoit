import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../prismaClient';

const prismaAdapter = PrismaAdapter(prisma)
const bcrypt = require('bcrypt')

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
                //TODO finish password checking logic 
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

                //TODO testing: 
                const hashedPass = await bcrypt.hash(credentials?.password, 14);
                const user = { id: '1', name: 'Alextest', email: credentials?.email }
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
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
}
