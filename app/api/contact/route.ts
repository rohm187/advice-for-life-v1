import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.()
    const { name, email, subject, message } = body ?? {}

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex?.test?.(email ?? '')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save contact submission to database
    const contact = await prisma?.contactSubmission?.create?.({
      data: {
        name: name ?? '',
        email: email ?? '',
        subject: subject ?? 'No subject',
        message: message ?? '',
      },
    })

    console.log('Contact submission saved:', contact?.id)

    return NextResponse.json({ 
      success: true,
      message: 'Your message has been received. We\'ll get back to you soon!' 
    })
  } catch (error: unknown) {
    console.error('Contact form error:', error)
    const message = error instanceof Error ? error?.message : 'Internal server error'
    return NextResponse.json(
      { error: message ?? 'Failed to process contact form' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'