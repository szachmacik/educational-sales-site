"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Quiz, Question, calculateScore } from "@/lib/quiz-schema";
import { cn } from "@/lib/utils";
import {
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RotateCcw,
    Trophy,
    AlertCircle
} from "lucide-react";

interface QuizViewProps {
    quiz: Quiz;
    onComplete?: (passed: boolean, score: number) => void;
}

type QuizState = "intro" | "active" | "result";

export function QuizView({ quiz, onComplete }: QuizViewProps) {
    const { t } = useLanguage();
    const [state, setState] = useState<QuizState>("intro");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, string[]>>(new Map());
    const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
    const [showFeedback, setShowFeedback] = useState(false);

    const currentQuestion = quiz.questions[currentIndex];
    const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

    // Timer
    useEffect(() => {
        if (state !== "active" || !quiz.timeLimit) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    finishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [state, quiz.timeLimit]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const selectOption = (optionId: string) => {
        if (showFeedback) return;

        const current = answers.get(currentQuestion.id) || [];

        if (currentQuestion.type === "single" || currentQuestion.type === "truefalse") {
            setAnswers(new Map(answers.set(currentQuestion.id, [optionId])));
        } else {
            // Multiple choice - toggle
            const newSelection = current.includes(optionId)
                ? current.filter((id) => id !== optionId)
                : [...current, optionId];
            setAnswers(new Map(answers.set(currentQuestion.id, newSelection)));
        }
    };

    const handleNext = () => {
        if (quiz.showFeedback && !showFeedback) {
            setShowFeedback(true);
            return;
        }

        setShowFeedback(false);
        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setState("result");
        const { passed, score } = calculateScore(quiz, answers);
        onComplete?.(passed, score);
    };

    const restart = () => {
        setState("intro");
        setCurrentIndex(0);
        setAnswers(new Map());
        setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
        setShowFeedback(false);
    };

    const result = useMemo(() => {
        if (state !== "result") return null;
        return calculateScore(quiz, answers);
    }, [state, quiz, answers]);

    const selectedOptions = answers.get(currentQuestion?.id) || [];
    const hasAnswer = selectedOptions.length > 0;

    // INTRO STATE
    if (state === "intro") {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Badge className="w-fit mx-auto mb-4">Knowledge Test</Badge>
                    <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                    {quiz.description && (
                        <p className="text-muted-foreground mt-2">{quiz.description}</p>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">{quiz.questions.length}</p>
                            <p className="text-sm text-muted-foreground">Questions</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">{quiz.passThreshold}%</p>
                            <p className="text-sm text-muted-foreground">Pass threshold</p>
                        </div>
                    </div>

                    {quiz.timeLimit && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Time limit: {quiz.timeLimit} minutes</span>
                        </div>
                    )}

                    <Button className="w-full" size="lg" onClick={() => setState("active")}>
                        Start Test
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // RESULT STATE
    if (state === "result" && result) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-8 text-center space-y-6">
                    <div className={cn(
                        "w-24 h-24 rounded-full mx-auto flex items-center justify-center",
                        result.passed ? "bg-green-100" : "bg-red-100"
                    )}>
                        {result.passed ? (
                            <Trophy className="h-12 w-12 text-green-600" />
                        ) : (
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">
                            {result.passed ? "Congratulations! Test passed!" : "Test not passed"}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            {result.passed
                                ? "Great job! You can continue learning."
                                : "Try again and review the materials."}
                        </p>
                    </div>

                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <p className={cn(
                                "text-4xl font-bold",
                                result.passed ? "text-green-600" : "text-red-600"
                            )}>
                                {result.score}%
                            </p>
                            <p className="text-sm text-muted-foreground">Your score</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold">{result.correctCount}/{quiz.questions.length}</p>
                            <p className="text-sm text-muted-foreground">Correct answers</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
                        <Button variant="outline" onClick={restart}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        {result.passed && (
                            <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")}>
                                Continue Learning
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ACTIVE STATE
    return (
        <Card className="max-w-2xl mx-auto">
            {/* Header */}
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                        Question {currentIndex + 1} of {quiz.questions.length}
                    </span>
                    {quiz.timeLimit && (
                        <Badge variant={timeLeft < 60 ? "destructive" : "secondary"} className="gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(timeLeft)}
                        </Badge>
                    )}
                </div>
                <Progress value={progress} className="h-2" />
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Question */}
                <div>
                    <Badge variant="outline" className="mb-3">
                        {currentQuestion.type === "single" && "Single choice"}
                        {currentQuestion.type === "multiple" && "Multiple choice"}
                        {currentQuestion.type === "truefalse" && "True / False"}
                    </Badge>
                    <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOptions.includes(option.id);
                        const showResult = showFeedback && quiz.showFeedback;
                        const isCorrect = option.isCorrect;

                        return (
                            <button
                                key={option.id}
                                onClick={() => selectOption(option.id)}
                                disabled={showFeedback}
                                className={cn(
                                    "w-full p-4 text-left rounded-lg border-2 transition-all flex items-center gap-3",
                                    !showResult && isSelected && "border-primary bg-primary/5",
                                    !showResult && !isSelected && "border-border hover:border-primary/50",
                                    showResult && isCorrect && "border-green-500 bg-green-50",
                                    showResult && !isCorrect && isSelected && "border-red-500 bg-red-50"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                                )}>
                                    {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                    {showResult && !isCorrect && isSelected && <XCircle className="h-4 w-4 text-red-600" />}
                                </div>
                                <span>{option.text}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {showFeedback && currentQuestion.explanation && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {currentQuestion.explanation}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end">
                    <Button onClick={handleNext} disabled={!hasAnswer}>
                        {showFeedback || !quiz.showFeedback
                            ? currentIndex === quiz.questions.length - 1
                                ? "Finish Test"
                                : "Next Question"
                            : "Check Answer"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
