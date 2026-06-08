"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Clock, Play, Menu as MenuIcon, ArrowLeft, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import TicketSelectorModal from "./ticket-selector-modal"
import { LightboxMedia, LightboxThumbnail } from "./lightbox-media"
import { useEventById } from "@/lib/events-store"
import { useAfterMovieMedia } from "@/lib/aftermovie-store"

interface EventDetailProps {
  onNavigate?: (page: string) => void
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-amber-500/30 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-500/70" />
        </div>
        <div className="text-[7px] sm:text-[9px] md:text-xs text-white/60 leading-tight">
          FALTAN PARA<br />BABADOOK 2026
        </div>
      </div>
      <div className="flex gap-1.5 sm:gap-2 md:gap-6">
        <div className="text-center">
          <div className="text-base sm:text-xl md:text-4xl font-light text-amber-500">{String(timeLeft.days).padStart(3, '0')}</div>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] tracking-wider text-white/50">DÍAS</div>
        </div>
        <div className="text-center">
          <div className="text-base sm:text-xl md:text-4xl font-light text-amber-500">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] tracking-wider text-white/50">HORAS</div>
        </div>
        <div className="text-center">
          <div className="text-base sm:text-xl md:text-4xl font-light text-amber-500">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] tracking-wider text-white/50">MIN</div>
        </div>
        <div className="text-center">
          <div className="text-base sm:text-xl md:text-4xl font-light text-amber-500">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[6px] sm:text-[8px] md:text-[10px] tracking-wider text-white/50">SEG</div>
        </div>
      </div>
    </div>
  )
}

function TicketIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 10L28 10L28 22L4 22L4 10Z" />
      <path d="M8 14L12 14M8 18L16 18" />
      <circle cx="24" cy="16" r="2" />
    </svg>
  )
}

function VIPIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 4L18 10H24L19 14L21 20L16 16L11 20L13 14L8 10H14L16 4Z" />
      <path d="M8 24H24" />
      <path d="M6 28H26" />
    </svg>
  )
}

