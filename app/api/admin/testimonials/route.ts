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
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: body.customerName,
        customerInitial: body.customerInitial || body.customerName?.substring(0, 1)?.toUpperCase(),
        avatarUrl: body.avatarUrl || null,
        rating: body.rating || 5,
        message: body.message,
        isApproved: body.isApproved ?? true,
        isFeatured: body.isFeatured ?? false,
        approvedAt: body.isApproved ?? true ? new Date() : null,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}