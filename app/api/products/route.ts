import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await prisma.product.findMany({
      orderBy: { order: 'asc' },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.product.count();

    return NextResponse.json({
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
