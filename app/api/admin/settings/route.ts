import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const settings = await prisma.siteSettings.create({
      data: {
        whatsappNumber: body.whatsappNumber || '',
        defaultWhatsappMessage: body.defaultWhatsappMessage || '',
        address: body.address || '',
        postalCode: body.postalCode || '',
        mapEmbedUrl: body.mapEmbedUrl || '',
        tiktokUrl: body.tiktokUrl || null,
        tiktokUsername: body.tiktokUsername || null,
        instagramUrl: body.instagramUrl || null,
        instagramUsername: body.instagramUsername || null,
        facebookUrl: body.facebookUrl || null,
        facebookUsername: body.facebookUsername || null,
        heroTitle: body.heroTitle || '',
        heroSubtitle: body.heroSubtitle || '',
        aboutTitle: body.aboutTitle || '',
        aboutContent: body.aboutContent || '',
        aboutImageUrl: body.aboutImageUrl || null,
      },
    });

    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    console.error('Error creating settings:', error);
    return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const existing = await prisma.siteSettings.findFirst();

    if (!existing) {
      const created = await prisma.siteSettings.create({
        data: {
          whatsappNumber: body.whatsappNumber || '',
          defaultWhatsappMessage: body.defaultWhatsappMessage || '',
          address: body.address || '',
          postalCode: body.postalCode || '',
          mapEmbedUrl: body.mapEmbedUrl || '',
          tiktokUrl: body.tiktokUrl || null,
          tiktokUsername: body.tiktokUsername || null,
          instagramUrl: body.instagramUrl || null,
          instagramUsername: body.instagramUsername || null,
          facebookUrl: body.facebookUrl || null,
          facebookUsername: body.facebookUsername || null,
          heroTitle: body.heroTitle || '',
          heroSubtitle: body.heroSubtitle || '',
          aboutTitle: body.aboutTitle || '',
          aboutContent: body.aboutContent || '',
          aboutImageUrl: body.aboutImageUrl || null,
        },
      });

      return NextResponse.json(created);
    }

    const updated = await prisma.siteSettings.update({
      where: { id: existing.id },
      data: {
        whatsappNumber: body.whatsappNumber ?? existing.whatsappNumber,
        defaultWhatsappMessage: body.defaultWhatsappMessage ?? existing.defaultWhatsappMessage,
        address: body.address ?? existing.address,
        postalCode: body.postalCode ?? existing.postalCode,
        mapEmbedUrl: body.mapEmbedUrl ?? existing.mapEmbedUrl,
        tiktokUrl: body.tiktokUrl !== undefined ? body.tiktokUrl || null : undefined,
        tiktokUsername: body.tiktokUsername !== undefined ? body.tiktokUsername || null : undefined,
        instagramUrl: body.instagramUrl !== undefined ? body.instagramUrl || null : undefined,
        instagramUsername: body.instagramUsername !== undefined ? body.instagramUsername || null : undefined,
        facebookUrl: body.facebookUrl !== undefined ? body.facebookUrl || null : undefined,
        facebookUsername: body.facebookUsername !== undefined ? body.facebookUsername || null : undefined,
        heroTitle: body.heroTitle ?? existing.heroTitle,
        heroSubtitle: body.heroSubtitle ?? existing.heroSubtitle,
        aboutTitle: body.aboutTitle ?? existing.aboutTitle,
        aboutContent: body.aboutContent ?? existing.aboutContent,
        aboutImageUrl: body.aboutImageUrl !== undefined ? body.aboutImageUrl || null : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}