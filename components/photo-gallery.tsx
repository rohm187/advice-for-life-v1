'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoGalleryProps {
  title: string;
  subtitle: string;
  photos: {
    filename: string;
    caption?: string;
  }[];
  galleryPath: string;
}

export function PhotoGallery({ title, subtitle, photos, galleryPath }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Header */}
      <div className="border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
            <p className="text-sm text-zinc-500 mt-4">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setSelectedPhoto(index)}
            >
              <div className="relative aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-300">
                <Image
                  src={`/galleries/${galleryPath}/${photo.filename}`}
                  alt={photo.caption || `Photo ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {photo.caption && (
                <p className="text-sm text-zinc-400 mt-2 text-center">{photo.caption}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/galleries/${galleryPath}/${photos[selectedPhoto].filename}`}
                  alt={photos[selectedPhoto].caption || `Photo ${selectedPhoto + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              {photos[selectedPhoto].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 text-center">
                  <p className="text-white text-lg">{photos[selectedPhoto].caption}</p>
                </div>
              )}
            </motion.div>

            {/* Navigation buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1));
                }}
                className="px-4 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition-colors"
              >
                ← Previous
              </button>
              <span className="px-4 py-2 rounded-full bg-zinc-900/80 text-white">
                {selectedPhoto + 1} / {photos.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0));
                }}
                className="px-4 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition-colors"
              >
                Next →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Book Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center border-t border-amber-900/20 pt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
          >
            ← Back to Advice for Life
          </a>
        </div>
      </div>
    </div>
  );
}
