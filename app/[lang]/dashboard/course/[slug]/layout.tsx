
import { getCourse } from "@/lib/api";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { redirect } from "next/navigation";

export default async function CourseLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Sidebar - hidden on mobile by default, but we'll keep it simple for now */}
            <aside className="hidden w-80 shrink-0 border-r bg-background lg:block">
                <CourseSidebar course={course} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-muted/20">
                {children}
            </main>
        </div>
    );
}
