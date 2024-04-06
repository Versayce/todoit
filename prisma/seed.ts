import { PrismaClient } from "@prisma/client/extension";
import { prisma } from '../src/app/api/prismaClient'
import bcrypt from "bcrypt"

async function seedDatabase() {
    // Delete all users and tasks associated with them
    await prisma.user.deleteMany({});
    console.log('db users deleted')
    // Seed test user
    const password = "1234"
    const hashedPass = await bcrypt.hash(password, 14)
    const user = await prisma.user.create({
        data: {
            username: 'example_user',
            email: 'user@example.com',
            hashedPassword: hashedPass,
            tasks: {
                create: [
                {
                    title: 'Task 1',
                    description: 'Description for Task 1',
                    priority: 1,
                    startDate: new Date(),
                    endDate: new Date(),
                    completionStatus: false
                },
                {
                    title: 'Task 2',
                    description: 'Description for Task 2',
                    priority: 2,
                    startDate: new Date(),
                    endDate: new Date(),
                    completionStatus: false
                }
                ]
            }
        },
        include: {
            tasks: true // Include the tasks in the response
        }
  });


    console.log("added user:", user)
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
