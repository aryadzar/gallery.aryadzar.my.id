import { client } from "@/sanity/lib/client"
import { SanityDocument } from "next-sanity"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch single item by ID
    const itemQuery = `*[_type == "galleryItem" && _id == $id][0] {
      _id,
      title,
      description,
      mediaType,
      "imageUrl": image.asset->url,
      "imageBlur": image.asset->metadata.lqip,
      "videoUrl": video.asset->url
    }`

    const item = await client.fetch<SanityDocument>(itemQuery, { id }, { next: { revalidate: 10 } })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Fetch all items for navigation (previous/next)
    const allItemsQuery = `*[_type == "galleryItem"] | order(_createdAt desc) {
      _id,
      title,
      mediaType,
      "imageUrl": image.asset->url,
      "imageBlur": image.asset->metadata.lqip,
      "videoUrl": video.asset->url
    }`

    const allItems = await client.fetch<SanityDocument[]>(allItemsQuery, {}, { next: { revalidate: 10 } })
    const currentIndex = allItems.findIndex((i) => i._id === id)

    return NextResponse.json({
      item,
      allItems,
      currentIndex
    })
  } catch (error) {
    console.error("Error fetching gallery item:", error)
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 })
  }
}
