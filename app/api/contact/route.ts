import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        service: body.service || null,
        message: body.message,
        status: 'new',
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
