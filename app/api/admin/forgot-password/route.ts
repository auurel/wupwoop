import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendSupabaseResetPasswordEmail, syncSupabaseAdminUser } from '@/lib/supabase-auth';

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

    await syncSupabaseAdminUser({
      email: admin.email,
      name: admin.name,
      createIfMissing: true,
    });

    const resetUrl = `${request.headers.get('origin') || 'http://localhost:3000'}/admin/reset-password`;

    await sendSupabaseResetPasswordEmail(admin.email, resetUrl);

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