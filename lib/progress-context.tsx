"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Types
interface LessonProgress {
    lessonId: number;
    courseSlug: string;
    completedAt: string;
}

interface ProgressState {
    completedLessons: LessonProgress[];
}

interface ProgressContextType {
    isLessonComplete: (lessonId: number) => boolean;
    markLessonComplete: (lessonId: number, courseSlug: string) => void;
    markLessonIncomplete: (lessonId: number) => void;
    getCourseProgress: (courseSlug: string, totalLessons: number) => number;
    getCompletedCount: (courseSlug: string) => number;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = "lms_progress";

// Helper functions for localStorage
function loadProgress(): ProgressState {
    if (typeof window === "undefined") return { completedLessons: [] };
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error("Failed to load progress:", e);
    }
    return { completedLessons: [] };
}

function saveProgress(state: ProgressState): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save progress:", e);
    }
}

// Provider Component
export function ProgressProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ProgressState>({ completedLessons: [] });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        setState(loadProgress());
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            saveProgress(state);
        }
    }, [state, isLoaded]);

    const isLessonComplete = useCallback((lessonId: number): boolean => {
        return state.completedLessons.some((l) => l.lessonId === lessonId);
    }, [state.completedLessons]);

    const markLessonComplete = useCallback((lessonId: number, courseSlug: string): void => {
        setState((prev) => {
            // Already completed? Don't add again
            if (prev.completedLessons.some((l) => l.lessonId === lessonId)) {
                return prev;
            }
            return {
                ...prev,
                completedLessons: [
                    ...prev.completedLessons,
                    {
                        lessonId,
                        courseSlug,
                        completedAt: new Date().toISOString(),
                    },
                ],
            };
        });
    }, []);

    const markLessonIncomplete = useCallback((lessonId: number): void => {
        setState((prev) => ({
            ...prev,
            completedLessons: prev.completedLessons.filter((l) => l.lessonId !== lessonId),
        }));
    }, []);

    const getCourseProgress = useCallback((courseSlug: string, totalLessons: number): number => {
        if (totalLessons === 0) return 0;
        const completed = state.completedLessons.filter((l) => l.courseSlug === courseSlug).length;
        return Math.round((completed / totalLessons) * 100);
    }, [state.completedLessons]);

    const getCompletedCount = useCallback((courseSlug: string): number => {
        return state.completedLessons.filter((l) => l.courseSlug === courseSlug).length;
    }, [state.completedLessons]);

    return (
        <ProgressContext.Provider
            value={{
                isLessonComplete,
                markLessonComplete,
                markLessonIncomplete,
                getCourseProgress,
                getCompletedCount,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

// Hook
export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return context;
}
