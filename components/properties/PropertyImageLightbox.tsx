"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string; alt?: string | null }>;
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  propertyTitle?: string;
}

export function PropertyImageLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  propertyTitle,
}: PropertyImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((currentIndex === 0 ? images.length - 1 : currentIndex - 1));
      if (e.key === "ArrowRight") onIndexChange((currentIndex === images.length - 1 ? 0 : currentIndex + 1));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div>
              <span className="text-xs text-brand-orange uppercase tracking-wider font-bold block">
                Photo Gallery Lightbox
              </span>
              <h3 className="text-sm font-semibold truncate max-w-sm sm:max-w-md">
                {propertyTitle || "Property Photo View"}
              </h3>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </span>
              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Animated Image Display */}
          <div className="relative flex-grow flex items-center justify-center my-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full h-full max-w-5xl max-h-[75vh]"
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || propertyTitle || "Property Photo"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Next / Previous Arrow Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
                  className="absolute left-4 p-3 rounded-full bg-black/60 text-white hover:bg-brand-orange transition-all backdrop-blur-sm border border-white/20 shadow-xl"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
                  className="absolute right-4 p-3 rounded-full bg-black/60 text-white hover:bg-brand-orange transition-all backdrop-blur-sm border border-white/20 shadow-xl"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Carousel Strip */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto pt-3 border-t border-white/10">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onIndexChange(idx)}
                  className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === idx
                      ? "border-brand-orange ring-2 ring-brand-orange/40 scale-105"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt="Thumbnail" fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
