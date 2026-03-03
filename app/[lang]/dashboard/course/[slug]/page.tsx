import { getCourse } from "@/lib/api";
import { LessonView } from "@/components/course/lesson-view";
import fs from 'fs/promises';
import path from 'path';

async function getDashboardDictionary(lang: string) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, 'dashboard.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return null;
    }
}

interface PageProps {
    params: Promise<{ slug: string; lang: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CoursePage({ params, searchParams }: PageProps) {
    const { slug, lang } = await params;
    const { lessonId } = await searchParams;
    const course = await getCourse(slug);
    const t = await getDashboardDictionary(lang);

    if (!course) return <div className="p-8 text-center">{t?.dashboard?.course?.notFound || "Course not found"}</div>;

    // Flatten lessons to find current and next/prev
    const allLessons = course.modules?.flatMap(m => m.lessons) || [];

    // Default to first lesson if none selected
    const activeLessonId = lessonId ? Number(lessonId) : allLessons[0]?.id;
    const activeLesson = allLessons.find(l => l.id === activeLessonId);

    const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
    const prevLesson = allLessons[currentIndex - 1];
    const nextLesson = allLessons[currentIndex + 1];

    if (!activeLesson) {
        return (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                {t?.dashboard?.course?.selectLesson || "Select a lesson from the menu to start."}
            </div>
        )
    }

    return (
        <LessonView
            lesson={activeLesson}
            courseSlug={slug}
            courseTitle={course.title}
            prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
            nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
        />
    );
}
