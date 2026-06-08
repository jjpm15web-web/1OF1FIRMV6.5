"use client"

import { useState, useEffect, useCallback } from "react"

// Types
export interface EventOption {
  id: string
  name: string
  subtitle: string
  image: string
  category: "signature" | "weekend"
  isEditable: boolean
  description?: string
  date?: string
  time?: string
  location?: string
  ticketPrice?: string
  vipPrice?: string
  vipNote?: string
  stage?: string
  countdownDate?: string
  dateLabel?: string
  dateSubtitle?: string
  soldOut?: boolean
  // Weekend-event specific display fields (shown on the public WEEKEND EVENTS cards)
  dayLabel?: string
  venue?: string
  ageRestriction?: string
  ageNote?: string
  buttonText?: string
}

// LocalStorage keys
const SIGNATURE_EVENTS_KEY = "1of1_signature_events"
const WEEKEND_EVENTS_KEY = "1of1_weekend_events"

// Default data - Signature Events
const defaultSignatureEvents: EventOption[] = [
  { id: "babadook", name: "BABADOOK 2026", subtitle: "SEXTO ANIVERSARIO DE 1OF1", image: "https://f005.backblazeb2.com/file/b21of1firm/background/BDsig.png", category: "signature", isEditable: false, description: "6ta Edicion - Sexto aniversario", date: "30 Y 31 DE OCTUBRE", location: "BARRANQUILLA", ticketPrice: "$45.000 COP", vipPrice: "$500.000 COP", vipNote: "NORMALMENTE $700K - $2M", stage: "ETAPA CREYENTES", countdownDate: "2026-10-30T20:00", dateLabel: "30 Y 31 DE OCTUBRE", dateSubtitle: "2026" },
  { id: "luna-llena", name: "LUNA LLENA", subtitle: "RUMBA DE PERREO & REGGAETON", image: "https://f005.backblazeb2.com/file/b21of1firm/background/LLback.png", category: "signature", isEditable: false, description: "Rumba de perreo y reggaeton", location: "BARRANQUILLA", ticketPrice: "$45.000 COP", vipPrice: "$500.000 COP", vipNote: "NORMALMENTE $700K - $2M", stage: "ETAPA CREYENTES", countdownDate: "2026-06-01T21:00", dateLabel: "FECHA PRÓXIMAMENTE", dateSubtitle: "PRONTO SERÁ ANUNCIADA" },
  { id: "la-festa", name: "LA FESTA", subtitle: "RUMBA EPICA - CARNAVAL", image: "https://f005.backblazeb2.com/file/b21of1firm/background/LFESTAhome.png", category: "signature", isEditable: false, description: "Rumba epica de carnaval", location: "BARRANQUILLA", ticketPrice: "$45.000 COP", vipPrice: "$500.000 COP", vipNote: "NORMALMENTE $700K - $2M", stage: "ETAPA CREYENTES", countdownDate: "2027-02-15T22:00", dateLabel: "FECHA PRÓXIMAMENTE", dateSubtitle: "PRONTO SERÁ ANUNCIADA" },
  { id: "animal", name: "ANIMAL", subtitle: "MAS SALVAJE - +14 SIN ALCOHOL", image: "https://f005.backblazeb2.com/file/b21of1firm/background/ANhome.jpg", category: "signature", isEditable: false, description: "Experiencia mas salvaje +14 sin alcohol", date: "SÁBADO 17 DE MAYO", location: "DISCOLO NIGHT CLUB, BARRANQUILLA", ticketPrice: "$45.000 COP", vipPrice: "$500.000 COP", vipNote: "NORMALMENTE $700K - $2M", stage: "ETAPA CREYENTES", countdownDate: "2027-05-17T19:00", dateLabel: "SÁBADO 17 DE MAYO", dateSubtitle: "DISCOLO NIGHT CLUB" },
  { id: "celestial", name: "MISS 1 OF 1", subtitle: "CELESTIAL", image: "https://f005.backblazeb2.com/file/b21of1firm/background/MChome.png", category: "signature", isEditable: false, description: "Certamen de belleza con after party", location: "BARRANQUILLA", ticketPrice: "45.000", vipPrice: "500.000", vipNote: "", stage: "ETAPA CREYENTES", countdownDate: "2027-08-01T18:00", dateLabel: "COMING SOON", dateSubtitle: "" },
  { id: "championship", name: "THE 1 OF 1", subtitle: "CHAMPIONSHIP", image: "https://f005.backblazeb2.com/file/b21of1firm/background/CHAMPhome.png", category: "signature", isEditable: false, description: "Torneo de artes marciales", date: "COMING SOON", location: "BARRANQUILLA", ticketPrice: "$250.000", vipPrice: "$100.000", vipNote: "", stage: "ETAPA CREYENTES", countdownDate: "2027-12-01T17:00", dateLabel: "COMING SOON", dateSubtitle: "" },
]

