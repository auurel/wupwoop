import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function maskedDbInfo() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return '{DATABASE_URL not set}';
  try {
    // try parse as URL to hide credentials
    const url = new URL(raw);
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}${url.pathname}`;
  } catch (e) {
    // fallback: show first 60 chars
    return `${String(raw).slice(0, 60)}...`;
  }
}

export async function GET() {
  console.debug('DEBUG: masked DATABASE_URL ->', maskedDbInfo());
  try {
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Return error message for debugging (non-production). If this exposes sensitive
    // details, remove the message after debugging.
    const msg = (error instanceof Error) ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', message: msg },
      { status: 500 }
    );
  }
}
