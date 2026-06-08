"use client"

import { ChevronRight, Calendar, MapPin, Menu as MenuIcon } from "lucide-react"
import { useState } from "react"
import HamburgerMenu from "./hamburger-menu"
import { useSignatureEvents } from "@/lib/events-store"

interface EventCardProps {
  image: string
  title: string
  edition?: string
  subtitle: string
  date?: string
  dateLabel?: string
  location?: string
  ticketPrice: string
  ticketNote?: string
  vipPrice: string
  vipNote: string
  stage?: string
  comingSoon?: boolean
  comingSoonText?: string
  soldOut?: boolean
  onClick?: () => void
}

function EventCard({
  image,
  title,
  edition,
  subtitle,
  date,
  dateLabel,
  location,
  ticketPrice,
  ticketNote,
  vipPrice,
  vipNote,
  stage,
  comingSoon,
  comingSoonText,
  soldOut,
  onClick,
}: EventCardProps) {
  return (
    <div 
      onClick={onClick}
      className="border-l-2 border-amber-500 bg-gradient-to-r from-black/60 to-black/40 overflow-hidden group cursor-pointer hover:from-black/70 transition-all"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Event Image */}
        <div className="relative w-full sm:w-36 md:w-48 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 md:bg-gradient-to-t md:from-black/50 md:to-transparent" />
          {/* SOLD OUT Badge */}
          {soldOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <div className="bg-red-600 px-4 sm:px-6 py-1.5 sm:py-2 shadow-lg rotate-45">
                <span className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wider">SOLD OUT</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-between">
          <div>
            {/* Title Row */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs sm:text-base md:text-2xl font-light tracking-wider text-white">{title}</h3>
              {edition && (
                <span className="text-amber-500 text-[8px] sm:text-[10px] md:text-xs tracking-wider whitespace-nowrap">{edition}</span>
              )}
            </div>

            {/* Subtitle */}
            <p className="text-amber-500/80 text-[7px] sm:text-[8px] md:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase mt-0.5 sm:mt-1">{subtitle}</p>

            {/* Date & Location */}
            {(date || location) && (
              <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 mt-2 sm:mt-3 text-[9px] sm:text-[10px] md:text-xs text-white/60">
                {date && (
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                    {date}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                    {location}
                  </span>
                )}
              </div>
            )}

            {dateLabel && (
              <div className="mt-2 sm:mt-3">
                <span className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] md:text-xs">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-amber-500" />
                  <span className="text-amber-500">{dateLabel}</span>
                </span>
                <p className="text-white/50 text-[8px] sm:text-[10px] md:text-xs mt-0.5 ml-3.5 sm:ml-4 md:ml-5">PRONTO SERÁ ANUNCIADA</p>
              </div>
            )}

            {comingSoon && (
              <p className="text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-wider mt-2 sm:mt-3">{comingSoonText || "COMING SOON"}</p>
            )}

            {/* Stage */}
            {stage && (
              <div className="mt-2 sm:mt-3">
                <p className="text-amber-500 text-[8px] sm:text-[10px] md:text-xs tracking-wider">{stage}</p>
              </div>
            )}
          </div>

          {/* Pricing */}
          {!comingSoon && (
            <div className="flex items-end gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4">
              <div>
                <p className="text-white/50 text-[7px] sm:text-[8px] md:text-[10px] tracking-wider uppercase">TICKET</p>
                <p className="text-white text-sm sm:text-base md:text-lg font-light">{ticketPrice}</p>
                {ticketNote && (
                  <p className="text-white/40 text-[7px] sm:text-[8px] md:text-[10px] tracking-wide">({ticketNote})</p>
                )}
              </div>
              <div className="border-l border-white/20 pl-3 sm:pl-4 md:pl-6">
                <p className="text-white/50 text-[7px] sm:text-[8px] md:text-[10px] tracking-wider uppercase">MESA VIP 10 PERSONAS</p>
                <p className="text-white text-sm sm:text-base md:text-lg font-light">{vipPrice}</p>
                <p className="text-white/40 text-[7px] sm:text-[8px] md:text-[10px] tracking-wide">{vipNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex items-center px-2 sm:px-3 md:px-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all">
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/50 group-hover:text-amber-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Crown() {
  return (
    <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 20h20v2H2v-2zm2-8l4 4 4-4 4 4 4-4V4L12 8 2 4v8z" />
    </svg>
  )
}

interface SignatureEventsProps {
  onNavigate?: (page: string) => void
}

export default function SignatureEvents({ onNavigate }: SignatureEventsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { events: signatureEventsData, isLoaded } = useSignatureEvents()
  
  const handleNavigate = (page: string) => {
    setIsMenuOpen(false)
    onNavigate?.(page)
  }

  // Transform events from store to display format
  const events = signatureEventsData.map(event => ({
    id: event.id,
    image: event.image,
    title: event.name,
    edition: event.id === "babadook" ? "6TA EDICION" : undefined,
    subtitle: event.subtitle,
    date: event.date,
    dateLabel: !event.date && event.id !== "championship" ? "FECHA PROXIMAMENTE" : undefined,
    location: event.location,
    stage: event.stage,
    ticketPrice: event.ticketPrice || "",
    ticketNote: event.id === "babadook" ? "normalmente 60-120k" : undefined,
    vipPrice: event.vipPrice || "",
    vipNote: event.vipNote || "",
    comingSoon: event.ticketPrice === "COMING SOON",
    comingSoonText: event.ticketPrice === "COMING SOON" ? "COMING SOON" : undefined,
    soldOut: event.soldOut || false,
  }))

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

      {/* Hero Header */}
      <section className="relative pt-20 sm:pt-22 md:pt-24 pb-4 sm:pb-6 md:pb-8 px-3 sm:px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-sm sm:text-base md:text-5xl font-light tracking-wider italic">SIGNATURE EVENTS</h1>
          <p className="text-white/50 text-[7px] sm:text-[8px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] mt-0.5 sm:mt-1 md:mt-2 uppercase">
            EXPERIENCES THAT DEFINE 1OF1.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="px-2 sm:px-3 md:px-4 pb-6 sm:pb-8 space-y-2 sm:space-y-3 max-w-4xl mx-auto">
        {events.map((event, index) => (
          <EventCard 
            key={index} 
            {...event} 
            onClick={event.id ? () => handleNavigate(event.id!) : undefined}
          />
        ))}
      </section>

      {/* Bottom Banner */}
      <section className="px-3 sm:px-4 py-4 sm:py-5 md:py-6 bg-black/80 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3 md:gap-4">
          <Crown />
          <div>
            <p className="text-white/70 text-[8px] sm:text-[10px] md:text-xs tracking-wider">
              TODOS NUESTROS EVENTOS SON EXPERIENCIAS ÚNICAS.
            </p>
            <p className="text-amber-500 text-[8px] sm:text-[10px] md:text-xs tracking-wider">PRODUCCIÓN DE OTRO NIVEL. SOLO 1 OF 1.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-3 sm:px-4 py-4 sm:py-5 md:py-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="text-white">
              <div className="text-sm sm:text-base md:text-lg font-bold tracking-tight">
                <span className="text-amber-400">1</span>
                <span className="text-[8px] sm:text-[10px] md:text-xs align-top mx-0.5">OF</span>
                <span className="text-amber-400">1</span>
                <span className="text-[8px] sm:text-[10px] md:text-xs ml-0.5 sm:ml-1">FIRM</span>
              </div>
            </div>
            <div className="text-white/50 text-[8px] sm:text-[10px] md:text-xs tracking-wider">
              <p>THIS IS NOT FOR EVERYONE.</p>
              <p className="text-amber-500">#1UNIQUEEXPERIENCE</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
            <a
              href="https://www.instagram.com/1of1.firm?igsh=eWM2NDYzb3hzaDBl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://wa.me/+573003676521"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@1of1firm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
            <a
              href="https://youtube.com/@1of1firm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
