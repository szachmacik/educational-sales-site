export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-4 w-72 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                            <div className="h-8 w-8 bg-slate-200 rounded-xl animate-pulse" />
                        </div>
                        <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                            <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                                <div className="h-3 w-3/4 bg-slate-100 rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <div className="h-6 w-28 bg-slate-200 rounded animate-pulse" />
                    <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                                <div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
