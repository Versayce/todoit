import { prisma } from '../src/app/api/prismaClient'
import bcrypt from "bcrypt"

async function seedDatabase() {
    try {
        // Delete all existing data
        await prisma.userTask.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.project.deleteMany({});
        await prisma.projectTask.deleteMany({});

        // Seed test user
        const password = "1234";
        const hashedPass = await bcrypt.hash(password, 14);
        const user = await prisma.user.create({
            data: {
                username: 'example_user',
                email: 'user@example.com',
                hashedPassword: hashedPass,
                tasks: {
                    create: [
                        {
                            title: 'Task 1',
                            description: 'This is the first task created by this user.',
                            priority: 1,
                            startDate: new Date(),
                            endDate: new Date(),
                            completionStatus: false
                        },
                        {
                            title: 'Task 2',
                            description: 'This is the second task created by this user.',
                            priority: 2,
                            startDate: new Date(),
                            endDate: new Date(),
                            completionStatus: false
                        }
                    ]
                },
                projects: {
                    create: [
                        {
                            title: 'project1',
                            description: 'this is project #1',
                            projectTask: {
                                create: [
                                    {
                                        title: "project1 task #1",
                                        description: "project1 task"
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            include: {
                tasks: true // Include the tasks in the response
            }
        });

        console.log("added user:", user);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
