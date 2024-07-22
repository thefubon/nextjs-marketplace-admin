import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  const user = await prisma.user.create({
    data: { email, password, name },
  });

  return NextResponse.json(user);
}
