import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { sendAdminForgotPasswordEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

type ResetTokenPayload = {
  id: string;
  email: string;
  purpose: 'reset-password';
};

function getAppBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXTAUTH_URL?.trim() || request.headers.get('origin') || 'http://localhost:3000';

  if (/^https?:\/\//i.test(configuredUrl)) {
    return configuredUrl.replace(/\/+$/, '');
  }

  return `https://${configuredUrl.replace(/\/+$/, '')}`;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email harus diisi' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });

    if (!admin) {
      return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 404 });
    }

    const token = sign(
      {
        id: admin.id,
        email: admin.email,
        purpose: 'reset-password',
      } satisfies ResetTokenPayload,
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '30m' }
    );

    const resetUrl = `${getAppBaseUrl(request)}/admin/reset-password?token=${encodeURIComponent(token)}`;

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
    const message = error instanceof Error ? error.message : 'Gagal memproses permintaan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}