export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="relative aspect-[16/10] bg-gray-900 rounded-xl overflow-hidden animate-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
