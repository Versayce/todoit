import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '../prismaClient';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json('Unauthorized, please sign in.', { status: 401 });
	try {
		const data = await req.json();
		const { id } = data;

		if (!id)
			return Response.json('Required data missing.', { status: 400 });

		const userProjects = await prisma.project.findMany({
			where: { authorId: id },
			select: {
				id: true,
				title: true,
				description: true,
				completionStatus: true,
				projectTasks: {
					select: {
						id: true,
						title: true,
						description: true,
						priority: true,
						completionStatus: true,
					},
				},
			},
		});

		if (!userProjects)
			return Response.json('Projects not found.', { status: 404 });

		return Response.json(userProjects, { status: 200 });
	} catch (error) {
		return Response.json(`${error}`, { status: 500 });
	}
}
