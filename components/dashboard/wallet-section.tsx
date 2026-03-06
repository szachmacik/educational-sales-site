import { useLanguage } from "@/components/language-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ShoppingBag, Sparkles, TrendingUp, CalendarCheck, FileCheck, Gift, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserPoints, UserPoints } from "@/lib/points-service";

import { toast } from "sonner";
export function WalletSection() {
    const { t } = useLanguage();
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);

    useEffect(() => {
        // Assume default test user for now or get from context if available
        const currentEmail = localStorage.getItem("user_email") || "test@kamila.shor.dev";
        setUserPoints(getUserPoints(currentEmail));
    }, []);

    const getIconForReason = (reason: string) => {
        switch (reason) {
            case 'purchase': return ShoppingBag;
            case 'check-in':
            case 'streak': return CalendarCheck;
            case 'profile-completion': return FileCheck;
            case 'referral': return Gift;
            case 'level-up': return Award;
            default: return Sparkles;
        }
    };

    const getColorForReason = (reason: string, type: string) => {
        if (type === 'spend') return "text-red-600 bg-red-50";
        switch (reason) {
            case 'purchase': return "text-emerald-600 bg-emerald-50";
            case 'check-in':
            case 'streak': return "text-blue-600 bg-blue-50";
            case 'profile-completion': return "text-indigo-600 bg-indigo-50";
            default: return "text-amber-600 bg-amber-50";
        }
    };

    const balance = userPoints?.balance || 0;
    const valuePln = (balance / 100).toFixed(2);

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-100 rounded-3xl p-8 shadow-sm">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Coins className="h-10 w-10 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.dashboard?.wallet?.title || "Your Wallet"}</h2>
                <p className="text-slate-600 max-w-md mx-auto mb-8">
                    {t.dashboard?.wallet?.subtitle || "Collect points for activity and purchases."}
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                    <div className="bg-white p-4 rounded-2xl border shadow-sm">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">{t.dashboard?.wallet?.available || "Available funds"}</p>
                        <p className="text-3xl font-black text-amber-500">{balance.toLocaleString()} <span className="text-sm text-amber-700 font-medium">{t.dashboard?.wallet?.points || "pts"}</span></p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border shadow-sm">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                            {(t.dashboard?.wallet?.value || "Value in {currency}").replace("{currency}", "PLN")}
                        </p>
                        <p className="text-3xl font-black text-slate-700">{valuePln} <span className="text-sm text-slate-400 font-medium">PLN</span></p>
                    </div>
                </div>

                <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg shadow-amber-200 px-8">
                    {t.dashboard?.wallet?.spend || "Spend points in shop"}
                </Button>
            </div>

            <Card className="text-left border-none shadow-md overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-lg">{t.dashboard?.wallet?.history || "Recent activity"}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {(!userPoints?.history || userPoints.history.length === 0) ? (
                            <div className="p-8 text-center text-slate-500 italic">Brak niedawnej aktywności punktowej.</div>
                        ) : (
                            userPoints.history.map((item, i) => {
                                const Icon = getIconForReason(item.reason);
                                const colorClass = getColorForReason(item.reason, item.type);
                                const displayAmount = item.type === 'earn' ? `+${item.amount}` : `-${item.amount}`;
                                const dateStr = new Date(item.timestamp).toLocaleDateString();
                                const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${colorClass}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-slate-900 capitalize">{item.reason.replace('-', ' ')}</p>
                                                <p className="text-xs text-muted-foreground">{dateStr} {timeStr}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold px-2 py-1 rounded text-xs ${item.type === 'earn' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                            {displayAmount} {t.dashboard?.wallet?.points || "pts"}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
