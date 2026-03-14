import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to create a short random string
function generateShortId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { originalUrl } = await request.json();

    if (!originalUrl || typeof originalUrl !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid URL' }, { status: 400 });
    }

    // Verify that the URL is valid and is a web page
    try {
      const parsedUrl = new URL(originalUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return NextResponse.json({ error: 'You can only shorten website URLs (http:// or https://)' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid web address' }, { status: 400 });
    }

    // Check if the URL already exists in the database
    const existingUrl = await prisma.url.findFirst({
      where: { originalUrl }
    });

    if (existingUrl) {
      // If a shortcut already exists for this URL, return it instead of creating a new one
      return NextResponse.json(existingUrl, { status: 200 });
    }

    let shortId = '';
    let isUnique = false;

    // Keep generating a short ID until we get one that doesn't exist in the database
    while (!isUnique) {
      shortId = generateShortId();
      const existing = await prisma.url.findUnique({ where: { shortId } });
      if (!existing) {
        isUnique = true;
      }
    }

    // Save the URL to the database
    const newUrl = await prisma.url.create({
      data: {
        shortId,
        originalUrl
      }
    });

    return NextResponse.json(newUrl, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
