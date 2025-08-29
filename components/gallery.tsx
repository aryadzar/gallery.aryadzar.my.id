"use client"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Play } from "lucide-react"
import { MediaModal } from "./media-modal"
import { useState } from "react"
import { SanityDocument } from "next-sanity"
import { VideoThumbnail } from "@/lib/thumbnail"



export interface GalleryProps {
  items: SanityDocument[]
}

export function Gallery({ items }: GalleryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("media")
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)

  const handleItemClick = (id: string) => {
    router.push(`/?media=${id}`, { scroll: false })
  }

  const handleCloseModal = () => {
    router.push("/", { scroll: false })
  }

  const selectedItem = items.find((item) => item._id === selectedId)
  const selectedIndex = selectedItem ? items.findIndex((item) => item._id === selectedId) : -1

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="group relative aspect-[16/10] bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10"
            onClick={() => handleItemClick(item._id)}
            onMouseEnter={() => item.mediaType === "video" && setHoveredVideo(item._id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            {item.mediaType === "video" ? (
              hoveredVideo === item._id && item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <VideoThumbnail src={item.videoUrl} />
              )
            ) : (
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title || ""}
                fill
                className="object-cover transition-all duration-300 group-hover:brightness-110"
              />
            )}


            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />

            {item.mediaType === "video" && hoveredVideo !== item._id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/30 transition-all duration-300">
                  <Play className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-base group-hover:text-gray-200 transition-colors duration-300">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <MediaModal
          item={selectedItem}
          items={items}
          currentIndex={selectedIndex}
          isOpen={!!selectedId}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
