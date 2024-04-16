import { prisma } from '../src/app/api/prismaClient';
import bcrypt from 'bcrypt';

async function seedDatabase(): Promise<void> {
	try {
		// Ensure deletion order respects foreign key constraints
		console.log('Deleting existing seed data...');
		await prisma.userTask.deleteMany({});
		await prisma.projectTask.deleteMany({});
		await prisma.project.deleteMany({});
		await prisma.user.deleteMany({});

		// Seed test user without tasks and projects
		console.log('Seeding user...');
		const password = 'testpass';
		const hashedPass = await bcrypt.hash(password, 14);
		const user = await prisma.user.create({
			data: {
				name: 'testUser',
				email: 'user@test.com',
				hashedPassword: hashedPass,
			},
		});
		console.log('User seeding complete.');

		// Seed user tasks
		console.log('Seeding user tasks...');
		await prisma.userTask.createMany({
			data: [
				{
					title: 'Task 1',
					description: `This is the first task created by user: ${user.name}.`,
					priority: 1,
					completionStatus: false,
					authorId: user.id,
				},
				{
					title: 'Task 2',
					description: `This is the first task created by user: ${user.name}.`,
					priority: 2,
					completionStatus: false,
					authorId: user.id,
				},
			],
		});
		console.log('User task seeding complete.');

		// Seed user projects and project tasks
		console.log('Seeding project and projectTasks...');
		const project = await prisma.project.create({
			data: {
				title: 'project1',
				description: 'this is project #1',
				authorId: user.id,
				projectTasks: {
					create: [
						{
							title: 'Task 1',
							description: 'task for project 1',
							priority: 1,
							completionStatus: false,
							authorId: user.id,
						},
						{
							title: 'Task 2',
							description: 'task for project 1',
							priority: 2,
							completionStatus: false,
							authorId: user.id,
						},
					],
				},
			},
			include: {
				projectTasks: true,
			},
		});

		const project2 = await prisma.project.create({
			data: {
				title: 'project2',
				description: 'this is project #2',
				authorId: user.id,
				projectTasks: {
					create: [
						{
							title: 'Task 1',
							description: 'task for project 2',
							priority: 1,
							completionStatus: false,
							authorId: user.id,
						},
						{
							title: 'Task 2',
							description: 'task for project 2',
							priority: 2,
							completionStatus: false,
							authorId: user.id,
						},
					],
				},
			},
			include: {
				projectTasks: true,
			},
		});

		console.log('***SEEDING COMPLETED***');
	} catch (error) {
		console.error('SEEDING FAILED:', error);
	} finally {
		await prisma.$disconnect();
	}
}

seedDatabase();
