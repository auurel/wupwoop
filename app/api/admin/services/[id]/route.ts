import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

function verifyToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    return verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');
  } catch {
    return null;
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        name: body.name || undefined,
        slug: body.slug || (body.name ? body.name.toLowerCase().replace(/\s+/g, '-') : undefined),
        description: body.description || undefined,
        order: body.order !== undefined ? body.order : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}