import { prisma } from '../prismaClient'
import { NextApiResponse, NextApiRequest } from 'next'

const bcrypt = require('bcrypt')

export default async function register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ success: false, message: 'Missing username, email, or password' });
            }
            //TODO add user creation logic 
            //check if user exists
            const existingUser = await prisma.user.findUnique({where: {email: email}})
            //If user does not exist, create a new user and add to db
            if (!existingUser) {
                const hashedPass = await bcrypt.hash(password, 14)
                const newUser = await prisma.user.create({
                    data: {
                        email: email,
                        hashedPassword: hashedPass
                    }
                })
                //returning success message on successful user creation
                return res.status(200).json({ user: newUser, success: true, message: `User account under email:${email} registered successfully` })
            }
            //returning failure message when user credentials are already found in db
            return res.status(500).json({ success: false, message: 'A user already exists with these credentials'})
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Registration Failed', error: error })
        } 
    } else {
        return res.status(405).json({ success: false, message: 'Request method not allowed' })
    }
}
