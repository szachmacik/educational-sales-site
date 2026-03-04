"use client";
import { useParams } from "next/navigation";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useLanguage, NamespaceGuard } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Order,
    OrderStatus,
    ORDER_STATUS_LABELS,
    PAYMENT_METHOD_LABELS,
    SAMPLE_ORDERS
} from "@/lib/order-schema";
import {
    Search,
    Eye,
    Download,
    ShoppingCart,
    Calendar,
    CreditCard,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "admin_orders";

const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-700 hover:bg-green-100";
        case "processing":
            return "bg-blue-100 text-blue-700 hover:bg-blue-100";
        case "pending":
            return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
        case "cancelled":
        case "refunded":
            return "bg-red-100 text-red-700 hover:bg-red-100";
        default:
            return "";
    }
};

const formatDate = (dateString: string, language: string) => {
    const localeMap: Record<string, string> = {
        'pl': 'pl-PL',
        'en': 'en-US',
        'es': 'es-ES',
        'de': 'de-DE',
        'fr': 'fr-FR',
        'uk': 'uk-UA'
    };
    const locale = localeMap[language] || 'en-US';

    return new Date(dateString).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function OrdersPage() {
    const params = useParams();
    const lang = (params?.lang as string) || 'pl';
    const { t, language } = useLanguage();

    // @ts-ignore
    const dictionary = translations[lang] || translations['pl'] || {};
    const o = t.adminPanel?.orders || {};
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setOrders(JSON.parse(stored));
        } else {
            setOrders(SAMPLE_ORDERS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
        }
        setLoading(false);
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                order.customer.email.toLowerCase().includes(search.toLowerCase()) ||
                order.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
                order.customer.lastName.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === "all" || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    // Stats
    const stats = useMemo(() => {
        const totalRevenue = orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total, 0);
        const pendingCount = orders.filter((o) => o.status === "pending").length;
        const todayOrders = orders.filter((o) => {
            const today = new Date().toDateString();
            return new Date(o.createdAt).toDateString() === today;
        }).length;
        return { totalRevenue, pendingCount, todayOrders };
    }, [orders]);

    const exportToCSV = useCallback(() => {
        // Safe access to translated headers
        const h = o.export_headers || {
            order_number: "Order number",
            date: "Date",
            customer: "Customer",
            email: "Email",
            products: "Products",
            total: "Total",
            status: "Status"
        };

        const headers = [h.order_number, h.date, h.customer, h.email, h.products, h.total, h.status];
        const rows = filteredOrders.map((order: Order) => [
            order.orderNumber,
            formatDate(order.createdAt, language),
            `${order.customer?.firstName} ${order.customer?.lastName}`,
            order.customer?.email,
            order.items.map((i: any) => i.title).join("; "),
            `${order.total} ${t.adminPanel?.dashboard?.currency}`,
            o.status?.[order.status],
        ]);

        const csv = [headers.join(","), ...rows.map((r: any[]) => r.map((c: any) => `"${c}"`).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    }, [filteredOrders, language, o, t.adminPanel?.dashboard?.currency]);


    return (
        <NamespaceGuard dictionary={dictionary}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{o.title || "Orders"}</h1>
                        <p className="text-muted-foreground">{o.subtitle}</p>
                    </div>
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        {o.exportCsv}
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-green-100">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalRevenue} {t.adminPanel?.dashboard?.currency}</p>
                                    <p className="text-sm text-muted-foreground">{o.stats?.revenue}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-yellow-100">
                                    <ShoppingCart className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.pendingCount}</p>
                                    <p className="text-sm text-muted-foreground">{o.stats?.pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.todayOrders}</p>
                                    <p className="text-sm text-muted-foreground">{o.stats?.today}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={o.search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={o.statusFilter} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{o.allStatuses}</SelectItem>
                            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {o.status?.[value as keyof typeof o.status]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">{o.empty}</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{o.table.order}</TableHead>
                                        <TableHead>{o.table.customer}</TableHead>
                                        <TableHead className="hidden lg:table-cell">{o.table.products}</TableHead>
                                        <TableHead>{o.table.total}</TableHead>
                                        <TableHead>{o.table.status}</TableHead>
                                        <TableHead className="hidden md:table-cell text-right">{o.table.date}</TableHead>
                                        <TableHead className="w-[60px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order: Order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <span className="font-mono text-sm">{order.orderNumber}</span>
                                            </TableCell>
                                            <TableCell className="max-w-[120px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-xs truncate">
                                                            {order.customer?.firstName} {order.customer?.lastName}
                                                        </p>
                                                        <p className="hidden sm:block text-[10px] text-muted-foreground truncate">{order.customer?.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell whitespace-normal text-xs max-w-[150px]">
                                                <span className="line-clamp-1">
                                                    {order.items.length === 1
                                                        ? order.items[0].title
                                                        : o.details?.quantity?.replace("{count}", order.items.length.toString()) || o.recentOrders?.productCount?.replace("{count}", order.items.length.toString())}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm whitespace-nowrap">{order.total} {t.adminPanel?.dashboard?.currency}</span>
                                                    {order.discount > 0 && (
                                                        <span className="text-[10px] text-green-600">(-{order.discount} {t.adminPanel?.dashboard?.currency})</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("text-[10px] h-5 px-1.5 whitespace-nowrap", getStatusBadgeVariant(order.status))}>
                                                    {o.status?.[order.status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-right">
                                                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{formatDate(order.createdAt, language).split(",")[0]}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/${language}/admin/orders/${order.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </NamespaceGuard>
    );
}
