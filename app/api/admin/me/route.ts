import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { verifyPassword, hashPassword } from '@/lib/auth';

function verifyToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    return verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key') as {
      id: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}

function createAdminToken(admin: { id: string; email: string; role: string }) {
  return sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.NEXTAUTH_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

export async function GET(request: Request) {
  const tokenData = verifyToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: tokenData.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const tokenData = verifyToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const currentAdmin = await prisma.admin.findUnique({ where: { id: tokenData.id } });

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isChangingCredentials = Boolean(body.email && body.email !== currentAdmin.email) || Boolean(body.newPassword);

    if (isChangingCredentials && !body.currentPassword) {
      return NextResponse.json({ error: 'Password saat ini harus diisi untuk mengubah email atau password' }, { status: 400 });
    }

    if (body.currentPassword) {
      const isValid = await verifyPassword(body.currentPassword, currentAdmin.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Password saat ini salah' }, { status: 400 });
      }
    }

    const emailChanged = body.email && body.email !== currentAdmin.email;
    const passwordChanged = Boolean(body.newPassword);

    const updated = await prisma.admin.update({
      where: { id: currentAdmin.id },
      data: {
        name: body.name || undefined,
        email: body.email || undefined,
        password: passwordChanged ? await hashPassword(body.newPassword) : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return NextResponse.json({
      admin: updated,
      token: emailChanged ? createAdminToken(updated) : undefined,
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Email sudah digunakan' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to update admin profile' }, { status: 500 });
  }
}