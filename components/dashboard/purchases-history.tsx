"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, FileText as FileTextIcon, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Order, ORDER_STATUS_LABELS } from "@/lib/order-schema";
import Link from "next/link";

import { toast } from "sonner";
export function PurchasesHistory() {
    const { t, formatPrice, language } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("admin_orders");
        if (stored) {
            try {
                setOrders(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse orders", e);
            }
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">{t.dashboard?.purchases?.loading || "Loading..."}</div>;
    }

    return (
        <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{t.dashboard?.purchases?.title || "Purchase History"}</CardTitle>
                    <Button onClick={() => toast.success("Funkcja została wywołana.")} variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {orders.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">{t.dashboard?.purchases?.empty || "No orders"}</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">{t.dashboard?.purchases?.emptyDesc || "You haven't made any purchases yet."}</p>
                        <Button asChild>
                            <Link href={`/${language}/products`}>{t.dashboard?.purchases?.goToShop || "Go to Shop"}</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <FileTextIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex flex-col mb-1">
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className="text-sm font-bold text-slate-900">
                                                    {item.title} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                                                </span>
                                            ))}
                                            {order.items.length > 2 && (
                                                <span className="text-xs text-slate-500">+ {order.items.length - 2} {t.dashboard?.purchases?.moreItems || "more"}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{order.orderNumber}</span>
                                            <span>•</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span className={`font-medium ${order.status === 'completed' || (order.payment.status === 'paid' && order.status !== 'cancelled') ? 'text-green-600' :
                                                order.status === 'pending' ? 'text-amber-600' : 'text-slate-600'
                                                }`}>
                                                {ORDER_STATUS_LABELS[order.status] || order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pl-14 md:pl-0">
                                    <span className="font-bold text-slate-900">{formatPrice(order.total)}</span>
                                    <Button onClick={() => toast.success("Funkcja została wywołana.")} size="sm" variant="outline" className="gap-2 text-xs h-9 border-slate-200">
                                        <Download className="h-3 w-3" />
                                        {t.dashboard?.purchases?.invoice || "Invoice"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
