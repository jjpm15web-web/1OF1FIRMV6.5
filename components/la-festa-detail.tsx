"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Clock, Play, Globe, Menu as MenuIcon, ArrowLeft, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import TicketSelectorModal from "./ticket-selector-modal"
import { LightboxMedia, LightboxThumbnail } from "./lightbox-media"
import { useEventById } from "@/lib/events-store"
import { useAfterMovieMedia } from "@/lib/aftermovie-store"

interface LaFestaDetailProps {
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
    <div className="flex items-center gap-2 md:gap-6">
      <div className="text-center">
        <div className="text-xl md:text-4xl font-light text-white">{String(timeLeft.days).padStart(2, "0")}</div>
        <div className="text-[8px] md:text-[10px] tracking-widest text-white/60">DÍAS</div>
      </div>
      <div className="text-center">
        <div className="text-xl md:text-4xl font-light text-white">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-[8px] md:text-[10px] tracking-widest text-white/60">HORAS</div>
      </div>
      <div className="text-center">
        <div className="text-xl md:text-4xl font-light text-white">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-[8px] md:text-[10px] tracking-widest text-white/60">MIN</div>
      </div>
      <div className="text-center">
        <div className="text-xl md:text-4xl font-light text-white">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-[8px] md:text-[10px] tracking-widest text-white/60">SEG</div>
      </div>
    </div>
  )
}

