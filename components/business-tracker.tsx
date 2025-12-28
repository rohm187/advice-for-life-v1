'use client'

import { useEffect, useState } from 'react'
import { Flame, TrendingUp, Clock, ExternalLink, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Business {
  id: string
  name: string
  description: string
  launchDate: string
  websiteLink?: string
  status: string
  category?: string
  milestone?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

interface BusinessData {
  businesses: Business[]
  totalCount: number
  activeCount: number
}

function Counter({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: 'easeOut',
    })

    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(latest)
    })

    return () => {
      controls?.stop?.()
      unsubscribe?.()
    }
  }, [value, count, rounded])

  return <span>{displayValue}</span>
}

export default function BusinessTracker() {
  const [data, setData] = useState<BusinessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses')
      if (response?.ok) {
        const result = await response.json()
        setData(result ?? null)
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-800 rounded-lg w-3/4 mx-auto" />
            <div className="h-32 bg-gray-800 rounded-lg" />
          </div>
        </div>
      </section>
    )
  }

  const totalCount = data?.totalCount ?? 0
  const activeCount = data?.activeCount ?? 0
  const businesses = data?.businesses ?? []
  const displayedBusinesses = showAll ? businesses : businesses?.slice(0, 6) ?? []
  const progress = Math.min((totalCount / 100) * 100, 100)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-600/10 border border-amber-600/20 rounded-full">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-amber-500 font-semibold text-sm">Rising from the Ashes</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Watch Me <span className="gold-gradient">Build 100 Businesses</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            I'm not just writing about transformation—I'm living it in real-time. Follow my journey as I rise like a phoenix from rock bottom.
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Counter */}
            <div className="text-center md:text-left">
              <div className="flex items-baseline justify-center md:justify-start gap-3 mb-4">
                <span className="text-6xl md:text-7xl font-bold gold-gradient">
                  <Counter value={totalCount} />
                </span>
                <span className="text-4xl md:text-5xl font-bold text-gray-500">/100</span>
              </div>
              <p className="text-xl text-gray-400 mb-2">Businesses Built</p>
              <div className="flex items-center gap-2 text-amber-500 justify-center md:justify-start">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">{activeCount} Active Now</span>
              </div>
              {totalCount > 0 && (
                <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm justify-center md:justify-start">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {new Date(businesses?.[0]?.updatedAt ?? '')?.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Right: Progress Bar */}
            <div className="space-y-4">
              <div className="relative">
                <div className="h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </motion.div>
                </div>
                <div className="absolute -top-8 right-0 flex items-center gap-1 text-amber-500 text-sm font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>{progress?.toFixed(0)}% Complete</span>
                </div>
              </div>
              
              {totalCount >= 10 && totalCount < 20 && (
                <div className="bg-amber-600/10 border border-amber-600/20 rounded-xl p-4">
                  <p className="text-amber-500 font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Milestone: First 10 Businesses! 🎉
                  </p>
                </div>
              )}
              {totalCount >= 25 && totalCount < 50 && (
                <div className="bg-amber-600/10 border border-amber-600/20 rounded-xl p-4">
                  <p className="text-amber-500 font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Milestone: Quarter of the Way There! 🔥
                  </p>
                </div>
              )}
              {totalCount >= 50 && totalCount < 75 && (
                <div className="bg-amber-600/10 border border-amber-600/20 rounded-xl p-4">
                  <p className="text-amber-500 font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Milestone: Halfway to 100! 💪
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Business Grid */}
        {businesses?.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-8 text-center">The Businesses</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedBusinesses?.map?.((business, index) => (
                  <motion.div
                    key={business?.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-amber-600/50 transition-all group"
                  >
                    {business?.imageUrl && (
                      <div className="relative aspect-video mb-4 bg-gray-800 rounded-xl overflow-hidden">
                        <Image
                          src={business?.imageUrl}
                          alt={business?.name ?? 'Business'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">
                          {business?.name}
                        </h4>
                        {business?.status === 'active' && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-500 text-xs font-semibold rounded-full flex-shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {business?.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Launched {new Date(business?.launchDate)?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        {business?.websiteLink && (
                          <a
                            href={business?.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {business?.category && (
                        <div className="pt-2 border-t border-gray-800">
                          <span className="text-xs text-gray-500">{business?.category}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {businesses?.length > 6 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-600/30"
                >
                  {showAll ? 'Show Less' : `View All ${businesses?.length} Businesses`}
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 pt-12 border-t border-gray-800"
        >
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Want to learn the mindset and strategies behind this journey? Get the book and discover the raw truth about rising from rock bottom.
          </p>
          <Link
            href="/#purchase"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-600/30"
          >
            Get the Book
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
