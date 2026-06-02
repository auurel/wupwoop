import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { sendAdminForgotPasswordEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

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

    const token = sign(
      { id: admin.id, email: admin.email, purpose: 'reset-password' },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '30m' }
    );

    const resetUrl = `${request.headers.get('origin') || 'http://localhost:3000'}/admin/reset-password?token=${encodeURIComponent(token)}`;

    await sendAdminForgotPasswordEmail({
      to: admin.email,
      adminName: admin.name,
      resetUrl,
    });

    return NextResponse.json({
      message: 'Email reset password sudah dikirim ke inbox admin.',
      email: admin.email,
      resetUrl,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 });
  }
}