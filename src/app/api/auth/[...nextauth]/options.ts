import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
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
				if (!passwordMatch) throw new Error('Invalid credentials');

				return {
					id: user.id,
					name: user.name,
					email: user.email,
				};
			},
		}),
		GitHub({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		Google({
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	pages: {
		signIn: '/signin',
	},
	callbacks: {
		session({ session, token }) {
			session.user.id = token.userId;
			session.user.hashedPassword = token.hashedPassword;
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
				},
			};
		},
		jwt({ token, user }) {
			if (user) {
				const u = user as User;
				return {
					...token,
					id: u.id,
					email: u.email,
					name: u.name,
					hashedPassword: u.hashedPassword,
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
