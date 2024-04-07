import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "../prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json("Unauthorized, please sign in.", { status: 401 });
  try {
    const data = await req.json();
    const { id } = data;

    if (!id) return NextResponse.json("Required data missing.", { status: 400 });

    const userProjects = await prisma.project.findMany({
      where: { authorId: id },
      select: {
        title: true,
        description: true,
        completionStatus: true,
        projectTasks: {
            select: {
                title: true,
                description: true,
                priority: true,
                completionStatus: true
            }
        }
      }
    });

    if (!userProjects) return NextResponse.json("Projects not found.", { status: 404 });

    return NextResponse.json(({ userProjects }), { status: 200 });
  } catch (error) {
    return NextResponse.json(`${error}`, { status: 500 });
  }
}
