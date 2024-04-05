import { prisma } from "../prismaClient";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, username } = data;
    console.log('req data: ', data);

    if (!email || !username) return new Response('No data provided for one or more fields', { status: 400 })

    const thisUser = await prisma.user.findFirst({where: {email: email}})
    const allUsers = await prisma.user.findMany();

    return new Response(JSON.stringify({ thisUser }), { status: 200 });
  } catch (error) {
    return new Response(`${ error }`, { status: 500 })
  }
}


export async function DELETE(req: Request) {
  try {

  } catch(error) {
    return new Response(`${ error }`, { status: 500 })
  }
}
