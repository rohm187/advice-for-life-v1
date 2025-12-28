import Image from 'next/image'
import { Quote, BookOpen, Award, Shield, Download, Star } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import PurchaseButton from '@/components/purchase-button'
import AnimatedSection from '@/components/animated-section'
import BusinessTracker from '@/components/business-tracker'
import BusinessIdeaForm from '@/components/business-idea-form'
import ProductTiers from '@/components/product-tiers'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <AnimatedSection>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Life Lessons from <span className="gold-gradient">Rock Bottom</span>
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Raw, unfiltered wisdom from someone who survived addiction and built success from nothing.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <p className="text-lg text-gray-400">
                  This isn't your typical self-help book. It's honest, brutal, and real—because that's what transformation requires.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.6}>
                <div className="flex flex-wrap gap-4 items-center">
                  <PurchaseButton />
                  <div className="flex items-center gap-2 text-amber-500">
                    <Download className="w-5 h-5" />
                    <span className="text-sm font-medium">Instant PDF Download</span>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.8}>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)]?.map?.((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">Honest insights from lived experience</span>
                </div>
              </AnimatedSection>
            </div>

            {/* Right: Book Cover */}
            <AnimatedSection delay={0.3} className="relative">
              <div className="relative aspect-[2/3] max-w-md mx-auto">
                <div className="absolute inset-0 bg-amber-600/20 blur-3xl rounded-full" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-gray-800 hover:shadow-amber-600/30 transition-all duration-500">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/book-cover.png"
                      alt="Advice for Life from a Drug Addict by Brandon Rohm"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About the Author Section */}
      <section id="about" className="py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                About <span className="gold-gradient">Brandon Rohm</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                From survival to success—one honest story at a time
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  Brandon Rohm is a 39-year-old Pittsburgh native who turned his life around after hitting rock bottom with addiction.
                </p>
                <p>
                  This isn't a story about redemption written from a penthouse. It's raw wisdom from someone still in the trenches, building 100 businesses while applying the Stoic principles that kept him alive.
                </p>
                <p>
                  No sugar-coating. No false promises. Just hard-earned lessons about resilience, discipline, and what it actually takes to rebuild when everything's gone.
                </p>
                <p className="text-amber-500 font-semibold italic">
                  "If you're looking for inspiration porn, this isn't it. If you want the truth about surviving and thriving—keep reading."
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-amber-600/50 transition-all">
                  <Award className="w-8 h-8 text-amber-500 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">100+</h3>
                  <p className="text-gray-400 text-sm">Businesses Built</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-amber-600/50 transition-all">
                  <Shield className="w-8 h-8 text-amber-500 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Survivor</h3>
                  <p className="text-gray-400 text-sm">Addiction Recovery</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-amber-600/50 transition-all">
                  <BookOpen className="w-8 h-8 text-amber-500 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Stoic</h3>
                  <p className="text-gray-400 text-sm">Philosophy Student</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-amber-600/50 transition-all">
                  <Star className="w-8 h-8 text-amber-500 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Pittsburgh</h3>
                  <p className="text-gray-400 text-sm">Born & Raised</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 100 Businesses Tracker */}
      <BusinessTracker />

      {/* Testimonials / Quotes Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What's <span className="gold-gradient">Inside</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Real wisdom from real experience
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "You can't think your way out of a hole you behaved your way into.",
                category: "On Action"
              },
              {
                quote: "Success isn't built on motivation. It's built on discipline when motivation is gone.",
                category: "On Discipline"
              },
              {
                quote: "The person you were got you here. Be someone different to get somewhere else.",
                category: "On Change"
              }
            ]?.map?.((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-amber-600/50 transition-all group h-full">
                  <Quote className="w-10 h-10 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <blockquote className="text-gray-300 text-lg mb-4 leading-relaxed italic">
                    {item?.quote}
                  </blockquote>
                  <p className="text-amber-500 font-semibold text-sm">{item?.category}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Product Tiers Section */}
      <section id="purchase" className="bg-gradient-to-b from-gray-900 to-gray-950">
        <ProductTiers />
      </section>

      {/* Business Idea Submission Section */}
      <section id="business-idea-form">
        <BusinessIdeaForm />
      </section>

      <Footer />
    </div>
  )
}