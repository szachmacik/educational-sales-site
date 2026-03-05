export default function ProductsLoading() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header skeleton */}
                <div className="mb-8">
                    <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-72 bg-slate-200 rounded animate-pulse" />
                </div>
                {/* Filter skeleton */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-9 w-24 bg-slate-200 rounded-full animate-pulse" />
                    ))}
                </div>
                {/* Products grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <div className="aspect-square bg-slate-200 animate-pulse" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                                <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse mt-3" />
                                <div className="h-10 bg-slate-200 rounded-xl animate-pulse mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
