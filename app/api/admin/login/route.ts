import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { authenticateAdmin } from '@/lib/auth';
import { getSupabaseAnonServerClient, syncSupabaseAdminUser } from '@/lib/supabase-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const supabase = getSupabaseAnonServerClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    let admin = null;

    if (authData.user && !authError) {
      admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
    }

    if (!admin) {
      admin = await authenticateAdmin(normalizedEmail, password);

      if (!admin) {
        return NextResponse.json(
          { error: 'Email atau password salah' },
          { status: 401 }
        );
      }

      await syncSupabaseAdminUser({
        email: admin.email,
        name: admin.name,
        password,
        createIfMissing: true,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      token,
      admin,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
