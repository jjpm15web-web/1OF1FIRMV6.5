"use client"

import { useState, useEffect, useCallback } from "react"

// ============ INTERFACES ============
export interface DripProduct {
  id: string
  drop: string
  name: string
  colorway: string
  price: number
  sizes: string[]
  mainImage: string
  galleryImages: string[]
  soldOut?: boolean
}

export interface VisionArtwork {
  id: string
  number: string
  totalEditions: number
  name: string
  category: string
  type: string
  price: number
  currency: string
  available: boolean
  image: string
}

export interface CampInfo {
  id: string
  number: string
  dates: string
  location: string
  description?: string
  image?: string
  soldOut?: boolean
}

export interface MaisonProduct {
  id: string
  edition: string
  name: string
  color: string
  price: number
  badge: string
  image: string
  description?: string
  soldOut?: boolean
}

export interface BackstageContent {
  id: string
  title: string
  subtitle: string
  duration: string
  image: string
  type: "video" | "image"
  videoUrl?: string
}

export interface GalleryMoment {
  id: string
  src: string
  alt?: string
}

// ============ LOCALSTORAGE KEYS ============
const DRIP_KEY = "1of1_universe_drip"
const VISION_KEY = "1of1_universe_vision"
const CAMP_KEY = "1of1_universe_camp"
const MAISON_KEY = "1of1_universe_maison"
const BACKSTAGE_KEY = "1of1_universe_backstage"
const GALLERY_KEY = "1of1_universe_gallery"

// ============ DEFAULT DATA ============
const defaultDripProducts: DripProduct[] = [
  {
    id: "after-midnight-hoodie",
    drop: "DROP 01",
    name: "AFTER MIDNIGHT HOODIE",
    colorway: "BLACK ON BLACK",
    price: 159000,
    sizes: ["S", "M", "L", "XL"],
    mainImage: "https://f005.backblazeb2.com/file/b21of1firm/background/DRIPhome.jpg",
    galleryImages: []
  },
  {
    id: "midnight-tee",
    drop: "DROP 01",
    name: "MIDNIGHT TEE",
    colorway: "WASHED BLACK",
    price: 89000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    galleryImages: []
  },
  {
    id: "firm-cap",
    drop: "DROP 01",
    name: "1OF1 FIRM CAP",
    colorway: "BLACK EMBOSSED",
    price: 69000,
    sizes: ["ONE SIZE"],
    mainImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    galleryImages: []
  }
]

