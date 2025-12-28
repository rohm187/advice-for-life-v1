import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// PATCH update business (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session?.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, launchDate, websiteLink, status, category, milestone, imageUrl } = body ?? {}

    const business = await prisma.business.update({
      where: { id: params?.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(launchDate && { launchDate: new Date(launchDate) }),
        ...(websiteLink !== undefined && { websiteLink }),
        ...(status && { status }),
        ...(category !== undefined && { category }),
        ...(milestone !== undefined && { milestone }),
        ...(imageUrl !== undefined && { imageUrl }),
      }
    })

    return NextResponse.json(
      { message: 'Business updated successfully', business },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    )
  }
}

// DELETE business (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session?.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.business.delete({
      where: { id: params?.id }
    })

    return NextResponse.json(
      { message: 'Business deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}
