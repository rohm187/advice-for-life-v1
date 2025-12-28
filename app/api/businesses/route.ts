import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET all businesses (public)
export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      orderBy: {
        order: 'asc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    const activeCount = businesses?.filter((b: any) => b?.status === 'active')?.length ?? 0

    return NextResponse.json({
      businesses: businesses ?? [],
      totalCount: businesses?.length ?? 0,
      activeCount,
    })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}

// POST new business (admin only)
export async function POST(request: Request) {
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

    if (!name || !description || !launchDate) {
      return NextResponse.json(
        { error: 'Name, description, and launch date are required' },
        { status: 400 }
      )
    }

    const business = await prisma.business.create({
      data: {
        name,
        description,
        launchDate: new Date(launchDate),
        websiteLink: websiteLink ?? null,
        status: status ?? 'active',
        category: category ?? null,
        milestone: milestone ?? null,
        imageUrl: imageUrl ?? null,
        userId: (session?.user as any)?.id,
      }
    })

    return NextResponse.json(
      { message: 'Business created successfully', business },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    )
  }
}
