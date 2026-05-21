import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const hours = await prisma.operatingHours.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(hours);
  } catch (error) {
    console.error('Error fetching admin operating hours:', error);
    return NextResponse.json({ error: 'Failed to fetch operating hours' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const hours = await prisma.operatingHours.create({
      data: {
        day: body.day,
        dayLabel: body.dayLabel,
        openTime: body.isClosed ? null : body.openTime || null,
        closeTime: body.isClosed ? null : body.closeTime || null,
        isClosed: body.isClosed ?? false,
        order: body.order || 0,
      },
    });

    return NextResponse.json(hours, { status: 201 });
  } catch (error) {
    console.error('Error creating operating hours:', error);
    return NextResponse.json({ error: 'Failed to create operating hours' }, { status: 500 });
  }
}