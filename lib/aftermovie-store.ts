"use client"

import { useState, useEffect, useCallback } from "react"

// Types
export interface AfterMovieMedia {
  id: string
  type: "image" | "video"
  src: string
  alt: string
  eventId: string // Which event this media belongs to
}

// LocalStorage key
const AFTERMOVIE_KEY = "1of1_aftermovie_media"

// Default data for all events
const defaultAfterMovieMedia: AfterMovieMedia[] = [
  // Babadook event
  { id: "bb-1", type: "image", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80", alt: "Babadook event 1", eventId: "babadook" },
  { id: "bb-2", type: "image", src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80", alt: "Babadook event 2", eventId: "babadook" },
  { id: "bb-3", type: "image", src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80", alt: "Babadook event 3", eventId: "babadook" },
  { id: "bb-4", type: "image", src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80", alt: "Babadook event 4", eventId: "babadook" },
  { id: "bb-5", type: "video", src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", alt: "Babadook video 1", eventId: "babadook" },
  { id: "bb-6", type: "image", src: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=400&q=80", alt: "Babadook event 5", eventId: "babadook" },
  
  // Animal event
  { id: "an-1", type: "image", src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80", alt: "Animal event 1", eventId: "animal" },
  { id: "an-2", type: "image", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80", alt: "Animal event 2", eventId: "animal" },
  { id: "an-3", type: "video", src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80", alt: "Animal video 1", eventId: "animal" },
  { id: "an-4", type: "image", src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80", alt: "Animal event 3", eventId: "animal" },
  { id: "an-5", type: "image", src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80", alt: "Animal event 4", eventId: "animal" },
  { id: "an-6", type: "image", src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80", alt: "Animal event 5", eventId: "animal" },
  
  // Luna Llena event
  { id: "ll-1", type: "image", src: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=400&q=80", alt: "Luna Llena event 1", eventId: "luna-llena" },
  { id: "ll-2", type: "image", src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80", alt: "Luna Llena event 2", eventId: "luna-llena" },
  { id: "ll-3", type: "image", src: "https://images.unsplash.com/photo-1571266028243-3716f02d3a52?w=400&q=80", alt: "Luna Llena event 3", eventId: "luna-llena" },
  { id: "ll-4", type: "video", src: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=400&q=80", alt: "Luna Llena video 1", eventId: "luna-llena" },
  { id: "ll-5", type: "image", src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80", alt: "Luna Llena event 4", eventId: "luna-llena" },
  { id: "ll-6", type: "image", src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80", alt: "Luna Llena event 5", eventId: "luna-llena" },
  
  // La Festa event
  { id: "lf-1", type: "image", src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80", alt: "La Festa event 1", eventId: "la-festa" },
  { id: "lf-2", type: "image", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80", alt: "La Festa event 2", eventId: "la-festa" },
  { id: "lf-3", type: "video", src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80", alt: "La Festa video 1", eventId: "la-festa" },
  { id: "lf-4", type: "image", src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80", alt: "La Festa event 3", eventId: "la-festa" },
  { id: "lf-5", type: "image", src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", alt: "La Festa event 4", eventId: "la-festa" },
  { id: "lf-6", type: "image", src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80", alt: "La Festa event 5", eventId: "la-festa" },
  
  // Celestial event
  { id: "ce-1", type: "image", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80", alt: "Celestial event 1", eventId: "celestial" },
  { id: "ce-2", type: "image", src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80", alt: "Celestial event 2", eventId: "celestial" },
  { id: "ce-3", type: "video", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80", alt: "Celestial video 1", eventId: "celestial" },
  { id: "ce-4", type: "image", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80", alt: "Celestial event 3", eventId: "celestial" },
  { id: "ce-5", type: "image", src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80", alt: "Celestial event 4", eventId: "celestial" },
  { id: "ce-6", type: "image", src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80", alt: "Celestial event 5", eventId: "celestial" },
  
  // Championship event
  { id: "ch-1", type: "image", src: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80", alt: "Championship event 1", eventId: "championship" },
  { id: "ch-2", type: "image", src: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=400&q=80", alt: "Championship event 2", eventId: "championship" },
  { id: "ch-3", type: "video", src: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=400&q=80", alt: "Championship video 1", eventId: "championship" },
  { id: "ch-4", type: "image", src: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=400&q=80", alt: "Championship event 3", eventId: "championship" },
  { id: "ch-5", type: "image", src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80", alt: "Championship event 4", eventId: "championship" },
  { id: "ch-6", type: "image", src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80", alt: "Championship event 5", eventId: "championship" },
]

// Helper to get data from localStorage
function getStoredMedia(): AfterMovieMedia[] {
  if (typeof window === "undefined") return defaultAfterMovieMedia
  try {
    const stored = localStorage.getItem(AFTERMOVIE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error reading aftermovie media from localStorage:", error)
  }
  return defaultAfterMovieMedia
}

// Helper to save data to localStorage
function saveMedia(data: AfterMovieMedia[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(AFTERMOVIE_KEY, JSON.stringify(data))
    // Dispatch custom event to notify other components
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("aftermovie-updated", { detail: { timestamp: Date.now() } }))
    }, 0)
  } catch (error) {
    console.error("Error saving aftermovie media to localStorage:", error)
  }
}

// Hook for AfterMovie Media
export function useAfterMovieMedia(eventId?: string) {
  const [allMedia, setAllMedia] = useState<AfterMovieMedia[]>(defaultAfterMovieMedia)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredMedia()
    setAllMedia(stored)
    setIsLoaded(true)
  }, [])

  // Listen for updates from other components
  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredMedia()
      setAllMedia(stored)
    }
    window.addEventListener("aftermovie-updated", handleUpdate)
    return () => window.removeEventListener("aftermovie-updated", handleUpdate)
  }, [])

  // Filter media by eventId if provided
  const media = eventId ? allMedia.filter(m => m.eventId === eventId) : allMedia

  const addMedia = useCallback((newMedia: Omit<AfterMovieMedia, "id">) => {
    setAllMedia(prev => {
      const mediaWithId: AfterMovieMedia = {
        ...newMedia,
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      const newMediaList = [...prev, mediaWithId]
      saveMedia(newMediaList)
      return newMediaList
    })
  }, [])

  const updateMedia = useCallback((updatedMedia: AfterMovieMedia) => {
    setAllMedia(prev => {
      const newMediaList = prev.map(m => m.id === updatedMedia.id ? updatedMedia : m)
      saveMedia(newMediaList)
      return newMediaList
    })
  }, [])

  const deleteMedia = useCallback((mediaId: string) => {
    setAllMedia(prev => {
      const newMediaList = prev.filter(m => m.id !== mediaId)
      saveMedia(newMediaList)
      return newMediaList
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    setAllMedia(defaultAfterMovieMedia)
    saveMedia(defaultAfterMovieMedia)
  }, [])

  return { 
    media, 
    allMedia, 
    addMedia, 
    updateMedia, 
    deleteMedia, 
    resetToDefaults, 
    isLoaded 
  }
}
