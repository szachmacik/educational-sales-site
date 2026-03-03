
"use client";

import { useLanguage } from "@/components/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    BookOpen, FileText as FileTextIcon, User, Lock, Target, Flame, Heart, AlertCircle, ArrowRight, Award, Map, Star, Compass, Download, Plus as PlusIcon
} from "lucide-react";

export function StudentTasks() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl flex items-center gap-2 text-slate-900">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    {t.dashboard?.studentTasks?.title || "Your Tasks & Materials"}
                </h3>
            </div>

            {/* Student's Weekly Goal Board */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Target className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm border border-white/30">
                            <Target className="h-3 w-3" />
                            Cel tygodnia
                        </span>
                    </div>
                    <h4 className="text-xl font-black mb-1">Mój cel na ten tydzień! 🎯</h4>
                    <p className="text-indigo-100 font-medium mb-4 max-w-lg">
                        W tym tygodniu skupiamy się na odmianie czasownika <b>to be</b> w czasie przeszłym (Past Simple). Pamiętaj o różnicy między <i>was</i> a <i>were</i>. Powodzenia!
                    </p>
                    <div className="flex gap-3">
                        <Button onClick={() => toast.success("Funkcja została wywołana.")} variant="secondary" className="bg-white text-indigo-600 hover:bg-slate-50 font-bold">
                            Przejdź do lekcji (Past Simple)
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {[
                    { title: t.dashboard?.studentTasks?.mock?.homework || "Homework: Present Simple", assignee: t.dashboard?.studentTasks?.mock?.teacher || "Teacher", due: t.dashboard?.studentTasks?.mock?.tomorrow || "Tomorrow", status: "todo", type: "homework" },
                    { title: t.dashboard?.studentTasks?.mock?.quiz || "Quiz: Animals", assignee: t.dashboard?.studentTasks?.mock?.teacher || "Teacher", due: t.dashboard?.studentTasks?.mock?.friday || "Friday", status: "inProgress", type: "quiz" },
                    { title: t.dashboard?.studentTasks?.mock?.ebook || "E-book: Grammar Basics", assignee: t.dashboard?.studentTasks?.mock?.system || "System", due: "-", status: "available", type: "resource" }
                ].map((task, i) => (
                    <Card key={i} className="hover:border-indigo-200 transition-colors cursor-pointer">
                        <CardContent className="flex items-center p-6 gap-4">
                            <div className={`p-3 rounded-xl ${task.type === 'homework' ? 'bg-orange-100 text-orange-600' : task.type === 'quiz' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                <FileTextIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900">{task.title}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {task.assignee}</span>
                                    {task.due !== '-' && <span className="flex items-center gap-1 text-orange-600 font-medium"><Lock className="h-3 w-3" /> {t.dashboard?.studentTasks?.due || "Due"}: {task.due}</span>}
                                </div>
                            </div>
                            <Button onClick={() => toast.success("Funkcja została wywołana.")} variant={task.status === "todo" ? "default" : "secondary"}>
                                {task.status === "todo" ? (t.dashboard?.studentTasks?.actions?.start || "Start") : (t.dashboard?.studentTasks?.actions?.open || "Open")}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Student Progress Summary */}
            <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 mb-4">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Moje postępy w tym tygodniu
                </h3>
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <ul className="text-sm text-slate-500 space-y-2">
                        <li className="flex justify-between border-b border-slate-50 pb-2">Ostatnia aktywność: <span className="font-medium text-slate-700">Dzisiaj</span></li>
                        <li className="flex justify-between border-b border-slate-50 pb-2">Wykonane zadania (tydzień): <span className="font-medium text-slate-700">3/4</span></li>
                        <li className="flex justify-between">Średnia ocen z quizów: <span className="font-medium text-emerald-600">85%</span></li>
                    </ul>
                </div>
            </div>
            {/* PHASE 9: Interest UI & Certificate Repository */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid md:grid-cols-2 gap-8">

                {/* 1. Drzewo Zainteresowań (Interest UI) */}
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 mb-4">
                        <Compass className="h-5 w-5 text-sky-500" />
                        Drzewo Zainteresowań
                    </h3>
                    <Card className="border-sky-100 shadow-sm bg-gradient-to-br from-white to-sky-50/50">
                        <CardContent className="p-6">
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Wybierz co lubisz uczyć się najbardziej, aby Twój nauczyciel i platforma mogli lepiej dobierać Ci materiały!
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "Gry Komputerowe", active: true, icon: "🎮" },
                                    { label: "Sport i Ruch", active: true, icon: "⚽" },
                                    { label: "Zwierzęta", active: false, icon: "🐶" },
                                    { label: "Kultura UK/USA", active: false, icon: "🗽" },
                                    { label: "Przyroda", active: true, icon: "🌿" },
                                    { label: "Muzyka", active: false, icon: "🎵" }
                                ].map((badge, i) => (
                                    <Button onClick={() => toast.success("Funkcja została wywołana.")}
                                        key={i}
                                        variant={badge.active ? "default" : "outline"}
                                        size="sm"
                                        className={`rounded-full gap-1.5 ${badge.active
                                            ? "bg-sky-500 hover:bg-sky-600 border-transparent shadow-md shadow-sky-500/20"
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span className="text-sm">{badge.icon}</span> {badge.label}
                                    </Button>
                                ))}
                                <Button onClick={() => toast.success("Funkcja została wywołana.")} variant="ghost" size="sm" className="rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-slate-600">
                                    <PlusIcon className="h-3 w-3 mr-1" /> Dodaj własne
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. Repozytorium Certyfikatów (Certificate Rewards) */}
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 mb-4">
                        <Award className="h-5 w-5 text-amber-500" />
                        Półka z Osiągnięciami
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-4 text-center">
                                <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform">
                                    <Star className="h-6 w-6" />
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Mistrz Past Simple</h4>
                                <p className="text-[10px] text-slate-500 mb-3">Zdobyto: 12.02.2026</p>
                                <Button onClick={() => toast.success("Funkcja została wywołana.")} size="sm" variant="outline" className="w-full text-xs h-7 border-amber-200 text-amber-700 hover:bg-amber-100 gap-1 font-bold">
                                    <Download className="h-3 w-3" /> Pobierz PDF
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 border-dashed bg-slate-50/50 flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-2">
                                <Lock className="h-4 w-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-500">Zablokowany</p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[100px]">Ukończ moduł Eko, aby odblokować</p>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}
