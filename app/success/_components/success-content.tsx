'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Download, Mail, AlertCircle, Loader2, Package, Headphones } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '@/components/animated-section'

interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface OrderData {
  email: string
  downloadUrl: string
  productType: string
  shippingAddress?: ShippingAddress
  luluPrintJobId?: number
  luluPrintJobStatus?: string
  luluTrackingId?: string
  luluTrackingUrl?: string
}

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams?.get?.('session_id')

    if (!sessionId) {
      setError('No session ID found')
      setLoading(false)
      return
    }

    // Fetch order details
    fetch(`/api/order-details?session_id=${sessionId}`)
      .then(res => res?.json?.())
      .then(data => {
        if (data?.error) {
          setError(data?.error ?? 'Failed to fetch order')
        } else {
          setOrderData(data ?? null)
        }
      })
      .catch(err => {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto" />
          <p className="text-gray-400">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="text-gray-400">{error}</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    )
  }

  const productType = orderData?.productType ?? 'pdf'
  const hasDigitalContent = productType === 'pdf' || productType === 'audiobook' || productType === 'bundle'
  const hasPhysicalCopy = productType === 'hardback' || productType === 'bundle'

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedSection>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 md:p-12 text-center space-y-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold gold-gradient">
                Thank You for Your Purchase!
              </h1>
              <p className="text-xl text-gray-300">
                Your order has been confirmed
              </p>
            </div>

            {orderData && (
              <>
                <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <Mail className="w-5 h-5 text-amber-500" />
                    <span>Order confirmation sent to: <strong className="text-white">{orderData?.email}</strong></span>
                  </div>
                </div>

                {/* Digital Content Section */}
                {hasDigitalContent && orderData.downloadUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {productType === 'audiobook' ? (
                        <Headphones className="w-6 h-6 text-amber-500" />
                      ) : (
                        <Download className="w-6 h-6 text-amber-500" />
                      )}
                      <h2 className="text-xl font-bold text-white">
                        {productType === 'audiobook' ? 'Your Audiobook is Ready!' : 'Your Download is Ready!'}
                      </h2>
                    </div>
                    
                    <p className="text-gray-400">
                      {productType === 'bundle' 
                        ? 'Click below to download a complete ZIP package containing the audiobook MP3, bonus 30-minute raw rant, and PDF eBook.'
                        : productType === 'audiobook'
                        ? 'Click below to download a ZIP package with the full audiobook MP3, bonus 30-minute raw rant, and PDF eBook as a bonus.'
                        : 'Your PDF is ready to download. Start reading immediately!'}
                    </p>
                    
                    <a
                      href={orderData?.downloadUrl ?? '#'}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg transition-all shadow-xl hover:shadow-2xl hover:shadow-amber-600/50"
                    >
                      <Download className="w-5 h-5" />
                      {productType === 'bundle' ? 'Download All Digital Content' : 'Download Now'}
                    </a>

                    {/* PDF Usage Instructions for Non-Tech Users */}
                    {(productType === 'pdf' || productType === 'bundle') && (
                      <div className="mt-6 bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-left space-y-4">
                        <h3 className="text-lg font-bold text-amber-400 text-center">📖 How to Read Your PDF</h3>
                        
                        <div className="space-y-3 text-sm text-gray-300">
                          <div>
                            <p className="font-semibold text-white mb-1">Step 1: Find the File</p>
                            <p>After clicking "Download Now" above, the PDF will save to your device. Check your <strong>Downloads folder</strong> or look for a notification at the bottom of your browser.</p>
                          </div>

                          <div>
                            <p className="font-semibold text-white mb-1">Step 2: Open the PDF</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li><strong>On Computer:</strong> Double-click the file. It will open in your default PDF viewer (Adobe Acrobat, Preview, or your web browser).</li>
                              <li><strong>On Phone/Tablet:</strong> Tap the file in your Downloads. It will open in your default PDF app (Apple Books, Google Drive, or Adobe).</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-white mb-1">Step 3: Have It Read to You (Optional)</p>
                            <p className="mb-2">If you prefer listening instead of reading:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li><strong>iPhone/iPad:</strong> Open the PDF, swipe down from top-right, tap the "<strong>AA</strong>" icon, and turn on "<strong>Speak Screen</strong>".</li>
                              <li><strong>Android:</strong> Go to <strong>Settings → Accessibility → Select to Speak</strong>, then tap text to have it read aloud.</li>
                              <li><strong>Computer:</strong> Use free tools like <a href="https://www.naturalreaders.com/" target="_blank" rel="noopener" className="text-amber-400 underline hover:text-amber-300">NaturalReader</a> or your computer's built-in screen reader.</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-white mb-1">Need Help?</p>
                            <p>Can't find the PDF? Check your email at <strong className="text-amber-400">{orderData?.email}</strong> — the download link is in there too. Still stuck? <Link href="/contact" className="text-amber-400 underline hover:text-amber-300">Contact me</Link> and I'll walk you through it.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      You can download up to 3 times. The link expires in 7 days.
                    </p>
                  </div>
                )}

                {/* Physical Copy Section */}
                {hasPhysicalCopy && orderData.shippingAddress && (
                  <div className="space-y-4 border-t border-gray-800 pt-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Package className="w-6 h-6 text-amber-500" />
                      <h2 className="text-xl font-bold text-white">Hardback Copy Shipping</h2>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 text-left">
                      <p className="text-sm text-gray-400 mb-3">Shipping to:</p>
                      <div className="text-white space-y-1">
                        <p className="font-semibold">{orderData.shippingAddress.name}</p>
                        <p>{orderData.shippingAddress.line1}</p>
                        {orderData.shippingAddress.line2 && (
                          <p>{orderData.shippingAddress.line2}</p>
                        )}
                        <p>
                          {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.postal_code}
                        </p>
                        <p>{orderData.shippingAddress.country}</p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm">
                      Your hardback copy will be shipped within 3-5 business days. You'll receive a tracking number via email.
                    </p>

                    {/* Lulu Print Job Status */}
                    {orderData.luluPrintJobId && (
                      <div className="mt-4 bg-amber-900/20 border border-amber-800/30 rounded-xl p-4">
                        <p className="text-sm text-gray-400 mb-2">Print Job Status:</p>
                        <div className="space-y-2">
                          <p className="text-white font-medium">
                            {orderData.luluPrintJobStatus || 'Processing'}
                          </p>
                          {orderData.luluTrackingId && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">Tracking:</span>
                              {orderData.luluTrackingUrl ? (
                                <a
                                  href={orderData.luluTrackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-500 hover:text-amber-400 underline font-mono text-sm"
                                >
                                  {orderData.luluTrackingId}
                                </a>
                              ) : (
                                <span className="text-white font-mono text-sm">{orderData.luluTrackingId}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {productType === 'hardback' && !orderData.downloadUrl && (
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Your hardback copy will be shipped within 3-5 business days. You'll receive a tracking number via email.
                    </p>
                    <p className="text-sm text-amber-400">
                      Bonus: You'll also receive a PDF version via email shortly!
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Bonus Reminder for Audiobook */}
            {(productType === 'audiobook' || productType === 'bundle') && (
              <div className="pt-6 border-t border-gray-800">
                <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Headphones className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-bold text-amber-400">Don't Forget Your Bonuses!</h3>
                  </div>
                  <p className="text-gray-300 text-center">
                    Your audiobook includes <strong className="text-white">exclusive bonus stories</strong>, 
                    raw moments you won't find anywhere else, and the <strong className="text-white">5 Songs playlist</strong> that 
                    got me through the hardest times.
                  </p>
                  <p className="text-amber-400 font-semibold text-center">
                    Check your download package — it's all in there. 🔥
                  </p>
                </div>
              </div>
            )}

            {/* Feedback Request */}
            <div className="pt-6 border-t border-gray-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Help Me Help Others</h3>
              <p className="text-gray-400">
                This book was born from pain and built to help people survive. 
                If it hits you, <strong className="text-white">I want to hear about it</strong>.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-amber-400 font-semibold rounded-lg transition-all border border-gray-700"
              >
                Send Me Your Feedback
              </Link>
            </div>

            {/* Business Idea CTA */}
            <div className="pt-6 border-t border-gray-800">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-amber-700/50 rounded-2xl p-8 space-y-4">
                <h3 className="text-2xl font-bold gold-gradient">Want to Build Something Together?</h3>
                <p className="text-gray-300">
                  I'm building <strong className="text-white">100 automated AI businesses</strong> in 24 months. 
                  If you've got a killer idea, submit it. If I build it, <strong className="text-amber-400">you get equity</strong>.
                </p>
                <p className="text-gray-400 text-sm">
                  This isn't theory. This is real money, real businesses, real opportunity. 
                  I'm looking for ideas that solve problems, make money, and don't require me to babysit them.
                </p>
                <Link
                  href="/#business-idea-form"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg transition-all shadow-xl hover:shadow-2xl hover:shadow-amber-600/50"
                >
                  Submit Your Business Idea
                  <span className="text-xl">→</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <p className="text-gray-400">
                Start your transformation journey today.
              </p>
              <Link
                href="/"
                className="inline-block text-amber-500 hover:text-amber-400 font-medium transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
