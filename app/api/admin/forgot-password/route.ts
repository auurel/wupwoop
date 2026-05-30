import { prisma } from '@/lib/prisma';
import { isEmailConfigured, sendResetPasswordEmail } from '@/lib/mailer';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email harus diisi' }, { status: 400 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: 'Layanan email belum dikonfigurasi. Hubungi pengelola sistem.' },
        { status: 500 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });

    if (!admin) {
      return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 404 });
    }

    const token = sign(
      { id: admin.id, email: admin.email, purpose: 'reset-password' },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '30m' }
    );

    const resetUrl = `${request.headers.get('origin') || 'http://localhost:3000'}/admin/reset-password?token=${encodeURIComponent(token)}`;
    await sendResetPasswordEmail(admin.email, resetUrl);

    return NextResponse.json({
      message: 'Link reset password berhasil dikirim. Silakan cek inbox atau folder spam email Anda.',
      email: admin.email,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Gagal mengirim email reset password' }, { status: 500 });
  }
}