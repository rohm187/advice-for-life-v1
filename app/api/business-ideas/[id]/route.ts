import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// PATCH - Admin endpoint to update business idea (review, select, reject)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, equityPercentage, adminNotes } = body;

    // Validate status if provided
    if (status && !['pending', 'under_review', 'selected', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = session.user?.email || 'admin';
    }

    if (equityPercentage !== undefined) {
      updateData.equityPercentage = equityPercentage;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const businessIdea = await prisma.businessIdea.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(businessIdea);
  } catch (error) {
    console.error('Error updating business idea:', error);
    return NextResponse.json(
      { error: 'Failed to update business idea' },
      { status: 500 }
    );
  }
}

// DELETE - Admin endpoint to delete business idea
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.businessIdea.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting business idea:', error);
    return NextResponse.json(
      { error: 'Failed to delete business idea' },
      { status: 500 }
    );
  }
}
