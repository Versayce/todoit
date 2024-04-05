import { prisma } from '../prismaClient'
import { NextResponse, NextRequest } from 'next/server';
import { NextApiResponse, NextApiRequest } from 'next';
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { username, email, password } = data;

        if (!username || !email || !password) {
            return new NextResponse(
                'Missing username, email, or password', 
                {
                    status: 400,
                },
            )  
        }

        const existingUser = await prisma.user.findUnique({ where: { email: email } })

        if (!existingUser) {
            const hashedPass = await bcrypt.hash(password, 14)
            const newUser = await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    hashedPassword: hashedPass
                }
            })
            return new NextResponse(
                `User account under email: ${ email } registered successfully}`,
                {
                    status: 200
                }
            )
            // res.status(200).json({ user: newUser, success: true, message: `User account under email: ${ email } registered successfully` })
        }
        return new NextResponse(
            'A user already exists with these credentials',
            {
                status: 500,
            }
        )
    } catch (error) {
        return new NextResponse(
            `${error}`,
            {
                status: 500,
            },
        )
    } 
}
