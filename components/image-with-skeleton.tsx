"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  /** Extra classes applied to the wrapper element. */
  wrapperClassName?: string
}

/**
 * Renders an <img> with a pulsing skeleton placeholder that stays visible
 * until the image has finished loading (or fails). The skeleton fills the
 * same box as the image so layout never shifts.
 */
export default function ImageWithSkeleton({
  src,
  alt,
  className,
  wrapperClassName,
  onLoad,
  onError,
  ...props
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span className={cn("relative block h-full w-full overflow-hidden", wrapperClassName)}>
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-white/10"
        />
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        onError={(e) => {
          setLoaded(true)
          onError?.(e)
        }}
        {...props}
      />
    </span>
  )
}
