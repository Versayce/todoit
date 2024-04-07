import { getServerSession } from "next-auth";
import { prisma } from "../prismaClient";
import bcrypt from 'bcrypt'
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized, please sign in.', { status: 401 })
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        tasks: true,
        projects: {
          select: {
            title: true,
            description: true,
            completionStatus:true,
            projectTasks: {
              select: {
                title: true,
                description: true,
                priority: true,
                completionStatus: true
              }
            }
          }
        }
      },
    });

    return new Response(JSON.stringify({ allUsers }), { status: 200 });
  } catch(error) {

    return new Response(`${ error }`, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized, please sign in.', { status: 401 })
  try {
    const data = await req.json();
    const { email, username, id } = data;

    if (!email || !id) return new Response('No data provided for one or more fields.', { status: 400 })

    const thisUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { id: id }
        ]
      }
    })

    if (!thisUser) return new Response('User not found.', { status: 404 })

    return new Response(JSON.stringify({ thisUser }), { status: 200 });
  } catch (error) {

    return new Response(`${ error }`, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized, please sign in.', { status: 401 })
  try {
    const data = await req.json();
    const { email, password } = data;

    if (!email || !password) return new Response('The required credentials have not been given', { status: 500 })
    
    const existingUser = await prisma.user.findUnique({ where: { email: email } })

    if (existingUser?.hashedPassword) {
      const passwordMatch = await bcrypt.compare(password, existingUser.hashedPassword)
      if (passwordMatch) {
        const deletedUser = await prisma.user.delete({ where: { email: existingUser?.email }, select: { id: true, email: true } });
        
        return new Response(`User: ${ JSON.stringify(deletedUser) } deleted.`, { status: 200 });
      }
    }

    return new Response('Given user not found in database.', { status: 400 })
  } catch(error) {

    return new Response(`${ error }`, { status: 500 })
  }
}
