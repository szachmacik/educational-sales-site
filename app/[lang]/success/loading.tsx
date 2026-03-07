export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-20 bg-background border-b" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-8" />
    <div className="max-w-lg mx-auto text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-muted animate-pulse mx-auto" />
      <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto" />
      <div className="h-4 w-64 bg-muted rounded animate-pulse mx-auto" />
      <div className="h-10 w-40 bg-muted rounded animate-pulse mx-auto" />
    </div>
      </div>
    </div>
  )
}
