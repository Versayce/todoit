import { prisma } from '../src/app/api/prismaClient'
import bcrypt from "bcrypt"

async function seedDatabase() {
    try {
        // Ensure deletion order respects foreign key constraints
        await prisma.userTask.deleteMany({});
        await prisma.projectTask.deleteMany({});
        await prisma.project.deleteMany({});
        await prisma.user.deleteMany({});
        console.log('Deleted any existing seed data...');

        // Seed test user without tasks and projects
        const password = "testpass";
        const hashedPass = await bcrypt.hash(password, 14);
        const user = await prisma.user.create({
            data: {
                username: 'testUser',
                email: 'user@test.com',
                hashedPassword: hashedPass,
            }
        });

        // Seed user tasks
        await prisma.userTask.createMany({
            data: [
                {
                    title: 'Task 1',
                    description: 'This is the first task created by this user.',
                    priority: 1,
                    completionStatus: false,
                    authorId: user.id
                },
                {
                    title: 'Task 2',
                    description: 'This is the second task created by this user.',
                    priority: 2,
                    completionStatus: false,
                    authorId: user.id
                }
            ]
        });

        // Seed user projects and project tasks
        const project = await prisma.project.create({
            data: {
                title: 'project1',
                description: 'this is project #1',
                authorId: user.id,
                projectTasks: {
                    create: [
                        {
                            title: 'test1',
                            description: 'project task #1',
                            priority: 1,
                            completionStatus: false,
                            authorId: user.id
                        },
                        {
                            title: 'test2',
                            description: 'project task #2',
                            priority: 2,
                            completionStatus: false,
                            authorId: user.id
                        }
                    ]
                }
            },
            include: {
                projectTasks: true
            }
        });

        console.log("Added user and related data successfully.");
    } catch (error) {
        console.error("Failed to seed database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
