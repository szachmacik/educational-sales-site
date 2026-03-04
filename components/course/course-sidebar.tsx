"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course, isLessonUnlocked, getDaysUntilUnlock } from "@/lib/mock-data";
import { CheckCircle, PlayCircle, FileText, Lock, HelpCircle, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/lib/progress-context";
import { useLanguage } from "@/components/language-provider";
import { useMemo } from "react";

interface CourseSidebarProps {
    course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
    const searchParams = useSearchParams();
    const currentLessonId = Number(searchParams?.get("lessonId"));
    const { isLessonComplete, getCourseProgress } = useProgress();
    const { t, language } = useLanguage();

    // Calculate total lessons and progress
    const totalLessons = useMemo(() => {
        return course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
    }, [course.modules]);

    const progress = getCourseProgress(course.slug, totalLessons);

    if (!course.modules || course.modules.length === 0) {
        return <div className="p-4 text-muted-foreground">{t.course.noLessons}</div>;
    }

    return (
        <div className="w-full bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
            <div className="p-5 border-b border-border bg-muted/20">
                <h2 className="font-bold text-lg leading-tight">{course.title}</h2>
                <div className="mt-4">
                    <div className="flex justify-between text-xs font-semibold uppercase text-muted-foreground mb-2">
                        <span>{t.course.yourProgress}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="flex-1 bg-secondary h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={course.modules.map(m => `item-${m.id}`)} className="w-full">
                {course.modules.map((module) => (
                    <AccordionItem key={module.id} value={`item-${module.id}`} className="border-b last:border-0">
                        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 text-left font-semibold text-foreground/90 data-[state=open]:bg-muted/30">
                            <span className="text-sm">{module.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-0">
                            <div className="flex flex-col">
                                {module.lessons.map((lesson) => {
                                    const isActive = currentLessonId === lesson.id || (!currentLessonId && course.modules![0].lessons[0]?.id === lesson.id);
                                    const completed = isLessonComplete(lesson.id);
                                    const unlocked = isLessonUnlocked(lesson, course.enrolledAt);
                                    const daysUntilUnlock = getDaysUntilUnlock(lesson, course.enrolledAt);

                                    // Icon based on lesson type
                                    let Icon = lesson.type === 'video' ? PlayCircle : lesson.type === 'quiz' ? HelpCircle : FileText;
                                    if (!unlocked) Icon = Lock;

                                    if (!unlocked) {
                                        return (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center gap-3 px-5 py-3.5 text-sm border-l-[3px] border-transparent bg-muted/20 cursor-not-allowed"
                                            >
                                                <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                                                <span className="line-clamp-2 leading-snug flex-1 text-muted-foreground/60">
                                                    {lesson.title}
                                                </span>
                                                <Badge variant="outline" className="text-xs shrink-0 gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {t.course.unlocksInDays.replace('{days}', daysUntilUnlock.toString())}
                                                </Badge>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={lesson.id}
                                            href={`/${language}/dashboard/course/${course.slug}?lessonId=${lesson.id}`}
                                            className={cn(
                                                "flex items-center gap-3 px-5 py-3.5 text-sm transition-all border-l-[3px]",
                                                isActive
                                                    ? "bg-primary/10 border-primary text-primary font-medium"
                                                    : "border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                                            <span className="line-clamp-2 leading-snug flex-1">{lesson.title}</span>
                                            {lesson.type === 'quiz' && (
                                                <Badge variant="secondary" className="text-xs shrink-0">{t.course.quiz}</Badge>
                                            )}
                                            {completed && (
                                                <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-green-600 animate-in fade-in duration-300" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
