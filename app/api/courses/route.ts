import { NextResponse } from 'next/server';
import { getCourses } from '@/lib/api';

export async function GET() {
    try {
        const courses = await getCourses();
        return NextResponse.json(courses);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}
