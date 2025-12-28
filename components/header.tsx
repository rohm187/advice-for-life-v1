'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window?.scrollY > 50)
    }
    window?.addEventListener?.('scroll', handleScroll)
    return () => window?.removeEventListener?.('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <BookOpen className="w-6 h-6 text-amber-500 group-hover:text-amber-400 transition-colors" />
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
              Advice for Life
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#about"
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/faq"
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium"
            >
              Contact
            </Link>
            <Link
              href="/#purchase"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-amber-600/50 hover:scale-105"
            >
              Get the Book
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-amber-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/98 backdrop-blur-md border-t border-gray-800"
          >
            <nav className="px-4 py-4 space-y-3">
              <Link
                href="/#about"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-amber-500 hover:bg-gray-800/50 rounded-lg transition-all"
              >
                About
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-amber-500 hover:bg-gray-800/50 rounded-lg transition-all"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-amber-500 hover:bg-gray-800/50 rounded-lg transition-all"
              >
                Contact
              </Link>
              <Link
                href="/#purchase"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all text-center"
              >
                Get the Book
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}