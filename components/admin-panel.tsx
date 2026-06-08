"use client"

import { useState } from "react"
import { 
  Calendar, 
  ChevronRight, 
  ChevronDown,
  MapPin,
  Clock,
  Headphones,
  LogOut,
  Check,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Lock,
  Edit3,
  Trash2,
  Play,
  Film,
  Video
} from "lucide-react"
import AdminUniversePanel from "./admin-universe-panel"
import { useAllEvents, type EventOption } from "@/lib/events-store"
import { useAfterMovieMedia, type AfterMovieMedia } from "@/lib/aftermovie-store"

interface AdminPanelProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface NewEventForm {
  name: string
  subtitle: string
  description: string
  date: string
  time: string
  location: string
  ticketPrice: string
  vipPrice: string
  vipNote: string
  stage: string
  image: string
  category: "signature" | "weekend"
  countdownDate: string
  dateLabel: string
  dateSubtitle: string
  // Weekend-event specific fields
  dayLabel: string
  venue: string
  ageRestriction: string
  ageNote: string
  buttonText: string
}

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

// Helper para formatear fecha y hora del contador
const formatCountdownDateTime = (dateTimeStr: string): string => {
  if (!dateTimeStr) return ""
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  } catch {
    return dateTimeStr
  }
}

export default function AdminPanel({ onNavigate, onLogout }: AdminPanelProps) {
  // Use centralized store for events
  const { signatureEvents, weekendEvents, addEvent, updateEvent, deleteEvent, isLoaded } = useAllEvents()
  
  const [selectedEvent, setSelectedEvent] = useState<string>("babadook")
  const [showNewEventModal, setShowNewEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventOption | null>(null)
  const [newEventForm, setNewEventForm] = useState<NewEventForm>({
    name: "",
    subtitle: "",
    description: "",
    date: "",
    time: "",
    location: "Barranquilla, Colombia",
    ticketPrice: "",
    vipPrice: "",
    vipNote: "",
    stage: "",
    image: "",
    category: "weekend",
    countdownDate: "",
    dateLabel: "",
    dateSubtitle: "",
    dayLabel: "",
    venue: "",
    ageRestriction: "",
    ageNote: "",
    buttonText: ""
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // AfterMovie Media State
  const [selectedAfterMovieEvent, setSelectedAfterMovieEvent] = useState<string>("babadook")
  const { media: afterMovieMedia, addMedia, deleteMedia, isLoaded: afterMovieLoaded } = useAfterMovieMedia(selectedAfterMovieEvent)
  const [showAfterMovieModal, setShowAfterMovieModal] = useState(false)
  
  // Aftermovie event options - sections that have VER AFTERMOVIE
  const afterMovieEventOptions = [
    { id: "babadook", name: "BABADOOK", page: "Pagina de Evento Principal" },
    { id: "animal", name: "ANIMAL", page: "Animal Detail" },
    { id: "luna-llena", name: "LUNA LLENA", page: "Luna Llena Detail" },
    { id: "la-festa", name: "LA FESTA", page: "La Festa Detail" },
    { id: "celestial", name: "CELESTIAL", page: "Celestial Detail" },
    { id: "championship", name: "CHAMPIONSHIP", page: "Championship Detail" },
  ]
  
  const selectedAfterMovieEventData = afterMovieEventOptions.find(e => e.id === selectedAfterMovieEvent)
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image")
  const [newMediaSrc, setNewMediaSrc] = useState("")
  const [newMediaAlt, setNewMediaAlt] = useState("")
  const [isMediaUploading, setIsMediaUploading] = useState(false)
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null)

  const allEvents = [...signatureEvents, ...weekendEvents]
  const selectedEventData = allEvents.find(e => e.id === selectedEvent)

  const handleNewEventChange = (field: keyof NewEventForm, value: string) => {
    setNewEventForm(prev => ({ ...prev, [field]: value }))
    setUploadError(null)
  }

  // Handle file upload from local storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Por favor selecciona un archivo de imagen valido")
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("La imagen debe ser menor a 50MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const base64 = await fileToBase64(file)
      setNewEventForm(prev => ({ ...prev, image: base64 }))
    } catch (error) {
      console.error("[v0] Error uploading file:", error)
      setUploadError("Error al procesar la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateEvent = () => {
    if (!newEventForm.name || !newEventForm.subtitle) return
    
    const newEvent: EventOption = {
      id: `weekend-${Date.now()}`,
      name: newEventForm.name.toUpperCase(),
      subtitle: newEventForm.subtitle.toUpperCase(),
      image: newEventForm.image || "https://f005.backblazeb2.com/file/b21of1firm/background/SEhome.jpg",
      category: "weekend",
      isEditable: true,
      description: newEventForm.description,
      date: newEventForm.date,
      time: newEventForm.time,
      location: newEventForm.location,
      ticketPrice: newEventForm.ticketPrice,
      vipPrice: newEventForm.vipPrice,
      vipNote: newEventForm.vipNote,
      stage: newEventForm.stage,
      dayLabel: newEventForm.dayLabel.toUpperCase(),
      venue: newEventForm.venue.toUpperCase(),
      ageRestriction: newEventForm.ageRestriction,
      ageNote: newEventForm.ageNote.toUpperCase(),
      buttonText: (newEventForm.buttonText || "COMPRAR").toUpperCase()
    }
    
    addEvent(newEvent)
    
    setNewEventForm({
      name: "",
      subtitle: "",
      description: "",
      date: "",
      time: "",
      location: "Barranquilla, Colombia",
      ticketPrice: "",
      vipPrice: "",
      vipNote: "",
      stage: "",
      image: "",
      category: "weekend",
      countdownDate: "",
      dateLabel: "",
      dateSubtitle: "",
      dayLabel: "",
      venue: "",
      ageRestriction: "",
      ageNote: "",
      buttonText: ""
    })
    setShowNewEventModal(false)
  }

  const handleEditEvent = (event: EventOption) => {
    setEditingEvent(event)
    setNewEventForm({
      name: event.name,
      subtitle: event.subtitle,
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "Barranquilla, Colombia",
      ticketPrice: event.ticketPrice || "",
      vipPrice: event.vipPrice || "",
      vipNote: event.vipNote || "",
      stage: event.stage || "",
      image: event.image,
      category: event.category,
      countdownDate: event.countdownDate || "",
      dateLabel: event.dateLabel || "",
      dateSubtitle: event.dateSubtitle || "",
      dayLabel: event.dayLabel || "",
      venue: event.venue || "",
      ageRestriction: event.ageRestriction || "",
      ageNote: event.ageNote || "",
      buttonText: event.buttonText || ""
    })
    setShowNewEventModal(true)
  }

  const handleUpdateEvent = () => {
    if (!editingEvent || !newEventForm.name || !newEventForm.subtitle) return
    
    const updatedEvent: EventOption = {
      ...editingEvent,
      name: newEventForm.name.toUpperCase(),
      subtitle: newEventForm.subtitle.toUpperCase(),
      description: newEventForm.description,
      date: newEventForm.date,
      time: newEventForm.time,
      location: newEventForm.location,
      ticketPrice: newEventForm.ticketPrice,
      vipPrice: newEventForm.vipPrice,
      vipNote: newEventForm.vipNote,
      stage: newEventForm.stage,
      countdownDate: newEventForm.countdownDate,
      dateLabel: newEventForm.dateLabel,
      dateSubtitle: newEventForm.dateSubtitle,
      dayLabel: newEventForm.dayLabel.toUpperCase(),
      venue: newEventForm.venue.toUpperCase(),
      ageRestriction: newEventForm.ageRestriction,
      ageNote: newEventForm.ageNote.toUpperCase(),
      buttonText: (newEventForm.buttonText || "COMPRAR").toUpperCase(),
      // Solo actualizar imagen si es weekend event
      image: editingEvent.category === "weekend" ? (newEventForm.image || editingEvent.image) : editingEvent.image
    }
    
    if (editingEvent.category === "signature") {
      updateEvent(updatedEvent)
    } else {
      updateEvent(updatedEvent)
    }
    
    setEditingEvent(null)
    setNewEventForm({
      name: "",
      subtitle: "",
      description: "",
      date: "",
      time: "",
      location: "Barranquilla, Colombia",
      ticketPrice: "",
      vipPrice: "",
      vipNote: "",
      stage: "",
      image: "",
      category: "weekend",
      countdownDate: "",
      dateLabel: "",
      dateSubtitle: "",
      dayLabel: "",
      venue: "",
      ageRestriction: "",
      ageNote: "",
      buttonText: ""
    })
    setShowNewEventModal(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
    if (selectedEvent === eventId) {
      setSelectedEvent("babadook")
    }
  }

  const closeModal = () => {
    setShowNewEventModal(false)
    setEditingEvent(null)
    setUploadError(null)
    setIsUploading(false)
    setNewEventForm({
      name: "",
      subtitle: "",
      description: "",
      date: "",
      time: "",
      location: "Barranquilla, Colombia",
      ticketPrice: "",
      vipPrice: "",
      vipNote: "",
      stage: "",
      image: "",
      category: "weekend",
      countdownDate: "",
      dateLabel: "",
      dateSubtitle: "",
      dayLabel: "",
      venue: "",
      ageRestriction: "",
      ageNote: "",
      buttonText: ""
    })
  }

  // AfterMovie Media Handlers
  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type based on media type
    if (newMediaType === "image" && !file.type.startsWith("image/")) {
      setMediaUploadError("Por favor selecciona un archivo de imagen valido")
      return
    }
    if (newMediaType === "video" && !file.type.startsWith("video/")) {
      setMediaUploadError("Por favor selecciona un archivo de video valido")
      return
    }

    // Validate file size (max 50MB for images, 1GB for videos)
    const maxSize = newMediaType === "image" ? 50 * 1024 * 1024 : 1024 * 1024 * 1024
    if (file.size > maxSize) {
      setMediaUploadError(`El archivo debe ser menor a ${newMediaType === "image" ? "50MB" : "1GB"}`)
      return
    }

    setIsMediaUploading(true)
    setMediaUploadError(null)

    try {
      const base64 = await fileToBase64(file)
      setNewMediaSrc(base64)
    } catch (error) {
      console.error("[v0] Error uploading media file:", error)
      setMediaUploadError("Error al procesar el archivo")
    } finally {
      setIsMediaUploading(false)
    }
  }

  const handleAddMedia = () => {
    if (!newMediaSrc) return
    
    addMedia({
      type: newMediaType,
      src: newMediaSrc,
      alt: newMediaAlt || `${newMediaType === "image" ? "Imagen" : "Video"} del aftermovie - ${selectedAfterMovieEventData?.name || "Evento"}`,
      eventId: selectedAfterMovieEvent
    })
    
    // Reset form
    setNewMediaType("image")
    setNewMediaSrc("")
    setNewMediaAlt("")
    setShowAfterMovieModal(false)
    setMediaUploadError(null)
  }

  const closeAfterMovieModal = () => {
    setShowAfterMovieModal(false)
    setNewMediaType("image")
    setNewMediaSrc("")
    setNewMediaAlt("")
    setMediaUploadError(null)
    setIsMediaUploading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 md:px-8 bg-black/90 backdrop-blur-sm border-b border-white/5">
        <button onClick={() => onNavigate("home")} className="cursor-pointer">
          <img 
            src="/logo.png" 
            alt="1 OF 1 FIRM" 
            className="h-6 sm:h-8 md:h-10 w-auto"
          />
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-amber-500/80 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] hidden sm:block">VIP ACCESS</span>
          <button
            onClick={onLogout}
            className="text-white/60 hover:text-amber-500 transition-colors p-1.5 sm:p-2"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 pb-6 sm:pb-8 px-3 sm:px-4 md:px-8">
        {/* Title */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-thin tracking-wider text-white italic">EVENTS REQUEST</h1>
          <button 
            onClick={() => setShowNewEventModal(true)}
            className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 border border-amber-500/50 text-amber-500 text-[10px] sm:text-xs tracking-[0.15em] hover:bg-amber-500 hover:text-black transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            NUEVO EVENTO
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Column - Event Selection */}
          <div className="w-full lg:w-[380px] space-y-3 sm:space-y-4">
            {/* SIGNATURE EVENTS */}
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Lock className="w-3 h-3 text-amber-500/70" />
                <p className="text-amber-500/80 text-[10px] sm:text-xs tracking-[0.2em]">SIGNATURE EVENTS</p>
                <span className="text-white/30 text-[9px] sm:text-[10px] hidden sm:inline">(Foto no editable)</span>
              </div>
              
              <div className="space-y-2 max-h-[25vh] sm:max-h-[30vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent">
                {signatureEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all duration-300 ${
                      selectedEvent === event.id 
                        ? "border-amber-500/50 bg-amber-500/5" 
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedEvent(event.id)}
                      className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                    >
                      {/* Event Thumbnail */}
                      <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                        {event.soldOut && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-red-500 text-[6px] sm:text-[8px] font-bold tracking-wider">SOLD OUT</span>
                          </div>
                        )}
                        <div className="absolute bottom-0.5 right-0.5">
                          <Lock className="w-2 h-2 sm:w-3 sm:h-3 text-amber-500/70" />
                        </div>
                      </div>
                      
                      {/* Event Info */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-white text-xs sm:text-sm tracking-wide truncate">{event.name}</p>
                        <p className="text-amber-500/70 text-[9px] sm:text-[10px] tracking-[0.1em] truncate">{event.subtitle}</p>
                        {event.countdownDate && (
                          <p className="text-white/40 text-[8px] sm:text-[9px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            Contador: {formatCountdownDateTime(event.countdownDate)}
                          </p>
                        )}
                      </div>
                    </button>
                    
                    {/* Sold Out Toggle */}
                    <button
                      onClick={() => updateEvent({ ...event, soldOut: !event.soldOut })}
                      className={`p-1 sm:p-1.5 rounded-lg transition-all flex-shrink-0 ${
                        event.soldOut 
                          ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" 
                          : "text-white/40 hover:text-red-500 hover:bg-red-500/10"
                      }`}
                      title={event.soldOut ? "Desactivar SOLD OUT" : "Activar SOLD OUT"}
                    >
                      <span className="text-[8px] sm:text-[9px] font-bold tracking-wider">SOLD</span>
                    </button>
                    
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-1 sm:p-1.5 rounded-lg text-white/40 hover:text-amber-500 hover:bg-amber-500/10 transition-all flex-shrink-0"
                      title="Editar evento (foto protegida)"
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    
                    {/* Selection Indicator */}
                    {selectedEvent === event.id ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/30 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* WEEKEND EVENTS */}
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Edit3 className="w-3 h-3 text-green-500/70" />
                <p className="text-green-500/80 text-[10px] sm:text-xs tracking-[0.2em]">WEEKEND EVENTS</p>
                <span className="text-white/30 text-[9px] sm:text-[10px] hidden sm:inline">(Editable)</span>
              </div>
              
              <div className="space-y-2 max-h-[20vh] sm:max-h-[25vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-500/30 scrollbar-track-transparent">
                {weekendEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all duration-300 ${
                      selectedEvent === event.id 
                        ? "border-green-500/50 bg-green-500/5" 
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedEvent(event.id)}
                      className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                    >
                      {/* Event Thumbnail */}
                      <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                        {event.image ? (
                          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white/40" />
                          </div>
                        )}
                        {event.soldOut && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-red-500 text-[6px] sm:text-[8px] font-bold tracking-wider">SOLD OUT</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Event Info */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-white text-xs sm:text-sm tracking-wide truncate">{event.name}</p>
                        <p className="text-green-500/70 text-[9px] sm:text-[10px] tracking-[0.1em] truncate">{event.subtitle}</p>
                      </div>
                    </button>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                      <button
                        onClick={() => updateEvent({ ...event, soldOut: !event.soldOut })}
                        className={`p-1 sm:p-1.5 rounded-lg transition-all ${
                          event.soldOut 
                            ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" 
                            : "text-white/40 hover:text-red-500 hover:bg-red-500/10"
                        }`}
                        title={event.soldOut ? "Desactivar SOLD OUT" : "Activar SOLD OUT"}
                      >
                        <span className="text-[8px] sm:text-[9px] font-bold tracking-wider">SOLD</span>
                      </button>
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-1 sm:p-1.5 rounded-lg text-white/40 hover:text-green-500 hover:bg-green-500/10 transition-all"
                        title="Editar evento"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-1 sm:p-1.5 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedEvent === event.id && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex-1">
            {/* Event Header Image - Shows selected event */}
            <div className="relative h-28 sm:h-32 md:h-40 rounded-xl overflow-hidden mb-4 sm:mb-6">
              <img
                src={selectedEventData?.image || "https://f005.backblazeb2.com/file/b21of1firm/background/BDsig.png"}
                alt={selectedEventData?.name || "Event"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                <p className="text-white text-base sm:text-lg md:text-xl font-medium tracking-wide">{selectedEventData?.name}</p>
                <p className="text-amber-500/80 text-[10px] sm:text-xs tracking-[0.1em]">{selectedEventData?.subtitle}</p>
              </div>
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                <span className="text-white/60 text-3xl sm:text-4xl md:text-6xl font-thin italic">1OF1</span>
              </div>
              {/* Category Badge */}
              <div className={`absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] tracking-[0.1em] flex items-center gap-1 ${
                selectedEventData?.category === "signature" 
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" 
                  : "bg-green-500/20 text-green-500 border border-green-500/30"
              }`}>
                {selectedEventData?.category === "signature" ? <Lock className="w-2 h-2 sm:w-3 sm:h-3" /> : <Edit3 className="w-2 h-2 sm:w-3 sm:h-3" />}
                {selectedEventData?.category === "signature" ? "SIGNATURE" : "WEEKEND"}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
              {/* Event Information - Shows selected event data */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500/70" />
                    <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]">EVENT INFORMATION</span>
                  </div>
                  <button
                    onClick={() => selectedEventData && handleEditEvent(selectedEventData)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs tracking-[0.1em] flex items-center gap-1 sm:gap-1.5 transition-all ${
                      selectedEventData?.category === "signature"
                        ? "border border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                        : "border border-green-500/30 text-green-500 hover:bg-green-500/10"
                    }`}
                  >
                    <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    EDITAR
                  </button>
                </div>
                
                {/* Selected Event Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1">EVENTO</label>
                    <p className="text-white text-xs sm:text-sm font-medium">{selectedEventData?.name || "-"}</p>
                    <p className="text-amber-500/60 text-[9px] sm:text-[10px]">{selectedEventData?.subtitle || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1">UBICACION</label>
                    <p className="text-white text-xs sm:text-sm">{selectedEventData?.location || "Barranquilla, Colombia"}</p>
                  </div>
                  {selectedEventData?.date && (
                    <div>
                      <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1">FECHA</label>
                      <p className="text-white text-xs sm:text-sm">{selectedEventData.date}</p>
                    </div>
                  )}
                  {selectedEventData?.stage && (
                    <div>
                      <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1">ETAPA</label>
                      <p className="text-amber-500 text-xs sm:text-sm">{selectedEventData.stage}</p>
                    </div>
                  )}
                  {selectedEventData?.countdownDate && selectedEventData?.category === "signature" && (
                    <div>
                      <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        FECHA Y HORA CONTADOR
                      </label>
                      <p className="text-amber-500 text-xs sm:text-sm font-medium">{formatCountdownDateTime(selectedEventData.countdownDate)}</p>
                    </div>
                  )}
                  {selectedEventData?.description && (
                    <div className="sm:col-span-2">
                      <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1">DESCRIPCION</label>
                      <p className="text-white/70 text-xs sm:text-sm">{selectedEventData.description}</p>
                    </div>
                  )}
                </div>

                {/* Pricing Details */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1">TICKET</label>
                    <p className="text-white text-sm sm:text-lg font-light">{selectedEventData?.ticketPrice || "Consultar"}</p>
                  </div>
                  <div>
                    <label className="block text-white/40 text-[8px] sm:text-[9px] tracking-[0.15em] mb-1">MESA VIP</label>
                    <p className="text-white text-sm sm:text-lg font-light">{selectedEventData?.vipPrice || "Consultar"}</p>
                    {selectedEventData?.vipNote && (
                      <p className="text-white/40 text-[9px] sm:text-[10px]">{selectedEventData.vipNote}</p>
                    )}
                  </div>
                </div>
                
                {/* Event Selector */}
                <div className="mt-3 sm:mt-4">
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">SELECCIONAR EVENTO</label>
                  <div className="relative">
                    <select 
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm appearance-none cursor-pointer focus:outline-none focus:border-amber-500/50"
                    >
                      <optgroup label="SIGNATURE EVENTS" className="bg-black text-amber-500">
                        {signatureEvents.map(event => (
                          <option key={event.id} value={event.id} className="bg-black text-white">{event.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="WEEKEND EVENTS" className="bg-black text-green-500">
                        {weekendEvents.map(event => (
                          <option key={event.id} value={event.id} className="bg-black text-white">{event.name}</option>
                        ))}
                      </optgroup>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1 OF 1 UNIVERSE Section */}
        <AdminUniversePanel />

        {/* VER AFTERMOVIE Section */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-thin tracking-wider text-white italic">VER AFTERMOVIE</h2>
            </div>
            <button 
              onClick={() => setShowAfterMovieModal(true)}
              className="px-3 sm:px-4 py-2 border border-amber-500/50 text-amber-500 text-[10px] sm:text-xs tracking-[0.15em] hover:bg-amber-500 hover:text-black transition-all duration-300 flex items-center gap-2 w-fit"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              AGREGAR MEDIA
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
            {/* Event Selector for Aftermovie */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <label className="block text-amber-500/80 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2 flex items-center gap-2">
                <Film className="w-3 h-3" />
                SELECCIONAR SECCION A EDITAR
              </label>
              <div className="relative">
                <select 
                  value={selectedAfterMovieEvent}
                  onChange={(e) => setSelectedAfterMovieEvent(e.target.value)}
                  className="w-full bg-black/50 border border-amber-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm appearance-none cursor-pointer focus:outline-none focus:border-amber-500/60"
                >
                  {afterMovieEventOptions.map(event => (
                    <option key={event.id} value={event.id} className="bg-black text-white">
                      {event.name} - {event.page}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-amber-500/60 pointer-events-none" />
              </div>
              <p className="text-white/40 text-[8px] sm:text-[9px] mt-2">
                Seccion actual: <span className="text-amber-500">{selectedAfterMovieEventData?.page}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Play className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500/70" />
              <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]">GALERIA {selectedAfterMovieEventData?.name || "EVENTO"}</span>
              <span className="text-white/40 text-[9px] sm:text-[10px] ml-2">({afterMovieMedia.length} elementos)</span>
            </div>

            {afterMovieMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 border-2 border-dashed border-white/10 rounded-xl">
                <Film className="w-10 h-10 sm:w-12 sm:h-12 text-white/20 mb-3" />
                <p className="text-white/40 text-xs sm:text-sm">No hay contenido en la galeria</p>
                <p className="text-white/30 text-[10px] sm:text-xs mt-1">Agrega imagenes o videos para el aftermovie</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                {afterMovieMedia.map((item) => (
                  <div 
                    key={item.id}
                    className="relative aspect-square rounded-lg overflow-hidden group bg-white/5"
                  >
                    {item.src.startsWith("data:video") ? (
                      <video src={item.src} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                    )}
                    
                    {/* Media Type Badge */}
                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] ${
                      item.type === "video" ? "bg-red-500/80 text-white" : "bg-amber-500/80 text-black"
                    }`}>
                      {item.type === "video" ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                    </div>
                    
                    {/* Overlay with delete button */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => deleteMedia(item.id)}
                        className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-[9px] sm:text-[10px]">
                Estos elementos se mostraran en la seccion {"\""}VER AFTERMOVIE{"\""} de <span className="text-amber-500 font-medium">{selectedAfterMovieEventData?.name}</span> ({selectedAfterMovieEventData?.page}).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info Bar */}
      <footer className="py-4 sm:py-6 px-3 sm:px-4 md:px-8 border-t border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
              <div>
                <p className="text-white/60 text-[9px] sm:text-[10px] tracking-[0.1em]">RESPONSE TIME</p>
                <p className="text-white text-[10px] sm:text-xs">24 - 48 hours</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
              <div>
                <p className="text-white/60 text-[9px] sm:text-[10px] tracking-[0.1em]">LOCATION</p>
                <p className="text-white text-[10px] sm:text-xs">Barranquilla, Colombia</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Headphones className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
              <div>
                <p className="text-white/60 text-[9px] sm:text-[10px] tracking-[0.1em]">VIP SUPPORT</p>
                <p className="text-white text-[10px] sm:text-xs">+57 300 367 6521</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4 sm:mt-6">
          <div className="flex items-center justify-center gap-2 text-white/40">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]">BARRANQUILLA, COLOMBIA</span>
          </div>
          <p className="text-amber-500/60 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] mt-2">#UNIQUEEXPERIENCE</p>
        </div>
      </footer>

      {/* New/Edit Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 sticky top-0 bg-[#0f0f0f] z-10">
              <div>
                <h2 className="text-lg sm:text-xl font-thin tracking-wider text-white">
                  {editingEvent ? "EDITAR EVENTO" : "NUEVO EVENTO"}
                </h2>
                <p className="text-white/40 text-[10px] sm:text-xs mt-1">
                  {editingEvent ? "Modifica la informacion del evento" : "Agrega un nuevo evento a Weekend Events"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 sm:p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Category Badge */}
              {editingEvent?.category === "signature" ? (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                  <span className="text-amber-500 text-[10px] sm:text-xs tracking-[0.1em]">SIGNATURE EVENT</span>
                  <span className="text-white/40 text-[9px] sm:text-[10px] hidden sm:inline">- Foto protegida</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-green-500 text-[10px] sm:text-xs tracking-[0.1em]">WEEKEND EVENT</span>
                  <span className="text-white/40 text-[9px] sm:text-[10px] hidden sm:inline">- Totalmente editable</span>
                </div>
              )}

              {/* Event Image */}
              <div>
                <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">
                  IMAGEN DEL EVENTO 
                  {editingEvent?.category === "signature" && (
                    <span className="text-amber-500/60 ml-2">(Protegida)</span>
                  )}
                </label>
                <div className="relative">
                  {editingEvent?.category === "signature" ? (
                    // Signature Event - Image locked
                    <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden">
                      <img src={editingEvent.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black/60 rounded-lg">
                          <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                          <span className="text-amber-500 text-[10px] sm:text-xs">Imagen protegida</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Weekend Event - Image editable with file upload
                    <>
                      {newEventForm.image ? (
                        <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden">
                          <img src={newEventForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleNewEventChange("image", "")}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white/70 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="h-32 sm:h-40 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-500/50 transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                          {isUploading ? (
                            <>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-green-500 text-[10px] sm:text-xs">Cargando imagen...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
                              <span className="text-white/40 text-[10px] sm:text-xs text-center px-2">
                                Haz clic para subir imagen
                              </span>
                              <span className="text-white/30 text-[8px] sm:text-[9px]">PNG, JPG hasta 50MB</span>
                            </>
                          )}
                        </label>
                      )}
                      
                      {/* Error message */}
                      {uploadError && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-500 text-[10px] sm:text-xs">{uploadError}</p>
                        </div>
                      )}
                      
                      {/* Separator */}
                      <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-white/30 text-[9px] sm:text-[10px]">O</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                      </div>
                      
                      {/* URL Input */}
                      <div>
                        <label className="block text-white/40 text-[8px] sm:text-[9px] mb-1.5">URL DE IMAGEN</label>
                        <input
                          type="text"
                          value={newEventForm.image.startsWith("data:") ? "" : newEventForm.image}
                          onChange={(e) => handleNewEventChange("image", e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Event Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">NOMBRE DEL EVENTO *</label>
                  <input
                    type="text"
                    value={newEventForm.name}
                    onChange={(e) => handleNewEventChange("name", e.target.value)}
                    placeholder="Ej: NEON PARTY"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">SUBTITULO *</label>
                  <input
                    type="text"
                    value={newEventForm.subtitle}
                    onChange={(e) => handleNewEventChange("subtitle", e.target.value)}
                    placeholder="Ej: ELECTRONIC EXPERIENCE"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">DESCRIPCION (OPCIONAL)</label>
                <textarea
                  value={newEventForm.description}
                  onChange={(e) => handleNewEventChange("description", e.target.value)}
                  placeholder={editingEvent?.category === "weekend" ? "Una línea por renglón. Ej:\nLA EXPERIENCIA\nQUE NUNCA OLVIDAS" : "Describe el evento..."}
                  rows={3}
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50 resize-none"
                />
                {editingEvent?.category === "weekend" && (
                  <p className="text-white/40 text-[9px] sm:text-[10px] mt-1.5">Cada línea se muestra como un renglón separado en la tarjeta.</p>
                )}
              </div>

              {/* Weekend Event display fields - Solo para Weekend Events */}
              {editingEvent?.category === "weekend" && (
                <div className="p-3 sm:p-4 bg-green-500/5 border border-green-500/20 rounded-lg space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <label className="text-green-500 text-[10px] sm:text-xs tracking-[0.15em] font-medium">DATOS DE LA TARJETA WEEKEND</label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">DIA (ETIQUETA)</label>
                      <input
                        type="text"
                        value={newEventForm.dayLabel}
                        onChange={(e) => handleNewEventChange("dayLabel", e.target.value)}
                        placeholder="Ej: VIERNES"
                        className="w-full bg-white/5 border border-green-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">LUGAR (VENUE)</label>
                      <input
                        type="text"
                        value={newEventForm.venue}
                        onChange={(e) => handleNewEventChange("venue", e.target.value)}
                        placeholder="Ej: DISCOLO NIGHT CLUB"
                        className="w-full bg-white/5 border border-green-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">HORA</label>
                      <input
                        type="text"
                        value={newEventForm.time}
                        onChange={(e) => handleNewEventChange("time", e.target.value)}
                        placeholder="Ej: 9:00 PM"
                        className="w-full bg-white/5 border border-green-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">RESTRICCION EDAD</label>
                      <input
                        type="text"
                        value={newEventForm.ageRestriction}
                        onChange={(e) => handleNewEventChange("ageRestriction", e.target.value)}
                        placeholder="Ej: +14"
                        className="w-full bg-white/5 border border-green-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">TEXTO DEL BOTON</label>
                      <input
                        type="text"
                        value={newEventForm.buttonText}
                        onChange={(e) => handleNewEventChange("buttonText", e.target.value)}
                        placeholder="Ej: COMPRAR"
                        className="w-full bg-white/5 border border-green-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">NOTA DE EDAD</label>
                    <input
                      type="text"
                      value={newEventForm.ageNote}
                      onChange={(e) => handleNewEventChange("ageNote", e.target.value)}
                      placeholder="Ej: MÁS SALVAJE. +14 SIN ALCOHOL"
                      className="w-full bg-white/5 border border-green-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <p className="text-white/40 text-[9px] sm:text-[10px]">
                    Estos campos se muestran en la tarjeta de la seccion WEEKEND EVENTS de la web.
                  </p>
                </div>
              )}

              {/* Date, Time & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">FECHA</label>
                  <input
                    type="text"
                    value={newEventForm.date}
                    onChange={(e) => handleNewEventChange("date", e.target.value)}
                    placeholder="Ej: 30 Y 31 DE OCTUBRE"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">ETAPA</label>
                  <input
                    type="text"
                    value={newEventForm.stage}
                    onChange={(e) => handleNewEventChange("stage", e.target.value)}
                    placeholder="Ej: ETAPA CREYENTES"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">UBICACION</label>
                  <input
                    type="text"
                    value={newEventForm.location}
                    onChange={(e) => handleNewEventChange("location", e.target.value)}
                    placeholder="Barranquilla, Colombia"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
              </div>

              {/* Countdown Date - Solo para Signature Events */}
              {editingEvent?.category === "signature" && (
                <div className="p-3 sm:p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <label className="text-amber-500 text-[10px] sm:text-xs tracking-[0.15em] font-medium">FECHA Y HORA DEL CONTADOR</label>
                  </div>
                  <input
                    type="datetime-local"
                    value={newEventForm.countdownDate}
                    onChange={(e) => handleNewEventChange("countdownDate", e.target.value)}
                    className="w-full bg-white/5 border border-amber-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500/50 [color-scheme:dark]"
                  />
                  <p className="text-white/40 text-[9px] sm:text-[10px] mt-2">
                    Esta fecha y hora se usara para el contador regresivo del evento. El contador mostrara dias, horas, minutos y segundos.
                  </p>
                </div>
              )}

              {/* Date Label y Date Subtitle - Solo para Signature Events */}
              {editingEvent?.category === "signature" && (
                <div className="p-3 sm:p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <label className="text-amber-500 text-[10px] sm:text-xs tracking-[0.15em] font-medium">TEXTO DE FECHA EN HERO</label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">ETIQUETA DE FECHA</label>
                      <input
                        type="text"
                        value={newEventForm.dateLabel}
                        onChange={(e) => handleNewEventChange("dateLabel", e.target.value)}
                        placeholder="Ej: FECHA PRÓXIMAMENTE"
                        className="w-full bg-white/5 border border-amber-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">SUBTITULO DE FECHA</label>
                      <input
                        type="text"
                        value={newEventForm.dateSubtitle}
                        onChange={(e) => handleNewEventChange("dateSubtitle", e.target.value)}
                        placeholder="Ej: PRONTO SERÁ ANUNCIADA"
                        className="w-full bg-white/5 border border-amber-500/30 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                  <p className="text-white/40 text-[9px] sm:text-[10px] mt-2">
                    Estos textos se muestran en la seccion hero del evento junto al icono de calendario.
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">PRECIO TICKET</label>
                  <input
                    type="text"
                    value={newEventForm.ticketPrice}
                    onChange={(e) => handleNewEventChange("ticketPrice", e.target.value)}
                    placeholder="Ej: $45.000 COP"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">PRECIO MESA VIP</label>
                  <input
                    type="text"
                    value={newEventForm.vipPrice}
                    onChange={(e) => handleNewEventChange("vipPrice", e.target.value)}
                    placeholder="Ej: $500.000 COP"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">NOTA VIP</label>
                  <input
                    type="text"
                    value={newEventForm.vipNote}
                    onChange={(e) => handleNewEventChange("vipNote", e.target.value)}
                    placeholder="Ej: NORMALMENTE $700K - $2M"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                  />
                </div>
              </div>

              {/* Info Note */}
              {editingEvent?.category === "signature" ? (
                <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-500 text-[10px] sm:text-xs font-medium">Evento Signature - Foto Protegida</p>
                    <p className="text-white/50 text-[9px] sm:text-[10px] mt-1">
                      Puedes editar la informacion del evento pero la imagen principal esta protegida.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-500 text-[10px] sm:text-xs font-medium">Evento Weekend - Totalmente Editable</p>
                    <p className="text-white/50 text-[9px] sm:text-[10px] mt-1">
                      Puedes modificar toda la informacion del evento incluyendo la imagen.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-white/10 sticky bottom-0 bg-[#0f0f0f]">
              <button
                onClick={closeModal}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white/70 text-[10px] sm:text-xs tracking-[0.15em] rounded-lg hover:border-white/40 transition-all"
              >
                CANCELAR
              </button>
              <button
                onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                disabled={!newEventForm.name || !newEventForm.subtitle}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 text-black text-[10px] sm:text-xs tracking-[0.15em] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 ${
                  editingEvent?.category === "signature"
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                }`}
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                {editingEvent ? "GUARDAR" : "CREAR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AfterMovie Media Modal */}
      {showAfterMovieModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 sticky top-0 bg-[#0f0f0f] z-10">
              <div>
                <h2 className="text-lg sm:text-xl font-thin tracking-wider text-white">AGREGAR MEDIA</h2>
                <p className="text-white/40 text-[10px] sm:text-xs mt-1">
                  Agregando a: <span className="text-amber-500 font-medium">{selectedAfterMovieEventData?.name}</span> ({selectedAfterMovieEventData?.page})
                </p>
              </div>
              <button
                onClick={closeAfterMovieModal}
                className="p-1.5 sm:p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Media Type Selector */}
              <div>
                <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">TIPO DE MEDIA</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNewMediaType("image")
                      setNewMediaSrc("")
                      setMediaUploadError(null)
                    }}
                    className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                      newMediaType === "image"
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-white/20 text-white/60 hover:border-white/40"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    IMAGEN
                  </button>
                  <button
                    onClick={() => {
                      setNewMediaType("video")
                      setNewMediaSrc("")
                      setMediaUploadError(null)
                    }}
                    className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                      newMediaType === "video"
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/20 text-white/60 hover:border-white/40"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    VIDEO
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">
                  SUBIR {newMediaType === "image" ? "IMAGEN" : "VIDEO"}
                </label>
                {newMediaSrc ? (
                  <div className="relative h-40 sm:h-48 rounded-xl overflow-hidden bg-white/5">
                    {newMediaSrc.startsWith("data:video") || newMediaType === "video" ? (
                      <video src={newMediaSrc} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={newMediaSrc} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => setNewMediaSrc("")}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white/70 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ) : (
                  <label className={`h-40 sm:h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                    newMediaType === "image" 
                      ? "border-amber-500/30 hover:border-amber-500/50" 
                      : "border-red-500/30 hover:border-red-500/50"
                  }`}>
                    <input
                      type="file"
                      accept={newMediaType === "image" ? "image/*" : "video/*"}
                      onChange={handleMediaFileUpload}
                      className="hidden"
                      disabled={isMediaUploading}
                    />
                    {isMediaUploading ? (
                      <>
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 border-2 ${newMediaType === "image" ? "border-amber-500" : "border-red-500"} border-t-transparent rounded-full animate-spin`} />
                        <span className={`${newMediaType === "image" ? "text-amber-500" : "text-red-500"} text-[10px] sm:text-xs`}>Cargando...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
                        <span className="text-white/40 text-[10px] sm:text-xs text-center px-2">
                          Haz clic para subir {newMediaType === "image" ? "imagen" : "video"}
                        </span>
                        <span className="text-white/30 text-[8px] sm:text-[9px]">
                          {newMediaType === "image" ? "PNG, JPG hasta 50MB" : "MP4, WebM hasta 1GB"}
                        </span>
                      </>
                    )}
                  </label>
                )}
                
                {/* Error message */}
                {mediaUploadError && (
                  <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-500 text-[10px] sm:text-xs">{mediaUploadError}</p>
                  </div>
                )}
                
                {/* Separator */}
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-white/30 text-[9px] sm:text-[10px]">O</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
                
                {/* URL Input */}
                <div>
                  <label className="block text-white/40 text-[8px] sm:text-[9px] mb-1.5">URL DE {newMediaType === "image" ? "IMAGEN" : "VIDEO"}</label>
                  <input
                    type="text"
                    value={newMediaSrc.startsWith("data:") ? "" : newMediaSrc}
                    onChange={(e) => setNewMediaSrc(e.target.value)}
                    placeholder={newMediaType === "image" ? "https://ejemplo.com/imagen.jpg" : "https://ejemplo.com/video.mp4"}
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/50 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2">DESCRIPCION (OPCIONAL)</label>
                <input
                  type="text"
                  value={newMediaAlt}
                  onChange={(e) => setNewMediaAlt(e.target.value)}
                  placeholder={`Ej: Aftermovie ${selectedAfterMovieEventData?.name || "Evento"} 2025`}
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-white/10 sticky bottom-0 bg-[#0f0f0f]">
              <button
                onClick={closeAfterMovieModal}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white/70 text-[10px] sm:text-xs tracking-[0.15em] rounded-lg hover:border-white/40 transition-all"
              >
                CANCELAR
              </button>
              <button
                onClick={handleAddMedia}
                disabled={!newMediaSrc}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-[10px] sm:text-xs tracking-[0.15em] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2"
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                AGREGAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
