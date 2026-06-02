import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

type ResetOtpPayload = {
  email: string;
  otp: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { email, otp, password } = (await request.json()) as ResetOtpPayload;

    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'Email, OTP, dan password harus diisi' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ error: 'Akun admin tidak ditemukan' }, { status: 404 });
    }

    if (!admin.resetOtpHash || !admin.resetOtpExpiresAt) {
      return NextResponse.json({ error: 'OTP reset belum diminta' }, { status: 400 });
    }

    if (admin.resetOtpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP sudah kedaluwarsa' }, { status: 400 });
    }

    const isOtpValid = await bcrypt.compare(otp, admin.resetOtpHash);

    if (!isOtpValid) {
      return NextResponse.json({ error: 'OTP tidak valid' }, { status: 400 });
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: await hashPassword(password),
        resetOtpHash: null,
        resetOtpExpiresAt: null,
      },
    });

    return NextResponse.json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Gagal mereset password' }, { status: 400 });
  }
}