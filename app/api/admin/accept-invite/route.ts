import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { hashPassword } from '@/lib/auth';
import { syncSupabaseAdminUser } from '@/lib/supabase-auth';

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token dan password harus diisi' }, { status: 400 });
    }

    const invite = await prisma.adminInvite.findFirst({
      where: {
        tokenHash: hashToken(token),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: 'Undangan tidak valid atau sudah kedaluwarsa' }, { status: 400 });
    }

    const admin = await prisma.admin.create({
      data: {
        email: invite.email,
        name: invite.name,
        role: invite.role,
        password: await hashPassword(password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    await syncSupabaseAdminUser({
      email: admin.email,
      name: admin.name,
      password,
      createIfMissing: true,
    });

    await prisma.adminInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({ message: 'Akun admin berhasil diaktifkan', admin });
  } catch (error) {
    console.error('Error accepting admin invite:', error);
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 });
  }
}