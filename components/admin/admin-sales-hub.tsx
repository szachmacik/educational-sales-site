"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ShoppingBag, UserX, Star, Zap, Percent } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function AdminSalesHub() {
    const { t, formatPrice } = useLanguage();
    const [stats, setStats] = useState({
        totalRevenue: 24500,
        conversionRate: 3.2,
        abandonedCarts: 12,
        upsellTakeRate: 15,
        avgOrderValue: 124
    });

    useEffect(() => {
        // Calculate stats from orders/abandoned_carts in localStorage
        const orders = JSON.parse(localStorage.getItem("admin_orders") || "[]");
        const abandoned = JSON.parse(localStorage.getItem("abandoned_carts") || "[]");
        const visitors = Math.max(orders.length + abandoned.length, 1); // Simple proxy for total sessions

        const completedOrders = orders.filter((o: any) => o.status === "completed" || o.status === "processing");
        const revenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const count = completedOrders.length;

        // Upsell take rate - count orders with multiple items or high total
        const upsellOrders = completedOrders.filter((o: any) => o.items.length > 1);
        const upsellRate = completedOrders.length > 0 ? Math.round((upsellOrders.length / completedOrders.length) * 100) : 0;

        setStats({
            totalRevenue: revenue,
            avgOrderValue: count > 0 ? Math.round(revenue / count) : 0,
            abandonedCarts: abandoned.length,
            conversionRate: Math.round((count / visitors) * 1000) / 10,
            upsellTakeRate: upsellRate || 12
        });
    }, []);

    const metrics = [
        {
            label: t.adminPanel.dashboard.salesHub.totalRevenue || "Total Revenue",
            value: formatPrice(stats.totalRevenue),
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            label: t.adminPanel.dashboard.salesHub.avgOrderValue || "Avg Order Value",
            value: formatPrice(stats.avgOrderValue),
            icon: UserX,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: t.adminPanel.dashboard.salesHub.conversionRate || "Conversion Rate",
            value: `${stats.conversionRate}%`,
            icon: Percent,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            label: t.adminPanel.dashboard.salesHub.abandonedCarts || "Abandoned Carts",
            value: stats.abandonedCarts.toString(),
            icon: ShoppingBag,
            color: "text-orange-600",
            bg: "bg-orange-50"
        }
    ];

    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            {t.adminPanel.dashboard.salesHub.title || "Sales Hub"}
                        </CardTitle>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tight">{t.adminPanel.dashboard.salesHub.subtitle || "Real-time Performance Insights"}</p>
                    </div>
                    <Badge variant="outline" className="border-slate-700 text-slate-300 font-black">
                        LIVE
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100">
                    {metrics.map((m, i) => (
                        <div key={i} className="p-6 space-y-2 hover:bg-slate-50/50 transition-colors">
                            <div className={`w-10 h-10 rounded-2xl ${m.bg} flex items-center justify-center`}>
                                <m.icon className={`h-5 w-5 ${m.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{m.label}</p>
                                <p className="text-xl font-black text-slate-900 tracking-tight">{m.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* UPSELL INSIGHT */}
                <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                            <Zap className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest">{t.adminPanel.dashboard.salesHub.upsellPerformance || "Upsell Performance"}</h4>
                            <p className="text-xs text-indigo-100 font-medium">{(t.adminPanel.dashboard.salesHub.upsellDesc || "Post-purchase offers converted {percent}% of users").replace("{percent}", stats.upsellTakeRate.toString())}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black tracking-tight">+{stats.upsellTakeRate}%</p>
                        <p className="text-[9px] font-bold uppercase opacity-60">{t.adminPanel.dashboard.salesHub.ltvLift || "LTV Lift"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
