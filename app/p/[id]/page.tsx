import { client } from "@/sanity/lib/client"
import { SanityDocument } from "next-sanity"
import { notFound } from "next/navigation"
import { PhotoModal } from "@/components/photo-modal"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PhotoPage({ params }: PageProps) {
  const { id } = await params

  // Fetch single item by ID efficiently
  const itemQuery = `*[_type == "galleryItem" && _id == $id][0] {
    _id,
    title,
    description,
    mediaType,
    "imageUrl": image.asset->url,
    "imageBlur": image.asset->metadata.lqip,
    "videoUrl": video.asset->url
  }`

  const item = await client.fetch<SanityDocument>(itemQuery, { id }, {})

  if (!item) {
    notFound()
  }

  // Fetch only IDs for navigation (more efficient)
  const navQuery = `*[_type == "galleryItem"] | order(_createdAt desc) {
    _id,
    title,
    mediaType,
    "imageUrl": image.asset->url,
    "imageBlur": image.asset->metadata.lqip,
    "videoUrl": video.asset->url
  }`

  const allItems = await client.fetch<SanityDocument[]>(navQuery, {}, {})
  const currentIndex = allItems.findIndex((i) => i._id === id)

  return <PhotoModal item={item} items={allItems} currentIndex={currentIndex} />
}
