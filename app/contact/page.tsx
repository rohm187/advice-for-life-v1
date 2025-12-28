import { Mail, MessageSquare } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'
import ContactForm from './_components/contact-form'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get in <span className="gold-gradient">Touch</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Have questions? Need help with your order? We're here for you.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimatedSection delay={0.2}>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-amber-600/50 transition-all">
                <Mail className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                <p className="text-gray-400">
                  We typically respond within 24 hours. Send us your questions or concerns.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-amber-600/50 transition-all">
                <MessageSquare className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Technical Issues</h3>
                <p className="text-gray-400">
                  Problems with download or payment? We'll get it sorted out quickly.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.4}>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </div>

      <Footer />
    </div>
  )
}