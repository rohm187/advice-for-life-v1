'use client';

import { useState } from 'react';
import { Check, Download, Package, Headphones, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const products = [
  {
    id: 'pdf',
    name: 'PDF eBook',
    price: 1499,
    displayPrice: '$14.99',
    description: 'Digital version - Read anywhere',
    features: [
      'Instant download',
      'Full book content',
      'Optimized for all devices',
      'Lifetime access',
    ],
    icon: Download,
    popular: false,
  },
  {
    id: 'audiobook',
    name: 'Audiobook + Bonuses',
    price: 1999,
    displayPrice: '$19.99',
    description: 'Listen in my own voice + extras',
    features: [
      'Narrated by Brandon Rohm',
      'Bonus stories & raw moments',
      '5 Songs playlist for hard times',
      'Instant streaming/download',
      'Behind-the-scenes commentary',
    ],
    icon: Headphones,
    popular: false,
  },
  {
    id: 'paperback',
    name: 'Paperback Physical Copy',
    price: 2499,
    displayPrice: '$24.99',
    description: 'Affordable physical book',
    features: [
      'Quality paperback edition',
      'Includes PDF version',
      'Shipped to your door',
      'Easy to read format',
    ],
    icon: Package,
    popular: false,
  },
  {
    id: 'hardback',
    name: 'Hardback Physical Copy',
    price: 4199,
    displayPrice: '$41.99',
    description: 'Premium physical book',
    features: [
      'High-quality hardback edition',
      'Includes PDF version',
      'Shipped to your door',
      'Collector\'s item',
    ],
    icon: Package,
    popular: false,
  },
  {
    id: 'bundle',
    name: 'Complete Bundle',
    price: 5999,
    displayPrice: '$59.99',
    description: 'Everything. Best value.',
    features: [
      'PDF eBook',
      'Audiobook + Bonuses',
      'Hardback Physical Copy',
      'Save $36.97',
      'Complete experience',
    ],
    icon: Sparkles,
    popular: true,
    badge: 'BEST VALUE',
  },
];

interface ProductTiersProps {
  className?: string;
}

export default function ProductTiers({ className = '' }: ProductTiersProps) {
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  const handlePurchase = async (productId: string) => {
    try {
      setLoadingProduct(productId);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productType: productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      console.error('Purchase error:', error);
      toast.error(message || 'Failed to process purchase');
      setLoadingProduct(null);
    }
  };

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="gold-gradient">Experience</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get the book in the format that works best for you. All options include the same powerful content.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            const isLoading = loadingProduct === product.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-gradient-to-br from-zinc-900 to-black border ${
                  product.popular
                    ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'border-zinc-800'
                } rounded-2xl p-6 flex flex-col hover:shadow-2xl transition-all duration-300 ${
                  product.popular ? 'lg:scale-105' : ''
                }`}
              >
                {product.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold rounded-full">
                    {product.badge}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${
                      product.popular
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20'
                        : 'bg-zinc-800/50'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        product.popular ? 'text-amber-400' : 'text-zinc-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{product.name}</h3>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm mb-4">{product.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{product.displayPrice}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          product.popular ? 'text-amber-400' : 'text-zinc-400'
                        }`} />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(product.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    product.popular
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Buy Now
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-zinc-500 mt-8"
        >
          Secure checkout powered by Stripe. 30-day money-back guarantee.
        </motion.p>
      </div>
    </section>
  );
}
