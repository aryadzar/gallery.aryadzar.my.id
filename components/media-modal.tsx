"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useRouter } from "next/navigation"
import { useEffect, useCallback, useState, useRef } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryProps } from "./gallery"
import { SanityDocument } from "next-sanity"

interface MediaModalProps {
  item: SanityDocument
  items: SanityDocument[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
}

export function MediaModal({ item, items, currentIndex, isOpen, onClose }: MediaModalProps) {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePrevious = useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    const prevItem = items[prevIndex]
    router.push(`/?media=${prevItem._id}`, { scroll: false })
  }, [currentIndex, items, router])

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    const nextItem = items[nextIndex]
    router.push(`/?media=${nextItem._id}`, { scroll: false })
  }, [currentIndex, items, router])

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case " ":
          if (item.type === "video") {
            e.preventDefault()
            togglePlayPause()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, handlePrevious, handleNext, item.type])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Reset video state when item changes
  useEffect(() => {
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [item.id])

  if (!mounted || !isOpen) return null

return createPortal(
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-200"
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 rounded-full transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 rounded-full transition-colors"
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 rounded-full transition-colors"
          onClick={handleNext}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

        {/* Media Content */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {item.mediaType === "image" ? (
            <div className="relative w-full h-full max-w-[95vw] max-h-[95vh]">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                      muted
                      autoPlay
                      loop
                      playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={item.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {/* Media Info + Detail Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-semibold mb-1">{item.title}</h2>
              <p className="text-gray-400 text-sm">
                {currentIndex + 1} of {items.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20 rounded-xl"
                onClick={() => setShowDetail(true)}
              >
                Detail
              </Button>
              <span className="text-gray-400 text-sm">
                ← → navigate • ESC close {item.mediaType === "video" && "• SPACE play/pause"}
              </span>
            </div>
          </div>
        </div>

        {/* Smooth Popup Detail */}
        <AnimatePresence>
          {showDetail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
            >
              <div className="relative bg-zinc-900 text-white rounded-2xl shadow-xl p-6 max-w-lg w-full">
                <button
                  onClick={() => setShowDetail(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.description || "No description available."}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>,
    document.body,
  )
}
