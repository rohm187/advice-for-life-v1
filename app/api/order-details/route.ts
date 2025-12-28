import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request?.url ?? '')
    const sessionId = searchParams?.get?.('session_id') ?? ''

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve session from Stripe
    const session = await stripe?.checkout?.sessions?.retrieve?.(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Find or create order in database
    let order = await prisma?.order?.findUnique?.({
      where: { stripeSessionId: sessionId },
      include: { downloadLinks: true },
    })

    if (!order && session?.payment_status === 'paid') {
      // Get product type from metadata
      const productType = session?.metadata?.product ?? 'pdf'

      // Get shipping address if available
      let shippingAddress = null
      const sessionWithShipping = session as any
      if (sessionWithShipping?.shipping_details?.address) {
        shippingAddress = JSON.stringify({
          name: sessionWithShipping?.shipping_details?.name ?? session?.customer_details?.name ?? '',
          line1: sessionWithShipping?.shipping_details?.address?.line1 ?? '',
          line2: sessionWithShipping?.shipping_details?.address?.line2 ?? '',
          city: sessionWithShipping?.shipping_details?.address?.city ?? '',
          state: sessionWithShipping?.shipping_details?.address?.state ?? '',
          postal_code: sessionWithShipping?.shipping_details?.address?.postal_code ?? '',
          country: sessionWithShipping?.shipping_details?.address?.country ?? '',
        })
      }

      // Create order if it doesn't exist (in case webhook hasn't processed yet)
      const newOrder = await prisma?.order?.create?.({
        data: {
          email: session?.customer_details?.email ?? '',
          amount: session?.amount_total ?? 0,
          status: 'completed',
          stripeSessionId: sessionId,
          stripePaymentIntentId: session?.payment_intent as string ?? '',
          customerName: session?.customer_details?.name ?? '',
          productType: productType,
          shippingAddress: shippingAddress,
        },
      })

      // Create download link for digital products
      if (productType !== 'hardback') {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt?.getDate?.() + 7)

        await prisma?.downloadLink?.create?.({
          data: {
            orderId: newOrder?.id ?? '',
            expiresAt,
          },
        })
      }

      // Save email to subscribers
      if (session?.customer_details?.email) {
        await prisma?.emailSubscriber?.upsert?.({
          where: { email: session?.customer_details?.email },
          update: {},
          create: {
            email: session?.customer_details?.email,
            source: 'purchase',
          },
        })
      }

      // Refetch order with download links
      order = await prisma?.order?.findUnique?.({
        where: { id: newOrder?.id },
        include: { downloadLinks: true },
      })
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const downloadLink = order?.downloadLinks?.[0]
    const downloadUrl = downloadLink 
      ? `/api/download?token=${downloadLink?.token}`
      : ''

    // Parse shipping address if available
    let shippingAddress = null
    if (order?.shippingAddress) {
      try {
        shippingAddress = JSON.parse(order.shippingAddress)
      } catch (e) {
        console.error('Failed to parse shipping address:', e)
      }
    }

    return NextResponse.json({
      email: order?.email ?? '',
      downloadUrl,
      productType: order?.productType ?? 'pdf',
      shippingAddress,
      luluPrintJobId: order?.luluPrintJobId,
      luluPrintJobStatus: order?.luluPrintJobStatus,
      luluTrackingId: order?.luluTrackingId,
      luluTrackingUrl: order?.luluTrackingUrl,
    })
  } catch (error: unknown) {
    console.error('Order details error:', error)
    const message = error instanceof Error ? error?.message : 'Internal server error'
    return NextResponse.json(
      { error: message ?? 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'