"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp, Menu as MenuIcon, DoorOpen } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import TicketSelectorModal from "./ticket-selector-modal"

interface MenuSectionProps {
  title: string
  subtitle: string
  backgroundImage: string
  hasGoldBorder?: boolean
  isExpanded?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
}

function MenuSection({ title, subtitle, backgroundImage, hasGoldBorder = true, isExpanded = false, hasSubmenu = false, onClick }: MenuSectionProps) {
  return (
    <div
      onClick={onClick}
      className={`relative min-h-[80px] sm:min-h-[100px] md:min-h-[140px] flex items-center overflow-hidden group cursor-pointer ${
        hasGoldBorder ? "border-l-2 border-amber-500" : ""
      }`}
    >
      {/* Left side - Content with dark background */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-black" />
      
      {/* Right side - Image taking 50% */}
      <div className="absolute inset-y-0 right-0 w-1/2">
        <img 
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-contain object-center"
        />
      </div>
      
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent" style={{ width: '60%' }} />
      
      <div className="relative z-10 p-2 sm:p-3 md:p-6 flex items-center justify-between w-full">
        <div>
          <h3 className="text-white font-light text-xs sm:text-sm md:text-2xl tracking-wider uppercase">{title}</h3>
          <span className="text-amber-500 text-[7px] sm:text-[9px] md:text-sm tracking-widest uppercase flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            {subtitle} {!hasSubmenu && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
          </span>
        </div>
        {hasSubmenu ? (
          isExpanded ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
          )
        ) : (
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
        )}
      </div>
    </div>
  )
}

interface SubmenuProps {
  items: { label: string; id: string }[]
  onNavigate: (page: string) => void
  viewAllLabel?: string
  viewAllPage?: string
}

function Submenu({ items, onNavigate, viewAllLabel, viewAllPage }: SubmenuProps) {
  return (
    <div className="bg-black/95 border-l-2 border-amber-500/50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="py-2 sm:py-4 px-3 sm:px-6 space-y-0.5 sm:space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="block w-full text-left text-white/60 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] hover:text-amber-500 transition-colors py-1.5 sm:py-2 pl-2 sm:pl-4 border-l border-transparent hover:border-amber-500/50"
          >
            {item.label}
          </button>
        ))}
        {viewAllLabel && viewAllPage && (
          <button
            onClick={() => onNavigate(viewAllPage)}
            className="mt-2 sm:mt-3 md:mt-3 px-3 sm:px-4 md:px-4 py-1 sm:py-1.5 md:py-1.5 border border-amber-500/50 text-amber-500 text-[9px] sm:text-[10px] md:text-[10px] tracking-widest hover:bg-amber-500 hover:text-black transition-all duration-300 w-full md:w-auto"
          >
            {viewAllLabel}
          </button>
        )}
      </div>
    </div>
  )
}

interface MenuProps {
  onNavigate?: (page: string) => void
}

