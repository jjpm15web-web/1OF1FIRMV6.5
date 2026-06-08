"use client"

import { useState } from "react"
import { MapPin, Menu as MenuIcon, ArrowLeft, Play, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import TicketSelectorModal from "./ticket-selector-modal"
import { LightboxMedia, LightboxThumbnail } from "./lightbox-media"
import { useEventById } from "@/lib/events-store"
import { useAfterMovieMedia } from "@/lib/aftermovie-store"

interface CelestialDetailProps {
  onNavigate?: (page: string) => void
}

function StarIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 17L5 7L9 11L12 4L15 11L19 7L22 17H2Z" />
      <path d="M2 17H22V20H2V17Z" />
    </svg>
  )
}

export default function CelestialDetail({ onNavigate }: CelestialDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  // Get event data from store
  const { event, isLoaded } = useEventById("celestial")
  
  // Get aftermovie media from store
  const { media: galleryMedia, isLoaded: mediaLoaded } = useAfterMovieMedia("celestial")
  
  const openLightbox = (index: number) => {
    setCurrentMediaIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)
  const goToPrevious = () => setCurrentMediaIndex((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1))
  const goToNext = () => setCurrentMediaIndex((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1))

  const handleNavigate = (page: string) => {
    setIsMenuOpen(false)
    onNavigate?.(page)
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
        currentPage="events"
      />

      {/* Back Button */}
      <button 
        onClick={() => handleNavigate("home")}
        className="fixed top-20 left-4 z-30 text-white/70 hover:text-amber-500 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Hero Section - Full screen elegant queen image */}
      <section className="relative min-h-[60vh] sm:min-h-[75vh] md:min-h-screen flex flex-col justify-end pb-6 sm:pb-10 md:pb-12">
        {/* Background Image - Elegant queen silhouette */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/MChome.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
        
        {/* SOLD OUT Badge */}
        {event?.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-red-600 px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-5 shadow-2xl rotate-45">
              <span className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-widest drop-shadow-lg">SOLD OUT</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 text-center mt-24 sm:mt-32 md:mt-40">
          <span className="text-amber-500 text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-3 sm:mb-4 md:mb-6 block">SIGNATURE EVENTS</span>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-thin tracking-wide sm:tracking-wider mb-1 text-amber-500 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
            {event?.name || "MISS 1 OF 1"}
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-thin tracking-wide sm:tracking-wider mb-4 sm:mb-6 md:mb-8 text-amber-500 leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
            {event?.subtitle || "CELESTIAL"}
          </h2>

          {/* Location */}
          <div className="space-y-1 mb-4 sm:mb-6 md:mb-8">
            <p className="text-white/60 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em]">{event?.location || "BARRANQUILLA"}</p>
            <p className="text-amber-500/80 text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em]">{event?.dateLabel || "COMING SOON"}</p>
          </div>
        </div>
      </section>

      {/* Early Bird Section */}
      <section className="px-4 py-6 sm:py-8 max-w-lg mx-auto">
        {/* Early Bird Label */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-px bg-amber-500/30 flex-1" />
          <span className="text-amber-500 text-[9px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">EARLY BIRD · {event?.stage || "ETAPA CREYENTES"}</span>
          <div className="h-px bg-amber-500/30 flex-1" />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Ticket */}
          <div className="border border-amber-500/30 p-4 sm:p-6 text-center bg-black/50">
            <div className="flex justify-center mb-3 sm:mb-4">
              <StarIcon />
            </div>
            <h3 className="text-white font-medium tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">TICKET</h3>
            <div className="mb-2">
              <span className="text-2xl sm:text-3xl font-light text-amber-500">{event?.ticketPrice?.replace(" COP", "").replace("$", "") || "45K"}</span>
            </div>
          </div>

          {/* VIP Table */}
          <div className="border border-amber-500/30 p-4 sm:p-6 text-center bg-black/50">
            <div className="flex justify-center mb-3 sm:mb-4">
              <CrownIcon />
            </div>
            <h3 className="text-white font-medium tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">VIP TABLE</h3>
            <div className="mb-2">
              <span className="text-2xl sm:text-3xl font-light text-amber-500">{event?.vipPrice?.replace(" COP", "").replace("$", "") || "500K"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reserve CTA */}
      <section className="px-4 py-4 sm:py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <div className="h-px bg-amber-500/30 flex-1" />
          <span className="text-amber-500 text-[9px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">RESERVE YOUR EXPERIENCE</span>
          <div className="h-px bg-amber-500/30 flex-1" />
        </div>
      </section>

      {/* Description Section */}
      <section className="px-4 py-6 sm:py-8 max-w-lg mx-auto">
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-white/60 text-xs sm:text-sm tracking-wide sm:tracking-wider leading-relaxed">
            Un certamen de belleza exclusivo donde elegancia, estilo y confianza se unen en una noche inolvidable.
          </p>
          <p className="text-white/60 text-xs sm:text-sm tracking-wide sm:tracking-wider leading-relaxed">
            Experimenta la magia de CELESTIAL con after party incluido.
          </p>
        </div>
      </section>

      {/* Event Details */}
      <section className="px-4 py-4 sm:py-6 max-w-lg mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-amber-500 text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-center mb-3 sm:mb-4">DETALLES DEL EVENTO</h3>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500/60 flex-shrink-0" />
              <span className="text-white/80 text-xs sm:text-sm tracking-wide sm:tracking-wider">{event?.location || "BARRANQUILLA"}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-white/80 text-xs sm:text-sm tracking-wide sm:tracking-wider">{event?.dateLabel || "FECHA PRÓXIMAMENTE"}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-white/80 text-xs sm:text-sm tracking-wide sm:tracking-wider">CERTAMEN + AFTER PARTY</span>
            </div>
          </div>
        </div>
      </section>

{/* CTA Button */}
      <section className="px-4 py-6 sm:py-8 max-w-lg mx-auto">
        {event?.soldOut ? (
          <div className="w-full py-3 sm:py-4 bg-red-600/20 border border-red-600 text-red-500 text-sm sm:text-base font-medium tracking-widest text-center cursor-not-allowed">
            SOLD OUT
          </div>
        ) : (
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="w-full py-3 sm:py-4 bg-amber-500 text-black text-sm sm:text-base font-medium tracking-widest hover:bg-amber-400 transition-colors"
          >
            RESERVAR MI LUGAR
          </button>
        )}
        <p className="text-center text-white/40 text-[9px] sm:text-[10px] tracking-wide sm:tracking-wider mt-2 sm:mt-3">
          CUPOS LIMITADOS. RESERVA AHORA.
        </p>
      </section>

      {/* Aftermovie Section */}
      <section className="px-3 sm:px-4 py-4 sm:py-6">
        <div
          className="relative py-6 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 border border-white/10 overflow-hidden rounded-lg min-h-[150px] md:min-h-[300px]"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/MChome.png')`,
            backgroundSize: "contain",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div>
              <span className="text-amber-500 text-[8px] sm:text-[10px] tracking-widest">REVIVE LA EXPERIENCIA</span>
              <h3 className="text-xl sm:text-3xl font-light tracking-wider mt-1 text-amber-100">MISS 1 OF 1 CELESTIAL</h3>
              <button 
                onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-white/80 hover:text-amber-500 transition-colors"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs tracking-widest">VER AFTERMOVIE</span>
                {isGalleryOpen ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Expandable Gallery */}
        {isGalleryOpen && (
          <div className="mt-4 border border-white/10 bg-black/50 p-3 sm:p-4 rounded-lg">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {galleryMedia.map((media, index) => (
                <div 
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square cursor-pointer group overflow-hidden rounded"
                >
                  <LightboxThumbnail
                    type={media.type}
                    src={media.src}
                    alt={media.alt}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                  {media.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors p-2">
            <X className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="absolute left-2 md:left-6 z-50 text-white/70 hover:text-amber-500 transition-colors p-2">
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh]">
            <LightboxMedia type={galleryMedia[currentMediaIndex].type} src={galleryMedia[currentMediaIndex].src} alt={galleryMedia[currentMediaIndex].alt} />
          </div>
          <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-2 md:right-6 z-50 text-white/70 hover:text-amber-500 transition-colors p-2">
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{currentMediaIndex + 1} / {galleryMedia.length}</div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        <div className="text-center sm:text-left">
          <p className="text-white/60 text-[10px] sm:text-xs">1 OF 1 FIRM</p>
          <p className="text-white/40 text-[9px] sm:text-[10px] mt-1">THIS IS NOT FOR EVERYONE.</p>
          <p className="text-amber-500 text-[10px] sm:text-xs tracking-wide sm:tracking-wider">#1UNIQUEEXPERIENCE</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
              <circle cx="18.406" cy="5.594" r="1.44"/>
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>
        </div>
      </footer>

      {/* Ticket Selector Modal */}
      <TicketSelectorModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        preSelectedEvent="celestial"
      />
    </div>
  )
}
