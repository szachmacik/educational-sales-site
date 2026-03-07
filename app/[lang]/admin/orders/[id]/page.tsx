"use client";


import React, { useState, useEffect } from "react";
import { useRouter , useParams} from "next/navigation";
import { useLanguage, NamespaceGuard } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Order,
    OrderStatus,
    ORDER_STATUS_LABELS,
    PAYMENT_METHOD_LABELS
} from "@/lib/order-schema";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Building,
    CreditCard,
    Package,
    Calendar,
    FileText,
    Send,
    Loader2,
} from "lucide-react";
import { issueInFaktInvoice, getInFaktConfig } from "@/lib/integrations/infakt-service";
import { toast } from "sonner";

const STORAGE_KEY = "admin_orders";

export default function OrderDetailsPage() {
    const params = useParams();
    const lang = (params?.lang as string) || 'pl';
    const orderId = params?.id as string;
    const { t, language } = useLanguage();
    const router = useRouter();

    const dictionary = (translations as Record<string, Record<string, unknown>>)[lang] || {}
    const o = t.adminPanel?.orders || {};

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [isIssuingInvoice, setIsIssuingInvoice] = useState(false);

    useEffect(() => {
        const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const found = orders.find((o) => o.id === orderId);
        setOrder(found || null);
        setLoading(false);
    }, [orderId]);

    const updateStatus = (newStatus: OrderStatus) => {
        if (!order) return;

        const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const updated = orders.map((o) =>
            o.id === orderId
                ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
                : o
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setOrder({ ...order, status: newStatus, updatedAt: new Date().toISOString() });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang || "en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleIssueInvoice = async () => {
        if (!order) return;

        const config = getInFaktConfig();
        if (!config) {
            toast.error("InFakt is not configured in Settings.");
            router.push(`/${language}/admin/settings?tab=taxes`);
            return;
        }

        setIsIssuingInvoice(true);
        try {
            // Defaulting to 'en' if not specified, or use the customer's preferred language if we had it in order
            // Since we don't have language in Order yet, we'll use 'en' or 'pl' based on context or just 'pl_en'
            const result = await issueInFaktInvoice(order, 'pl_en');
            if (result.success) {
                toast.success(`Invoice ${result.invoiceNumber} issued successfully!`);
            }
        } catch (error: any) {
            toast.error(`Failed to issue invoice: ${error.message}`);
        } finally {
            setIsIssuingInvoice(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold mb-4">{o.details?.notFound || "Order not found"}</h1>
                <Button asChild>
                    <Link href={`/${language}/admin/orders`}>{o.details?.back || "Back to orders"}</Link>
                </Button>
            </div>
        );
    }

    return (
        <NamespaceGuard dictionary={dictionary}>
            <div className="max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/${language}/admin/orders`}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{o.table.order} {order.orderNumber}</h1>
                            <p className="text-sm text-muted-foreground">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={order.status} onValueChange={(v) => updateStatus(v as OrderStatus)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {o.status[value as keyof typeof o.status]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={handleIssueInvoice}
                            disabled={isIssuingInvoice}
                            className="gap-2"
                        >
                            {isIssuingInvoice ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileText className="h-4 w-4" />
                            )}
                            {o.details.invoice}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Customer */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {o.details.customer}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="font-medium">
                                {order.customer.firstName} {order.customer.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {order.customer.email}
                            </div>
                            {order.customer.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {order.customer.phone}
                                </div>
                            )}
                            {order.customer.company && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building className="h-3 w-3" />
                                    {order.customer.company}
                                    {order.customer.nip && ` (NIP: ${order.customer.nip})`}
                                </div>
                            )}
                            <Button onClick={() => { toast.info("Wysyłanie e-maili będzie dostępne po skonfigurowaniu klucza RESEND_API_KEY."); }} variant="outline" size="sm" className="w-full mt-2">
                                <Send className="h-3 w-3 mr-2" />
                                {o.details.sendEmail}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Payment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                {o.details.payment}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="font-medium">{o.paymentMethods[order.payment.method]}</p>
                            <Badge
                                variant={order.payment.status === "paid" ? "default" : "secondary"}
                                className={order.payment.status === "paid" ? "bg-green-100 text-green-700" : ""}
                            >
                                {order.payment.status === "paid" && o.paymentStatus.paid}
                                {order.payment.status === "pending" && o.paymentStatus.pending}
                                {order.payment.status === "failed" && o.paymentStatus.failed}
                                {order.payment.status === "refunded" && o.paymentStatus.refunded}
                            </Badge>
                            {order.payment.transactionId && (
                                <p className="text-xs text-muted-foreground font-mono">
                                    ID: {order.payment.transactionId}
                                </p>
                            )}
                            {order.payment.paidAt && (
                                <p className="text-xs text-muted-foreground">
                                    {o.details.paidAt.replace("{date}", formatDate(order.payment.paidAt))}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                {o.details.summary}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{o.details.items}</span>
                                <span>{order.subtotal} {o.details?.currency || "EUR"}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>{o.details.discount} {order.couponCode && `(${order.couponCode})`}</span>
                                    <span>-{order.discount} {o.details?.currency || "EUR"}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>{o.details.total}</span>
                                <span>{order.total} {o.details?.currency || "EUR"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>{o.details.items} ({order.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                            <Package className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                ID: {item.productId} • {o.details.quantity}: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium">{item.price * item.quantity} {o.details?.currency || "EUR"}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </NamespaceGuard>
    );
}