export default function Menu({ onNavigate }: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  console.log("[v0] Menu component rendered, isMenuOpen:", isMenuOpen, "expandedSection:", expandedSection)

  const signatureEvents = [
    { label: "BABADOOK", id: "babadook" },
    { label: "LUNA LLENA", id: "luna-llena" },
    { label: "LA FESTA", id: "la-festa" },
    { label: "ANIMAL", id: "animal" },
    { label: "CELESTIAL", id: "celestial" },
    { label: "CHAMPIONSHIP", id: "championship" },
  ]

  const universeItems = [
    { label: "DRIP", id: "drip" },
    { label: "VISION GALLERY", id: "vision-gallery" },
    { label: "CAMP", id: "camp" },
    { label: "MAISON SWIM", id: "maison-swim" },
    { label: "GOLDEN BACKSTAGE", id: "golden-backstage" },
  ]

  const handleNavigate = (page: string) => {
    console.log("[v0] handleNavigate called with page:", page)
    setIsMenuOpen(false)
    setExpandedSection(null)
    onNavigate?.(page)
  }

  const toggleSection = (section: string) => {
    console.log("[v0] toggleSection called with section:", section)
    setExpandedSection(expandedSection === section ? null : section)
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
        currentPage="home"
      />

      {/* Hero Section */}
      <section className="relative h-[50svh] sm:h-[55svh] md:min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0">
          <img 
            src="https://f005.backblazeb2.com/file/b21of1firm/background/home.jpg"
            alt="1 OF 1 FIRM Background"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

        <div className="relative z-10 text-center px-4 flex flex-col items-center justify-center">
          <h1 className="text-6xl sm:text-7xl md:text-[12rem] lg:text-[16rem] font-thin tracking-wider leading-none">
            <span className="text-white">1</span>
            <span className="text-white/80 text-2xl sm:text-3xl md:text-8xl lg:text-9xl mx-2 md:mx-6">OF</span>
            <span className="text-white">1</span>
          </h1>
          <p className="text-amber-500/80 text-[6px] sm:text-[7px] md:text-base tracking-[0.3em] sm:tracking-[0.4em] mt-1 md:mt-4">#1UNIQUEEXPERIENCE</p>

          <div className="mt-2 md:mt-16 flex flex-col items-center">
            <div className="w-px h-3 sm:h-4 md:h-12 bg-amber-500/50" />
            <p className="text-white/70 text-[5px] sm:text-[6px] md:text-xs tracking-[0.2em] sm:tracking-[0.3em] mt-1 md:mt-4 uppercase">Enter the Universe</p>
            <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-5 md:h-5 text-white/50 mt-0.5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="relative z-10 -mt-4 md:-mt-20 px-0 md:px-16 lg:px-32 xl:px-48">
        {/* SIGNATURE EVENTS - Expandable */}
        <MenuSection
          title="SIGNATURE EVENTS"
          subtitle="DISCOVER"
          backgroundImage="https://f005.backblazeb2.com/file/b21of1firm/background/SEhome.jpg"
          hasSubmenu={true}
          isExpanded={expandedSection === "events"}
          onClick={() => toggleSection("events")}
        />
        {expandedSection === "events" && (
          <Submenu
            items={signatureEvents}
            onNavigate={handleNavigate}
            viewAllLabel="VIEW ALL EVENTS"
            viewAllPage="events"
          />
        )}

        {/* 1 OF 1 UNIVERSE - Expandable */}
        <MenuSection
          title="1 OF 1 UNIVERSE"
          subtitle="EXPLORE"
          backgroundImage="https://f005.backblazeb2.com/file/b21of1firm/background/1of1Uhome.png"
          hasSubmenu={true}
          isExpanded={expandedSection === "universe"}
          onClick={() => toggleSection("universe")}
        />
        {expandedSection === "universe" && (
          <Submenu
            items={universeItems}
            onNavigate={handleNavigate}
          />
        )}

        {/* BUY TICKETS - Direct navigation */}
        <MenuSection
          title="BUY TICKETS / BOOK VIP"
          subtitle="GET ACCESS"
          backgroundImage="https://f005.backblazeb2.com/file/b21of1firm/background/BThome.png"
          onClick={() => handleNavigate("buy-tickets")}
        />

        {/* CONTACT - Direct navigation */}
        <MenuSection
          title="CONTACT"
          subtitle="CONNECT"
          backgroundImage="https://f005.backblazeb2.com/file/b21of1firm/background/CONThome.png"
          onClick={() => handleNavigate("contact")}
        />
      </section>

      {/* Footer CTA */}
      <section className="py-6 sm:py-8 md:py-16 px-4 text-center bg-black">
        <div className="w-6 sm:w-8 md:w-12 h-px bg-amber-500 mx-auto mb-3 sm:mb-4 md:mb-8" />
        <p className="text-white/60 text-[8px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">This is not for everyone.</p>
        <p className="text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.4em] mt-1 md:mt-2">#1UNIQUEEXPERIENCE</p>

        <button 
          onClick={() => setIsTicketModalOpen(true)}
          className="mt-4 sm:mt-4 md:mt-8 px-6 sm:px-8 md:px-12 py-2 md:py-3 border border-amber-500 text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-widest hover:bg-amber-500 hover:text-black transition-all duration-300"
        >
          GET ACCESS
        </button>
      </section>

      {/* Bottom Bar */}
      <footer className="py-3 sm:py-4 md:py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <a 
              href="https://www.instagram.com/1of1.firm?igsh=eWM2NDYzb3hzaDBl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]"
            >
              INSTAGRAM
            </a>
            <a 
              href="https://youtube.com/@1of1firm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]"
            >
              YOUTUBE
            </a>
            <a 
              href="https://tiktok.com/@1of1firm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]"
            >
              TIKTOK
            </a>
            <a 
              href="https://wa.me/+573003676521" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-amber-500 transition-colors text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]"
            >
              WHATSAPP
            </a>
          </div>

          {/* Email with Admin Button */}
          <div className="text-center mb-2 sm:mb-3 md:mb-6 flex items-center justify-center gap-1.5">
            <a 
              href="mailto:contact@1of1firm.com"
              className="text-amber-500 hover:text-amber-400 transition-colors text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em]"
            >
              contact@1of1firm.com
            </a>
            <button
              onClick={() => handleNavigate("admin-login")}
              className="text-white/10 hover:text-amber-500/40 transition-all duration-300"
              aria-label="Admin Access"
              title="Admin Access"
            >
              <DoorOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>

          {/* Copyright */}
          <p className="text-white/30 text-[10px] sm:text-xs tracking-wider text-center">&copy; 2026 1 OF 1 FIRM. All rights reserved.</p>
        </div>
      </footer>

      {/* Ticket Selector Modal */}
      <TicketSelectorModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />
    </div>
  )
}
