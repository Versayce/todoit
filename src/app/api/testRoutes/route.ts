import { prisma } from "../client";

async function testing() {
  const user = await prisma.user.create({
      data: {
        email: 'elsa@prisma.io',
        firstName: 'Test',
        lastName: 'User',
      },
  })
}

testing();
