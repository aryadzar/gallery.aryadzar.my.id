import { Gallery } from "@/components/gallery"
import { galleryQuery, options } from "@/lib/query"
import { client } from "@/sanity/lib/client"
import { SanityDocument } from "next-sanity"
import { Suspense } from "react"


export default async function Home() {
  const data = await client.fetch<SanityDocument[]>(galleryQuery, {}, options)
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">Arya Dzaky's Gallery</h1>
          <p className="text-gray-400 text-lg text-pretty">
            A collection of beautiful photographs showcasing the beauty of nature, architecture and everyday life.
          </p>
        </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Gallery items={data} />
      </Suspense>
        {/* <Gallery items={data} /> */}
      </div>
    </main>
  )
}
