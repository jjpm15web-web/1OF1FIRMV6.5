"use client"

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
    return (
      <video
        src={playable}
        controls
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        autoPlay
        playsInline
        className="max-w-full max-h-[85vh] object-contain rounded-lg"
      />
    )
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
