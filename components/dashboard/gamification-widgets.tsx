"use client";

import { useState, useEffect } from "react";
import { Coins, Flame, Trophy, CheckCircle2, ArrowRight, Gift, Briefcase } from "lucide-react";
import { getUserPoints, UserPoints, triggerPointEvent, STREAK_BONUS_MAP, getXpForLevel } from "@/lib/points-service";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
export function GamificationWidgets({ userId, userRole }: { userId: string, userRole?: string }) {
    const [points, setPoints] = useState<UserPoints | null>(null);

    useEffect(() => {
        setPoints(getUserPoints(userId));
        // Trigger login check-in automatically
        triggerPointEvent(userId, 'check-in');
    }, [userId]);

    if (!points) return null;

    const xpNeeded = getXpForLevel(points.level);
    const xpProgress = (points.xp / xpNeeded) * 100;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Points & Level Card */}
            <div className="glass-card p-6 border-l-4 border-l-primary relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy className="h-16 w-16" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Poziom {points.level}</p>
                        <h3 className="text-xl font-black">Nauczyciel Expert</h3>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase">
                        <span>XP: {points.xp.toLocaleString()}</span>
                        <span>Cel: {xpNeeded.toLocaleString()}</span>
                    </div>
                    <Progress value={xpProgress} className="h-2" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-600">
                        <Coins className="h-5 w-5 fill-amber-500" />
                        <span className="text-2xl font-black">{points.balance.toLocaleString()}</span>
                    </div>
                    {userRole !== "student" && (
                        <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="ghost" size="sm" className="text-xs uppercase font-bold gap-1">
                            Sklep <ArrowRight className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Streak Card */}
            <div className="glass-card p-6 border-l-4 border-l-orange-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Flame className="h-16 w-16 text-orange-500" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Flame className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Twój Streak</p>
                        <h3 className="text-xl font-black">{points.currentStreak} Dni z rzędu!</h3>
                    </div>
                </div>
                <div className="flex gap-1.5 mt-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div
                            key={day}
                            className={`h-8 flex-1 rounded-md flex items-center justify-center text-[10px] font-bold border ${day <= points.currentStreak
                                ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                                : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {day === 7 ? <Gift className="h-3 w-3" /> : day}
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 uppercase font-bold text-center">
                    {points.currentStreak >= 7
                        ? "🚀 Bonus 7-dniowy odebrany!"
                        : `Zaloguj się jutro po +${STREAK_BONUS_MAP[Math.min(points.currentStreak + 1, 7)]} pkt bonusu!`}
                </p>
            </div>

            {/* Quests Card */}
            <div className="glass-card p-6 border-l-4 border-l-indigo-500 overflow-hidden group">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Aktywne Questy</p>
                        <h3 className="text-lg font-black">Zdobądź więcej punktów</h3>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/50 border border-indigo-100 group/item hover:bg-indigo-50 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white rounded border">
                                <Coins className="h-3 w-3 text-amber-500" />
                            </div>
                            <span className="text-xs font-bold">Uzupełnij Profil</span>
                        </div>
                        <span className="text-xs font-black text-indigo-600">+200 PT</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/50 border border-indigo-100 group/item hover:bg-indigo-50 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white rounded border">
                                <Briefcase className="h-3 w-3 text-emerald-500" />
                            </div>
                            <span className="text-xs font-bold">Poleć Partnera</span>
                        </div>
                        <span className="text-xs font-black text-indigo-600">+500 PT</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
