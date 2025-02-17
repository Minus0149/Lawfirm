export function ArticleListSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-sm bg-card">
            <div className="relative h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrendingNewsSkeleton() {
  return (
    <div className="w-full bg-card text-card-foreground p-4 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="h-48 bg-gray-300 rounded w-full mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 w-6 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-12"></div>
        <div className="h-6 w-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

