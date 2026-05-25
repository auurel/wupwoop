import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { hashPassword } from '@/lib/auth';

type ResetTokenPayload = {
  id: string;
  email: string;
  purpose?: string;
};

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token dan password harus diisi' }, { status: 400 });
    }

    const payload = verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key') as ResetTokenPayload;

    if (!payload || payload.purpose !== 'reset-password') {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { id: payload.id } });

    if (!admin || admin.email !== payload.email) {
      return NextResponse.json({ error: 'Akun admin tidak ditemukan' }, { status: 404 });
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: await hashPassword(password) },
    });

    return NextResponse.json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Token tidak valid atau sudah kedaluwarsa' }, { status: 400 });
  }
}