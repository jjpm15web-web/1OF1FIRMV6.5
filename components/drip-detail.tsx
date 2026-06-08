"use client"

import { useState } from "react"
import { ArrowLeft, Menu as MenuIcon } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import { useDripProducts, type DripProduct } from "@/lib/universe-store"

interface DripDetailProps {
  onNavigate?: (page: string) => void
}

function ProductCard({ product, onClick }: { product: DripProduct; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group text-left w-full"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-900 mb-2 md:mb-4">
        <img 
          src={product.mainImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute top-2 left-2 md:top-4 md:left-4 text-white/60 text-[10px] md:text-xs tracking-[0.2em]">
          {product.drop}
        </span>
        {product.soldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs md:text-base font-bold tracking-wider px-3 md:px-5 py-1 md:py-1.5 rotate-[-12deg]">SOLD OUT</span>
          </div>
        )}
      </div>
      <h3 className="text-white text-sm md:text-lg tracking-wide font-light mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-white/50 text-[10px] md:text-xs tracking-wider mb-2">{product.colorway}</p>
      <p className="text-white text-xs md:text-sm">{product.price.toLocaleString('es-CO')} COP</p>
    </button>
  )
}

function ProductDetail({ product, onBack }: { product: DripProduct; onBack: () => void }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-20 left-4 z-40 text-white/80 hover:text-white transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Main Product Image */}
      <div className="relative w-full aspect-[3/4] md:aspect-[16/9] max-h-[70vh]">
        <img 
          src={product.mainImage} 
          alt={product.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        {product.soldOut && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-sm md:text-lg font-bold tracking-wider px-4 md:px-6 py-1.5 md:py-2 rotate-[-6deg]">
            SOLD OUT
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 md:px-8 py-8 -mt-20 relative z-10">
        <span className="text-white/60 text-xs tracking-[0.2em] block mb-2">{product.drop}</span>
        <h1 className="text-4xl md:text-5xl font-light tracking-wide text-white mb-2" style={{ fontFamily: 'serif' }}>
          {product.name}
        </h1>
        <p className="text-white/60 text-sm tracking-wider mb-4">{product.colorway}</p>
        <p className="text-white text-xl mb-6">{product.price.toLocaleString('es-CO')} COP</p>

        {/* Sizes */}
        <div className="mb-8">
          <span className="text-white/50 text-xs tracking-[0.15em] block mb-3">SIZES</span>
          <div className="flex items-center gap-2 flex-wrap">
            {product.sizes.map((size, index) => (
              <span key={size} className="flex items-center">
                <button
                  onClick={() => setSelectedSize(size)}
                  className={`text-sm tracking-wider transition-colors px-2 py-1 ${
                    selectedSize === size 
                      ? 'text-white bg-white/10' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {size}
                </button>
                {index < product.sizes.length - 1 && (
                  <span className="text-white/30 mx-1">/</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Buy Button */}
        {product.soldOut ? (
          <div className="block w-full md:max-w-md py-4 border border-red-600/50 bg-red-600/10 text-red-500 text-sm tracking-[0.2em] text-center cursor-not-allowed">
            SOLD OUT
          </div>
        ) : (
          <a 
            href={`https://wa.me/573003676521?text=${encodeURIComponent(
              `Hola! Estoy interesado en el producto:\n\n` +
              `*${product.name}*\n` +
              `Color: ${product.colorway}\n` +
              `Precio: ${product.price.toLocaleString('es-CO')} COP\n` +
              (selectedSize ? `Talla: ${selectedSize}\n` : '') +
              `\n¿Está disponible?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full md:max-w-md py-4 border border-white/30 text-white text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 text-center"
          >
            BUY
          </a>
        )}

        {/* Gallery */}
        {product.galleryImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-8">
            {product.galleryImages.map((img, index) => (
              <div key={index} className="aspect-square overflow-hidden bg-neutral-900">
                <img 
                  src={img} 
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 md:px-8 py-6 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/50 text-xs tracking-[0.15em]">NO REPLICA. NO RESTOCK. ONLY 10F1.</p>
            <p className="text-white/30 text-xs mt-1">© 10F1 FIRM 2026</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">TERMS</a>
            <a href="#" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">PRIVACY</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function DripDetail({ onNavigate }: DripDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<DripProduct | null>(null)
  
  // Use centralized store for products
  const { products, isLoaded } = useDripProducts()

  const handleNavigate = (page: string) => {
    setIsMenuOpen(false)
    onNavigate?.(page)
  }

  if (selectedProduct) {
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
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white p-2 hover:text-amber-500 transition-colors"
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </header>

        <HamburgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={handleNavigate}
          currentPage="drip"
        />

        <ProductDetail 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
        />
      </div>
    )
  }

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
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-white p-2 hover:text-amber-500 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
        currentPage="drip"
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
        <div className="max-w-6xl mx-auto">
          <span className="text-amber-500 text-xs tracking-[0.2em] block mb-2">1 OF 1 UNIVERSE</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">DRIP</h1>
          <p className="text-white/60 text-sm tracking-wider max-w-md">
            EXCLUSIVE PIECES. LIMITED DROPS. NO REPLICA. NO RESTOCK.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="border border-white/30 py-16 px-8">
            <span className="text-amber-500/70 text-xs tracking-[0.2em]">PRÓXIMAMENTE</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-wider text-white mt-2 mb-4">DROP 02</h2>
            <p className="text-white/50 text-sm tracking-wider">STAY TUNED FOR MORE EXCLUSIVE PIECES</p>
          
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/50 text-xs tracking-[0.15em]">NO REPLICA. NO RESTOCK. ONLY 10F1.</p>
            <p className="text-white/30 text-xs mt-1">© 10F1 FIRM 2026</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">TERMS</a>
            <a href="#" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">PRIVACY</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
