export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                    </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse mb-3" />
                            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse mb-1" />
                            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
                {/* Courses */}
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <div className="aspect-video bg-slate-200 animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 bg-slate-200 rounded animate-pulse" />
                                <div className="h-2 bg-slate-200 rounded-full animate-pulse" />
                                <div className="h-9 bg-slate-200 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
