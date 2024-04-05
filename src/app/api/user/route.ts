import { prisma } from "../prismaClient";
import bcrypt from 'bcrypt'

export async function GET() {
  try {
    const allUsers = await prisma.user.findMany();
    
    return new Response(JSON.stringify({ allUsers }), { status: 200 });
  } catch(error) {

    return new Response(`${error}`, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, username } = data;
    console.log('req data: ', data);

    if (!email || !username) return new Response('No data provided for one or more fields', { status: 400 })

    const thisUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username } 
        ]
      }
    })

    if (!thisUser) return new Response('User not found', { status: 404 })

    return new Response(JSON.stringify({ thisUser }), { status: 200 });
  } catch (error) {

    return new Response(`${ error }`, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const { email, username, password } = data;
    
    const thisUser = await prisma.user.findFirst({ where: { email: email } })
    if (thisUser) {
      const deletedUser = await prisma.user.delete({where: {email: thisUser?.email}});
      return new Response(`User: ${deletedUser.email} deleted`, { status: 200 });
    }

    return new Response('Given user not found in database', { status: 400 })
  } catch(error) {

    return new Response(`${ error }`, { status: 500 })
  }
}
