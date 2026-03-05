export default function BlogLoading() {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <div className="aspect-video bg-slate-200 animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                                <div className="h-5 bg-slate-200 rounded animate-pulse" />
                                <div className="h-5 w-4/5 bg-slate-200 rounded animate-pulse" />
                                <div className="h-4 bg-slate-100 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
