import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';
import { hashPassword } from '@/lib/auth';
import { syncSupabaseAdminUser } from '@/lib/supabase-auth';

const allowedRoles = ['admin', 'superadmin'] as const;

function isValidRole(role: string) {
  return allowedRoles.includes(role as (typeof allowedRoles)[number]);
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  const tokenData = verifyAdminToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const currentAdmin = await prisma.admin.findUnique({ where: { id } });
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }

    const body = await request.json();
    const name = body.name !== undefined ? String(body.name).trim() : undefined;
    const email = body.email !== undefined ? String(body.email).trim().toLowerCase() : undefined;
    const role = body.role !== undefined ? String(body.role).trim().toLowerCase() : undefined;
    const password = body.password !== undefined ? String(body.password) : undefined;

    if (name !== undefined && !name) {
      return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 });
    }

    if (email !== undefined && !email) {
      return NextResponse.json({ error: 'Email tidak boleh kosong' }, { status: 400 });
    }

    if (role !== undefined && !isValidRole(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    if (role !== undefined && tokenData.role !== 'superadmin') {
      return NextResponse.json({ error: 'Hanya superadmin yang dapat mengubah role admin' }, { status: 403 });
    }

    if (password !== undefined && password.length > 0 && password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }

    if (email && email !== currentAdmin.email) {
      const existingEmail = await prisma.admin.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: 'Email sudah digunakan admin lain' }, { status: 409 });
      }
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: {
        name,
        email,
        role,
        password: password ? await hashPassword(password) : undefined,
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
      email: updated.email,
      name: updated.name,
      password: password && password.length > 0 ? password : undefined,
      createIfMissing: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const tokenData = verifyAdminToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (tokenData.id === id) {
      return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri' }, { status: 400 });
    }

    if (tokenData.role === 'admin') {
      return NextResponse.json({ error: 'Role admin tidak memiliki izin untuk menghapus admin' }, { status: 403 });
    }

    const targetAdmin = await prisma.admin.findUnique({ where: { id } });
    if (!targetAdmin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }

    if (targetAdmin.role === 'superadmin') {
      return NextResponse.json({ error: 'Superadmin tidak dapat menghapus superadmin lain' }, { status: 403 });
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ message: 'Admin berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}