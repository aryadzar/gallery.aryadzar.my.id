"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Play } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { SanityDocument } from "next-sanity"
import { VideoThumbnail } from "@/lib/thumbnail"
import { GallerySkeleton } from "./gallery-skeleton"
import { useInfiniteQuery } from "@tanstack/react-query"

export interface GalleryProps {
  // No props needed - Gallery fetches its own data
}

export function Gallery() {
  const router = useRouter()
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  const handleItemClick = (id: string) => {
    router.push(`/p/${id}`)
  }

  // Fetch function for infinite query
  const fetchGalleryItems = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await fetch(`/api/gallery?page=${pageParam}`)
    if (!response.ok) {
      throw new Error("Failed to fetch gallery items")
    }
    return response.json()
  }

  // Infinite query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["gallery"],
    queryFn: fetchGalleryItems,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined
    },
  })

  // Flatten all pages into single array
  const items = data?.pages.flatMap((page) => page.items) ?? []

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Show initial loading skeleton
  if (isLoading) {
    return <GallerySkeleton />
  }

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
                placeholder="blur"
                blurDataURL={item.imageBlur}
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

      {/* Loading trigger for infinite scroll */}
      <div ref={observerTarget} className="w-full h-20" />

      {/* Loading skeleton when fetching more */}
      {isFetchingNextPage && <GallerySkeleton />}

      {/* End of gallery message */}
      {!hasNextPage && items.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">You've reached the end of the gallery</p>
        </div>
      )}
    </>
  )
}