// Default data - Weekend Events
const defaultWeekendEvents: EventOption[] = [
  { id: "weekend-1", name: "ELITE WEEKEND", subtitle: "Night", image: "https://f005.backblazeb2.com/file/b21of1firm/background/SEhome.jpg", category: "weekend", isEditable: true, description: "LA EXPERIENCIA\nQUE NUNCA OLVIDAS", date: "VIERNES 16 DE MAYO", time: "9:00 PM", location: "BARRANQUILLA", ticketPrice: "$40.000 COP", vipPrice: "$400.000 COP", vipNote: "Mesa VIP 10 personas", dayLabel: "VIERNES", venue: "DISCOLO NIGHT CLUB", ageRestriction: "+14", ageNote: "MÁS SALVAJE. +14 SIN ALCOHOL", buttonText: "COMPRAR" },
  { id: "weekend-2", name: "SECRET PARTY", subtitle: "VIP", image: "https://f005.backblazeb2.com/file/b21of1firm/background/BThome.png", category: "weekend", isEditable: true, description: "VIVE EL FIN DE SEMANA\nCOMO NUNCA", date: "SÁBADO 17 DE MAYO", time: "9:00 PM", location: "BARRANQUILLA", ticketPrice: "$40.000 COP", vipPrice: "$400.000 COP", vipNote: "Mesa VIP 10 personas", dayLabel: "SÁBADO", venue: "DISCOLO NIGHT CLUB", ageRestriction: "+14", ageNote: "MÁS SALVAJE. +14 SIN ALCOHOL", buttonText: "COMPRAR" },
  { id: "weekend-3", name: "ANIMAL", subtitle: "Aftermovie", image: "https://f005.backblazeb2.com/file/b21of1firm/background/SEhome.jpg", category: "weekend", isEditable: true, description: "REVIVE LA EXPERIENCIA\nCOMO SI ESTUVIERAS AHÍ", date: "DOMINGO 18 DE MAYO", time: "8:00 PM", location: "BARRANQUILLA", ticketPrice: "$40.000 COP", vipPrice: "$400.000 COP", vipNote: "Mesa VIP 10 personas", dayLabel: "DOMINGO", venue: "DISCOLO NIGHT CLUB", ageRestriction: "+14", ageNote: "MÁS SALVAJE. +14 SIN ALCOHOL", buttonText: "COMPRAR" },
]

// Helper to get data from localStorage
function getStoredEvents<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
  }
  return defaultValue
}

// Helper to save data to localStorage
function saveEvents(key: string, data: EventOption[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
    // Dispatch custom event to notify other components - use setTimeout to ensure state update completes first
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("events-updated", { detail: { key, timestamp: Date.now() } }))
    }, 0)
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

