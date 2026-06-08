"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, ArrowRight, Menu as MenuIcon, X, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import { useVisionArtworks, type VisionArtwork } from "@/lib/universe-store"

interface VisionGalleryDetailProps {
  onNavigate?: (page: string) => void
}

const categories = ["ALL", "LANDSCAPES", "URBAN", "BLACK & WHITE", "ABSTRACT"]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function Sparkle() {
  return (
    <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
    </svg>
  )
}

function ArtworkCard({ artwork, onImageClick }: { artwork: VisionArtwork; onImageClick: () => void }) {
  const whatsappMessage = encodeURIComponent(`Hi! I'm interested in purchasing "${artwork.name}" - $${artwork.price.toFixed(2)} ${artwork.currency}`)
  const whatsappLink = `https://wa.me/573003676521?text=${whatsappMessage}`

  return (
    <div className="group">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <span className="text-white/60 text-[10px] md:text-xs tracking-wider">{artwork.number} / {artwork.totalEditions}</span>
        <span className="text-white/60 text-[10px] md:text-xs tracking-wider">{artwork.available ? "AVAILABLE" : "SOLD"}</span>
      </div>

      {/* Framed Image */}
      <div 
        className="relative bg-neutral-900 p-2 md:p-4 mb-2 md:mb-4 cursor-pointer"
        onClick={onImageClick}
      >
        <div className="relative aspect-[4/3] overflow-hidden border-2 md:border-4 border-neutral-700 shadow-2xl">
          <img 
            src={artwork.image} 
            alt={artwork.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
          {!artwork.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs md:text-base font-bold tracking-wider px-3 md:px-5 py-1 md:py-1.5 rotate-[-12deg]">SOLD OUT</span>
            </div>
          )}
        </div>
      </div>

      {/* Artwork Info */}
      <h3 className="text-white text-sm md:text-base tracking-wide font-medium mb-1 line-clamp-1">{artwork.name}</h3>
      <p className="text-white/50 text-[10px] md:text-xs tracking-wider mb-1 md:mb-2 line-clamp-1">{artwork.type}</p>
      <p className="text-white text-xs md:text-sm mb-2 md:mb-4">${artwork.price.toFixed(2)} {artwork.currency}</p>

      {/* Buy Button */}
      {artwork.available ? (
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 md:gap-3 w-full py-2 md:py-3 bg-neutral-900 border border-neutral-700 text-white text-[10px] md:text-xs tracking-[0.1em] md:tracking-[0.15em] hover:bg-neutral-800 hover:border-amber-500/50 transition-all duration-300"
        >
          <WhatsAppIcon />
          <span className="hidden sm:inline">BUY ON WHATSAPP</span>
          <span className="sm:hidden">COMPRAR</span>
        </a>
      ) : (
        <div className="flex items-center justify-center w-full py-2 md:py-3 bg-red-600/10 border border-red-600/50 text-red-500 text-[10px] md:text-xs tracking-[0.15em] cursor-not-allowed">
          SOLD OUT
        </div>
      )}
    </div>
  )
}

export default function VisionGalleryDetail({ onNavigate }: VisionGalleryDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("ALL")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use centralized store for artworks
  const { artworks, isLoaded } = useVisionArtworks()

  const handleNavigate = (page: string) => {
    setIsMenuOpen(false)
    onNavigate?.(page)
  }

  const filteredArtworks = activeCategory === "ALL" 
    ? artworks 
    : artworks.filter(a => a.category === activeCategory)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? filteredArtworks.length - 1 : prev - 1))
  }, [filteredArtworks.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === filteredArtworks.length - 1 ? 0 : prev + 1))
  }, [filteredArtworks.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goToPrevious, goToNext])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => handleNavigate("home")} className="cursor-pointer">
          <img 
            src="/logo.png" 
            alt="1 OF 1 FIRM" 
            className="h-10 md:h-12 w-auto"
          />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white p-2 hover:text-amber-500 transition-colors"
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
        currentPage="vision-gallery"
      />

      {/* Back Button */}
      <button 
        onClick={() => handleNavigate("home")}
        className="fixed top-20 left-4 z-30 text-white/70 hover:text-amber-500 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 items-center">
          <div>
            <span className="text-white/60 text-[10px] md:text-xs tracking-[0.2em] block mb-2 md:mb-4">VISION GALLERY</span>
            <h1 className="text-2xl md:text-7xl font-light tracking-tight leading-none mb-3 md:mb-6" style={{ fontFamily: 'serif' }}>
              PHOTO<br />GALLERY
            </h1>
            <div className="flex items-center gap-2 mb-2 md:mb-4">
              <div className="w-6 md:w-8 h-px bg-white/30"></div>
              <Sparkle />
            </div>
            <p className="text-[8px] md:text-sm tracking-wider leading-relaxed max-w-sm" style={{ color: '#bdb8b8' }}>
              A CURATED EXHIBITION<br />
              OF IMAGES THAT TELL STORIES.<br />
              VISUAL ART AT ITS<br />
              FINEST EXPRESSION.
            </p>
          </div>
          <div className="relative flex justify-end">
            <img 
              src="https://f005.backblazeb2.com/file/b21of1firm/background/VISIONhome.jpg"
              alt="Vision Gallery"
              className="w-full md:w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 md:px-8 py-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-xs tracking-[0.15em] whitespace-nowrap transition-colors ${
                  activeCategory === category 
                    ? 'text-white font-medium' 
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Galleries Header */}
      <section className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h2 className="text-white text-sm tracking-[0.15em]">FEATURED GALLERIES</h2>
          <button className="flex items-center gap-2 text-white/60 text-xs tracking-wider hover:text-white transition-colors">
            
          </button>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-8">
            {filteredArtworks.map((artwork, index) => (
              <ArtworkCard 
                key={artwork.id} 
                artwork={artwork} 
                onImageClick={() => openLightbox(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="px-4 md:px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="text-white/70 text-sm tracking-[0.2em]">VISUAL ART. EMOTION. INSPIRATION.</p>
        </div>
        <div className="flex justify-center mt-2">
          <Sparkle />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© VISION GALLERY 2026</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">TERMS</a>
            <a href="#" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">FAQ</a>
            <span className="text-white/50 text-xs tracking-wider">COLOMBIA</span>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && filteredArtworks.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous button */}
          <button 
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-amber-500 transition-colors z-50 p-2"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Next button */}
          <button 
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-amber-500 transition-colors z-50 p-2"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Content */}
          <div 
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-neutral-900 p-3 md:p-6">
              <div className="border-2 md:border-4 border-neutral-700 shadow-2xl">
                <img
                  src={filteredArtworks[currentIndex]?.image}
                  alt={filteredArtworks[currentIndex]?.name || 'Gallery image'}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
            </div>
            
            {/* Caption */}
            <div className="mt-4 text-center">
              <span className="text-white/50 text-xs tracking-wider">
                {filteredArtworks[currentIndex]?.number} / {filteredArtworks[currentIndex]?.totalEditions}
              </span>
              <h3 className="text-white text-lg md:text-xl font-medium tracking-wide mt-2">
                {filteredArtworks[currentIndex]?.name}
              </h3>
              <p className="text-white/60 text-sm tracking-wider mt-1">
                {filteredArtworks[currentIndex]?.type}
              </p>
              <p className="text-amber-500 text-sm mt-2">
                ${filteredArtworks[currentIndex]?.price.toFixed(2)} {filteredArtworks[currentIndex]?.currency}
              </p>
            </div>

            {/* Indicator */}
            <div className="mt-4 text-white/50 text-sm">
              {currentIndex + 1} / {filteredArtworks.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
