import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import { sendAdminForgotPasswordEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

function generateOtp() {
  return String(randomInt(100000, 1000000));
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email harus diisi' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 404 });
    }

    const otp = generateOtp();
    const resetOtpHash = await bcrypt.hash(otp, 10);
    const resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetOtpHash,
        resetOtpExpiresAt,
      },
    });

    await sendAdminForgotPasswordEmail({
      to: admin.email,
      adminName: admin.name,
      otp,
    });

    return NextResponse.json({
      message: 'Kode OTP reset password sudah dikirim ke inbox admin.',
      email: admin.email,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 });
  }
}