const defaultVisionArtworks: VisionArtwork[] = [
  { id: "silence-peaks", number: "01", totalEditions: 12, name: "SILENCE PEAKS", category: "LANDSCAPES", type: "FINE ART PHOTOGRAPHY", price: 249000, currency: "COP", available: true, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { id: "urban-reflections", number: "02", totalEditions: 12, name: "URBAN REFLECTIONS", category: "URBAN", type: "FINE ART PHOTOGRAPHY", price: 229000, currency: "COP", available: true, image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=80" },
  { id: "ocean-force", number: "03", totalEditions: 12, name: "OCEAN FORCE", category: "BLACK & WHITE", type: "FINE ART PHOTOGRAPHY", price: 219000, currency: "COP", available: true, image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80" },
]

const defaultCamps: CampInfo[] = [
  { id: "camp-02", number: "02", dates: "NOVEMBER 20 - 30, 2026", location: "MEDELLIN, COLOMBIA" },
  { id: "camp-03", number: "03", dates: "JANUARY 12 - 22, 2027", location: "CARTAGENA, COLOMBIA" },
]

const defaultMaisonProducts: MaisonProduct[] = [
  { id: "maison-1", edition: "01 / 12", name: "CLASSIC SWIM SHORTS", color: "ONYX BLACK", price: 89000, badge: "NEW", image: "https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=600&q=80" },
  { id: "maison-2", edition: "02 / 12", name: "CLASSIC SWIM SHORTS", color: "FOREST GREEN", price: 89000, badge: "NEW", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80" },
  { id: "maison-3", edition: "03 / 12", name: "CLASSIC SWIM SHORTS", color: "SAND BEIGE", price: 89000, badge: "NEW", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80" },
]

const defaultBackstageContent: BackstageContent[] = [
  { id: "backstage-1", title: "LUNA LLENA", subtitle: "BEFORE THE SHOW", duration: "11:32", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80", type: "video" },
  { id: "backstage-2", title: "ANIMAL", subtitle: "BACKSTAGE INTERVIEW", duration: "08:47", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", type: "video" },
  { id: "backstage-3", title: "BABADOOK", subtitle: "INSIDE THE DRESSING ROOM", duration: "09:15", image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80", type: "video" },
]

const defaultGalleryMoments: GalleryMoment[] = [
  { id: "moment-1", src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80", alt: "Momento 1" },
  { id: "moment-2", src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80", alt: "Momento 2" },
  { id: "moment-3", src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80", alt: "Momento 3" },
  { id: "moment-4", src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&q=80", alt: "Momento 4" },
  { id: "moment-5", src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80", alt: "Momento 5" },
]

// ============ HELPERS ============
function getStoredData<T>(key: string, defaultValue: T): T {
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

function saveData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("universe-updated", { detail: { key, timestamp: Date.now() } }))
    }, 0)
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

// ============ HOOKS ============

// DRIP Products Hook
export function useDripProducts() {
  const [products, setProducts] = useState<DripProduct[]>(defaultDripProducts)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getStoredData(DRIP_KEY, defaultDripProducts)
    setProducts(stored)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === DRIP_KEY) {
        const stored = getStoredData(DRIP_KEY, defaultDripProducts)
        setProducts(stored)
      }
    }
    window.addEventListener("universe-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("universe-updated", handleUpdate as EventListener)
  }, [])

  const addProduct = useCallback((product: DripProduct) => {
    setProducts(prev => {
      const newProducts = [...prev, product]
      saveData(DRIP_KEY, newProducts)
      return newProducts
    })
  }, [])

  const updateProduct = useCallback((product: DripProduct) => {
    setProducts(prev => {
      const newProducts = prev.map(p => p.id === product.id ? product : p)
      saveData(DRIP_KEY, newProducts)
      return newProducts
    })
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const newProducts = prev.filter(p => p.id !== id)
      saveData(DRIP_KEY, newProducts)
      return newProducts
    })
  }, [])

  return { products, addProduct, updateProduct, deleteProduct, isLoaded }
}

// Vision Artworks Hook
export function useVisionArtworks() {
  const [artworks, setArtworks] = useState<VisionArtwork[]>(defaultVisionArtworks)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getStoredData(VISION_KEY, defaultVisionArtworks)
    setArtworks(stored)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === VISION_KEY) {
        const stored = getStoredData(VISION_KEY, defaultVisionArtworks)
        setArtworks(stored)
      }
    }
    window.addEventListener("universe-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("universe-updated", handleUpdate as EventListener)
  }, [])

  const addArtwork = useCallback((artwork: VisionArtwork) => {
    setArtworks(prev => {
      const newArtworks = [...prev, artwork]
      saveData(VISION_KEY, newArtworks)
      return newArtworks
    })
  }, [])

  const updateArtwork = useCallback((artwork: VisionArtwork) => {
    setArtworks(prev => {
      const newArtworks = prev.map(a => a.id === artwork.id ? artwork : a)
      saveData(VISION_KEY, newArtworks)
      return newArtworks
    })
  }, [])

  const deleteArtwork = useCallback((id: string) => {
    setArtworks(prev => {
      const newArtworks = prev.filter(a => a.id !== id)
      saveData(VISION_KEY, newArtworks)
      return newArtworks
    })
  }, [])

  return { artworks, addArtwork, updateArtwork, deleteArtwork, isLoaded }
}

// Camp Info Hook
export function useCamps() {
  const [camps, setCamps] = useState<CampInfo[]>(defaultCamps)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getStoredData(CAMP_KEY, defaultCamps)
    setCamps(stored)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === CAMP_KEY) {
        const stored = getStoredData(CAMP_KEY, defaultCamps)
        setCamps(stored)
      }
    }
    window.addEventListener("universe-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("universe-updated", handleUpdate as EventListener)
  }, [])

  const addCamp = useCallback((camp: CampInfo) => {
    setCamps(prev => {
      const newCamps = [...prev, camp]
      saveData(CAMP_KEY, newCamps)
      return newCamps
    })
  }, [])

  const updateCamp = useCallback((camp: CampInfo) => {
    setCamps(prev => {
      const newCamps = prev.map(c => c.id === camp.id ? camp : c)
      saveData(CAMP_KEY, newCamps)
      return newCamps
    })
  }, [])

  const deleteCamp = useCallback((id: string) => {
    setCamps(prev => {
      const newCamps = prev.filter(c => c.id !== id)
      saveData(CAMP_KEY, newCamps)
      return newCamps
    })
  }, [])

  return { camps, addCamp, updateCamp, deleteCamp, isLoaded }
}

