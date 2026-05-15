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

export async function POST(request: Request) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description || null,
        imageUrl: body.imageUrl,
        category: body.category || null,
        order: body.order || 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
