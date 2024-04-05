import { PrismaClient } from "@prisma/client/extension";
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function seedDatabase() {
    const password = "1234"
    const hashedPass = bcrypt.hash(password, 14)
    const user1 = await prisma.user.upsert({
        where: { email: 'user1@test.io' },
        update: {},
        create: {
            email: 'user1@test.io',
            username: 'user1',
            hashedPassword: hashedPass, 
            tasks: {
                create: [
                    {
                        title: "task1",
                        description: "task 1 description",
                        priority: 1
                    },
                    {
                        title: "task2",
                        description: "task 2 description",
                        priority: 3
                    }
                ],
            }
        }
    })

    console.log("added user:", user1)
}

seedDatabase()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
