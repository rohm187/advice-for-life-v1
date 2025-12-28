import { Suspense } from 'react'
import SuccessContent from './_components/success-content'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  )
}