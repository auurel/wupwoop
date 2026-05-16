import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch stats
    const [
      totalProducts,
      totalServices,
      pendingTestimonials,
      newInquiries,
      approvedTestimonials,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.service.count(),
      prisma.testimonial.count({ where: { isApproved: false } }),
      prisma.contactInquiry.count({ where: { status: 'new' } }),
      prisma.testimonial.count({ where: { isApproved: true } }),
    ]);

    return NextResponse.json({
      totalProducts,
      totalServices,
      pendingTestimonials,
      newInquiries,
      approvedTestimonials,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
