"use client"

import { useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"

interface LightboxMediaProps {
  type: string
  src: string
  alt?: string
}

const isVideoFile = (url?: string) =>
  !!url && (/^data:video\//i.test(url) || /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))

const isEmbed = (url?: string) => !!url && /youtube\.com|youtu\.be|vimeo\.com/i.test(url)

// Upscale unsplash thumbnails for images only. Never alter data URLs or video files.
const upscale = (url: string) =>
  url.startsWith("data:") ? url : url.replace("w=400", "w=1200")

export function LightboxMedia({ type, src, alt = "" }: LightboxMediaProps) {
  // Treat as video if explicitly typed video AND we have a real playable source,
  // or if the src itself is a video file / embed regardless of declared type.
  const playable = isVideoFile(src) || isEmbed(src) ? src : type === "video" ? src : undefined

  if (playable && isEmbed(playable)) {
    const embedUrl = playable
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/")
      .replace("vimeo.com/", "player.vimeo.com/video/")
    return (
      <iframe
        src={embedUrl}
        title={alt || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-[90vw] max-w-4xl aspect-video rounded-lg"
      />
    )
  }

  if (playable && isVideoFile(playable)) {
    return <CustomVideoPlayer src={playable} />
  }

  // Fallback: image (covers real images and items typed "video" that only have a thumbnail).
  return (
    <img
      src={upscale(src) || "/placeholder.svg"}
      alt={alt}
      onError={(e) => {
        e.currentTarget.src = src
      }}
      className="max-w-full max-h-[85vh] object-contain"
    />
  )
}

interface LightboxThumbnailProps {
  type: string
  src: string
  alt?: string
  className?: string
}

// Thumbnail preview used in gallery grids. When the source is a local/uploaded
// video file, render a <video> (which shows the first frame as a preview)
// instead of an <img>, which would appear broken for video files.
export function LightboxThumbnail({ type, src, alt = "", className = "" }: LightboxThumbnailProps) {
  const treatAsVideoFile = isVideoFile(src)

  if (treatAsVideoFile) {
    return (
      <video
        src={`${src}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        controlsList="nodownload"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        className={className}
      />
    )
  }

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={className}
    />
  )
}

// Custom video player with no native browser menu, so there is no
// "Download" option exposed to the user. Controls are fully custom.
function CustomVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen?.()
    }
  }

  const onTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    setProgress((v.currentTime / v.duration) * 100)
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    v.currentTime = (Number(e.target.value) / 100) * v.duration
    setProgress(Number(e.target.value))
  }

  return (
    <div
      ref={containerRef}
      className="relative group max-w-full max-h-[85vh] rounded-lg overflow-hidden bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        onClick={togglePlay}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onContextMenu={(e) => e.preventDefault()}
        className="max-w-full max-h-[85vh] object-contain"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pausar" : "Reproducir"}
          className="text-white hover:text-amber-400 transition-colors"
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={onSeek}
          aria-label="Progreso del video"
          className="flex-1 h-1 cursor-pointer accent-amber-400"
        />

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          className="text-white hover:text-amber-400 transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Pantalla completa"
          className="text-white hover:text-amber-400 transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
