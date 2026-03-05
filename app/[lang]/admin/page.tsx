"use client";


import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Order, OrderItem, SAMPLE_ORDERS } from "@/lib/order-schema";
import { Course as Product } from "@/lib/mock-data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    Sparkles,
    TrendingUp,
    Eye,
    Plus,
    DollarSign,
    ShoppingCart,
    Users,
    ArrowUp,
    ArrowDown,
    Calendar,
    Zap,
    Lightbulb,
    X,
    CheckCircle2,
    ArrowRight,
    Gamepad2,
    Search,
    Loader2,
    Image as ImageIcon,
    Smartphone,
    BrainCircuit,
    Mail
} from "lucide-react";
import { TranslationMerger, NamespaceGuard } from "@/components/language-provider";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AdminSalesHub } from "@/components/admin/admin-sales-hub";
import { SuperAdminToggles } from "@/components/admin/super-admin-toggles";

const ORDERS_KEY = "admin_orders";
const PRODUCTS_KEY = "admin_products";

// Simple bar chart component
function BarChart({ data, maxValue, currency }: { data: { label: string; value: number }[]; maxValue: number; currency: string }) {
    return (
        <div className="space-y-4">
            {data.map((item, i) => (
                <div key={item.label} className="flex flex-col gap-1 group">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <span>{item.label}</span>
                        <span className="text-slate-900">{item.value.toLocaleString()} {currency}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out delay-75 shadow-sm"
                                style={{
                                    width: `${(item.value / maxValue) * 100}%`,
                                    transitionDelay: `${i * 100}ms`
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const params = useParams();
    const lang = (params?.lang as string) || 'pl';
    const { t, language } = useLanguage();

    // @ts-ignore
    const dictionary = translations[lang] || translations['pl'] || {};
    const d = t.adminPanel?.dashboard || {};
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [period, setPeriod] = useState("30days");
    const [generating, setGenerating] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [previewProduct, setPreviewProduct] = useState<any>(null);
    const [aiHistory, setAiHistory] = useState<any[]>([]);
    const [subscriberCount, setSubscriberCount] = useState<number>(0);

    useEffect(() => {
        const storedOrders = localStorage.getItem(ORDERS_KEY);
        setOrders(storedOrders ? JSON.parse(storedOrders) : SAMPLE_ORDERS);

        // Fetch AI history for logs
        const savedHistory = localStorage.getItem("ai_workshop_history");
        if (savedHistory) {
            try {
                setAiHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to load AI history for dashboard", e);
            }
        }

        // Fetch products from server
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/admin/products");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        fetchProducts();

        // Fetch newsletter subscriber count
        const fetchSubscribers = async () => {
            try {
                const res = await fetch("/api/newsletter");
                const data = await res.json();
                if (Array.isArray(data)) setSubscriberCount(data.length);
                else if (data?.count) setSubscriberCount(data.count);
            } catch {}
        };
        fetchSubscribers();
    }, []);

    // Calculate stats based on period
    const stats = useMemo(() => {
        const now = new Date();
        let daysBack = 30;
        if (period === "7days") daysBack = 7;
        if (period === "90days") daysBack = 90;
        if (period === "all") daysBack = 365 * 10;

        const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

        const periodOrders = orders.filter((o) => new Date(o.createdAt) >= cutoff);
        const completedOrders = periodOrders.filter((o) => o.status === "completed");

        const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        const orderCount = periodOrders.length;
        const customerCount = new Set(periodOrders.map((o) => o.customer.email)).size;
        const avgOrderValue = orderCount > 0 ? Math.round(revenue / completedOrders.length) || 0 : 0;

        return { revenue, orderCount, customerCount, avgOrderValue };
    }, [orders, period]);

    // Daily revenue for chart
    const dailyRevenue = useMemo(() => {
        const days = [
            d.charts?.days?.mon,
            d.charts?.days?.tue,
            d.charts?.days?.wed,
            d.charts?.days?.thu,
            d.charts?.days?.fri,
            d.charts?.days?.sat,
            d.charts?.days?.sun
        ];
        const today = new Date().getDay();
        const result = days.map((label) => ({ label, value: 0 }));

        orders
            .filter((o) => o.status === "completed")
            .forEach((order) => {
                const orderDay = new Date(order.createdAt).getDay();
                const dayIndex = orderDay === 0 ? 6 : orderDay - 1;
                result[dayIndex].value += order.total;
            });

        return result;
    }, [orders, t]);

    // Bestsellers
    const bestsellers = useMemo(() => {
        const productSales: Record<string, { title: string; count: number; revenue: number }> = {};

        orders
            .filter((o) => o.status === "completed")
            .forEach((order) => {
                order.items.forEach((item: OrderItem) => {
                    if (!productSales[item.productId]) {
                        productSales[item.productId] = { title: item.title, count: 0, revenue: 0 };
                    }
                    productSales[item.productId].count += item.quantity;
                    productSales[item.productId].revenue += item.price * item.quantity;
                });
            });

        return Object.entries(productSales)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [orders]);

    // Recent orders
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const maxDailyRevenue = Math.max(...dailyRevenue.map((d) => d.value), 100);

    const handleGenerateStrategy = async () => {
        setGenerating(true);
        setProgress(0);
        for (let i = 0; i <= 100; i += 20) {
            setProgress(i);
            await new Promise(r => setTimeout(r, 300));
        }
        setGenerating(false);
        setPreviewOpen(true);
    };


    return (
        <NamespaceGuard dictionary={dictionary}>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{d.title || "Dashboard"}</h1>
                        <p className="text-muted-foreground">{d.subtitle}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-[150px] font-bold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">{d.periods?.["7days"]}</SelectItem>
                                <SelectItem value="30days">{d.periods?.["30days"]}</SelectItem>
                                <SelectItem value="90days">{d.periods?.["90days"]}</SelectItem>
                                <SelectItem value="all">{d.periods?.all}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" asChild className="gap-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                            <Link href={`/${language}/admin/import`}>
                                <Zap className="h-4 w-4" />
                                {d.wordwallSync?.title || "Import & Sync"}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/${language}/admin/products/new`}>
                                {d.addProduct}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Sales Hub Widget */}
                <AdminSalesHub />

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="border-none premium-card-ring glass-premium group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/30 backdrop-blur-sm">
                            <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{d.stats?.revenue}</CardTitle>
                            <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.revenue.toLocaleString()} {d.currency}</div>
                            <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 mt-2">
                                <span className="flex items-center text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                                    <ArrowUp className="h-3 w-3 mr-0.5" />
                                    12.5%
                                </span>
                                {d.stats?.vsPrevious}
                            </p>
                            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-emerald-500/5 blur-2xl rounded-full" />
                        </CardContent>
                    </Card>
                    <Card className="border-none premium-card-ring glass-premium group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/30 backdrop-blur-sm">
                            <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{d.stats?.orders}</CardTitle>
                            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                <ShoppingCart className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.orderCount}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60">{d.stats?.inSelectedPeriod}</p>
                            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-blue-500/5 blur-2xl rounded-full" />
                        </CardContent>
                    </Card>
                    <Card className="border-none premium-card-ring glass-premium group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/30 backdrop-blur-sm">
                            <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{d.stats?.customers}</CardTitle>
                            <div className="p-2 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.customerCount}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60">{d.stats?.uniqueCustomers}</p>
                            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-purple-500/5 blur-2xl rounded-full" />
                        </CardContent>
                    </Card>
                    <Card className="border-none premium-card-ring glass-premium group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/30 backdrop-blur-sm">
                            <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{d.stats?.avgOrderValue}</CardTitle>
                            <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-4 w-4 text-indigo-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.avgOrderValue.toLocaleString()} {d.currency}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60">{d.stats?.perOrder}</p>
                            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-indigo-500/5 blur-2xl rounded-full" />
                        </CardContent>
                    </Card>
                    {/* Newsletter subscribers card */}
                    <Card className="border-none premium-card-ring glass-premium group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/30 backdrop-blur-sm">
                            <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Newsletter</CardTitle>
                            <div className="p-2 bg-pink-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                <Mail className="h-4 w-4 text-pink-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{subscriberCount}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60">{language === 'pl' ? 'Subskrybenci' : language === 'uk' ? 'Підписники' : 'Subscribers'}</p>
                            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-pink-500/5 blur-2xl rounded-full" />
                        </CardContent>
                    </Card>
                </div>

                {/* AI Insights & Quick Actions Row */}
                <div className="grid lg:grid-cols-12 gap-8">
                    <Card className="lg:col-span-8 border-none bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group ai-surface-glow">
                        <div className="absolute inset-0 premium-gradient-iridescent opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                            <Sparkles className="h-64 w-64 text-white" />
                        </div>
                        <CardContent className="p-10 relative z-10">
                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                <div className="h-24 w-24 rounded-[2rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-2xl relative overflow-hidden group-hover:rotate-6 transition-transform">
                                    <Zap className="h-12 w-12 text-yellow-300 fill-yellow-300 animate-pulse relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                </div>
                                <div className="flex-1 space-y-4 text-center lg:text-left">
                                    <div className="flex items-center justify-center lg:justify-start gap-3">
                                        <Badge className="bg-white text-indigo-900 border-none font-black px-4 py-1.5 uppercase tracking-tighter shadow-xl">AI COPILOT</Badge>
                                        <span className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase">{d.aiInsights?.card?.monitoring}</span>
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-indigo-50 to-white/80 bg-clip-text text-transparent">
                                        {d.aiInsights?.card?.strategyTitle?.replace("{period}", period === '7days' ? d.aiInsights?.card?.periodWeek : d.aiInsights?.card?.periodMonth)}
                                    </h2>
                                    <p className="text-indigo-50/70 font-bold text-lg max-w-2xl leading-relaxed">
                                        {d.aiInsights?.card?.description?.replace("{count}", orders.length.toString())}
                                    </p>
                                </div>
                                <Button
                                    onClick={handleGenerateStrategy}
                                    className="bg-white text-indigo-700 hover:bg-indigo-50 font-black h-20 px-12 text-xl rounded-[1.5rem] shadow-2xl shadow-indigo-950/40 transition-all transform hover:scale-105 active:scale-95 shrink-0 border-none ring-4 ring-white/10"
                                >
                                    <Lightbulb className="mr-4 h-8 w-8" />
                                    {d.aiInsights?.card?.generateBtn}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Studio Quick Access & AI Log */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card className="border-none premium-card-ring glass-premium overflow-hidden">
                            <CardHeader className="p-6 bg-slate-50/30 backdrop-blur-sm border-b border-white/20">
                                <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Studio Quick Access</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 flex flex-col gap-4">
                                <Link href={`/${language}/admin/workshop`} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 text-xs uppercase tracking-tight">Image Studio</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generate 4K Visuals</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href={`/${language}/admin/workshop`} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-50/50 transition-all">
                                    <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 text-xs uppercase tracking-tight">Social Hub</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Viral Post Creation</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border-none premium-card-ring glass-premium overflow-hidden">
                            <CardHeader className="p-6 bg-slate-50/30 backdrop-blur-sm border-b border-white/20 flex flex-row items-center justify-between">
                                <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active AI Logs</CardTitle>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-slate-400 uppercase">Live</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {aiHistory.length > 0 ? (
                                    aiHistory.slice(0, 3).map((log, idx) => (
                                        <div key={log.id || idx} className="flex gap-3 animate-in slide-in-from-right-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                                            <div className={cn("h-1.5 w-1.5 rounded-full mt-1.5 shrink-0",
                                                log.type === 'images' ? "bg-indigo-500" :
                                                    log.type === 'social' ? "bg-blue-500" : "bg-emerald-500"
                                            )} />
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                                                        {log.type === 'images' ? "Image Generated" : log.type === 'social' ? "Social Post Ready" : "Flashcard Created"}
                                                    </p>
                                                    <span className="text-[8px] font-bold text-slate-400">
                                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium leading-tight truncate-2-lines">
                                                    {log.prompt || `Created asset for ${log.productTitle || 'Product'}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    [
                                        { time: "Just now", action: "Trend identified", desc: "Cross-sell opportunity: Preschool Grammar", color: "text-emerald-500" },
                                        { time: "2m ago", action: "SEO Optimized", desc: "Product descriptions sharpened (12 total)", color: "text-indigo-500" },
                                        { time: "5m ago", action: "Image Polished", desc: "AI Upscaling 4K: Mega Pack Cover", color: "text-purple-500" }
                                    ].map((log, idx) => (
                                        <div key={idx} className="flex gap-3 animate-in slide-in-from-right-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                                            <div className={cn("h-1.5 w-1.5 rounded-full mt-1.5 shrink-0", log.color.replace('text-', 'bg-'))} />
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{log.action}</p>
                                                    <span className="text-[8px] font-bold text-slate-400">{log.time}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium leading-tight">{log.desc}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* SuperAdmin Feature Toggles */}
                <SuperAdminToggles />

                {/* Charts Row */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Revenue Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{d.charts?.weeklyRevenue}</CardTitle>
                            <CardDescription>{d.charts?.revenueByDay}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart data={dailyRevenue} maxValue={maxDailyRevenue} currency={d.currency} />
                        </CardContent>
                    </Card>

                    {/* Bestsellers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{d.charts?.bestsellersRanking}</CardTitle>
                            <CardDescription>{d.charts?.topSellingProducts}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bestsellers.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    {d.charts?.noSalesData}
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {bestsellers.map((product, index) => (
                                        <div key={product.id} className="flex items-center gap-4">
                                            <div
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                                    index === 0 ? "bg-yellow-100 text-yellow-700" :
                                                        index === 1 ? "bg-gray-100 text-gray-600" :
                                                            index === 2 ? "bg-orange-100 text-orange-700" :
                                                                "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{product.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {d.charts?.sold?.replace("{count}", product.count.toString())}
                                                </p>
                                            </div>
                                            <span className="font-medium">{product.revenue} {d.currency}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* AI & Studio Insights Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
                    {/* Active AI Logs */}
                    <Card className="lg:col-span-8 border-none premium-card-ring glass-premium overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <CardTitle className="text-sm font-black uppercase tracking-widest">{d.activeAiLogs?.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                        {d.activeAiLogs?.live} - AI Production Line
                                    </CardDescription>
                                </div>
                                <Sparkles className="h-5 w-5 text-indigo-400 opacity-50" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {[
                                    { icon: ImageIcon, text: d.activeAiLogs?.imageGenerated, time: "2 min ago", color: "text-indigo-500", bg: "bg-indigo-50" },
                                    { icon: Smartphone, text: d.activeAiLogs?.socialPostReady, time: "15 min ago", color: "text-blue-500", bg: "bg-blue-50" },
                                    { icon: BrainCircuit, text: d.activeAiLogs?.flashcardCreated, time: "45 min ago", color: "text-emerald-500", bg: "bg-emerald-50" },
                                    { icon: TrendingUp, text: d.activeAiLogs?.trendIdentified, time: "1h ago", color: "text-purple-500", bg: "bg-purple-50" },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", log.bg)}>
                                                <log.icon className={cn("h-5 w-5", log.color)} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{log.text}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Studio Quick Access */}
                    <Card className="lg:col-span-4 border-none premium-card-ring overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                        <CardHeader className="p-8">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-white/60">{d.studioQuickAccess?.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <Link href={`/${language}/admin/workshop?studio=images`} className="block p-6 rounded-[2rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all group shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <ImageIcon className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-tight">{d.studioQuickAccess?.imageStudio}</p>
                                        <p className="text-[10px] font-medium text-white/60 tracking-wide">{d.studioQuickAccess?.generate4k}</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href={`/${language}/admin/workshop?studio=social`} className="block p-6 rounded-[2rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all group shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <Smartphone className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-tight">{d.studioQuickAccess?.socialHub}</p>
                                        <p className="text-[10px] font-medium text-white/60 tracking-wide">{d.studioQuickAccess?.viralCreation}</p>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                        <div className="mt-auto p-8 pt-0 opacity-20 flex justify-end">
                            <Sparkles className="h-24 w-24 -mr-8 -mb-8 rotate-12" />
                        </div>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{d.recentOrders?.title}</CardTitle>
                            <CardDescription>{d.recentOrders?.subtitle}</CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/${language}/admin/orders`}>{d.recentOrders?.viewAll}</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                {d.recentOrders?.noOrders}
                            </p>
                        ) : (
                            <div className="divide-y">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <Users className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {order.customer?.firstName} {order.customer?.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {order.items.length === 1
                                                        ? order.items[0].title
                                                        : d.recentOrders?.productCount?.replace("{count}", order.items.length.toString())}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    order.status === "completed" && "bg-green-100 text-green-700",
                                                    order.status === "pending" && "bg-yellow-100 text-yellow-700"
                                                )}
                                            >
                                                {order.status === "completed" && d.recentOrders.status.completed}
                                                {order.status === "pending" && d.recentOrders.status.pending}
                                                {order.status === "processing" && d.recentOrders.status.processing}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Strategy Preview Modal */}
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="max-w-4xl border-none shadow-2xl p-0 overflow-hidden bg-white rounded-[2rem]">
                        <div className="absolute top-0 right-0 p-6 z-50">
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full hover:bg-slate-100 h-10 w-10">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="bg-slate-900 p-10 text-white relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <TrendingUp className="h-48 w-48 text-white rotate-12" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight">{d.aiInsights?.modal?.title}</h2>
                                        <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">{d.aiInsights?.modal?.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{d.aiInsights?.modal?.revenueChance}</p>
                                    <p className="text-3xl font-black text-emerald-700">+3,420 {d.currency}</p>
                                    <p className="text-xs text-emerald-600/80 font-bold">{d.aiInsights?.modal?.revenueGrowth}</p>
                                </div>
                                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{d.aiInsights?.modal?.crossSellScore}</p>
                                    <p className="text-3xl font-black text-indigo-700">8.4/10</p>
                                    <p className="text-xs text-indigo-600/80 font-bold">{d.aiInsights?.modal?.crossSellDesc}</p>
                                </div>
                                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-600">{d.aiInsights?.modal?.retentionProj}</p>
                                    <p className="text-3xl font-black text-purple-700">62%</p>
                                    <p className="text-xs text-purple-600/80 font-bold">{d.aiInsights?.modal?.retentionDesc}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">{d.aiInsights?.modal?.recommendedActions}</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors shadow-sm group">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <ShoppingCart className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900">{d.aiInsights?.modal?.action1Title}</p>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{d.aiInsights?.modal?.action1Desc}</p>
                                        </div>
                                        <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} size="sm" variant="outline" className="ml-auto rounded-xl border-indigo-100 text-indigo-600 font-bold">{d.aiInsights?.modal?.deploy}</Button>
                                    </div>
                                    <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors shadow-sm group bg-slate-50/30 backdrop-blur-sm">
                                        <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Plus className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="font-bold text-slate-900">{d.aiInsights?.modal?.action2Title}</p>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{d.aiInsights?.modal?.action2Desc}</p>
                                        </div>
                                        <Button asChild size="sm" variant="outline" className="rounded-xl border-indigo-100 text-indigo-600 font-bold">
                                            <Link href={`/${language}/admin/workshop`}>
                                                {d.aiInsights?.modal?.goToWorkshop || "Go to Workshop"}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-10 bg-slate-50 border-t flex gap-4">
                            <Button variant="ghost" onClick={() => setPreviewOpen(false)} className="rounded-xl h-14 font-bold px-8 text-slate-500 hover:text-red-500">
                                {d.aiInsights?.modal?.skip}
                            </Button>
                            <Button
                                onClick={() => {
                                    setPreviewOpen(false);
                                    toast.success(d.aiInsights?.modal?.success);
                                }}
                                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-14 font-black px-10 shadow-lg shadow-indigo-100 flex-1 text-lg"
                            >
                                <CheckCircle2 className="h-5 w-5 mr-3" />
                                {d.aiInsights?.modal?.apply}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                {/* Strategy Progress Overlay */}
                {generating && (
                    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <div className="max-w-md w-full p-12 text-center space-y-8">
                            <div className="relative inline-block">
                                <TrendingUp className="h-24 w-24 text-indigo-600 animate-pulse" />
                                <Sparkles className="h-10 w-10 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{d.aiInsights?.overlay?.title}</h3>
                                <p className="text-slate-500 font-medium italic leading-relaxed">{d.aiInsights?.overlay?.subtitle}</p>
                            </div>
                            <div className="space-y-4">
                                <Progress value={progress} className="h-2.5 bg-slate-100 rounded-full" />
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-indigo-600 px-1">
                                    <span>
                                        {progress < 30 ? d.aiInsights?.overlay?.step1 : progress < 70 ? d.aiInsights?.overlay?.step2 : d.aiInsights?.overlay?.step3}
                                    </span>
                                    <span>{progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive Preview Dialog */}
                <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-slate-950 border-slate-800 rounded-[2.5rem]">
                        <div className="p-6 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-white font-black">{previewProduct?.title}</DialogTitle>
                                <DialogDescription className="text-slate-400 font-medium">
                                    {d.interactivePreview?.subtitle}
                                </DialogDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowPreviewDialog(false)} className="text-slate-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                            {previewProduct?.source?.embedHtml ? (
                                <div
                                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-900"
                                    dangerouslySetInnerHTML={{
                                        __html: previewProduct.source.embedHtml
                                            .replace(/width="\d+"/, 'width="100%"')
                                            .replace(/height="\d+"/, 'height="100%"')
                                            .replace(/style="[^"]*"/, 'style="width: 100%; height: 100%; border: none;"')
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                    {d.interactivePreview?.noPreview}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
                            <Button onClick={() => setShowPreviewDialog(false)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold">
                                {d.interactivePreview?.close}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </NamespaceGuard >
    );
}
