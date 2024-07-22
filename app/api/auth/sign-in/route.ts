import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && user.password === password) {
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
