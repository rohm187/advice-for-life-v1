import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { luluService } from '@/lib/lulu'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: NextRequest) {
  const body = await request?.text?.()
  const headersList = await headers()
  const signature = headersList?.get?.('stripe-signature') ?? ''

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe?.webhooks?.constructEvent?.(
      body ?? '',
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    ) as Stripe.Event
  } catch (error: unknown) {
    console.error('Webhook signature verification failed:', error)
    const message = error instanceof Error ? error?.message : 'Webhook error'
    return NextResponse.json(
      { error: message ?? 'Webhook verification failed' },
      { status: 400 }
    )
  }

  try {
    // Handle the event
    if (event?.type === 'checkout.session.completed') {
      const session = event?.data?.object as Stripe.Checkout.Session

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

      // Extract phone number
      const phone = session?.customer_details?.phone ?? null

      // Extract custom field values
      const customFields = sessionWithShipping?.custom_fields ?? []
      let acquisitionSource = null
      let companyName = null

      for (const field of customFields) {
        if (field?.key === 'acquisition_source') {
          acquisitionSource = field?.dropdown?.value ?? null
        } else if (field?.key === 'company_name') {
          companyName = field?.text?.value ?? null
        }
      }

      // Create order in database
      const order = await prisma?.order?.create?.({
        data: {
          email: session?.customer_details?.email ?? '',
          amount: session?.amount_total ?? 0,
          status: 'completed',
          stripeSessionId: session?.id ?? '',
          stripePaymentIntentId: session?.payment_intent as string ?? '',
          customerName: session?.customer_details?.name ?? '',
          productType: productType,
          shippingAddress: shippingAddress,
          phone: phone,
          acquisitionSource: acquisitionSource,
          companyName: companyName,
        },
      })

      // Create download link (expires in 7 days) - for digital products
      if (productType !== 'hardback' && productType !== 'paperback') {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt?.getDate?.() + 7)

        await prisma?.downloadLink?.create?.({
          data: {
            orderId: order?.id ?? '',
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

      // Send physical book orders to Lulu for printing and fulfillment
      if ((productType === 'hardback' || productType === 'paperback' || productType === 'bundle') && shippingAddress) {
        try {
          const shipping = JSON.parse(shippingAddress)
          
          // TODO: Replace these URLs with actual hosted PDF URLs
          // These PDFs need to be publicly accessible for Lulu to download
          const interiorPdfUrl = process.env.LULU_INTERIOR_PDF_URL || 'https://example.com/interior.pdf'
          const coverPdfUrl = process.env.LULU_COVER_PDF_URL || 'https://example.com/cover.pdf'
          
          console.log(`Sending ${productType} order to Lulu for:`, order?.id)
          
          const luluPrintJob = await luluService.createPrintJob(
            shipping,
            session?.customer_details?.email ?? '',
            interiorPdfUrl,
            coverPdfUrl,
            1, // quantity
            productType // Pass product type to determine POD package
          )
          
          // Update order with Lulu print job info
          await prisma?.order?.update?.({
            where: { id: order?.id },
            data: {
              luluPrintJobId: luluPrintJob.id,
              luluPrintJobStatus: luluPrintJob.status,
            },
          })
          
          console.log('Lulu print job created:', luluPrintJob.id, 'for order:', order?.id)
        } catch (luluError: unknown) {
          console.error('Failed to create Lulu print job for order:', order?.id, luluError)
          // Don't fail the webhook if Lulu fails - we'll handle this manually
          // Send notification to admin about failed Lulu order
        }
      }

      console.log('Order created successfully:', order?.id, 'Product:', productType)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error('Error processing webhook:', error)
    const message = error instanceof Error ? error?.message : 'Webhook processing error'
    return NextResponse.json(
      { error: message ?? 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'