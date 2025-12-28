import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST - Public endpoint for submitting business ideas
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submitterName, submitterEmail, businessName, description, whyItMatters } = body;

    // Validation
    if (!submitterName || !submitterEmail || !businessName || !description || !whyItMatters) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submitterEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create the business idea submission
    const businessIdea = await prisma.businessIdea.create({
      data: {
        submitterName,
        submitterEmail,
        businessName,
        description,
        whyItMatters,
        status: 'pending',
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Business idea submitted successfully!',
        id: businessIdea.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting business idea:', error);
    return NextResponse.json(
      { error: 'Failed to submit business idea' },
      { status: 500 }
    );
  }
}

// GET - Admin endpoint to view all business idea submissions
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const businessIdeas = await prisma.businessIdea.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get counts by status
    const counts = await prisma.businessIdea.groupBy({
      by: ['status'],
      _count: true,
    });

    const statusCounts = counts.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Get total count for public display
    const totalCount = await prisma.businessIdea.count();

    return NextResponse.json({
      businessIdeas,
      statusCounts,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching business ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business ideas' },
      { status: 500 }
    );
  }
}
