import { Gallery } from "@/components/gallery"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">Arya Dzaky's Gallery</h1>
          <p className="text-gray-400 text-lg text-pretty">
            A collection of beautiful photographs showcasing the beauty of nature, architecture and everyday life.
          </p>
        </div>
        <Gallery />
      </div>
    </main>
  )
}
