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

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        customerName: body.customerName || undefined,
        customerInitial: body.customerInitial || undefined,
        avatarUrl: body.avatarUrl !== undefined ? body.avatarUrl || null : undefined,
        rating: body.rating !== undefined ? body.rating : undefined,
        message: body.message || undefined,
        isApproved: body.isApproved !== undefined ? body.isApproved : undefined,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : undefined,
        approvedAt: body.isApproved !== undefined ? (body.isApproved ? new Date() : null) : undefined,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}