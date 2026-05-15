import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hours = await prisma.operatingHours.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error('Error fetching operating hours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operating hours' },
      { status: 500 }
    );
  }
}
