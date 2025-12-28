import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { luluService } from '@/lib/lulu'

/**
 * Admin-only endpoint to test Lulu integration and get POD package IDs
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'packages'

    if (action === 'packages') {
      // Get available POD packages
      const packages = await luluService.getPodPackages()
      
      // Filter for hardcover books around 6x9
      const hardcoverPackages = packages.filter((pkg: any) => 
        pkg.name?.toLowerCase().includes('hardcover') ||
        pkg.name?.toLowerCase().includes('casewrap') ||
        pkg.name?.toLowerCase().includes('hardback')
      )

      return NextResponse.json({
        success: true,
        totalPackages: packages.length,
        hardcoverPackages: hardcoverPackages.length,
        packages: hardcoverPackages.slice(0, 20), // Return first 20 hardcover options
        allPackages: packages, // Include all for reference
      })
    }

    return NextResponse.json({
      error: 'Invalid action',
      validActions: ['packages'],
    }, { status: 400 })
  } catch (error: unknown) {
    console.error('Lulu test error:', error)
    const message = error instanceof Error ? error.message : 'Lulu test failed'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
