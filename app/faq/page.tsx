import { ChevronDown } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'
import FAQItem from './_components/faq-item'

export default function FAQPage() {
  const faqs = [
    {
      question: 'What format is the book in?',
      answer: 'The book is delivered as a PDF file that you can read on any device - computer, tablet, or smartphone. No special reader required.'
    },
    {
      question: 'How do I receive the book after purchase?',
      answer: 'Immediately after completing your purchase, you\'ll be redirected to a download page. You\'ll also receive an email with your download link. The link is valid for 7 days and allows up to 3 downloads.'
    },
    {
      question: 'Is this a physical book or ebook?',
      answer: 'This is a digital ebook (PDF format). You receive instant access after purchase - no shipping, no waiting. Read it immediately on any device.'
    },
    {
      question: 'What if I lose my download link?',
      answer: 'Check your email for the order confirmation which contains your download link. If you can\'t find it, contact us with your order details and we\'ll help you out.'
    },
    {
      question: 'Is my payment secure?',
      answer: 'Absolutely. All payments are processed through Stripe, one of the world\'s most trusted payment processors. We never see or store your credit card information.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Due to the digital nature of the product and instant delivery, all sales are final. However, if you experience any technical issues with your download, please contact us and we\'ll make it right.'
    },
    {
      question: 'Who is this book for?',
      answer: 'This book is for anyone who wants raw, honest advice about overcoming adversity, building discipline, and creating success from nothing. Whether you\'re recovering from addiction, facing hard times, or just want unfiltered truth - this is for you.'
    },
    {
      question: 'How long is the book?',
      answer: 'The book contains essential lessons and insights from lived experience. It\'s designed to be read, re-read, and referenced throughout your journey. Quality over quantity.'
    },
    {
      question: 'Will you spam my email?',
      answer: 'No. Your email is used only for order confirmation and delivery. We respect your inbox and your time.'
    },
    {
      question: 'Can I share the PDF with others?',
      answer: 'The PDF is licensed for your personal use. If you know someone who would benefit from this book, send them to this website so they can get their own copy and support the work.'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked <span className="gold-gradient">Questions</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Everything you need to know about getting your copy
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs?.map?.((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <FAQItem question={faq?.question ?? ''} answer={faq?.answer ?? ''} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5}>
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">
                Still have questions?
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all"
              >
                Contact Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <Footer />
    </div>
  )
}