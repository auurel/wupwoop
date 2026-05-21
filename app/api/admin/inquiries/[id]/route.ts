import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const inquiry = await prisma.contactInquiry.update({
      where: { id: params.id },
      data: {
        name: body.name || undefined,
        phone: body.phone || undefined,
        email: body.email !== undefined ? body.email || null : undefined,
        service: body.service !== undefined ? body.service || null : undefined,
        message: body.message || undefined,
        status: body.status || undefined,
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.contactInquiry.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}