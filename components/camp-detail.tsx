"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import ImageWithSkeleton from "./image-with-skeleton"
import { useCamps } from "@/lib/universe-store"

interface CampDetailProps {
  onNavigate?: (page: string) => void
}

export default function CampDetail({ onNavigate }: CampDetailProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Use centralized store for camps
  const { camps, isLoaded } = useCamps()

  // SOLD OUT state controlled from the admin panel (CAMP section)
  const allCampsSoldOut = camps.length > 0 && camps.every((camp) => camp.soldOut)

  const galleryImages = [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
    "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400&q=80",
  ]

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 md:p-6">
        <button onClick={() => onNavigate?.("home")}>
          <img src="/logo.png" alt="1 OF 1 FIRM" className="h-10 md:h-12 w-auto" />
        </button>
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-1.5 p-2"
          aria-label="Open menu"
        >
          <span className="w-6 h-px bg-white" />
          <span className="w-6 h-px bg-white" />
        </button>
      </header>

      <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Hero Section - Mismo estilo que Vision Gallery */}
      <section className="pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 items-center">
          <div>
            <span className="text-white/60 text-[8px] md:text-xs tracking-[0.2em] block mb-2 md:mb-4">1 OF 1 UNIVERSE</span>
            <h1 className="text-2xl md:text-6xl font-light tracking-tight leading-none mb-2 md:mb-6" style={{ fontFamily: 'serif' }}>
              CAMP
            </h1>
            <p className="text-amber-500 text-[8px] md:text-sm tracking-[0.15em] md:tracking-[0.2em] mb-2 md:mb-4">
              ARTISTS / GROWTH
            </p>
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
              <div className="w-4 md:w-8 h-px bg-white/30"></div>
              <svg className="w-2 md:w-3 h-2 md:h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
              </svg>
            </div>
            <p className="text-white/20 text-[8px] md:text-xs tracking-wider leading-relaxed max-w-sm">
              FOR EMERGING AND<br />
              ESTABLISHED ARTISTS.<br />
              CREATE. INSPIRE.<br />
              EVOLVE.
            </p>
          </div>
          <div className="relative">
            <ImageWithSkeleton
              src="https://f005.backblazeb2.com/file/b21of1firm/background/CAMPhome.jpg"
              alt="Camp"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Next Camps Section */}
      <section className="px-4 md:px-12 py-12 md:py-16 bg-black">
        <h2 className="text-white/20 text-[10px] md:text-xs tracking-[0.3em] mb-8 md:mb-12">NEXT CAMPS</h2>
        
        <div className="space-y-8 md:space-y-12">
          {camps.map((camp) => (
            <div key={camp.number} className="flex items-start gap-4 md:gap-6 border-b border-white/10 pb-6 md:pb-8">
              <span className="text-amber-500 text-xl md:text-3xl font-light">{camp.number}</span>
              <div className="flex-1">
                <div className="border-l-2 border-amber-500/50 pl-4 md:pl-6">
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <h3 className="text-lg md:text-4xl font-light tracking-wider mb-1 md:mb-2" style={{ fontFamily: "serif" }}>
                      {camp.dates}
                    </h3>
                    {camp.soldOut && (
                      <span className="bg-red-600 text-white text-[9px] md:text-xs font-bold tracking-wider px-2 md:px-3 py-0.5 md:py-1">SOLD OUT</span>
                    )}
                  </div>
                  <p className="text-white/50 text-[10px] md:text-xs tracking-[0.2em]">{camp.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Apply CTA */}
        <div className="mt-12 md:mt-16">
          <p className="text-white/60 text-[10px] md:text-xs tracking-[0.3em] mb-3 md:mb-4">LIMITED SPOTS.</p>
          {allCampsSoldOut ? (
            <div className="w-full border border-red-600 bg-red-600/10 text-red-500 py-3 md:py-4 flex items-center justify-center gap-3 md:gap-4 cursor-not-allowed">
              <span className="text-xs md:text-sm tracking-[0.3em] font-bold">SOLD OUT</span>
            </div>
          ) : (
            <a
              href={`https://wa.me/573003676521?text=${encodeURIComponent(
                "Hi! I'm interested in applying for the CAM camp. Could you share more details about availability and how to secure my spot?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-amber-500 text-amber-500 py-3 md:py-4 flex items-center justify-center gap-3 md:gap-4 hover:bg-amber-500 hover:text-black transition-all duration-300 group"
            >
              <span className="text-xs md:text-sm tracking-[0.3em]">APPLY NOW</span>
              <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="overflow-hidden">
        <div className="flex">
          {galleryImages.map((img, index) => (
            <div 
              key={index} 
              className="w-1/4 md:w-1/4 aspect-square flex-shrink-0 cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <ImageWithSkeleton
                src={img}
                alt={`Camp gallery ${index + 1}`}
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-2 md:left-6 z-50 text-white/70 hover:text-amber-500 transition-colors p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Image */}
          <div 
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[currentImageIndex].replace("w=400", "w=1200")}
              alt={`Camp gallery ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-2 md:right-6 z-50 text-white/70 hover:text-amber-500 transition-colors p-2"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wider">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-4 md:px-12 py-6 md:py-8 bg-black border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <p className="text-white/50 text-[10px] md:text-xs tracking-[0.15em]">
            FIRST EDITION — FEBRUARY 2025
          </p>
          <div className="text-left md:text-right">
            <p className="text-white/70 text-[10px] md:text-xs tracking-[0.15em]">THIS IS NOT FOR EVERYONE.</p>
            <p className="text-amber-500 text-[10px] md:text-xs tracking-[0.15em]">#1UNIQUEEXPERIENCE</p>
          </div>
        </div>
      </footer>

      {/* Back Button */}
      <button
        onClick={() => onNavigate?.("home")}
        className="fixed top-20 left-4 md:left-6 z-30 text-white/70 hover:text-amber-500 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    </div>
  )
}
