"use client";

import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { MOCK_COURSES } from "@/lib/mock-data";

import { toast } from "sonner";
export function RecentlyUsed() {
    const { language } = useLanguage();

    // Grabbing first 2 courses as "recent" based on mock data
    const recentCourses = MOCK_COURSES.slice(0, 2);

    if (!recentCourses.length) return null;

    return (
        <div className="bg-white/40 border border-white/80 rounded-2xl shadow-sm p-6 backdrop-blur-sm animate-in fade-in duration-500 mt-6">
            <h3 className="flex items-center gap-2 font-black text-slate-800 mb-4 tracking-tight">
                <Clock className="h-5 w-5 text-indigo-500" />
                Ostatnio Otwierane
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
                {recentCourses.map((course, idx) => {
                    const progress = idx === 0 ? 65 : 15;
                    const dateDesc = idx === 0 ? "Ostatnio aktywny: Dzisiaj" : "Ostatnio aktywny: 3 dni temu";

                    return (
                        <div key={course.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            {/* Hover accent */}
                            <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center relative shadow-inner">
                                {course.image_url ? (
                                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100" />
                                )}
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="font-bold text-slate-900 truncate text-sm">{course.title}</h4>
                                <p className="text-[10px] text-slate-400 font-medium mb-1.5">{dateDesc}</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shrink">
                                        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black tabular-nums text-slate-500">{progress}%</span>
                                </div>
                            </div>
                            <Button onClick={() => toast.success("Funkcja została wywołana.")} size="icon" className="rounded-full h-9 w-9 shadow-sm bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white shrink-0 group-hover:scale-110 transition-transform relative z-10 mr-1">
                                <Play className="h-3.5 w-3.5 ml-0.5 fill-current" />
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
