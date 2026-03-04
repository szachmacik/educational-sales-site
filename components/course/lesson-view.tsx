"use client";

import { useProgress } from "@/lib/progress-context";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, PlayCircle, FileText, CheckCircle, Download, Loader2, Monitor, MapPin, Gamepad } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Material {
    name: string;
    url: string;
    size: string;
    type: 'pdf' | 'docx' | 'zip' | 'mp3' | 'game' | 'external';
}

interface Lesson {
    id: number;
    title: string;
    type: 'video' | 'text' | 'quiz' | 'game';
    teachingMode?: 'online' | 'stationary' | 'hybrid';
    duration?: string;
    content?: string;
    materials?: Material[];
}

interface LessonViewProps {
    lesson: Lesson;
    courseSlug: string;
    courseTitle: string;
    prevLesson?: { id: number; title: string } | null;
    nextLesson?: { id: number; title: string } | null;
}

const fileIcons: Record<string, string> = {
    pdf: "📄",
    docx: "📝",
    zip: "📦",
    mp3: "🎵",
    game: "🎮",
    external: "🔗",
};

export function LessonView({ lesson, courseSlug, courseTitle, prevLesson, nextLesson }: LessonViewProps) {
    const { t, language } = useLanguage();
    const { isLessonComplete, markLessonComplete, markLessonIncomplete } = useProgress();
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);

    const isComplete = isLessonComplete(lesson.id);

    const handleToggleComplete = () => {
        startTransition(() => {
            if (isComplete) {
                markLessonIncomplete(lesson.id);
            } else {
                markLessonComplete(lesson.id, courseSlug);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-background/50">
            {/* Top Navigation Bar */}
            <div className="border-b bg-background px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        <Link href={`/${language}/dashboard`} className="hover:text-primary transition-colors">{t.dashboard?.course?.backToCourses || "My Courses"}</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{courseTitle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>
                        {lesson.teachingMode && (
                            <Badge variant="outline" className={cn(
                                "flex items-center gap-1 ml-2",
                                lesson.teachingMode === 'online' ? "text-blue-600 bg-blue-50 border-blue-200" :
                                    lesson.teachingMode === 'stationary' ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                                        "text-amber-600 bg-amber-50 border-amber-200"
                            )}>
                                {lesson.teachingMode === 'online' ? <Monitor className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                {lesson.teachingMode === 'online' ? (t.dashboard?.course?.teachingModes?.online || 'Online') : (t.dashboard?.course?.teachingModes?.stationary || 'In-person')}
                            </Badge>
                        )}
                    </div>
                </div>

                <Button
                    onClick={handleToggleComplete}
                    disabled={isPending}
                    variant={isComplete ? "outline" : "default"}
                    className={cn(
                        "gap-2 shrink-0 transition-all duration-300",
                        isComplete && "border-green-500 text-green-600 hover:bg-green-50",
                        showSuccess && "animate-pulse bg-green-600 text-white"
                    )}
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isComplete ? (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            {t.dashboard?.course?.completed || "Completed"}
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            {t.dashboard?.course?.complete || "Mark as completed"}
                        </>
                    )}
                </Button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-5xl mx-auto">
                {/* Video Player */}
                {lesson.type === 'video' && (
                    <div className="w-full aspect-video rounded-xl bg-black shadow-2xl overflow-hidden group relative mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white p-6 bg-black/40 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:bg-black/60 transition-all cursor-pointer">
                                <PlayCircle className="mx-auto h-16 w-16 opacity-80 group-hover:opacity-100 transition-all scale-95 group-hover:scale-105" />
                                <p className="mt-4 font-bold tracking-wide">{t.dashboard?.course?.playVideo || "PLAY VIDEO"}</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Game / External Material */}
                {lesson.type === 'game' && (
                    <div className="mb-8 p-8 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 text-center space-y-6">
                        <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
                            <Gamepad className="h-10 w-10" />
                        </div>
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard?.course?.gameTitle || "Interactive Online Game"}</h2>
                            <p className="text-slate-600 mt-2">
                                {t.dashboard?.course?.gameDesc || "Click the button below to open the game."}
                            </p>
                        </div>
                        {lesson.materials?.find(m => m.type === 'game') && (
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl text-lg shadow-xl shadow-indigo-100 group" asChild>
                                <a href={lesson.materials.find(m => m.type === 'game')?.url} target="_blank" rel="noopener noreferrer">
                                    {t.dashboard?.course?.gameBtn || "Open Game Now"}
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </Button>
                        )}
                    </div>
                )}

                {/* Lesson Content & Materials */}
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h3>{t.dashboard?.course?.introduction || "Introduction"}</h3>
                            <div dangerouslySetInnerHTML={{ __html: lesson.content || '' }} />
                        </div>
                    </div>

                    {/* Materials Widget */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 sticky top-24">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                {t.dashboard?.course?.materialsTitle || "Lesson Materials"}
                            </h3>
                            <div className="space-y-3">
                                {lesson.materials && lesson.materials.length > 0 ? (
                                    lesson.materials.map((material, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline"
                                            className="w-full justify-start h-auto py-3 gap-3 border-dashed hover:border-primary/50 hover:bg-primary/5 group"
                                            asChild
                                        >
                                            <a href={material.url} download>
                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                                    <span className="text-lg">{fileIcons[material.type] || "📄"}</span>
                                                </div>
                                                <div className="text-left overflow-hidden flex-1">
                                                    <div className="font-medium truncate text-sm">{material.name}</div>
                                                    <div className="text-xs text-muted-foreground">{material.size}</div>
                                                </div>
                                                <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </a>
                                        </Button>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">{t.dashboard?.materials?.no_files || "No files available"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="border-t bg-background p-6">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <div>
                        {prevLesson && (
                            <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
                                <Link href={`/${language}/dashboard/course/${courseSlug}?lessonId=${prevLesson.id}`}>
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    <span className="flex flex-col items-start gap-0.5 text-left">
                                        <span className="text-xs text-muted-foreground font-normal">{t.dashboard?.course?.prevLesson || "Previous Lesson"}</span>
                                        <span>{prevLesson.title}</span>
                                    </span>
                                </Link>
                            </Button>
                        )}
                    </div>

                    <div>
                        {nextLesson ? (
                            <Button asChild className="pr-4 hover:pr-6 transition-all bg-primary hover:bg-primary/90 text-white shadow-md">
                                <Link href={`/${language}/dashboard/course/${courseSlug}?lessonId=${nextLesson.id}`}>
                                    <span className="flex flex-col items-end gap-0.5 text-right mr-2">
                                        <span className="text-xs text-white/80 font-normal">{t.dashboard?.course?.nextLesson || "Next Lesson"}</span>
                                        <span>{nextLesson.title}</span>
                                    </span>
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button onClick={() => { markLessonComplete(lesson.id, courseSlug); toast.success(t?.dashboard?.course?.finishCourse || "Kurs ukończony! Gratulacje! 🎉"); }} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                                <CheckCircle className="mr-2 h-4 w-4" /> {t.dashboard?.course?.finishCourse || "Finish Course"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
