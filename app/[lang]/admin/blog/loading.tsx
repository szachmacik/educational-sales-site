export default function AdminBlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-20 bg-background border-b" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-8" />
    <div className="space-y-3">
      <div className="h-10 bg-muted rounded animate-pulse" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-14 bg-muted/60 rounded animate-pulse" />
      ))}
    </div>
      </div>
    </div>
  )
}
