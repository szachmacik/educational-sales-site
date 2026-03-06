"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
    TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign,
    Package, ArrowUpRight, ArrowDownRight, Calendar, Download,
    RefreshCw, Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
    id: string;
    orderNumber?: string;
    createdAt: string;
    total: number;
    status: string;
    items?: { title: string; price: number; quantity?: number }[];
    customerEmail?: string;
    paymentMethod?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateMonthlyData(orders: Order[]) {
    const months: Record<string, { revenue: number; orders: number; month: string }> = {};
    const now = new Date();
    // Seed last 12 months with zeros
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleString('pl-PL', { month: 'short', year: '2-digit' });
        months[key] = { revenue: 0, orders: 0, month: label };
    }
    orders.forEach(o => {
        const d = new Date(o.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (months[key]) {
            months[key].revenue += Number(o.total) || 0;
            months[key].orders += 1;
        }
    });
    return Object.values(months);
}

function generateDailyData(orders: Order[], days = 30) {
    const result: Record<string, { revenue: number; orders: number; day: string }> = {};
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleString('pl-PL', { day: 'numeric', month: 'short' });
        result[key] = { revenue: 0, orders: 0, day: label };
    }
    orders.forEach(o => {
        const key = new Date(o.createdAt).toISOString().slice(0, 10);
        if (result[key]) {
            result[key].revenue += Number(o.total) || 0;
            result[key].orders += 1;
        }
    });
    return Object.values(result);
}

function getStatusBreakdown(orders: Order[]) {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
        const s = o.status || 'unknown';
        counts[s] = (counts[s] || 0) + 1;
    });
    const COLORS: Record<string, string> = {
        completed: '#22c55e',
        paid: '#6366f1',
        pending: '#f59e0b',
        cancelled: '#ef4444',
        refunded: '#8b5cf6',
        unknown: '#94a3b8',
    };
    return Object.entries(counts).map(([name, value]) => ({
        name,
        value,
        color: COLORS[name] || '#94a3b8',
    }));
}

