import { useEffect, useState } from "react"

export function VideoThumbnail({ src }: { src: string }) {
  const [poster, setPoster] = useState<string | null>(null)

  useEffect(() => {
    if (!src) return

    const video = document.createElement("video")
    // Penting untuk canvas snapshot:
    video.crossOrigin = "anonymous"       // server harus kirim CORS header yg benar
    video.preload = "metadata"
    video.muted = true
    video.src = src

    const onLoadedMetadata = () => {
      // Ambil frame awal. Beberapa browser butuh seek kecil > 0
      try {
        video.currentTime = Math.min(0.1, (video.duration || 0.1))
      } catch {
        // abaikan; akan lanjut saat 'seeked'
      }
    }

    const onSeeked = () => {
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 720
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
          setPoster(dataUrl)
        } catch {
          setPoster(null)
        }
      }
      video.pause()
      video.remove()
    }

    const onError = () => {
      setPoster(null)
      video.remove()
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true })
    video.addEventListener("seeked", onSeeked, { once: true })
    video.addEventListener("error", onError, { once: true })

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.removeEventListener("seeked", onSeeked)
      video.removeEventListener("error", onError)
      video.remove()
    }
  }, [src])

  // fill container + efek hover konsisten
  return (
    <img
      src={poster || "/placeholder.svg"}
      alt=""
      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
    />
  )
}
