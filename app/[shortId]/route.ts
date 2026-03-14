import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const resolvedParams = await params;
    const shortId = resolvedParams.shortId;
    
    // Search for the URL in the database by ID
    const urlData = await prisma.url.findUnique({
      where: { shortId },
    });
    
    if (!urlData) {
      // If not found, redirect to the main page with an error parameter
      return NextResponse.redirect(new URL('/?error=not-found', request.url));
    }
    
    // Redirect the user to the original URL as saved in the database
    return NextResponse.redirect(urlData.originalUrl);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL('/?error=server-error', request.url));
  }
}
