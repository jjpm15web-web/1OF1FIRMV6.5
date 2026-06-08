"use client"

import { useState } from "react"
import { X, Plus, Minus } from "lucide-react"

function Sparkle() {
  return (
    <svg className="w-4 h-4 text-amber-500/70" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
    </svg>
  )
}

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (page: string) => void
  currentPage?: string
}

export default function HamburgerMenu({ isOpen, onClose, onNavigate, currentPage }: HamburgerMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const signatureEvents = ["BABADOOK", "LUNA LLENA", "LA FESTA", "ANIMAL", "CELESTIAL", "CHAMPIONSHIP"]
  const universeItems = ["DRIP", "VISION GALLERY", "CAMP", "MAISON SWIM", "GOLDEN BACKSTAGE"]

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleNavigate = (page: string) => {
    onClose()
    onNavigate?.(page)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 transition-all duration-500 opacity-100"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/BGhamburger.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Menu Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <button onClick={() => handleNavigate("home")} className="cursor-pointer">
            <img 
              src="/logo.png" 
              alt="1 OF 1 FIRM" 
              className="h-10 md:h-12 w-auto"
            />
          </button>
          <button
            onClick={onClose}
            className="text-white p-2 hover:text-amber-500 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto py-8">
          <div className="space-y-6 text-center w-full max-w-md mx-auto">
            {/* HOME */}
            <button
              onClick={() => handleNavigate("home")}
              className={`block w-full text-lg md:text-3xl tracking-[0.2em] font-light italic transition-colors ${
                currentPage === "home" ? "text-amber-500" : "text-white/90 hover:text-amber-500"
              }`}
            >
              HOME
            </button>

            {/* SIGNATURE EVENTS */}
            <div className="text-center">
              <button
                onClick={() => toggleSection("events")}
                className={`flex items-center justify-center gap-3 mx-auto transition-colors ${
                  currentPage === "events" ? "text-amber-500" : "text-white/90 hover:text-amber-500"
                }`}
              >
                <span className="text-base md:text-2xl tracking-[0.2em] font-light italic">SIGNATURE EVENTS</span>
                {expandedSection === "events" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              {expandedSection === "events" && (
                <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {signatureEvents.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleNavigate(item === "LUNA LLENA" ? "luna-llena" : item === "BABADOOK" ? "babadook" : item === "LA FESTA" ? "la-festa" : item === "ANIMAL" ? "animal" : item === "CELESTIAL" ? "celestial" : item === "CHAMPIONSHIP" ? "championship" : "events")}
                      className="block w-full text-white/60 text-sm tracking-[0.15em] hover:text-amber-500 transition-colors py-1"
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNavigate("events")}
                    className="mt-4 px-6 py-2 border border-amber-500/50 text-amber-500 text-xs tracking-widest hover:bg-amber-500 hover:text-black transition-all duration-300"
                  >
                    VIEW ALL EVENTS
                  </button>
                </div>
              )}
            </div>

            {/* Sparkle Divider */}
            <div className="flex justify-center">
              <Sparkle />
            </div>

            {/* 1 OF 1 UNIVERSE */}
            <div className="text-center">
              <button
                onClick={() => toggleSection("universe")}
                className="flex items-center justify-center gap-3 mx-auto text-white/90 hover:text-amber-500 transition-colors"
              >
                <span className="text-base md:text-2xl tracking-[0.2em] font-light italic">1 OF 1 UNIVERSE</span>
                {expandedSection === "universe" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              {expandedSection === "universe" && (
                <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {universeItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        if (item === "DRIP") handleNavigate("drip")
                        else if (item === "VISION GALLERY") handleNavigate("vision-gallery")
                        else if (item === "CAMP") handleNavigate("camp")
                        else if (item === "MAISON SWIM") handleNavigate("maison-swim")
                        else if (item === "GOLDEN BACKSTAGE") handleNavigate("golden-backstage")
                      }}
                      className="block w-full text-white/60 text-sm tracking-[0.15em] hover:text-amber-500 transition-colors py-1"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sparkle Divider */}
            <div className="flex justify-center">
              <Sparkle />
            </div>

            {/* BUY TICKETS */}
            <button
              onClick={() => handleNavigate("buy-tickets")}
              className="block w-full text-lg md:text-3xl tracking-[0.2em] text-amber-500 font-light italic hover:text-amber-400 transition-colors"
            >
              BUY TICKETS
            </button>

            {/* Sparkle Divider */}
            <div className="flex justify-center">
              <Sparkle />
            </div>

            {/* CONTACT */}
            <button
              onClick={() => handleNavigate("contact")}
              className={`block w-full text-lg md:text-3xl tracking-[0.2em] font-light italic transition-colors ${
                currentPage === "contact" ? "text-amber-500" : "text-white hover:text-amber-500"
              }`}
            >
              CONTACT
            </button>
          </div>
        </nav>

        {/* Social Links */}
        <div className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {["INSTAGRAM", "YOUTUBE", "TIKTOK"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-white/60 text-xs tracking-[0.15em] hover:text-amber-500 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
          <div className="flex justify-center">
            <a
              href="#"
              className="text-white/60 text-xs tracking-[0.15em] hover:text-amber-500 transition-colors"
            >
              WHATSAPP
            </a>
          </div>
          <div className="w-8 h-px bg-white/20 mx-auto" />
          <a
            href="mailto:contact@1of1firm.com"
            className="block text-white/50 text-xs tracking-[0.1em] hover:text-amber-500 transition-colors"
          >
            contact@1of1firm.com
          </a>
        </div>
      </div>
    </div>
  )
}