export default function LaFestaDetail({ onNavigate }: LaFestaDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  // Get event data from store
  const { event, isLoaded } = useEventById("la-festa")

  // Set target date for La Festa from store or default
  const targetDate = new Date(event?.countdownDate || "2027-02-15T00:00:00")
  
  // Get aftermovie media from store
  const { media: galleryMedia, isLoaded: mediaLoaded } = useAfterMovieMedia("la-festa")
  
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
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex flex-col justify-end pb-4 sm:pb-6 md:pb-8">
        {/* Background Image - Concert with confetti/sparklers */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/LFESTAhome.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Additional background color to fill empty space */}
        <div className="absolute inset-0 bg-black -z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />
        
        {/* SOLD OUT Badge */}
        {event?.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-red-600 px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-5 shadow-2xl rotate-45">
              <span className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-widest drop-shadow-lg">SOLD OUT</span>
            </div>
          </div>
        )}

        {/* Content - Positioned at bottom */}
        <div className="relative z-10 px-3 sm:px-4 md:px-18 text-center mt-58 md:pt-52 lg:pt-72">
          <span className="text-amber-500 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2 block">SIGNATURE EVENTS</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-thin tracking-wider mb-1 sm:mb-2 text-white leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
            {event?.name || "LA FESTA"}
          </h1>
          <p className="text-amber-500/80 text-xs sm:text-sm tracking-widest mb-4 sm:mb-6 md:mb-8">{event?.subtitle || "RUMBA ÉPICA · CARNAVAL"}</p>

          {/* Date and Location */}
          <div className="space-y-2 sm:space-y-3 text-left max-w-[280px] sm:max-w-xs mx-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
              <div>
                <span className="text-amber-500 text-[10px] sm:text-xs tracking-wider">{event?.dateLabel || "FECHA PRÓXIMAMENTE"}</span>
                <p className="text-white/60 text-[10px] sm:text-xs">{event?.dateSubtitle || "PRONTO SERÁ ANUNCIADA"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 flex-shrink-0" />
              <span className="text-white/80 text-xs sm:text-sm tracking-wider">{event?.location || "BARRANQUILLA"}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 flex-shrink-0" />
              <span className="text-white/60 text-[10px] sm:text-sm tracking-wider">ÚLTIMA VERSIÓN: PANAMÁ 2023</span>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="px-3 sm:px-4 py-4 sm:py-6 max-w-lg mx-auto">
        <div className="bg-black/60 border border-white/10 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
            </div>
            <div>
              <span className="text-[8px] sm:text-[10px] tracking-wider text-white/60 block">FALTA PARA</span>
              <span className="text-[10px] sm:text-xs tracking-wider text-white">LA FESTA</span>
            </div>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto flex justify-center">
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-3 sm:px-4 py-4 sm:py-6 max-w-lg mx-auto">
        {/* Stage Label */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-amber-500 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]">{event?.stage || "ETAPA CREYENTES"}</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Ticket */}
          <div className="border border-white/20 p-2 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 border border-amber-500/50 rounded flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-white font-medium tracking-wider text-xs sm:text-sm mb-1">TICKET</h3>
            <p className="text-white/50 text-[8px] sm:text-[10px] tracking-wider mb-2 sm:mb-3">ACCESO GENERAL AL EVENTO</p>
            <div className="mb-2 sm:mb-4">
              <span className="text-lg sm:text-2xl font-light text-white">{event?.ticketPrice?.replace(" COP", "") || "$45.000"}</span>
              <span className="text-white/60 text-[10px] sm:text-xs ml-1">COP</span>
            </div>
            {event?.soldOut ? (
              <div className="w-full py-1.5 sm:py-2 border border-red-600/50 bg-red-600/10 text-red-500 text-[10px] sm:text-xs tracking-widest text-center cursor-not-allowed">
                SOLD OUT
              </div>
            ) : (
              <button onClick={() => setIsTicketModalOpen(true)} className="w-full py-1.5 sm:py-2 border border-white/30 text-white text-[10px] sm:text-xs tracking-widest hover:bg-white/10 transition-colors">
                COMPRAR
              </button>
            )}
          </div>

          {/* VIP */}
          <div className="border border-amber-500/50 p-2 sm:p-4 text-center relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[6px] sm:text-[8px] tracking-wider px-1.5 sm:px-2 py-0.5">
              MÁS VENDIDA
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 border border-amber-500/50 rounded flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-white font-medium tracking-wider text-xs sm:text-sm mb-1">MESA VIP</h3>
            <p className="text-white/50 text-[8px] sm:text-[10px] tracking-wider">10 PERSONAS</p>
            <p className="text-white/40 text-[6px] sm:text-[8px] tracking-wider mb-2 sm:mb-3 hidden sm:block">EXPERIENCIA VIP PARA GRUPOS DE 10 PERSONAS</p>
            <div className="mb-1">
              <span className="text-lg sm:text-2xl font-light text-amber-500">{event?.vipPrice?.replace(" COP", "") || "$500.000"}</span>
              <span className="text-amber-500/60 text-[10px] sm:text-xs ml-1">COP</span>
            </div>
            <p className="text-white/40 text-[6px] sm:text-[8px] mb-2 sm:mb-3">{event?.vipNote || "NORMALMENTE $700K - $2M"}</p>
            {event?.soldOut ? (
              <div className="w-full py-1.5 sm:py-2 border border-red-600/50 bg-red-600/10 text-red-500 text-[10px] sm:text-xs tracking-widest text-center cursor-not-allowed">
                SOLD OUT
              </div>
            ) : (
              <button onClick={() => setIsTicketModalOpen(true)} className="w-full py-1.5 sm:py-2 border border-amber-500/50 text-amber-500 text-[10px] sm:text-xs tracking-widest hover:bg-amber-500 hover:text-black transition-colors">
                COMPRAR
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-3 sm:mt-4 text-white/40 text-[8px] sm:text-[10px] tracking-wider">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span>PRECIOS EXCLUSIVOS ETAPA CREYENTES.</span>
        </div>
        <p className="text-center text-white/40 text-[8px] sm:text-[10px] tracking-wider">POR TIEMPO LIMITADO.</p>
      </section>

      {/* CTA Section */}
      <section className="px-3 sm:px-4 py-4 sm:py-6">
        <div
          className="relative py-6 sm:py-8 px-3 sm:px-4 text-center border border-white/10 overflow-hidden rounded-lg min-h-[100px] sm:min-h-[120px]"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/LFESTAtarj.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60 sm:bg-black/70" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <p className="text-white text-xs sm:text-sm tracking-widest mb-3 sm:mb-4">LOS CUPOS SON LIMITADOS.</p>
            {event?.soldOut ? (
              <div className="px-4 sm:px-8 py-2 sm:py-3 bg-red-600/20 border border-red-600 text-red-500 font-medium text-[10px] sm:text-xs tracking-widest cursor-not-allowed inline-flex items-center gap-2 mx-auto">
                SOLD OUT
              </div>
            ) : (
              <button onClick={() => setIsTicketModalOpen(true)} className="px-4 sm:px-8 py-2 sm:py-3 bg-amber-500 text-black font-medium text-[10px] sm:text-xs tracking-widest hover:bg-amber-400 transition-colors flex items-center gap-2 mx-auto">
                COMPRAR ENTRADAS
                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Aftermovie Section */}
      <section className="px-3 sm:px-4 py-4 sm:py-6">
        <div
          className="relative py-6 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 border border-white/10 overflow-hidden rounded-lg min-h-[150px] md:min-h-[300px]"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/LFESTAhome.png')`,
            backgroundSize: "contain",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div>
              <span className="text-amber-500 text-[8px] sm:text-[10px] tracking-widest">REVIVE LA EXPERIENCIA</span>
              <h3 className="text-xl sm:text-3xl font-light italic tracking-wider mt-1 text-amber-100">LA FESTA</h3>
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
      <footer className="px-3 sm:px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 border-t border-white/10">
        <div className="text-center sm:text-left">
          <p className="text-white/60 text-[10px] sm:text-xs">THIS IS NOT FOR EVERYONE.</p>
          <p className="text-amber-500 text-[10px] sm:text-xs tracking-wider">#1UNIQUEEXPERIENCE</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
              <circle cx="18.406" cy="5.594" r="1.44" />
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-amber-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </a>
        </div>
      </footer>

      {/* Ticket Selector Modal */}
      <TicketSelectorModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        preSelectedEvent="la-festa"
      />
    </div>
  )
}
