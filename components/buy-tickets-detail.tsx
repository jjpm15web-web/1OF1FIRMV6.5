"use client"

import { useState } from "react"
import { X, Clock, MapPin, Calendar, Users, Ticket, ExternalLink, ArrowLeft, Play, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import TicketSelectorModal from "./ticket-selector-modal"
import { LightboxMedia, LightboxThumbnail } from "./lightbox-media"
import { useWeekendEvents } from "@/lib/events-store"

interface BuyTicketsDetailProps {
  onNavigate: (page: string) => void
}

interface WeekendEvent {
  id: string
  dayLabel: string
  dayLabelColor: string
  title: string
  subtitle: string
  subtitleStyle: "script" | "italic"
  description: string[]
  time: string
  date: string
  venue: string
  location: string
  ageRestriction: string
  ageNote: string
  buttonText: string
  buttonStyle: "outline" | "filled"
  image: string
}

export default function BuyTicketsDetail({ onNavigate }: BuyTicketsDetailProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  // Read SOLD OUT state controlled from the admin panel (WEEKEND EVENTS section).
  // Each weekend event is independent: every card reflects the SOLD OUT state of its
  // matching event in the store (by position). The helper below resolves a card's
  // own soldOut value, falling back to false when there is no matching store event.
  const { events: weekendEventsData } = useWeekendEvents()
  const getSoldOut = (index: number) => weekendEventsData[index]?.soldOut ?? false
  // The bottom ticket cards (individual / VIP / limited spots) only sell out when
  // every weekend event is marked as SOLD OUT in the admin panel.
  const allSoldOut = weekendEventsData.length > 0 && weekendEventsData.every((e) => e.soldOut)

  const galleryMedia = [
    { type: "image", src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80", alt: "Weekend event 1" },
    { type: "image", src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", alt: "Weekend event 2" },
    { type: "video", src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80", alt: "Weekend video 1" },
    { type: "image", src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80", alt: "Weekend event 3" },
    { type: "image", src: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=400&q=80", alt: "Weekend event 4" },
    { type: "image", src: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&q=80", alt: "Weekend event 5" },
  ]

  const openLightbox = (index: number) => {
    setCurrentMediaIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)
  const goToPrevious = () => setCurrentMediaIndex((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1))
  const goToNext = () => setCurrentMediaIndex((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1))

  // The public WEEKEND EVENTS cards are fully driven by the store, so anything
  // edited in the admin panel (WEEKEND EVENTS) is reflected here. Each store event
  // is mapped to the presentation shape the card expects.
  const dayLabelColors = ["bg-amber-500", "bg-amber-600", "bg-amber-700"]
  const displayedWeekendEvents: WeekendEvent[] = weekendEventsData.map((event, index) => ({
    id: event.id,
    dayLabel: event.dayLabel || "",
    dayLabelColor: dayLabelColors[index % dayLabelColors.length],
    title: event.name,
    subtitle: event.subtitle,
    subtitleStyle: "script",
    description: (event.description || "").split("\n").filter(Boolean),
    time: event.time || "",
    date: event.date || "",
    venue: event.venue || "",
    location: event.location || "",
    ageRestriction: event.ageRestriction || "",
    ageNote: event.ageNote || "",
    buttonText: event.buttonText || "COMPRAR",
    buttonStyle: index === weekendEventsData.length - 1 ? "filled" : "outline",
    image: event.image,
  }))

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 md:p-6">
        <button onClick={() => onNavigate("home")} className="flex items-center">
          <img 
            src="/logo.png" 
            alt="1 OF 1 FIRM" 
            className="h-10 md:h-12 w-auto"
          />
        </button>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white p-2 hover:text-amber-500 transition-colors"
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <div className="w-6 h-0.5 bg-current"></div>
            <div className="w-6 h-0.5 bg-current"></div>
          </div>
        </button>
      </header>

      {/* Hero Section with Background */}
      <div className="relative pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/WEEKENDtarj.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black" />

        {/* Content */}
        <div className="relative z-10 px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
          {/* Main Title */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-lg sm:text-xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                WEEKEND
              </span>
              <span className="block bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 bg-clip-text text-transparent mt-0.5 sm:mt-1 md:mt-2">
                EVENTS
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-center text-white/60 text-[7px] sm:text-[8px] md:text-base tracking-[0.1em] sm:tracking-[0.15em] mb-3 sm:mb-4 md:mb-8 max-w-md mx-auto">
            EXPERIENCIAS QUE MARCAN<br />TU FIN DE SEMANA.
          </p>

          {/* Event Info */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-8 mb-6 sm:mb-8 text-[9px] sm:text-xs md:text-sm text-white/80">
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-500" />
              <span className="tracking-wider">VIERNES 16 Y<br className="sm:hidden" /> SÁBADO 17 DE MAYO</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-500" />
              <span className="tracking-wider">DISCOLO NIGHT CLUB<br />BARRANQUILLA</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border border-amber-500/50 flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold text-amber-500">
                +14
              </div>
              <span className="tracking-wider text-[8px] sm:text-[10px] md:text-xs text-white/60">MÁS SALVAJE.<br />+14 SIN ALCOHOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Cards */}
      <main className="px-2 sm:px-3 md:px-8 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
        {displayedWeekendEvents.map((event, index) => {
          const cardSoldOut = getSoldOut(index)
          return (
          <div
            key={event.id}
            className="bg-zinc-900/60 border border-white/10 rounded-lg sm:rounded-xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Left Content */}
              <div className="p-3 sm:p-4 md:p-6 flex-1">
                {/* Day Badge */}
                <div className="inline-block mb-2 sm:mb-3">
                  <span className={`${event.dayLabelColor} text-black text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded tracking-wider`}>
                    {event.dayLabel}
                  </span>
                  {index === displayedWeekendEvents.length - 1 && (
                    <span className="ml-1 sm:ml-2 bg-amber-700 text-black text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded tracking-wider">
                      AFTERMOVIE
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className="mb-2 sm:mb-3">
                  <h2 className="text-sm sm:text-base md:text-4xl font-bold tracking-wider text-white">
                    {event.title}
                  </h2>
                  <span className={`text-xs sm:text-sm md:text-3xl ${event.subtitleStyle === "script" ? "font-serif italic" : "italic font-light"} text-amber-500`}>
                    {event.subtitle}
                  </span>
                </div>

                {/* Description */}
                <div className="text-white/60 text-[9px] sm:text-xs md:text-sm tracking-wider mb-2 sm:mb-3 md:mb-4">
                  {event.description.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* Event Info: Date, Venue, Location, Age */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4 text-[8px] sm:text-[10px] md:text-xs text-white/60">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-amber-500/70" />
                    <span className="tracking-wider">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-amber-500/70" />
                    <span className="tracking-wider">{event.venue}, {event.location}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-amber-500/50 flex items-center justify-center text-[7px] sm:text-[9px] md:text-[10px] font-bold text-amber-500">
                      {event.ageRestriction}
                    </span>
                    <span className="tracking-wider text-white/50">{event.ageNote}</span>
                  </div>
                </div>

                {/* Time and Button */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="flex items-center gap-1 sm:gap-2 text-white/70">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    <span className="text-[9px] sm:text-xs md:text-sm tracking-wider">{event.time}</span>
                  </div>
                  {cardSoldOut ? (
                    <div className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] border border-red-600/50 bg-red-600/10 text-red-500 cursor-not-allowed">
                      SOLD OUT
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsTicketModalOpen(true)}
                      className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] transition-all ${
                        event.buttonStyle === "filled"
                          ? "bg-gradient-to-r from-amber-600 to-amber-500 text-black font-medium hover:from-amber-500 hover:to-amber-400"
                          : "border border-amber-500 text-amber-500"
                      }`}
                    >
                      {event.buttonText}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Image */}
              <div className="sm:w-2/5 md:w-1/2 h-32 sm:h-auto relative">
                <img
                  src={event.image}
                  alt={`${event.title} ${event.subtitle}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-transparent to-transparent md:bg-gradient-to-r md:from-zinc-900 md:via-transparent md:to-transparent" />
                {/* SOLD OUT Badge */}
                {cardSoldOut && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <div className="bg-red-600 px-4 sm:px-6 py-1.5 sm:py-2 shadow-lg rotate-45">
                      <span className="text-white text-base sm:text-xl md:text-2xl font-bold tracking-wider">SOLD OUT</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )
        })}

        {/* Aftermovie Section */}
        <div className="mt-4 sm:mt-6">
          <div
            className="relative py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 border border-white/20 overflow-hidden rounded-lg"
            style={{
              backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/WEEKENDtarj.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <span className="text-amber-500 text-[8px] sm:text-[10px] tracking-widest">REVIVE LA EXPERIENCIA</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider mt-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">WEEKEND EVENTS</h3>
                <button 
                  onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-white/80 hover:text-amber-500 transition-colors"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs tracking-widest">VER AFTERMOVIE</span>
                  {isGalleryOpen ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                </button>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
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
        </div>

        {/* VIP Table Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          {/* Individual Ticket Card */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg border border-amber-500/30 flex items-center justify-center">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500/70" />
              </div>
              <div className="flex-1">
                <h3 className="text-[9px] sm:text-[10px] md:text-lg font-bold tracking-wider mb-0.5 sm:mb-1">ENTRADA INDIVIDUAL</h3>
                <p className="text-white/50 text-[7px] sm:text-[8px] md:text-sm tracking-wider mb-1.5 sm:mb-2 md:mb-3">ACCESO GENERAL AL EVENTO</p>
                <div className="mb-1.5 sm:mb-2 md:mb-3">
                  <span className="text-base sm:text-lg md:text-3xl font-light text-white">$40.000</span>
                  <span className="text-white/50 text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2">COP</span>
                </div>
                <p className="text-white/40 text-[8px] sm:text-[10px] md:text-xs tracking-wider mb-2 sm:mb-3 md:mb-4">ENTRADA POR PERSONA</p>
                {allSoldOut ? (
                  <div className="w-full py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] text-center border border-red-600/50 bg-red-600/10 text-red-500 cursor-not-allowed">
                    SOLD OUT
                  </div>
                ) : (
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="w-full border border-amber-500 bg-amber-500 text-black py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] hover:bg-amber-400 hover:border-amber-400 transition-all"
                  >
                    COMPRAR
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VIP Table Card */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg border border-amber-500/30 flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500/70" />
              </div>
              <div className="flex-1">
                <h3 className="text-[9px] sm:text-[10px] md:text-lg font-bold tracking-wider mb-0.5 sm:mb-1">MESA VIP 10 PERSONAS</h3>
                <p className="text-white/50 text-[7px] sm:text-[8px] md:text-sm tracking-wider mb-1.5 sm:mb-2 md:mb-3">EXPERIENCIA VIP PARA GRUPOS</p>
                <div className="mb-1.5 sm:mb-2 md:mb-3">
                  <span className="text-base sm:text-lg md:text-3xl font-light text-white">$500.000</span>
                  <span className="text-white/50 text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2">COP</span>
                </div>
                <p className="text-white/40 text-[8px] sm:text-[10px] md:text-xs tracking-wider mb-2 sm:mb-3 md:mb-4">NORMALMENTE $700K - $2M</p>
                {allSoldOut ? (
                  <div className="w-full py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] text-center border border-red-600/50 bg-red-600/10 text-red-500 cursor-not-allowed">
                    SOLD OUT
                  </div>
                ) : (
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-medium py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] hover:from-amber-500 hover:to-amber-400 transition-all"
                  >
                    COMPRAR
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Limited Spots CTA */}
          <div 
            className="bg-zinc-900/20 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
            style={{
              backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/WEEKENDtarj3.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light italic tracking-wider text-white/80 mb-2 sm:mb-3 md:mb-4">
                LOS CUPOS SON LIMITADOS.
              </p>
              {allSoldOut ? (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 border-2 border-red-600 bg-red-600/10 text-red-500 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] font-bold cursor-not-allowed">
                  SOLD OUT
                </div>
              ) : (
                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 border-2 border-amber-500 text-amber-500 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] font-bold hover:bg-amber-500 hover:text-black transition-all"
                >
                  COMPRAR ENTRADAS
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 px-3 sm:px-4 md:px-8 py-4 sm:py-5 md:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Left - Aftermovie Link */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div>
                <p className="text-amber-500 text-[8px] sm:text-[10px] md:text-xs tracking-wider">REVIVE LA EXPERIENCIA</p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg md:text-xl font-bold tracking-wider">WEEKEND</span>
                  <button className="flex items-center gap-1 text-white/50 text-[8px] sm:text-[10px] md:text-xs hover:text-amber-500 transition-colors">
                    <span className="w-0 h-0 border-l-4 border-l-white/50 border-y-2 border-y-transparent"></span>
                   
                  </button>
                </div>
              </div>
            </div>

            {/* Center - Tagline */}
            <div className="text-center">
              <p className="text-white/50 text-[8px] sm:text-[10px] md:text-xs tracking-[0.1em] sm:tracking-[0.15em]">THIS IS NOT FOR EVERYONE.</p>
              <p className="text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-wider font-medium">#1UNIQUEEXPERIENCE</p>
            </div>

            {/* Right - Logo and Social */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <span className="text-sm sm:text-base md:text-lg font-bold tracking-wider">1 OF 1 FIRM</span>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <a href="https://www.instagram.com/1of1.firm?igsh=eWM2NDYzb3hzaDBl" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://wa.me/+573003676521" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com/@1of1firm" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a href="https://youtube.com/@1of1firm" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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

      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} currentPage="buy-tickets" />

      {/* Back Button */}
      <button 
        onClick={() => onNavigate("home")}
        className="fixed top-20 left-4 z-30 text-white/70 hover:text-amber-500 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Ticket Selector Modal */}
      <TicketSelectorModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />
    </div>
  )
}
