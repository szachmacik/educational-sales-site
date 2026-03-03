// Quiz system schema and types

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
    passThreshold: number; // 0-100 percentage
    timeLimit?: number; // minutes, optional
    shuffleQuestions: boolean;
    showFeedback: boolean;
}

export interface Question {
    id: string;
    type: 'single' | 'multiple' | 'truefalse';
    text: string;
    options: QuestionOption[];
    explanation?: string;
    points: number;
}

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface QuizAttempt {
    id: string;
    quizId: string;
    lessonId: number;
    courseSlug: string;
    userId: string;
    answers: { questionId: string; selectedOptionIds: string[] }[];
    score: number; // percentage
    passed: boolean;
    completedAt: string;
    timeSpent: number; // seconds
}

// Helper functions
export function generateQuizId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateScore(quiz: Quiz, answers: Map<string, string[]>): { score: number; passed: boolean; correctCount: number } {
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((question) => {
        totalPoints += question.points;
        const selectedIds = answers.get(question.id) || [];
        const correctIds = question.options.filter((o) => o.isCorrect).map((o) => o.id);

        // Check if answer is correct
        const isCorrect =
            selectedIds.length === correctIds.length &&
            selectedIds.every((id) => correctIds.includes(id));

        if (isCorrect) {
            earnedPoints += question.points;
        }
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const correctCount = quiz.questions.filter((q) => {
        const selectedIds = answers.get(q.id) || [];
        const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
        return selectedIds.length === correctIds.length && selectedIds.every((id) => correctIds.includes(id));
    }).length;

    return {
        score,
        passed: score >= quiz.passThreshold,
        correctCount,
    };
}

// Sample quiz for demo
export const SAMPLE_QUIZ: Quiz = {
    id: "quiz_1",
    title: "Test: Podstawy gramatyki",
    description: "Sprawdź swoją wiedzę z podstaw gramatyki angielskiej",
    passThreshold: 70,
    timeLimit: 10,
    shuffleQuestions: false,
    showFeedback: true,
    questions: [
        {
            id: "q1",
            type: "single",
            text: "Która forma jest poprawna?",
            points: 1,
            explanation: "Używamy 'goes' dla trzeciej osoby liczby pojedynczej.",
            options: [
                { id: "q1a", text: "He go to school", isCorrect: false },
                { id: "q1b", text: "He goes to school", isCorrect: true },
                { id: "q1c", text: "He going to school", isCorrect: false },
            ],
        },
        {
            id: "q2",
            type: "multiple",
            text: "Które zdania są poprawne? (wybierz wszystkie)",
            points: 2,
            options: [
                { id: "q2a", text: "I have been to London", isCorrect: true },
                { id: "q2b", text: "I have went to London", isCorrect: false },
                { id: "q2c", text: "She has finished her homework", isCorrect: true },
                { id: "q2d", text: "They has arrived", isCorrect: false },
            ],
        },
        {
            id: "q3",
            type: "truefalse",
            text: "Present Perfect używamy do opisania czynności, które właśnie się zakończyły.",
            points: 1,
            explanation: "Present Perfect może opisywać czynności zakończone, które mają związek z teraźniejszością.",
            options: [
                { id: "q3a", text: "Prawda", isCorrect: true },
                { id: "q3b", text: "Fałsz", isCorrect: false },
            ],
        },
    ],
};
