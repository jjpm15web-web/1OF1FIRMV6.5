"use client"

import { useState, useRef } from "react"
import { 
  Plus, 
  X, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Play,
  ChevronDown,
  ShoppingBag,
  Camera,
  Tent,
  Video,
  FileUp,
  Check
} from "lucide-react"
import {
  useDripProducts,
  useVisionArtworks,
  useCamps,
  useMaisonProducts,
  useBackstageContent,
  useGalleryMoments,
  type DripProduct,
  type VisionArtwork,
  type CampInfo,
  type MaisonProduct,
  type BackstageContent,
  type GalleryMoment
} from "@/lib/universe-store"

// ============ FILE UPLOAD HELPER ============
const handleFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ============ IMAGE UPLOAD COMPONENT ============
interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  accept?: string
  mediaType?: "image" | "video"
}

function ImageUploadField({ value, onChange, label, placeholder = "https://...", accept = "image/*", mediaType = "image" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    try {
      const base64 = await handleFileToBase64(file)
      onChange(base64)
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-white/50 text-[10px] tracking-wider mb-2">{label}</label>
      <div className="space-y-2">
        {/* Preview */}
        {value && (
          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-white/5 border border-white/10">
            {mediaType === "video" ? (
              <video src={value} controls className="w-full h-full object-cover" />
            ) : (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            )}
            <button 
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
        
        {/* Upload Options */}
        <div className="flex gap-2">
          <input
            type="text"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-2.5 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-1"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileUp className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-white/30 text-[9px]">Pega una URL o sube un archivo local</p>
      </div>
    </div>
  )
}

type UniverseSection = "drip" | "vision" | "camp" | "maison" | "backstage"

export default function AdminUniversePanel() {
  const [activeSection, setActiveSection] = useState<UniverseSection>("drip")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<DripProduct | VisionArtwork | CampInfo | MaisonProduct | BackstageContent | null>(null)
  
  // Use centralized stores
  const { products: dripProducts, addProduct: addDrip, updateProduct: updateDrip, deleteProduct: deleteDrip } = useDripProducts()
  const { artworks: visionArtworks, addArtwork: addVision, updateArtwork: updateVision, deleteArtwork: deleteVision } = useVisionArtworks()
  const { camps, addCamp, updateCamp, deleteCamp } = useCamps()
  const { products: maisonProducts, addProduct: addMaison, updateProduct: updateMaison, deleteProduct: deleteMaison } = useMaisonProducts()
  const { content: backstageContent, addContent: addBackstage, updateContent: updateBackstage, deleteContent: deleteBackstage } = useBackstageContent()
  const { moments: galleryMoments, addMoment, deleteMoment } = useGalleryMoments()

  // Form states
  const [dripForm, setDripForm] = useState<Partial<DripProduct>>({})
  const [visionForm, setVisionForm] = useState<Partial<VisionArtwork>>({})
  const [campForm, setCampForm] = useState<Partial<CampInfo>>({})
  const [maisonForm, setMaisonForm] = useState<Partial<MaisonProduct>>({})
  const [backstageForm, setBackstageForm] = useState<Partial<BackstageContent>>({})
  const [newMomentUrl, setNewMomentUrl] = useState("")
  const [isUploadingMoment, setIsUploadingMoment] = useState(false)
  const momentFileInputRef = useRef<HTMLInputElement>(null)

  const sections = [
    { id: "drip" as const, name: "DRIP", icon: ShoppingBag, description: "Productos de ropa" },
    { id: "vision" as const, name: "VISION GALLERY", icon: Camera, description: "Arte y fotografia" },
    { id: "camp" as const, name: "CAMP", icon: Tent, description: "Campamentos" },
    { id: "maison" as const, name: "MAISON SWIM", icon: ShoppingBag, description: "Productos de playa" },
    { id: "backstage" as const, name: "GOLDEN BACKSTAGE", icon: Video, description: "Fotos y videos" },
  ]

  const openAddModal = () => {
    setEditingItem(null)
    resetForms()
    setShowModal(true)
  }

  const openEditModal = (item: DripProduct | VisionArtwork | CampInfo | MaisonProduct | BackstageContent) => {
    setEditingItem(item)
    if (activeSection === "drip") {
      setDripForm(item as DripProduct)
    } else if (activeSection === "vision") {
      setVisionForm(item as VisionArtwork)
    } else if (activeSection === "camp") {
      setCampForm(item as CampInfo)
    } else if (activeSection === "maison") {
      setMaisonForm(item as MaisonProduct)
    } else if (activeSection === "backstage") {
      setBackstageForm(item as BackstageContent)
    }
    setShowModal(true)
  }

  const resetForms = () => {
    setDripForm({})
    setVisionForm({})
    setCampForm({})
    setMaisonForm({})
    setBackstageForm({})
    setNewMomentUrl("")
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    resetForms()
  }

  // DRIP handlers
  const handleSaveDrip = () => {
    if (!dripForm.name || !dripForm.price) return
    
    if (editingItem) {
      const updated: DripProduct = {
        ...(editingItem as DripProduct),
        ...dripForm,
        name: dripForm.name || "",
        price: dripForm.price || 0
      }
      updateDrip(updated)
    } else {
      const newProduct: DripProduct = {
        id: `drip-${Date.now()}`,
        drop: dripForm.drop || "DROP 01",
        name: dripForm.name || "",
        colorway: dripForm.colorway || "",
        price: dripForm.price || 0,
        sizes: dripForm.sizes || ["S", "M", "L", "XL"],
        mainImage: dripForm.mainImage || "",
        galleryImages: dripForm.galleryImages || []
      }
      addDrip(newProduct)
    }
    closeModal()
  }

  // VISION handlers
  const handleSaveVision = () => {
    if (!visionForm.name || !visionForm.price) return
    
    if (editingItem) {
      const updated: VisionArtwork = {
        ...(editingItem as VisionArtwork),
        ...visionForm,
        name: visionForm.name || "",
        price: visionForm.price || 0
      }
      updateVision(updated)
    } else {
      const newArtwork: VisionArtwork = {
        id: `vision-${Date.now()}`,
        number: String(visionArtworks.length + 1).padStart(2, "0"),
        totalEditions: visionForm.totalEditions || 12,
        name: visionForm.name || "",
        category: visionForm.category || "LANDSCAPES",
        type: visionForm.type || "FINE ART PHOTOGRAPHY",
        price: visionForm.price || 0,
        currency: "COP",
        available: visionForm.available !== false,
        image: visionForm.image || ""
      }
      addVision(newArtwork)
    }
    closeModal()
  }

  // CAMP handlers
  const handleSaveCamp = () => {
    if (!campForm.dates || !campForm.location) return
    
    if (editingItem) {
      const updated: CampInfo = {
        ...(editingItem as CampInfo),
        ...campForm,
        dates: campForm.dates || "",
        location: campForm.location || ""
      }
      updateCamp(updated)
    } else {
      const newCamp: CampInfo = {
        id: `camp-${Date.now()}`,
        number: String(camps.length + 1).padStart(2, "0"),
        dates: campForm.dates || "",
        location: campForm.location || "",
        description: campForm.description,
        image: campForm.image
      }
      addCamp(newCamp)
    }
    closeModal()
  }

  // MAISON handlers
  const handleSaveMaison = () => {
    if (!maisonForm.name || !maisonForm.price) return
    
    if (editingItem) {
      const updated: MaisonProduct = {
        ...(editingItem as MaisonProduct),
        ...maisonForm,
        name: maisonForm.name || "",
        price: maisonForm.price || 0
      }
      updateMaison(updated)
    } else {
      const newProduct: MaisonProduct = {
        id: `maison-${Date.now()}`,
        edition: maisonForm.edition || `${String(maisonProducts.length + 1).padStart(2, "0")} / 12`,
        name: maisonForm.name || "",
        color: maisonForm.color || "",
        price: maisonForm.price || 0,
        badge: maisonForm.badge || "NEW",
        image: maisonForm.image || "",
        description: maisonForm.description
      }
      addMaison(newProduct)
    }
    closeModal()
  }

  // BACKSTAGE handlers
  const handleSaveBackstage = () => {
    if (!backstageForm.title) return
    
    if (editingItem) {
      const updated: BackstageContent = {
        ...(editingItem as BackstageContent),
        ...backstageForm,
        title: backstageForm.title || ""
      }
      updateBackstage(updated)
    } else {
      const newContent: BackstageContent = {
        id: `backstage-${Date.now()}`,
        title: backstageForm.title || "",
        subtitle: backstageForm.subtitle || "",
        duration: backstageForm.duration || "00:00",
        image: backstageForm.image || "",
        type: backstageForm.type || "video",
        videoUrl: backstageForm.videoUrl
      }
      addBackstage(newContent)
    }
    closeModal()
  }

  const handleAddMoment = () => {
    if (!newMomentUrl) return
    addMoment({
      id: `moment-${Date.now()}`,
      src: newMomentUrl,
      alt: `Momento ${galleryMoments.length + 1}`
    })
    setNewMomentUrl("")
  }

  const handleMomentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploadingMoment(true)
    try {
      const base64 = await handleFileToBase64(file)
      addMoment({
        id: `moment-${Date.now()}`,
        src: base64,
        alt: `Momento ${galleryMoments.length + 1}`
      })
    } catch (error) {
      console.error("Error uploading moment:", error)
    } finally {
      setIsUploadingMoment(false)
      if (momentFileInputRef.current) {
        momentFileInputRef.current.value = ""
      }
    }
  }

  const handleSave = () => {
    if (activeSection === "drip") handleSaveDrip()
    else if (activeSection === "vision") handleSaveVision()
    else if (activeSection === "camp") handleSaveCamp()
    else if (activeSection === "maison") handleSaveMaison()
    else if (activeSection === "backstage") handleSaveBackstage()
  }

  return (
    <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 mt-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <h2 className="text-purple-400 text-xs sm:text-sm tracking-[0.2em]">1 OF 1 UNIVERSE</h2>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs tracking-wider transition-all ${
                activeSection === section.id
                  ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{section.name}</span>
              <span className="sm:hidden">{section.name.split(" ")[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Add Button */}
      <button
        onClick={openAddModal}
        className="mb-4 px-3 py-2 border border-purple-500/50 text-purple-400 text-[10px] sm:text-xs tracking-[0.15em] hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2 rounded-lg"
      >
        <Plus className="w-3 h-3" />
        AGREGAR {sections.find(s => s.id === activeSection)?.name}
      </button>

      {/* Content List */}
      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
        {/* DRIP Products */}
        {activeSection === "drip" && dripProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
              {product.mainImage ? (
                <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white/30" />
                </div>
              )}
              {product.soldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-red-500 text-[7px] sm:text-[8px] font-bold tracking-wider">SOLD OUT</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs sm:text-sm truncate">{product.name}</p>
              <p className="text-white/50 text-[10px] sm:text-xs truncate">{product.colorway}</p>
              <p className="text-purple-400 text-[10px] sm:text-xs">${product.price.toLocaleString()} COP</p>
              <p className="text-white/30 text-[9px]">{product.drop} - Tallas: {product.sizes.join(", ")}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => updateDrip({ ...product, soldOut: !product.soldOut })}
                className={`p-1.5 rounded-lg transition-colors ${product.soldOut ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-white/40 hover:text-red-400 hover:bg-red-500/10"}`}
                title={product.soldOut ? "Desactivar SOLD OUT" : "Activar SOLD OUT"}
              >
                <span className="text-[8px] sm:text-[9px] font-bold tracking-wider">SOLD</span>
              </button>
              <button onClick={() => openEditModal(product)} className="p-1.5 text-white/50 hover:text-purple-400 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteDrip(product.id)} className="p-1.5 text-white/50 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* VISION Artworks */}
        {activeSection === "vision" && visionArtworks.map((artwork) => (
          <div key={artwork.id} className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
              {artwork.image ? (
                <img src={artwork.image} alt={artwork.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white/30" />
                </div>
              )}
              {!artwork.available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-red-500 text-[7px] sm:text-[8px] font-bold tracking-wider">SOLD OUT</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs sm:text-sm truncate">{artwork.name}</p>
              <p className="text-white/50 text-[10px] sm:text-xs truncate">{artwork.category} - {artwork.type}</p>
              <p className="text-purple-400 text-[10px] sm:text-xs">${artwork.price.toLocaleString()} COP</p>
              <p className="text-white/30 text-[9px]">#{artwork.number} / {artwork.totalEditions} ediciones - {artwork.available ? "Disponible" : "Agotado"}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => updateVision({ ...artwork, available: !artwork.available })}
                className={`p-1.5 rounded-lg transition-colors ${!artwork.available ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-white/40 hover:text-red-400 hover:bg-red-500/10"}`}
                title={!artwork.available ? "Marcar como disponible" : "Marcar como SOLD OUT"}
              >
                <span className="text-[8px] sm:text-[9px] font-bold tracking-wider">SOLD</span>
              </button>
              <button onClick={() => openEditModal(artwork)} className="p-1.5 text-white/50 hover:text-purple-400 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteVision(artwork.id)} className="p-1.5 text-white/50 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* CAMP Info */}
        {activeSection === "camp" && camps.map((camp) => (
          <div key={camp.id} className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
              {camp.image ? (
                <img src={camp.image} alt={`Camp ${camp.number}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-purple-400 text-lg sm:text-xl font-bold">{camp.number}</span>
              )}
              {camp.soldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-red-500 text-[7px] sm:text-[8px] font-bold tracking-wider">SOLD OUT</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs sm:text-sm truncate">CAMP {camp.number}</p>
              <p className="text-white/50 text-[10px] sm:text-xs truncate">{camp.dates}</p>
              <p className="text-purple-400 text-[10px] sm:text-xs truncate">{camp.location}</p>
              {camp.description && <p className="text-white/30 text-[9px] truncate">{camp.description}</p>}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => updateCamp({ ...camp, soldOut: !camp.soldOut })}
                className={`p-1.5 rounded-lg transition-colors ${camp.soldOut ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-white/40 hover:text-red-400 hover:bg-red-500/10"}`}
                title={camp.soldOut ? "Desactivar SOLD OUT" : "Activar SOLD OUT"}
              >
                <span className="text-[8px] sm:text-[9px] font-bold tracking-wider">SOLD</span>
              </button>
              <button onClick={() => openEditModal(camp)} className="p-1.5 text-white/50 hover:text-purple-400 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteCamp(camp.id)} className="p-1.5 text-white/50 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* MAISON Products */}
        {activeSection === "maison" && maisonProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white/30" />
                </div>
              )}
              {product.soldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-red-500 text-[7px] sm:text-[8px] font-bold tracking-wider">SOLD OUT</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-xs sm:text-sm truncate">{product.name}</p>
                {product.badge && <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-[8px] rounded">{product.badge}</span>}
              </div>
              <p className="text-white/50 text-[10px] sm:text-xs truncate">{product.color}</p>
              <p className="text-purple-400 text-[10px] sm:text-xs">${product.price.toLocaleString()} COP</p>
              <p className="text-white/30 text-[9px]">Edicion: {product.edition}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => updateMaison({ ...product, soldOut: !product.soldOut })}
                className={`p-1.5 rounded-lg transition-colors ${product.soldOut ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-white/40 hover:text-red-400 hover:bg-red-500/10"}`}
                title={product.soldOut ? "Desactivar SOLD OUT" : "Activar SOLD OUT"}
              >
                <span className="text-[8px] sm:text-[9px] font-bold tracking-wider">SOLD</span>
              </button>
              <button onClick={() => openEditModal(product)} className="p-1.5 text-white/50 hover:text-purple-400 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteMaison(product.id)} className="p-1.5 text-white/50 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* BACKSTAGE Content */}
        {activeSection === "backstage" && (
          <>
            <p className="text-white/50 text-[10px] tracking-wider mb-2">VIDEOS Y CONTENIDO EXCLUSIVO</p>
            {backstageContent.map((content) => (
              <div key={content.id} className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  {content.image ? (
                    <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    </div>
                  )}
                  {content.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs sm:text-sm truncate">{content.title}</p>
                  <p className="text-white/50 text-[10px] sm:text-xs truncate">{content.subtitle}</p>
                  <p className="text-purple-400 text-[10px] sm:text-xs">{content.duration} - {content.type === "video" ? "Video" : "Imagen"}</p>
                  {content.videoUrl && <p className="text-white/30 text-[9px] truncate">URL: {content.videoUrl}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(content)} className="p-1.5 text-white/50 hover:text-purple-400 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteBackstage(content.id)} className="p-1.5 text-white/50 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Gallery Moments */}
            <p className="text-white/50 text-[10px] tracking-wider mt-4 mb-2">GALERIA DE MOMENTOS</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {galleryMoments.map((moment) => (
                <div key={moment.id} className="relative group w-16 h-16 sm:w-20 sm:h-20">
                  <img src={moment.src} alt={moment.alt || "Momento"} className="w-full h-full object-cover rounded-lg" />
                  <button 
                    onClick={() => deleteMoment(moment.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMomentUrl}
                onChange={(e) => setNewMomentUrl(e.target.value)}
                placeholder="URL de imagen..."
                className="flex-1 bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
              <button
                onClick={handleAddMoment}
                className="px-3 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg text-xs hover:bg-purple-500 hover:text-white transition-all"
                title="Agregar por URL"
              >
                <Plus className="w-4 h-4" />
              </button>
              <input
                ref={momentFileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleMomentFileUpload}
                className="hidden"
              />
              <button
                onClick={() => momentFileInputRef.current?.click()}
                disabled={isUploadingMoment}
                className="px-3 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg text-xs hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50"
                title="Subir archivo local"
              >
                {isUploadingMoment ? (
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileUp className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-white/30 text-[9px] mt-1">Pega una URL o sube archivos locales</p>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] rounded-t-xl sm:rounded-xl border border-white/10 w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
              <div>
                <h3 className="text-white text-sm tracking-wider">
                  {editingItem ? "EDITAR" : "AGREGAR"} {sections.find(s => s.id === activeSection)?.name}
                </h3>
                <p className="text-white/40 text-[10px] mt-1">
                  {editingItem ? "Modifica la informacion" : "Agrega nuevo contenido"}
                </p>
              </div>
              <button onClick={closeModal} className="text-white/50 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* DRIP Form */}
              {activeSection === "drip" && (
                <>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">NOMBRE *</label>
                    <input
                      type="text"
                      value={dripForm.name || ""}
                      onChange={(e) => setDripForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">DROP</label>
                      <input
                        type="text"
                        value={dripForm.drop || ""}
                        onChange={(e) => setDripForm(prev => ({ ...prev, drop: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="DROP 01"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">COLOR</label>
                      <input
                        type="text"
                        value={dripForm.colorway || ""}
                        onChange={(e) => setDripForm(prev => ({ ...prev, colorway: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="BLACK ON BLACK"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">PRECIO (COP) *</label>
                      <input
                        type="number"
                        value={dripForm.price || ""}
                        onChange={(e) => setDripForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="159000"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">TALLAS</label>
                      <input
                        type="text"
                        value={dripForm.sizes?.join(", ") || ""}
                        onChange={(e) => setDripForm(prev => ({ ...prev, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="S, M, L, XL"
                      />
                    </div>
                  </div>
                  <ImageUploadField
                    label="IMAGEN PRINCIPAL"
                    value={dripForm.mainImage || ""}
                    onChange={(value) => setDripForm(prev => ({ ...prev, mainImage: value }))}
                    placeholder="https://..."
                  />
                </>
              )}

              {/* VISION Form */}
              {activeSection === "vision" && (
                <>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">NOMBRE *</label>
                    <input
                      type="text"
                      value={visionForm.name || ""}
                      onChange={(e) => setVisionForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="Nombre de la obra"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">CATEGORIA</label>
                      <select
                        value={visionForm.category || ""}
                        onChange={(e) => setVisionForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="" className="bg-black">Seleccionar...</option>
                        <option value="LANDSCAPES" className="bg-black">LANDSCAPES</option>
                        <option value="URBAN" className="bg-black">URBAN</option>
                        <option value="BLACK & WHITE" className="bg-black">BLACK & WHITE</option>
                        <option value="ABSTRACT" className="bg-black">ABSTRACT</option>
                        <option value="PORTRAITS" className="bg-black">PORTRAITS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">TIPO</label>
                      <input
                        type="text"
                        value={visionForm.type || ""}
                        onChange={(e) => setVisionForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="FINE ART PHOTOGRAPHY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">EDICIONES</label>
                      <input
                        type="number"
                        value={visionForm.totalEditions || ""}
                        onChange={(e) => setVisionForm(prev => ({ ...prev, totalEditions: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">PRECIO (COP) *</label>
                      <input
                        type="number"
                        value={visionForm.price || ""}
                        onChange={(e) => setVisionForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="249000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">DISPONIBILIDAD</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setVisionForm(prev => ({ ...prev, available: true }))}
                        className={`flex-1 py-2.5 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                          visionForm.available !== false
                            ? "border-green-500 bg-green-500/10 text-green-400"
                            : "border-white/20 text-white/60 hover:border-white/40"
                        }`}
                      >
                        {visionForm.available !== false && <Check className="w-4 h-4" />}
                        Disponible
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisionForm(prev => ({ ...prev, available: false }))}
                        className={`flex-1 py-2.5 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                          visionForm.available === false
                            ? "border-red-500 bg-red-500/10 text-red-400"
                            : "border-white/20 text-white/60 hover:border-white/40"
                        }`}
                      >
                        {visionForm.available === false && <Check className="w-4 h-4" />}
                        Agotado
                      </button>
                    </div>
                  </div>
                  <ImageUploadField
                    label="IMAGEN DE LA OBRA"
                    value={visionForm.image || ""}
                    onChange={(value) => setVisionForm(prev => ({ ...prev, image: value }))}
                    placeholder="https://..."
                  />
                </>
              )}

              {/* CAMP Form */}
              {activeSection === "camp" && (
                <>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">NUMERO</label>
                    <input
                      type="text"
                      value={campForm.number || ""}
                      onChange={(e) => setCampForm(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="02"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">FECHAS *</label>
                    <input
                      type="text"
                      value={campForm.dates || ""}
                      onChange={(e) => setCampForm(prev => ({ ...prev, dates: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="NOVEMBER 20 - 30, 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">UBICACION *</label>
                    <input
                      type="text"
                      value={campForm.location || ""}
                      onChange={(e) => setCampForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="MEDELLIN, COLOMBIA"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">DESCRIPCION</label>
                    <textarea
                      value={campForm.description || ""}
                      onChange={(e) => setCampForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                      placeholder="Descripcion del campamento..."
                      rows={3}
                    />
                  </div>
                  <ImageUploadField
                    label="IMAGEN DEL CAMP"
                    value={campForm.image || ""}
                    onChange={(value) => setCampForm(prev => ({ ...prev, image: value }))}
                    placeholder="https://..."
                  />
                </>
              )}

              {/* MAISON Form */}
              {activeSection === "maison" && (
                <>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">NOMBRE *</label>
                    <input
                      type="text"
                      value={maisonForm.name || ""}
                      onChange={(e) => setMaisonForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">COLOR</label>
                      <input
                        type="text"
                        value={maisonForm.color || ""}
                        onChange={(e) => setMaisonForm(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="ONYX BLACK"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">EDICION</label>
                      <input
                        type="text"
                        value={maisonForm.edition || ""}
                        onChange={(e) => setMaisonForm(prev => ({ ...prev, edition: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="01 / 12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">PRECIO (COP) *</label>
                      <input
                        type="number"
                        value={maisonForm.price || ""}
                        onChange={(e) => setMaisonForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="89000"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">BADGE</label>
                      <input
                        type="text"
                        value={maisonForm.badge || ""}
                        onChange={(e) => setMaisonForm(prev => ({ ...prev, badge: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="NEW"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">DESCRIPCION</label>
                    <textarea
                      value={maisonForm.description || ""}
                      onChange={(e) => setMaisonForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                      placeholder="Descripcion del producto..."
                      rows={3}
                    />
                  </div>
                  <ImageUploadField
                    label="IMAGEN DEL PRODUCTO"
                    value={maisonForm.image || ""}
                    onChange={(value) => setMaisonForm(prev => ({ ...prev, image: value }))}
                    placeholder="https://..."
                  />
                </>
              )}

              {/* BACKSTAGE Form */}
              {activeSection === "backstage" && (
                <>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">TITULO *</label>
                    <input
                      type="text"
                      value={backstageForm.title || ""}
                      onChange={(e) => setBackstageForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="Titulo del contenido"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-wider mb-2">SUBTITULO</label>
                    <input
                      type="text"
                      value={backstageForm.subtitle || ""}
                      onChange={(e) => setBackstageForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                      placeholder="Subtitulo o descripcion corta"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">DURACION</label>
                      <input
                        type="text"
                        value={backstageForm.duration || ""}
                        onChange={(e) => setBackstageForm(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                        placeholder="11:32"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-wider mb-2">TIPO</label>
                      <select
                        value={backstageForm.type || "video"}
                        onChange={(e) => setBackstageForm(prev => ({ ...prev, type: e.target.value as "video" | "image" }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="video" className="bg-black">Video</option>
                        <option value="image" className="bg-black">Imagen</option>
                      </select>
                    </div>
                  </div>
                  {backstageForm.type !== "image" && (
                    <ImageUploadField
                      label="VIDEO (URL o archivo local)"
                      value={backstageForm.videoUrl || ""}
                      onChange={(value) => setBackstageForm(prev => ({ ...prev, videoUrl: value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      accept="video/*"
                      mediaType="video"
                    />
                  )}
                  <ImageUploadField
                    label="IMAGEN DE PORTADA"
                    value={backstageForm.image || ""}
                    onChange={(value) => setBackstageForm(prev => ({ ...prev, image: value }))}
                    placeholder="https://..."
                  />
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10 sticky bottom-0 bg-[#0a0a0a]">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 border border-white/20 text-white/70 text-xs tracking-wider rounded-lg hover:border-white/40 transition-all"
              >
                CANCELAR
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs tracking-wider rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingItem ? "GUARDAR" : "CREAR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