// Hook for Signature Events
export function useSignatureEvents() {
  const [events, setEvents] = useState<EventOption[]>(defaultSignatureEvents)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredEvents(SIGNATURE_EVENTS_KEY, defaultSignatureEvents)
    setEvents(stored)
    setIsLoaded(true)
  }, [])

  // Listen for updates from other components - including self updates
  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === SIGNATURE_EVENTS_KEY) {
        const stored = getStoredEvents(SIGNATURE_EVENTS_KEY, defaultSignatureEvents)
        setEvents(stored)
      }
    }
    window.addEventListener("events-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("events-updated", handleUpdate as EventListener)
  }, [])

  const updateEvent = useCallback((updatedEvent: EventOption) => {
    setEvents(prev => {
      const newEvents = prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
      saveEvents(SIGNATURE_EVENTS_KEY, newEvents)
      return newEvents
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    setEvents(defaultSignatureEvents)
    saveEvents(SIGNATURE_EVENTS_KEY, defaultSignatureEvents)
  }, [])

  return { events, updateEvent, resetToDefaults, isLoaded }
}

// Hook for Weekend Events
export function useWeekendEvents() {
  const [events, setEvents] = useState<EventOption[]>(defaultWeekendEvents)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredEvents(WEEKEND_EVENTS_KEY, defaultWeekendEvents)
    setEvents(stored)
    setIsLoaded(true)
  }, [])

  // Listen for updates from other components - including self updates
  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === WEEKEND_EVENTS_KEY) {
        const stored = getStoredEvents(WEEKEND_EVENTS_KEY, defaultWeekendEvents)
        setEvents(stored)
      }
    }
    window.addEventListener("events-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("events-updated", handleUpdate as EventListener)
  }, [])

  const addEvent = useCallback((newEvent: EventOption) => {
    setEvents(prev => {
      const newEvents = [...prev, newEvent]
      saveEvents(WEEKEND_EVENTS_KEY, newEvents)
      return newEvents
    })
  }, [])

  const updateEvent = useCallback((updatedEvent: EventOption) => {
    setEvents(prev => {
      const newEvents = prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
      saveEvents(WEEKEND_EVENTS_KEY, newEvents)
      return newEvents
    })
  }, [])

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => {
      const newEvents = prev.filter(e => e.id !== eventId)
      saveEvents(WEEKEND_EVENTS_KEY, newEvents)
      return newEvents
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    setEvents(defaultWeekendEvents)
    saveEvents(WEEKEND_EVENTS_KEY, defaultWeekendEvents)
  }, [])

  return { events, addEvent, updateEvent, deleteEvent, resetToDefaults, isLoaded }
}

// Hook to get a single event by ID from both stores - reads directly from localStorage for fresh data
export function useEventById(eventId: string) {
  const [event, setEvent] = useState<EventOption | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load directly from localStorage on mount and when eventId changes
  useEffect(() => {
    const loadEvent = () => {
      const signatureEvents = getStoredEvents(SIGNATURE_EVENTS_KEY, defaultSignatureEvents)
      const weekendEvents = getStoredEvents(WEEKEND_EVENTS_KEY, defaultWeekendEvents)
      const allEvents = [...signatureEvents, ...weekendEvents]
      const foundEvent = allEvents.find(e => e.id === eventId)
      setEvent(foundEvent)
      setIsLoaded(true)
    }

    loadEvent()

    // Listen for updates from admin panel
    const handleUpdate = () => {
      loadEvent()
    }
    
    window.addEventListener("events-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("events-updated", handleUpdate as EventListener)
  }, [eventId])

  return { event, isLoaded }
}

// Hook to get all events
export function useAllEvents() {
  const { events: signatureEvents, updateEvent: updateSignatureEvent, isLoaded: sigLoaded } = useSignatureEvents()
  const { events: weekendEvents, addEvent, updateEvent: updateWeekendEvent, deleteEvent, isLoaded: weekLoaded } = useWeekendEvents()

  const allEvents = [...signatureEvents, ...weekendEvents]
  const isLoaded = sigLoaded && weekLoaded

  const updateEvent = useCallback((event: EventOption) => {
    if (event.category === "signature") {
      updateSignatureEvent(event)
    } else {
      updateWeekendEvent(event)
    }
  }, [updateSignatureEvent, updateWeekendEvent])

  return {
    signatureEvents,
    weekendEvents,
    allEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    isLoaded
  }
}
