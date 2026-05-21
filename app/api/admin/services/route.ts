import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

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

export async function GET(request: Request) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching admin services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description || null,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}