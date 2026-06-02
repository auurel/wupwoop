import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { hashPassword } from '@/lib/auth';
import { syncSupabaseAdminUser } from '@/lib/supabase-auth';

const allowedRoles = ['admin', 'superadmin'] as const;

function isValidRole(role: string) {
  return allowedRoles.includes(role as (typeof allowedRoles)[number]);
}

export async function GET(request: Request) {
  const tokenData = verifyAdminToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const tokenData = verifyAdminToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = String(body.role || 'admin').trim().toLowerCase();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, email, dan password harus diisi' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }

    if (!isValidRole(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Email sudah terdaftar sebagai admin' }, { status: 409 });
    }

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    await syncSupabaseAdminUser({
      email: admin.email,
      name: admin.name,
      password,
      createIfMissing: true,
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}