function getPaymentMethodBreakdown(orders: Order[]) {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
        const m = o.paymentMethod || 'unknown';
        counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function getTopProducts(orders: Order[]) {
    const counts: Record<string, { title: string; revenue: number; units: number }> = {};
    orders.forEach(o => {
        (o.items || []).forEach(item => {
            if (!counts[item.title]) counts[item.title] = { title: item.title, revenue: 0, units: 0 };
            counts[item.title].revenue += item.price * (item.quantity || 1);
            counts[item.title].units += item.quantity || 1;
        });
    });
    return Object.values(counts).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
    title, value, sub, icon: Icon, trend, trendLabel, color = 'indigo'
}: {
    title: string; value: string; sub?: string;
    icon: React.ElementType; trend?: number; trendLabel?: string; color?: string;
}) {
    const isPositive = (trend ?? 0) >= 0;
    const colorMap: Record<string, string> = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
    };
    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {trend !== undefined && (
                        <Badge variant={isPositive ? "default" : "destructive"} className={`text-xs ${isPositive ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}`}>
                            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                            {Math.abs(trend)}%
                        </Badge>
                    )}
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
                {trendLabel && <p className="text-xs text-muted-foreground mt-1">{trendLabel}</p>}
            </CardContent>
        </Card>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'30d' | '90d' | '12m'>('30d');
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch {
            // use sample data if API fails
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders();
        toast.success("Dane zostały odświeżone");
    };

    // ── Derived metrics ──────────────────────────────────────────────────────
    const now = new Date();
    const thisMonth = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const lastMonth = orders.filter(o => {
        const d = new Date(o.createdAt);
        const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    });

    const totalRevenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const thisMonthRevenue = thisMonth.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const lastMonthRevenue = lastMonth.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0
        ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 0;

    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'paid');
    const conversionRate = orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0;

    const uniqueCustomers = new Set(orders.map(o => o.customerEmail).filter(Boolean)).size;

    // ── Chart data ────────────────────────────────────────────────────────────
    const monthlyData = generateMonthlyData(orders);
    const dailyData = generateDailyData(orders, period === '30d' ? 30 : period === '90d' ? 90 : 365);
    const statusData = getStatusBreakdown(orders);
    const paymentData = getPaymentMethodBreakdown(orders);
    const topProducts = getTopProducts(orders);

    const chartData = period === '12m' ? monthlyData : dailyData;

    const PAYMENT_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Analityka</h1>
                    <p className="text-muted-foreground text-sm mt-1">Szczegółowe statystyki sprzedaży i aktywności</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                        <SelectTrigger className="w-36 rounded-xl border-slate-200">
                            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30d">Ostatnie 30 dni</SelectItem>
                            <SelectItem value="90d">Ostatnie 90 dni</SelectItem>
                            <SelectItem value="12m">Ostatnie 12 miesięcy</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="rounded-xl border-slate-200">
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Odśwież
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Eksport CSV — wkrótce dostępny")} className="rounded-xl border-slate-200">
                        <Download className="h-4 w-4 mr-2" />
                        Eksport
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Łączny przychód"
                    value={`${totalRevenue.toFixed(2)} zł`}
                    sub={`Ten miesiąc: ${thisMonthRevenue.toFixed(2)} zł`}
                    icon={DollarSign}
                    trend={revenueGrowth}
                    trendLabel="vs. poprzedni miesiąc"
                    color="indigo"
                />
                <StatCard
                    title="Zamówienia"
                    value={orders.length.toString()}
                    sub={`Ten miesiąc: ${thisMonth.length}`}
                    icon={ShoppingCart}
                    trend={lastMonth.length > 0 ? Math.round(((thisMonth.length - lastMonth.length) / lastMonth.length) * 100) : 0}
                    trendLabel="vs. poprzedni miesiąc"
                    color="green"
                />
                <StatCard
                    title="Śr. wartość zamówienia"
                    value={`${avgOrderValue.toFixed(2)} zł`}
                    sub={`${completedOrders.length} zrealizowanych`}
                    icon={TrendingUp}
                    color="amber"
                />
                <StatCard
                    title="Unikalni klienci"
                    value={uniqueCustomers.toString()}
                    sub={`Konwersja: ${conversionRate}%`}
                    icon={Users}
                    color="purple"
                />
            </div>

            {/* Revenue Chart */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Przychód w czasie</CardTitle>
                    <CardDescription>
                        {period === '30d' ? 'Ostatnie 30 dni' : period === '90d' ? 'Ostatnie 90 dni' : 'Ostatnie 12 miesięcy'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey={period === '12m' ? 'month' : 'day'} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} zł`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                formatter={(v: number) => [`${v.toFixed(2)} zł`, 'Przychód']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Orders + Status row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders bar chart */}
                <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Liczba zamówień</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey={period === '12m' ? 'month' : 'day'} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                    formatter={(v: number) => [v, 'Zamówienia']}
                                />
                                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status pie */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Statusy zamówień</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statusData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                                            {statusData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: number) => [v, 'zamówień']} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 mt-2">
                                    {statusData.map((s) => (
                                        <div key={s.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                                                <span className="text-muted-foreground capitalize">{s.name}</span>
                                            </div>
                                            <span className="font-semibold">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                                <Package className="h-8 w-8 mb-2 opacity-30" />
                                Brak danych
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Products + Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Top produkty</CardTitle>
                        <CardDescription>Według przychodu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {topProducts.map((p, i) => (
                                    <div key={p.title} className="flex items-center gap-3">
                                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{p.title}</p>
                                            <p className="text-xs text-muted-foreground">{p.units} szt.</p>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600 whitespace-nowrap">{p.revenue.toFixed(2)} zł</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                                <Package className="h-8 w-8 mb-2 opacity-30" />
                                Brak danych o produktach
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Metody płatności</CardTitle>
                        <CardDescription>Rozkład zamówień</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {paymentData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie data={paymentData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                                            {paymentData.map((_, i) => (
                                                <Cell key={i} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: number) => [v, 'zamówień']} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 mt-2">
                                    {paymentData.map((m, i) => (
                                        <div key={m.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2.5 w-2.5 rounded-full" style={{ background: PAYMENT_COLORS[i % PAYMENT_COLORS.length] }} />
                                                <span className="text-muted-foreground capitalize">{m.name}</span>
                                            </div>
                                            <span className="font-semibold">{m.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                                <DollarSign className="h-8 w-8 mb-2 opacity-30" />
                                Brak danych o płatnościach
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
