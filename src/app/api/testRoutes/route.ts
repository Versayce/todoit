import { prisma } from "./prismaClient.js";

async function main() {
  const user = await prisma.user.create({
      data: {
        email: 'test@test.io',
        firstName: 'Test',
        lastName: 'User',
      },
  })

  const allUsers = await prisma.user.findMany();
  console.log(allUsers);

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1);
  })
