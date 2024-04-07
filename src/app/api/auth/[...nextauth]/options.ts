import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../prismaClient';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

const prismaAdapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
	adapter: prismaAdapter,
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text', placeholder: 'email' },
				password: { label: 'password', type: 'password', placeholder: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials?.email },
				});
				if (!user || !user.hashedPassword) return null;

				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				);
				if (!passwordMatch) return null;

				return {
					id: user.id,
					username: user.username,
					email: user.email,
				};
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
	],
	callbacks: {
		session({ session, token }) {
			console.log('Session Callback: ', { session, token });
			session.user.id = token.userId;
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
				},
			};
		},
		jwt({ token, user }) {
			console.log('JWT Callback: ', { token, user });
			if (user) {
				const u = user as User;
				return {
					...token,
					id: u.id,
					email: u.email,
					name: u.username,
				};
			}
			return token;
		},
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
};
