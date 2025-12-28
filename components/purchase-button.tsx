'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface PurchaseButtonProps {
  className?: string
}

export default function PurchaseButton({ className = '' }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response?.json?.()

      if (!response?.ok) {
        throw new Error(data?.error ?? 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error?.message : 'Something went wrong'
      console.error('Purchase error:', error)
      toast.error(message ?? 'Failed to process purchase')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className={`group relative px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Buy Now for $19.99</span>
        </>
      )}
    </button>
  )
}