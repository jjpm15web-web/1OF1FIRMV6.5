"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Instagram, MessageCircle, ArrowLeft } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"

interface ContactDetailProps {
  onNavigate?: (page: string) => void
}

export default function ContactDetail({ onNavigate }: ContactDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const contactCards = [
    {
      number: "01",
      title: "BOOK EVENTS",
      subtitle: "Bookings / Collaborations",
      buttonText: "WHATSAPP",
      buttonIcon: MessageCircle,
      href: "https://wa.me/+573003676521",
      image: "https://f005.backblazeb2.com/file/b21of1firm/background/CONTACTtarj.jpg"
    },
    {
      number: "02",
      title: "MEDIA",
      subtitle: "Press / Content / Interviews",
      buttonText: "INSTAGRAM",
      buttonIcon: Instagram,
      href: "https://www.instagram.com/1of1.firm?igsh=eWM2NDYzb3hzaDBl",
      image: "https://f005.backblazeb2.com/file/b21of1firm/background/CONTACTtarj1.jpg"
    },
    {
      number: "03",
      title: "BUSINESS",
      subtitle: "Partnerships / Proposals",
      buttonText: "EMAIL",
      buttonIcon: Mail,
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=contact@1of1firm.com&su=Consulta%20desde%201OF1%20FIRM&body=Hola%20equipo%20de%201OF1%20FIRM%2C%0A%0AMe%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios.%0A%0AGracias.",
      image: "https://f005.backblazeb2.com/file/b21of1firm/background/CONTACTtarj2.jpg",
      showEmail: true
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 md:p-6">
        <img 
          src="/logo.png" 
          alt="1 OF 1 FIRM" 
          className="h-8 md:h-10 w-auto cursor-pointer"
          onClick={() => onNavigate?.("home")}
        />
        <div className="flex items-center gap-4">
          <button className="text-white/80 text-xs tracking-[0.2em] hover:text-amber-500 transition-colors hidden md:block">
            VIP ACCESS
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white p-2 hover:text-amber-500 transition-colors"
            aria-label="Open menu"
          >
            <div className="space-y-1.5">
              <div className="w-6 h-px bg-current"></div>
              <div className="w-6 h-px bg-current"></div>
            </div>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[45vh] sm:min-h-[50vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-end">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover md:bg-contain lg:bg-cover bg-no-repeat bg-center md:bg-top"
          style={{
            backgroundImage: `url('https://f005.backblazeb2.com/file/b21of1firm/background/CONTACThome.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/10" />
        
        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 pb-8 sm:pb-10 md:pb-12 pt-24">
          <h1 
            className="text-[1.875rem] sm:text-[1.5rem] md:text-[7rem] lg:text-[9rem] font-medium leading-[0.85] tracking-tight text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            CONTACT
          </h1>
          <div className="w-5 sm:w-6 md:w-12 h-0.5 bg-amber-500 mt-1.5 sm:mt-2 md:mt-6 mb-0.5 sm:mb-1 md:mb-4" />
          <p className="text-amber-500/80 text-[7px] sm:text-[8px] md:text-base tracking-[0.15em] sm:tracking-[0.2em]">
            ENTER THE CONVERSATION.
          </p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="px-3 sm:px-4 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {contactCards.map((card) => (
            <div 
              key={card.number}
              className="relative border border-amber-500/30 bg-black overflow-hidden group"
            >
              {/* Card Number */}
              <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-20">
                <span className="text-amber-500 text-base sm:text-lg md:text-xl lg:text-2xl font-light">{card.number}</span>
              </div>

              {/* Card Image */}
              <div className="relative h-36 sm:h-40 md:h-48 lg:h-56 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>

              {/* Card Content */}
              <div className="p-3 sm:p-4 md:p-6 text-center">
                <h3 
                  className="text-xs sm:text-sm md:text-lg lg:text-2xl tracking-[0.1em] sm:tracking-[0.15em] text-white mb-1 sm:mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {card.title}
                </h3>
                <div className="w-4 sm:w-5 md:w-8 h-px bg-amber-500/50 mx-auto mb-1.5 sm:mb-2 md:mb-3" />
                <p className="text-white/50 text-[6px] sm:text-[8px] md:text-xs tracking-[0.05em] sm:tracking-[0.1em] mb-2 sm:mb-3 md:mb-6">
                  {card.subtitle}
                </p>

                {/* Button */}
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full py-1.5 sm:py-2 md:py-3 border border-amber-500 text-amber-500 text-[8px] sm:text-[10px] md:text-sm tracking-[0.15em] sm:tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all duration-300"
                >
                  <card.buttonIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  {card.buttonText}
                </a>

                {/* Email display for business card */}
                {card.showEmail && (
                  <p className="text-white/50 text-[8px] sm:text-[10px] md:text-xs tracking-[0.03em] sm:tracking-[0.05em] mt-2 sm:mt-3 md:mt-4">
                    contact@1of1firm.com
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-5 sm:py-6 md:py-8 px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-500/70" />
          <span className="text-white/60 text-[10px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em]">BARRANQUILLA, COLOMBIA</span>
        </div>
        <p className="text-amber-500 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em]">#1UNIQUEEXPERIENCE</p>
      </footer>

      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage="contact"
      />

      {/* Back Button */}
      <button 
        onClick={() => onNavigate?.("home")}
        className="fixed top-20 left-4 z-30 text-white/70 hover:text-amber-500 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    </div>
  )
}
