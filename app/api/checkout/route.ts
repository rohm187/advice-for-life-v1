import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-12-15.clover',
})

// Product configurations
const products = {
  pdf: {
    name: 'Advice for Life from a Drug Addict - PDF eBook',
    description: 'Digital PDF ebook by Brandon Rohm. Instant download.',
    amount: 1499, // $14.99
    requiresShipping: false,
  },
  audiobook: {
    name: 'Advice for Life from a Drug Addict - Audiobook + Bonuses',
    description: 'Full audiobook narrated by Brandon Rohm, plus bonus stories and 5 Songs playlist for hard times.',
    amount: 1999, // $19.99
    requiresShipping: false,
  },
  paperback: {
    name: 'Advice for Life from a Drug Addict - Paperback Physical Copy',
    description: 'Quality paperback edition shipped to your door. Includes PDF version.',
    amount: 2499, // $24.99
    requiresShipping: true,
  },
  hardback: {
    name: 'Advice for Life from a Drug Addict - Hardback Physical Copy',
    description: 'Premium hardback edition shipped to your door. Includes PDF version.',
    amount: 4199, // $41.99
    requiresShipping: true,
  },
  bundle: {
    name: 'Advice for Life from a Drug Addict - Complete Bundle',
    description: 'PDF eBook + Audiobook with Bonuses + Hardback Physical Copy. Save $36.97!',
    amount: 5999, // $59.99
    requiresShipping: true,
  },
}

export async function POST(request: NextRequest) {
  try {
    const origin = request?.headers?.get?.('origin') ?? 'http://localhost:3000'
    const body = await request.json()
    const productType = body?.productType ?? 'pdf'

    // Validate product type
    if (!products[productType as keyof typeof products]) {
      return NextResponse.json(
        { error: 'Invalid product type' },
        { status: 400 }
      )
    }

    const product = products[productType as keyof typeof products]

    // Create Stripe Checkout Session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [`${origin}/book-cover.png`],
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#purchase`,
      customer_email: undefined, // Let customer enter their email
      metadata: {
        product: productType,
        productName: product.name,
      },
      payment_intent_data: {
        metadata: {
          product: productType,
          productName: product.name,
        },
      },
    }

    // Add shipping address collection for physical products (REQUIRED FOR LULU)
    if (product.requiresShipping) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES'], // Major countries
      }
      // Add phone collection for physical shipments
      sessionConfig.phone_number_collection = {
        enabled: true,
      }
    }

    const session = await stripe?.checkout?.sessions?.create?.(sessionConfig)

    return NextResponse.json({ url: session?.url ?? '' })
  } catch (error: unknown) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error?.message : 'Internal server error'
    return NextResponse.json(
      { error: message ?? 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}