import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import type { NextRequest } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const hours = await prisma.operatingHours.update({
      where: { id },
      data: {
        day: body.day || undefined,
        dayLabel: body.dayLabel || undefined,
        openTime: body.isClosed ? null : body.openTime !== undefined ? body.openTime || null : undefined,
        closeTime: body.isClosed ? null : body.closeTime !== undefined ? body.closeTime || null : undefined,
        isClosed: body.isClosed !== undefined ? body.isClosed : undefined,
        order: body.order !== undefined ? body.order : undefined,
      },
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error('Error updating operating hours:', error);
    return NextResponse.json({ error: 'Failed to update operating hours' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.operatingHours.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting operating hours:', error);
    return NextResponse.json({ error: 'Failed to delete operating hours' }, { status: 500 });
  }
}