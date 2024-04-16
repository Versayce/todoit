import { prisma } from '../prismaClient';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
	try {
		const data = await req.json();
		const { name, email, password } = data;

		if (!name || !email || !password) {
			return new Response('Missing name, email, or password', {
				status: 400,
			});
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!existingUser) {
			const hashedPass = await bcrypt.hash(password, 14);
			const newUser = await prisma.user.create({
				data: {
					name: name,
					email: email,
					hashedPassword: hashedPass,
				},
			});
			return new Response(
				`User account under email: ${email} registered successfully}`,
				{ status: 200 }
			);
		}

		return new Response('A user already exists with these credentials', {
			status: 400,
		});
	} catch (error) {
		return new Response(`${error}`, { status: 500 });
	}
}
