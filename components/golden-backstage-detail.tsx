"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Play, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import HamburgerMenu from "./hamburger-menu"
import { LightboxThumbnail } from "./lightbox-media"
import { useBackstageContent, useGalleryMoments } from "@/lib/universe-store"

interface GoldenBackstageDetailProps {
  onNavigate?: (page: string) => void
}

interface LightboxItem {
  type: 'image' | 'video'
  src: string
  videoSrc?: string
  title?: string
  subtitle?: string
  duration?: string
}

export default function GoldenBackstageDetail({ onNavigate }: GoldenBackstageDetailProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([])

  // Use centralized stores for content and moments
  const { content: exclusiveContent, isLoaded: contentLoaded } = useBackstageContent()
  const { moments: galleryMoments, isLoaded: momentsLoaded } = useGalleryMoments()

  // Prepare all lightbox items
  const allLightboxItems: LightboxItem[] = [
    ...exclusiveContent.map(item => ({
      type: (item.type === "image" ? 'image' : 'video') as 'image' | 'video',
      src: item.image,
      videoSrc: item.videoUrl,
      title: item.title,
      subtitle: item.subtitle,
      duration: item.duration
    })),
    ...galleryMoments.map((moment, index) => ({
      type: 'image' as const,
      src: moment.src,
      title: moment.alt || `Moment ${index + 1}`
    }))
  ]

  const openLightbox = (index: number, isFromMoments: boolean = false) => {
    const actualIndex = isFromMoments ? exclusiveContent.length + index : index
    setCurrentIndex(actualIndex)
    setLightboxItems(allLightboxItems)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allLightboxItems.length - 1 : prev - 1))
  }, [allLightboxItems.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allLightboxItems.length - 1 ? 0 : prev + 1))
  }, [allLightboxItems.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goToPrevious, goToNext])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 md:p-6">
        <button onClick={() => onNavigate?.("home")} className="cursor-pointer">
          <img 
            src="/logo.png" 
            alt="1 OF 1 FIRM" 
            className="h-10 md:h-12 w-auto"
          />
        </button>
        <div className="flex items-center gap-4">
          <button className="text-amber-500 text-xs tracking-[0.15em] hover:text-amber-400 transition-colors hidden md:block">
            VIP ACCESS
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white p-2 hover:text-amber-500 transition-colors"
            aria-label="Open menu"
          >
            <div className="space-y-1.5">
              <div className="w-6 h-px bg-current" />
              <div className="w-6 h-px bg-current" />
            </div>
          </button>
        </div>
      </header>

      {/* Hero Section - Mismo estilo que Vision Gallery */}
      <section className="pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 items-center">
          <div>
            <span className="text-white/60 text-[8px] md:text-xs tracking-[0.2em] block mb-2 md:mb-4">GOLDEN BACKSTAGE</span>
            <h1 className="text-2xl md:text-6xl font-light tracking-tight leading-none mb-2 md:mb-6 text-amber-100" style={{ fontFamily: 'serif' }}>
              GOLDEN<br />BACKSTAGE
            </h1>
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
              <div className="w-4 md:w-8 h-px bg-amber-500/30"></div>
              <svg className="w-2 md:w-3 h-2 md:h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
              </svg>
            </div>
            <p className="text-white/60 text-[8px] md:text-xs tracking-wider leading-relaxed max-w-sm">
              INSIDE THE UNIVERSE.<br />
              EXCLUSIVE ACCESS.<br />
              BEHIND THE SCENES.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://f005.backblazeb2.com/file/b21of1firm/background/GOLDENhome.jpg"
              alt="Golden Backstage"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Exclusive Content Section */}
      <section className="px-4 md:px-12 py-8 md:py-16">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xs md:text-sm tracking-[0.2em] text-white/80">EXCLUSIVE CONTENT</h2>
          <button className="flex items-center gap-2 text-amber-500 text-[10px] md:text-xs tracking-[0.15em] hover:text-amber-400 transition-colors">
            
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {exclusiveContent.map((video, index) => (
            <div key={video.id} className="group cursor-pointer" onClick={() => openLightbox(index, false)}>
              <div className="relative aspect-square overflow-hidden rounded-lg border border-amber-500/20">
                <LightboxThumbnail
                  type={video.type}
                  src={video.type === "video" ? (video.videoUrl || video.image) : video.image}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                
                {/* Play button and duration */}
                <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3 flex items-center justify-between">
                  <button className="w-6 md:w-8 h-6 md:h-8 rounded-full border border-amber-500 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
                    <Play className="w-2 md:w-3 h-2 md:h-3 ml-0.5" fill="currentColor" />
                  </button>
                  <span className="text-white/80 text-[10px] md:text-xs">{video.duration}</span>
                </div>
              </div>
              
              <div className="mt-2 md:mt-3">
                <h3 className="text-white text-xs md:text-sm font-medium tracking-wide line-clamp-1">{video.title}</h3>
                <p className="text-white/50 text-[10px] md:text-xs tracking-wide mt-0.5 md:mt-1 line-clamp-1">{video.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* Moments Section */}
      <section className="px-4 md:px-12 py-8 md:py-16">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xs md:text-sm tracking-[0.2em] text-white/80">MOMENTS</h2>
          <button className="flex items-center gap-2 text-amber-500 text-[10px] md:text-xs tracking-[0.15em] hover:text-amber-400 transition-colors">
            
          </button>
        </div>

        <div className="grid grid-cols-5 gap-1.5 md:gap-3">
          {galleryMoments.slice(0, 5).map((moment, index) => (
            <div
              key={moment.id}
              className="aspect-square overflow-hidden rounded-md md:rounded-lg border border-amber-500/10 cursor-pointer group"
              onClick={() => openLightbox(index, true)}
            >
              <img
                src={moment.src}
                alt={moment.alt || `Moment ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1.5 md:gap-3 mt-1.5 md:mt-3">
          {galleryMoments.slice(5, 10).map((moment, index) => (
            <div
              key={moment.id}
              className="aspect-square overflow-hidden rounded-md md:rounded-lg border border-amber-500/10 cursor-pointer group"
              onClick={() => openLightbox(index + 5, true)}
            >
              <img
                src={moment.src}
                alt={moment.alt || `Moment ${index + 6}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Tagline */}
      <section className="py-8 md:py-16 text-center">
        <p className="text-amber-500/80 text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em]">
          CAPTURED DURING THE EXPERIENCE.
        </p>
        <div className="w-8 md:w-12 h-px bg-amber-500/30 mx-auto mt-4 md:mt-6" />
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-12 py-6 md:py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-white/40 text-[10px] md:text-xs tracking-wider">
          <p>© 10F1 FIRM 2026</p>
          <div className="flex items-center gap-4 md:gap-6">
            <a href="#" className="hover:text-amber-500 transition-colors">TERMS</a>
            <a href="#" className="hover:text-amber-500 transition-colors">PRIVACY</a>
          </div>
        </div>
      </footer>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Back Button */}
      <button 
        onClick={() => onNavigate?.("home")}
        className="fixed top-20 left-4 z-30 text-white/70 hover:text-amber-500 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxItems.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous button */}
          <button 
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-amber-500 transition-colors z-50 p-2"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Next button */}
          <button 
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-amber-500 transition-colors z-50 p-2"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Content */}
          <div 
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {(() => {
                const current = lightboxItems[currentIndex]
                // Determine a playable video source: prefer explicit videoSrc,
                // otherwise fall back to the main src if it is itself a video file.
                const isVideoFile = (url?: string) =>
                  !!url && (/^data:video\//i.test(url) || /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))
                const playableSrc =
                  current?.videoSrc || (isVideoFile(current?.src) ? current?.src : undefined)

                if (playableSrc) {
                  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/i.test(playableSrc)
                  if (isEmbed) {
                    const embedUrl = playableSrc
                      .replace("watch?v=", "embed/")
                      .replace("youtu.be/", "www.youtube.com/embed/")
                      .replace("vimeo.com/", "player.vimeo.com/video/")
                    return (
                      <iframe
                        src={embedUrl}
                        title={current?.title || 'Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-[90vw] max-w-3xl aspect-video rounded-lg"
                      />
                    )
                  }
                  return (
                    <video
                      src={playableSrc}
                      controls
                      autoPlay
                      poster={isVideoFile(current?.src) ? undefined : current?.src}
                      className="max-w-full max-h-[75vh] object-contain rounded-lg"
                    />
                  )
                }

                return (
                  <img
                    src={current?.src}
                    alt={current?.title || 'Gallery image'}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                  />
                )
              })()}
            </div>
            
            {/* Caption */}
            {lightboxItems[currentIndex]?.title && (
              <div className="mt-4 text-center">
                <h3 className="text-white text-lg md:text-xl font-medium tracking-wide">
                  {lightboxItems[currentIndex]?.title}
                </h3>
                {lightboxItems[currentIndex]?.subtitle && (
                  <p className="text-white/60 text-sm tracking-wider mt-1">
                    {lightboxItems[currentIndex]?.subtitle}
                  </p>
                )}
                {lightboxItems[currentIndex]?.duration && (
                  <p className="text-amber-500 text-sm mt-2">
                    {lightboxItems[currentIndex]?.duration}
                  </p>
                )}
              </div>
            )}

            {/* Indicator */}
            <div className="mt-4 text-white/50 text-sm">
              {currentIndex + 1} / {lightboxItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
