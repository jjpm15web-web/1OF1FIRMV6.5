"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import { useMaisonProducts, type MaisonProduct } from "@/lib/universe-store"

interface MaisonSwimDetailProps {
  onNavigate?: (page: string) => void
}

const categories = ["ALL", "MEN", "WOMEN", "ACCESSORIES", "BEACH ESSENTIALS"]

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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

export default function MaisonSwimDetail({ onNavigate }: MaisonSwimDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("ALL")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use centralized store for products
  const { products, isLoaded } = useMaisonProducts()

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }, [])

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

  const handleWhatsAppBuy = (product: MaisonProduct) => {
    const message = `Hi! I'm interested in purchasing the ${product.name} in ${product.color} ($${product.price.toFixed(2)} USD)`
    window.open(`https://wa.me/573001234567?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => onNavigate?.("home")} className="cursor-pointer">
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
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-current"></div>
                <div className="w-6 h-0.5 bg-current"></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Mismo estilo que Vision Gallery */}
      <section className="pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 items-center">
          <div>
            <span className="text-white/60 text-[8px] md:text-xs tracking-[0.2em] block mb-2 md:mb-4">MAISON SWIM</span>
            <h1 className="text-2xl md:text-6xl font-bold tracking-tight leading-none mb-2 md:mb-6" style={{ fontFamily: 'serif' }}>
              SWIM<br />WEAR
            </h1>
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
              <div className="w-4 md:w-8 h-px bg-white/30"></div>
              <Sparkle />
            </div>
            <p className="text-white/60 text-[8px] md:text-xs tracking-wider leading-relaxed max-w-sm">
              TIMELESS SWIMWEAR.<br />
              CRAFTED FOR THE SUN.<br />
              DESIGNED TO MAKE<br />
              A STATEMENT.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://f005.backblazeb2.com/file/b21of1firm/background/MAISONhome.jpg"
              alt="Maison Swim"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 md:px-6 py-4 md:py-6 border-b border-white/10">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-[10px] md:text-xs tracking-[0.15em] whitespace-nowrap transition-colors ${
                activeCategory === category 
                  ? "text-white border-b-2 border-white pb-1" 
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xs md:text-sm tracking-[0.2em] text-white/80">FEATURED COLLECTION</h2>
          <button className="flex items-center gap-2 text-white/60 text-[10px] md:text-xs tracking-wider hover:text-amber-500 transition-colors">
            
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden"
            >
              {/* Product Header */}
              <div className="flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-white/50">
                <span>{product.edition}</span>
                <span className="text-green-500">{product.badge}</span>
              </div>
              
              {/* Product Image */}
              <div 
                className="aspect-square bg-zinc-800 relative overflow-hidden cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {product.soldOut && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white text-[10px] md:text-sm font-bold tracking-wider px-2 md:px-4 py-1 rotate-[-12deg]">SOLD OUT</span>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-2 md:p-3">
                <h3 className="text-xs md:text-sm font-medium tracking-wide line-clamp-2">{product.name}</h3>
                <p className="text-[10px] md:text-xs text-white/50 tracking-wide mt-0.5 md:mt-1">{product.color}</p>
                <p className="text-xs md:text-sm mt-1 md:mt-2">${product.price.toFixed(2)} COP</p>
                
                {/* Buy Button */}
                {product.soldOut ? (
                  <div className="w-full mt-2 md:mt-3 flex items-center justify-center bg-red-600/10 border border-red-600/50 text-red-500 rounded-full py-2 md:py-2.5 text-[10px] md:text-xs tracking-wider cursor-not-allowed">
                    SOLD OUT
                  </div>
                ) : (
                  <button
                    onClick={() => handleWhatsAppBuy(product)}
                    className="w-full mt-2 md:mt-3 flex items-center justify-center gap-1.5 md:gap-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full py-2 md:py-2.5 text-[10px] md:text-xs tracking-wider transition-colors"
                  >
                    <WhatsAppIcon />
                    <span className="hidden sm:inline">BUY ON WHATSAPP</span>
                    <span className="sm:hidden">COMPRAR</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-6 py-8 md:py-12 border-t border-white/10">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-white/60">
              MADE FOR SUN. DESIGNED TO LAST.
            </p>
          </div>
          <Sparkle />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 text-[10px] md:text-xs text-white/40">
          <span>© MAISON SWIM 2026</span>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="hover:text-amber-500 transition-colors">TERMS</a>
            <a href="#" className="hover:text-amber-500 transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-amber-500 transition-colors">FAQ</a>
            <a href="#" className="hover:text-amber-500 transition-colors hidden sm:inline">GLOBAL</a>
          </div>
        </div>
      </footer>

      {/* Back Button */}
      <button 
        onClick={() => onNavigate?.("home")}
        className="fixed top-20 left-4 z-30 text-white/70 hover:text-amber-500 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Lightbox Modal */}
      {lightboxOpen && products.length > 0 && (
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
            <div className="relative">
              <img
                src={products[currentIndex]?.image}
                alt={products[currentIndex]?.name || 'Product image'}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>
            
            {/* Caption */}
            <div className="mt-4 text-center">
              <span className="text-white/50 text-xs tracking-wider">
                {products[currentIndex]?.edition}
              </span>
              <h3 className="text-white text-lg md:text-xl font-medium tracking-wide mt-2">
                {products[currentIndex]?.name}
              </h3>
              <p className="text-white/60 text-sm tracking-wider mt-1">
                {products[currentIndex]?.color}
              </p>
              <p className="text-amber-500 text-sm mt-2">
                ${products[currentIndex]?.price.toFixed(2)} COP
              </p>
            </div>

            {/* Indicator */}
            <div className="mt-4 text-white/50 text-sm">
              {currentIndex + 1} / {products.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
