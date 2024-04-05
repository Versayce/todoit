import { PrismaClient } from "@prisma/client/extension";
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function seedDatabase() {
    const password = "1234"
    const hashedPass = bcrypt.hash(password, 14)
    const testUser = await prisma.user.upsert({
        where: { email: 'user1@test.io' },
        update: {},
        create: {
            email: 'user1@test.io',
            username: 'user1',
            hashedPassword: hashedPass, 
            tasks: {
                create: {
                    
                }
            }
        }
    })
}
