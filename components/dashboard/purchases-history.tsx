"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    FileText as FileTextIcon,
    ShoppingBag,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle,
    Package,
    ChevronDown,
    ChevronUp,
    Calendar,
    CreditCard,
    RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Order, ORDER_STATUS_LABELS } from "@/lib/order-schema";
import Link from "next/link";
import { toast } from "sonner";

function generateInvoiceHTML(order: Order, language: string): string {
    const date = new Date(order.createdAt).toLocaleDateString(
        language === 'pl' ? 'pl-PL' : language === 'uk' ? 'uk-UA' : 'en-US'
    );
    const items = order.items.map(item =>
        `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${item.title}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">${item.price?.toFixed(2)} PLN</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">${((item.price || 0) * item.quantity).toFixed(2)} PLN</td>
        </tr>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<title>Faktura / Invoice ${order.orderNumber}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .logo { font-size: 24px; font-weight: 800; color: #4f46e5; }
  .invoice-info { text-align: right; }
  .invoice-info h1 { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0 0 4px; }
  .invoice-info p { color: #64748b; margin: 2px 0; font-size: 14px; }
  .divider { border: none; border-top: 2px solid #e2e8f0; margin: 24px 0; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 32px; }
  .party h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin: 0 0 8px; }
  .party p { margin: 2px 0; font-size: 14px; color: #334155; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead tr { background: #f8fafc; }
  th { padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
  .totals { margin-left: auto; width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #475569; }
  .totals-row.total { font-size: 18px; font-weight: 800; color: #1e293b; border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 6px; }
  .footer { margin-top: 48px; text-align: center; font-size: 12px; color: #94a3b8; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #dcfce7; color: #16a34a; }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">KamilaEnglish.com</div>
    <p style="color:#64748b;font-size:13px;margin-top:4px;">Materiały edukacyjne do nauki angielskiego</p>
  </div>
  <div class="invoice-info">
    <h1>${language === 'pl' ? 'FAKTURA' : 'INVOICE'}</h1>
    <p><strong>${order.orderNumber}</strong></p>
    <p>${language === 'pl' ? 'Data' : 'Date'}: ${date}</p>
    <p><span class="status">${ORDER_STATUS_LABELS[order.status] || order.status}</span></p>
  </div>
</div>
<hr class="divider">
<div class="parties">
  <div class="party">
    <h3>${language === 'pl' ? 'Sprzedawca' : 'Seller'}</h3>
    <p><strong>Kamila Łobko-Koziej</strong></p>
    <p>KamilaEnglish.com</p>
    <p>kontakt@kamilaenglish.com</p>
  </div>
  <div class="party">
    <h3>${language === 'pl' ? 'Nabywca' : 'Buyer'}</h3>
    <p><strong>${(order.customer?.firstName && order.customer?.lastName ? order.customer.firstName + ' ' + order.customer.lastName : order.customer?.email) || 'Klient'}</strong></p>
    <p>${order.customer?.email || ''}</p>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th>${language === 'pl' ? 'Produkt' : 'Product'}</th>
      <th style="text-align:center;">${language === 'pl' ? 'Ilość' : 'Qty'}</th>
      <th style="text-align:right;">${language === 'pl' ? 'Cena jedn.' : 'Unit price'}</th>
      <th style="text-align:right;">${language === 'pl' ? 'Wartość' : 'Total'}</th>
    </tr>
  </thead>
  <tbody>${items}</tbody>
</table>
<div class="totals">
  ${order.discount ? `<div class="totals-row"><span>${language === 'pl' ? 'Rabat' : 'Discount'}</span><span>-${order.discount.toFixed(2)} PLN</span></div>` : ''}
  <div class="totals-row total"><span>${language === 'pl' ? 'RAZEM' : 'TOTAL'}</span><span>${order.total.toFixed(2)} PLN</span></div>
</div>
<div class="footer">
  <p>${language === 'pl' ? 'Dziękujemy za zakup! Materiały dostępne są w Twoim koncie.' : 'Thank you for your purchase! Materials are available in your account.'}</p>
  <p>KamilaEnglish.com | kontakt@kamilaenglish.com</p>
</div>
</body>
</html>`;
}

export function PurchasesHistory() {
    const { t, formatPrice, language } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders");
                if (res.ok) {
                    const data = await res.json();
                    if (data.orders && data.orders.length > 0) {
                        setOrders(data.orders);
                        setIsLoading(false);
                        return;
                    }
                }
            } catch {}
            // Fallback to localStorage
            const stored = localStorage.getItem("admin_orders");
            if (stored) {
                try { setOrders(JSON.parse(stored)); } catch {}
            }
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = searchQuery === "" ||
                order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    const handleDownloadInvoice = (order: Order) => {
        const html = generateInvoiceHTML(order, language);
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `faktura-${order.orderNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(
            language === 'pl' ? "Faktura pobrana pomyślnie!" :
            language === 'uk' ? "Рахунок-фактуру завантажено!" :
            "Invoice downloaded successfully!"
        );
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
            case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Package className="h-4 w-4 text-blue-500" />;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'completed': return "bg-green-100 text-green-700 border-green-200";
            case 'pending': return "bg-amber-100 text-amber-700 border-amber-200";
            case 'cancelled': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    const totalSpent = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.total || 0), 0);

    if (isLoading) {
        return (
            <Card className="border-none shadow-md">
                <CardContent className="p-8 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-3" />
                    <p className="text-muted-foreground">{t.dashboard?.purchases?.loading || "Ładowanie..."}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stats Row */}
            {orders.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">
                                {language === 'pl' ? 'Łącznie zamówień' : language === 'uk' ? 'Всього замовлень' : 'Total orders'}
                            </p>
                            <p className="text-2xl font-black text-indigo-700">{orders.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">
                                {language === 'pl' ? 'Wydano łącznie' : language === 'uk' ? 'Витрачено всього' : 'Total spent'}
                            </p>
                            <p className="text-2xl font-black text-green-700">{totalSpent.toFixed(2)} PLN</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">
                                {language === 'pl' ? 'Zakupionych produktów' : language === 'uk' ? 'Куплених продуктів' : 'Products bought'}
                            </p>
                            <p className="text-2xl font-black text-purple-700">
                                {orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-6">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <CardTitle className="text-xl">{t.dashboard?.purchases?.title || "Historia zakupów"}</CardTitle>
                        {orders.length > 0 && (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-48">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
                                    <Input
                                        placeholder={language === 'pl' ? "Szukaj..." : language === 'uk' ? "Пошук..." : "Search..."}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-8 h-8 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="h-8 px-2 rounded-md bg-white/10 border border-white/20 text-white text-sm"
                                >
                                    <option value="all" className="text-slate-900">{language === 'pl' ? 'Wszystkie' : language === 'uk' ? 'Всі' : 'All'}</option>
                                    <option value="completed" className="text-slate-900">{language === 'pl' ? 'Zrealizowane' : language === 'uk' ? 'Виконані' : 'Completed'}</option>
                                    <option value="pending" className="text-slate-900">{language === 'pl' ? 'Oczekujące' : language === 'uk' ? 'Очікують' : 'Pending'}</option>
                                    <option value="cancelled" className="text-slate-900">{language === 'pl' ? 'Anulowane' : language === 'uk' ? 'Скасовані' : 'Cancelled'}</option>
                                </select>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {orders.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <ShoppingBag className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">{t.dashboard?.purchases?.empty || "Brak zamówień"}</h3>
                            <p className="text-slate-500 mb-6 max-w-sm">{t.dashboard?.purchases?.emptyDesc || "Nie dokonałeś jeszcze żadnych zakupów."}</p>
                            <Button asChild>
                                <Link href={`/${language}/products`}>{t.dashboard?.purchases?.goToShop || "Przejdź do sklepu"}</Link>
                            </Button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p>{language === 'pl' ? 'Brak wyników dla podanego filtra' : language === 'uk' ? 'Немає результатів для вибраного фільтра' : 'No results for the selected filter'}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredOrders.map((order) => {
                                const isExpanded = expandedOrder === order.id;
                                return (
                                    <div key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <div
                                            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                                    <FileTextIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-bold text-slate-900 text-sm">
                                                            {order.items.slice(0, 2).map(i => i.title).join(", ")}
                                                            {order.items.length > 2 && ` +${order.items.length - 2}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{order.orderNumber}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(order.createdAt).toLocaleDateString(
                                                                language === 'pl' ? 'pl-PL' : language === 'uk' ? 'uk-UA' : 'en-US'
                                                            )}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <CreditCard className="h-3 w-3" />
                                                            {order.payment?.method || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 pl-14 md:pl-0">
                                                <Badge className={`border text-xs ${getStatusBadgeClass(order.status)}`}>
                                                    <span className="flex items-center gap-1">
                                                        {getStatusIcon(order.status)}
                                                        {ORDER_STATUS_LABELS[order.status] || order.status}
                                                    </span>
                                                </Badge>
                                                <span className="font-black text-slate-900">{formatPrice(order.total)}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1.5 text-xs h-8 border-slate-200"
                                                    onClick={e => { e.stopPropagation(); handleDownloadInvoice(order); }}
                                                >
                                                    <Download className="h-3 w-3" />
                                                    {t.dashboard?.purchases?.invoice || "Faktura"}
                                                </Button>
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded details */}
                                        {isExpanded && (
                                            <div className="px-5 pb-5 bg-slate-50/80 border-t border-slate-100">
                                                <div className="mt-3 space-y-2">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                        {language === 'pl' ? 'Produkty w zamówieniu' : language === 'uk' ? 'Продукти в замовленні' : 'Order items'}
                                                    </p>
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                                                            <span className="text-slate-700 flex-1">{item.title}</span>
                                                            <div className="flex items-center gap-4 text-muted-foreground">
                                                                <span>×{item.quantity}</span>
                                                                <span className="font-semibold text-slate-900 w-24 text-right">
                                                                    {((item.price || 0) * item.quantity).toFixed(2)} PLN
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.discount && (
                                                        <div className="flex items-center justify-between text-sm text-green-700 font-medium pt-1">
                                                            <span>{language === 'pl' ? 'Rabat' : language === 'uk' ? 'Знижка' : 'Discount'}</span>
                                                            <span>-{order.discount.toFixed(2)} PLN</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                                                        <span>{language === 'pl' ? 'Razem' : language === 'uk' ? 'Разом' : 'Total'}</span>
                                                        <span>{order.total.toFixed(2)} PLN</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
