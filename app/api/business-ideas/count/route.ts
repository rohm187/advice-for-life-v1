import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Public endpoint to get total count of business idea submissions
export async function GET() {
  try {
    const totalCount = await prisma.businessIdea.count();

    return NextResponse.json({ totalCount });
  } catch (error) {
    console.error('Error fetching business ideas count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch count' },
      { status: 500 }
    );
  }
}
