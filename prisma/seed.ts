import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient()

async function seedDatabase() {
    const testUser = await prisma.user.
}
