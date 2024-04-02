import { prisma } from '../prismaClient'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextResponse, NextRequest } from 'next/server'

const prismaAdapter = PrismaAdapter(prisma)

export async function POST(request: NextRequest) {
    const body = await request.json();
}