export default function EventDetail({ onNavigate }: EventDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  
  // Get event data from store
  const { event, isLoaded } = useEventById("babadook")
  
  // Get aftermovie media from store
  const { media: galleryMedia, isLoaded: mediaLoaded } = useAfterMovieMedia("babadook")
  
  // Target date from store or default: October 30, 2026
  const targetDate = new Date(event?.countdownDate || '2026-10-30T00:00:00')

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

      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] flex flex-col justify-end pb-6 sm:pb-8">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-contain md:bg-cover bg-center bg-no-repeat bg-black"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/BBback.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        
        {/* SOLD OUT Badge */}
        {event?.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-red-600 px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-5 shadow-2xl rotate-45">
              <span className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-widest drop-shadow-lg">SOLD OUT</span>
            </div>
          </div>
        )}
        
        {/* Demon Figure Overlay */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-contain bg-right bg-no-repeat opacity-90 pointer-events-none"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/BDsig.png')`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-3 sm:px-4 md:px-8 pt-20">
          <div className="max-w-2xl">
            <span className="text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase">Signature Events</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-thin tracking-wider mb-1 sm:mb-2 text-white leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
            {event?.name || "BADADOOK 2026"}
          </h1>
            <p className="text-red-500 text-sm sm:text-base md:text-lg lg:text-xl tracking-wider mb-2 sm:mb-4">{event?.description || "6TA EDICION"}</p>
            <p className="text-white/70 text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed max-w-md">
              SEXTO ANIVERSARIO DE 1OF1.<br />
              SEIS AÑOS CONSTRUYENDO<br />
              LA EXPERIENCIA MÁS INMERSIVA DEL PAÍS.
            </p>

            <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
              <div className="flex items-center gap-2 sm:gap-3 text-white/80">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                <span className="text-[10px] sm:text-xs md:text-sm tracking-wide">{event?.date || "30 Y 31 DE OCTUBRE 2026"}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-white/80">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                <span className="text-[10px] sm:text-xs md:text-sm tracking-wide">{event?.location || "BARRANQUILLA"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 border-y border-white/10">
        <CountdownTimer targetDate={targetDate} />
      </section>

      {/* Tickets Section */}
      <section className="px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10">
        {/* Stage Title */}
        <div className="flex items-center gap-2 sm:gap-4 justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="h-px bg-gradient-to-r from-transparent to-amber-500/50 flex-1 max-w-[60px] sm:max-w-[80px] md:max-w-[100px]" />
          <h2 className="text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">{event?.stage || "Etapa Creyentes"}</h2>
          <div className="h-px bg-gradient-to-l from-transparent to-amber-500/50 flex-1 max-w-[60px] sm:max-w-[80px] md:max-w-[100px]" />
        </div>

        {/* Ticket Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto">
          {/* Regular Ticket */}
          <div className="border border-white/20 p-3 sm:p-4 md:p-6 relative">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
              <div className="text-amber-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 10L28 10L28 22L4 22L4 10Z" />
                  <path d="M8 14L12 14M8 18L16 18" />
                  <circle cx="24" cy="16" r="2" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold tracking-wide text-[10px] sm:text-xs md:text-base">TICKET</h3>
                <p className="text-white/50 text-[7px] sm:text-[9px] md:text-xs tracking-wide">ACCESO GENERAL AL EVENTO</p>
              </div>
            </div>
            <div className="mb-2 sm:mb-3 md:mb-4">
              <span className="text-lg sm:text-2xl md:text-3xl font-light text-white">{event?.ticketPrice?.replace(" COP", "") || "$45.000"}</span>
              <span className="text-white/50 text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2">COP</span>
            </div>
            {event?.soldOut ? (
              <div className="w-full py-2 sm:py-2.5 md:py-3 border border-red-600/50 bg-red-600/10 text-red-500 text-[9px] sm:text-[10px] md:text-sm tracking-widest text-center cursor-not-allowed">
                SOLD OUT
              </div>
            ) : (
              <button onClick={() => setIsTicketModalOpen(true)} className="w-full py-2 sm:py-2.5 md:py-3 border border-white/30 text-white text-[9px] sm:text-[10px] md:text-sm tracking-widest hover:bg-white/10 transition-colors">
                COMPRAR
              </button>
            )}
          </div>

          {/* VIP Table */}
          <div className="border border-amber-500/50 p-3 sm:p-4 md:p-6 relative">
            {/* Best Seller Badge */}
            <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-500 text-black text-[6px] sm:text-[8px] md:text-[10px] tracking-wider px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 font-medium whitespace-nowrap">
                MÁS VENDIDA
              </span>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
              <div className="text-amber-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 4L18 10H24L19 14L21 20L16 16L11 20L13 14L8 10H14L16 4Z" />
                  <path d="M8 24H24" />
                  <path d="M6 28H26" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold tracking-wide text-[10px] sm:text-xs md:text-base">MESA VIP</h3>
                <p className="text-white/50 text-[7px] sm:text-[9px] md:text-xs tracking-wide">10 PERSONAS</p>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-lg sm:text-2xl md:text-3xl font-light text-amber-500">{event?.vipPrice?.replace(" COP", "") || "$500.000"}</span>
              <span className="text-white/50 text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2">COP</span>
            </div>
            <p className="text-white/40 text-[7px] sm:text-[9px] md:text-xs mb-2 sm:mb-3 md:mb-4">{event?.vipNote || "NORMALMENTE $700K - $2M"}</p>
            {event?.soldOut ? (
              <div className="w-full py-2 sm:py-2.5 md:py-3 border border-red-600/50 bg-red-600/10 text-red-500 text-[9px] sm:text-[10px] md:text-sm tracking-widest text-center cursor-not-allowed">
                SOLD OUT
              </div>
            ) : (
              <button onClick={() => setIsTicketModalOpen(true)} className="w-full py-2 sm:py-2.5 md:py-3 border border-amber-500 text-amber-500 text-[9px] sm:text-[10px] md:text-sm tracking-widest hover:bg-amber-500 hover:text-black transition-colors">
                COMPRAR
              </button>
            )}
          </div>
        </div>

        {/* Exclusive Prices Note */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 md:mt-6 text-white/40 text-[7px] sm:text-[9px] md:text-xs tracking-wide">
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-center">PRECIOS EXCLUSIVOS ETAPA CREYENTES. POR TIEMPO LIMITADO.</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-8 sm:py-12 md:py-16 border border-white/20 overflow-hidden mx-2 sm:mx-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/BBbackfuego.png')`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-3 sm:px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light italic tracking-wide text-white mb-1 sm:mb-2">
            ASEGURA TU LUGAR
          </h2>
          <p className="text-white/60 text-[10px] sm:text-xs md:text-sm tracking-wider mb-4 sm:mb-6">LOS CUPOS SON LIMITADOS.</p>
          {event?.soldOut ? (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-red-600/20 border border-red-600 text-red-500 text-[10px] sm:text-xs md:text-sm tracking-widest cursor-not-allowed">
              SOLD OUT
            </div>
          ) : (
            <button onClick={() => setIsTicketModalOpen(true)} className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-amber-500/20 border border-amber-500 text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-widest hover:bg-amber-500 hover:text-black transition-all duration-300">
              COMPRAR ENTRADAS
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Aftermovie Section */}
      <section className="relative py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between bg-gradient-to-r from-black via-black/80 to-transparent border border-white/10 overflow-hidden">
          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
            <span className="text-amber-500/70 text-[8px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase">Revive la experiencia</span>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mt-0.5 sm:mt-1 mb-2 sm:mb-3">BABADOOK</h3>
            <button 
              onClick={() => setIsGalleryOpen(!isGalleryOpen)}
              className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-amber-500 transition-colors"
            >
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span className="text-[10px] sm:text-xs md:text-sm tracking-wider">VER AFTERMOVIE</span>
              {isGalleryOpen ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
          </div>
          <div
            className="w-1/3 sm:w-2/5 md:w-1/2 h-24 sm:h-28 md:h-32 lg:h-40 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/BBback2.png')`,
            }}
          />
        </div>

        {/* Expandable Gallery */}
        {isGalleryOpen && (
          <div className="max-w-4xl mx-auto mt-4 border border-white/10 bg-black/50 p-3 sm:p-4 rounded-lg">
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
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-2 md:left-6 z-50 text-white/70 hover:text-amber-500 transition-colors p-2"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh]">
            <LightboxMedia
              type={galleryMedia[currentMediaIndex].type}
              src={galleryMedia[currentMediaIndex].src}
              alt={galleryMedia[currentMediaIndex].alt}
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 md:right-6 z-50 text-white/70 hover:text-amber-500 transition-colors p-2"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentMediaIndex + 1} / {galleryMedia.length}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 px-3 sm:px-4 md:px-8 py-4 sm:py-5 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <span className="text-white font-bold tracking-tight text-xs sm:text-sm md:text-base">1 OF 1 FIRM</span>
            <div className="h-3 sm:h-4 w-px bg-white/20" />
            <div className="text-white/50 text-[8px] sm:text-[10px] md:text-xs">
              <span>THIS IS NOT FOR EVERYONE.</span>
              <span className="text-amber-500 ml-1 sm:ml-2">#1UNIQUEEXPERIENCE</span>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {[
              { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z", name: "Instagram" },
              { icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z", name: "WhatsApp" },
              { icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z", name: "TikTok" },
              { icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z", name: "Spotify" },
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                className="text-white/50 hover:text-amber-500 transition-colors"
                aria-label={social.name}
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Ticket Selector Modal */}
      <TicketSelectorModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        preSelectedEvent="babadook"
      />
    </div>
  )
}
