import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

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
    const mailto = `mailto:${encodeURIComponent(admin.email)}?subject=${encodeURIComponent('Reset Password Admin Muzayyan')}&body=${encodeURIComponent(`Kami menemukan permintaan reset password untuk akun admin Anda. Buka tautan berikut untuk mengatur ulang password:%0A%0A${resetUrl}%0A%0ATautan ini berlaku 30 menit.`)}`;

    return NextResponse.json({
      message: 'Email terdaftar. Silakan buka email untuk melanjutkan reset password.',
      email: admin.email,
      resetUrl,
      mailto,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 });
  }
}