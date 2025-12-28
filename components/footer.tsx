import Link from 'next/link'
import { BookOpen, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-lg font-bold text-white">Advice for Life</span>
          </div>

          <nav className="flex items-center space-x-6 text-sm">
            <Link
              href="/faq"
              className="text-gray-400 hover:text-amber-500 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date()?.getFullYear?.()} Brandon Rohm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}