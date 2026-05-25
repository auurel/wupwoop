import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { randomBytes, createHash } from 'node:crypto';
import { verify } from 'jsonwebtoken';

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

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function GET(request: Request) {
  const tokenData = verifyToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (tokenData.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const invites = await prisma.adminInvite.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        expiresAt: true,
        usedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error('Error fetching admin invites:', error);
    return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const tokenData = verifyToken(request);

  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (tokenData.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email, name, role } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Nama dan email harus diisi' }, { status: 400 });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Email sudah terdaftar sebagai admin' }, { status: 409 });
    }

    const existingInvite = await prisma.adminInvite.findUnique({ where: { email } });
    if (existingInvite && !existingInvite.usedAt && existingInvite.expiresAt > new Date()) {
      return NextResponse.json({ error: 'Undangan aktif sudah ada untuk email ini' }, { status: 409 });
    }

    const rawToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const invite = await prisma.adminInvite.upsert({
      where: { email },
      create: {
        email,
        name,
        role: role || 'admin',
        tokenHash: hashToken(rawToken),
        expiresAt,
        createdById: tokenData.id,
      },
      update: {
        name,
        role: role || 'admin',
        tokenHash: hashToken(rawToken),
        expiresAt,
        usedAt: null,
        createdById: tokenData.id,
      },
    });

    const activationUrl = `${request.headers.get('origin') || 'http://localhost:3000'}/admin/accept-invite?token=${encodeURIComponent(rawToken)}`;
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Undangan Admin Muzayyan')}&body=${encodeURIComponent(`Halo ${name},%0A%0AAnda diundang menjadi admin Muzayyan.%0AKlik tautan berikut untuk mengaktifkan akun dan membuat password:%0A%0A${activationUrl}%0A%0AUndangan ini berlaku 24 jam.`)}`;

    return NextResponse.json({
      invite,
      activationUrl,
      mailto,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin invite:', error);
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}