// Maison Products Hook
export function useMaisonProducts() {
  const [products, setProducts] = useState<MaisonProduct[]>(defaultMaisonProducts)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getStoredData(MAISON_KEY, defaultMaisonProducts)
    setProducts(stored)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === MAISON_KEY) {
        const stored = getStoredData(MAISON_KEY, defaultMaisonProducts)
        setProducts(stored)
      }
    }
    window.addEventListener("universe-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("universe-updated", handleUpdate as EventListener)
  }, [])

  const addProduct = useCallback((product: MaisonProduct) => {
    setProducts(prev => {
      const newProducts = [...prev, product]
      saveData(MAISON_KEY, newProducts)
      return newProducts
    })
  }, [])

  const updateProduct = useCallback((product: MaisonProduct) => {
    setProducts(prev => {
      const newProducts = prev.map(p => p.id === product.id ? product : p)
      saveData(MAISON_KEY, newProducts)
      return newProducts
    })
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const newProducts = prev.filter(p => p.id !== id)
      saveData(MAISON_KEY, newProducts)
      return newProducts
    })
  }, [])

  return { products, addProduct, updateProduct, deleteProduct, isLoaded }
}

// Backstage Content Hook
export function useBackstageContent() {
  const [content, setContent] = useState<BackstageContent[]>(defaultBackstageContent)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getStoredData(BACKSTAGE_KEY, defaultBackstageContent)
    setContent(stored)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === BACKSTAGE_KEY) {
        const stored = getStoredData(BACKSTAGE_KEY, defaultBackstageContent)
        setContent(stored)
      }
    }
    window.addEventListener("universe-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("universe-updated", handleUpdate as EventListener)
  }, [])

  const addContent = useCallback((item: BackstageContent) => {
    setContent(prev => {
      const newContent = [...prev, item]
      saveData(BACKSTAGE_KEY, newContent)
      return newContent
    })
  }, [])

  const updateContent = useCallback((item: BackstageContent) => {
    setContent(prev => {
      const newContent = prev.map(c => c.id === item.id ? item : c)
      saveData(BACKSTAGE_KEY, newContent)
      return newContent
    })
  }, [])

  const deleteContent = useCallback((id: string) => {
    setContent(prev => {
      const newContent = prev.filter(c => c.id !== id)
      saveData(BACKSTAGE_KEY, newContent)
      return newContent
    })
  }, [])

  return { content, addContent, updateContent, deleteContent, isLoaded }
}

// Gallery Moments Hook
export function useGalleryMoments() {
  const [moments, setMoments] = useState<GalleryMoment[]>(defaultGalleryMoments)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getStoredData(GALLERY_KEY, defaultGalleryMoments)
    setMoments(stored)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.key === GALLERY_KEY) {
        const stored = getStoredData(GALLERY_KEY, defaultGalleryMoments)
        setMoments(stored)
      }
    }
    window.addEventListener("universe-updated", handleUpdate as EventListener)
    return () => window.removeEventListener("universe-updated", handleUpdate as EventListener)
  }, [])

  const addMoment = useCallback((moment: GalleryMoment) => {
    setMoments(prev => {
      const newMoments = [...prev, moment]
      saveData(GALLERY_KEY, newMoments)
      return newMoments
    })
  }, [])

  const deleteMoment = useCallback((id: string) => {
    setMoments(prev => {
      const newMoments = prev.filter(m => m.id !== id)
      saveData(GALLERY_KEY, newMoments)
      return newMoments
    })
  }, [])

  return { moments, addMoment, deleteMoment, isLoaded }
}
