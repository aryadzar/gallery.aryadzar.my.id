import { client } from "@/sanity/lib/client"
import { SanityDocument } from "next-sanity"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 9

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1", 10)
    const start = (page - 1) * PAGE_SIZE

    const galleryQuery = `*[_type == "galleryItem"] | order(_createdAt desc) [${start}...${start + PAGE_SIZE}] {
      _id,
      title,
      description,
      mediaType,
      "imageUrl": image.asset->url,
      "imageBlur": image.asset->metadata.lqip,
      "videoUrl": video.asset->url
    }`

    const items = await client.fetch<SanityDocument[]>(galleryQuery, {}, { next: { revalidate: 10 } })

    // Fetch total count to determine if there are more items
    const countQuery = `count(*[_type == "galleryItem"])`
    const total = await client.fetch<number>(countQuery, {})
    const hasMore = start + PAGE_SIZE < total

    return NextResponse.json({
      items,
      hasMore,
      total,
      page,
      pageSize: PAGE_SIZE
    })
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}
