import { prisma } from '../prismaClient'
import { NextApiResponse, NextApiRequest } from 'next'
import bcrypt from 'bcrypt'

export default async function register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ success: false, message: 'Missing username, email, or password' });
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

                return res.status(200).json({ user: newUser, success: true, message: `User account under email: ${ email } registered successfully` })
            }

            return res.status(500).json({ success: false, message: 'A user already exists with these credentials'})
        } catch (error) {
            
            return res.status(500).json({ success: false, message: 'Registration Failed', error: error })
        } 
    } else {
        return res.status(405).json({ success: false, message: 'Request method not allowed' })
    }
}
