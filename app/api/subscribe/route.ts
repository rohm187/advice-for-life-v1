import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source = 'newsletter' } = body

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await prisma.emailSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json(
          { error: 'You\'re already subscribed!' },
          { status: 400 }
        )
      } else {
        // Resubscribe if previously unsubscribed
        await prisma.emailSubscriber.update({
          where: { email },
          data: { subscribed: true },
        })
        return NextResponse.json({ success: true, message: 'Welcome back!' })
      }
    }

    // Create new subscriber in database
    await prisma.emailSubscriber.create({
      data: {
        email,
        source,
        subscribed: true,
      },
    })

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' })
  } catch (error: unknown) {
    console.error('Subscribe error:', error)
    const message = error instanceof Error ? error.message : 'Failed to subscribe'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
