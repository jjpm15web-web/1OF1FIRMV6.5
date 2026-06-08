"use client"

import { useState } from "react"
import Menu from "@/components/menu"
import SignatureEvents from "@/components/signature-events"
import EventDetail from "@/components/event-detail"
import LunaLlenaDetail from "@/components/luna-llena-detail"
import LaFestaDetail from "@/components/la-festa-detail"
import AnimalDetail from "@/components/animal-detail"
import CelestialDetail from "@/components/celestial-detail"
import ChampionshipDetail from "@/components/championship-detail"
import DripDetail from "@/components/drip-detail"
import VisionGalleryDetail from "@/components/vision-gallery-detail"
import CampDetail from "@/components/camp-detail"
import MaisonSwimDetail from "@/components/maison-swim-detail"
import GoldenBackstageDetail from "@/components/golden-backstage-detail"
import BuyTicketsDetail from "@/components/buy-tickets-detail"
import ContactDetail from "@/components/contact-detail"
import AdminLogin from "@/components/admin-login"
import AdminPanel from "@/components/admin-panel"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"home" | "events" | "babadook" | "luna-llena" | "la-festa" | "animal" | "celestial" | "championship" | "drip" | "vision-gallery" | "camp" | "maison-swim" | "golden-backstage" | "buy-tickets" | "contact" | "admin-login" | "admin-panel">("home")
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  console.log("[v0] Home component rendered, currentPage:", currentPage)

  const handleNavigate = (page: string) => {
    console.log("[v0] Home handleNavigate called with:", page)
    if (page === "events") {
      setCurrentPage("events")
    } else if (page === "babadook") {
      setCurrentPage("babadook")
    } else if (page === "luna-llena") {
      setCurrentPage("luna-llena")
    } else if (page === "la-festa") {
      setCurrentPage("la-festa")
    } else if (page === "animal") {
      setCurrentPage("animal")
    } else if (page === "celestial") {
      setCurrentPage("celestial")
    } else if (page === "championship") {
      setCurrentPage("championship")
    } else if (page === "drip") {
      setCurrentPage("drip")
    } else if (page === "vision-gallery") {
      setCurrentPage("vision-gallery")
    } else if (page === "camp") {
      setCurrentPage("camp")
    } else if (page === "maison-swim") {
      setCurrentPage("maison-swim")
    } else if (page === "golden-backstage") {
      setCurrentPage("golden-backstage")
    } else if (page === "buy-tickets") {
      setCurrentPage("buy-tickets")
    } else if (page === "contact") {
      setCurrentPage("contact")
    } else if (page === "admin-login") {
      setCurrentPage("admin-login")
    } else if (page === "admin-panel") {
      setCurrentPage("admin-panel")
    } else {
      setCurrentPage("home")
    }
  }

  if (currentPage === "babadook") {
    return (
      <div>
        <EventDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "luna-llena") {
    return (
      <div>
        <LunaLlenaDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "la-festa") {
    return (
      <div>
        <LaFestaDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "animal") {
    return (
      <div>
        <AnimalDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "celestial") {
    return (
      <div>
        <CelestialDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "championship") {
    return (
      <div>
        <ChampionshipDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "drip") {
    return (
      <div>
        <DripDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "vision-gallery") {
    return (
      <div>
        <VisionGalleryDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "camp") {
    return (
      <div>
        <CampDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "maison-swim") {
    return (
      <div>
        <MaisonSwimDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "golden-backstage") {
    return (
      <div>
        <GoldenBackstageDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "buy-tickets") {
    return (
      <div>
        <BuyTicketsDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "contact") {
    return (
      <div>
        <ContactDetail onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === "admin-login") {
    return (
      <div>
        <AdminLogin 
          onNavigate={handleNavigate} 
          onLogin={() => {
            setIsAdminLoggedIn(true)
            setCurrentPage("admin-panel")
          }}
        />
      </div>
    )
  }

  if (currentPage === "admin-panel") {
    if (!isAdminLoggedIn) {
      setCurrentPage("admin-login")
      return null
    }
    return (
      <div>
        <AdminPanel 
          onNavigate={handleNavigate} 
          onLogout={() => {
            setIsAdminLoggedIn(false)
            setCurrentPage("home")
          }}
        />
      </div>
    )
  }

  if (currentPage === "events") {
    return (
      <div>
        <SignatureEvents onNavigate={handleNavigate} />
      </div>
    )
  }

  return (
    <div>
      <Menu onNavigate={handleNavigate} />
    </div>
  )
}
