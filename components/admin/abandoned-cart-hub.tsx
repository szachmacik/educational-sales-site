"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { Mail, Link as LinkIcon, Trash2, ShoppingCart, UserX, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface AbandonedCart {
    email: string;
    items: { title: string; price: number; quantity: number }[];
    total: number;
    timestamp: number;
    status: "pending" | "contacted" | "recovered";
}

export function AbandonedCartHub() {
    const { t, formatPrice } = useLanguage();
    const [leads, setLeads] = useState<AbandonedCart[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("abandoned_carts");
        if (stored) {
            try {
                setLeads(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse abandoned carts", e);
            }
        }
    }, []);

    const handleSendReminder = (email: string) => {
        // Simulation of sending an email
        toast.success(t.abandonedHub.notifications.reminderSent.replace("{email}", email));

        // Update status locally
        const updated = leads.map(l => l.email === email ? { ...l, status: "contacted" as const } : l);
        setLeads(updated);
        localStorage.setItem("abandoned_carts", JSON.stringify(updated));
    };

    const handleCopyLink = () => {
        // Simulation of link generation
        navigator.clipboard.writeText("https://educational-site.com/checkout?coupon=RECOVER10");
        toast.success(t.abandonedHub.notifications.linkCopied);
    };

    const handleDelete = (email: string) => {
        const updated = leads.filter(l => l.email !== email);
        setLeads(updated);
        localStorage.setItem("abandoned_carts", JSON.stringify(updated));
    };

    if (leads.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <UserX className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-medium">No abandoned carts found today.</p>
                    <p className="text-xs">Incoming leads from the checkout form will appear here.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader className="bg-slate-900 text-white p-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                        <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black uppercase tracking-widest">{t.abandonedHub.title}</CardTitle>
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-tight">{t.abandonedHub.subtitle}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-100">
                            <TableHead className="font-black uppercase text-[10px] tracking-widest">{t.abandonedHub.table.customer}</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest">{t.abandonedHub.table.cart}</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest">{t.abandonedHub.table.value}</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest">{t.abandonedHub.table.lastActive}</TableHead>
                            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">{t.abandonedHub.table.actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead, idx) => (
                            <TableRow key={idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                <TableCell className="font-bold text-slate-900">
                                    <div className="flex flex-col">
                                        {lead.email}
                                        {lead.status === "contacted" && (
                                            <Badge variant="outline" className="w-fit mt-1 h-4 text-[8px] bg-blue-50 text-blue-600 border-blue-100">
                                                {t.abandonedHub.status.contacted}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-slate-500 max-w-[200px] truncate">
                                        {lead.items.map(i => i.title).join(", ")}
                                    </div>
                                </TableCell>
                                <TableCell className="font-black text-slate-900">
                                    {formatPrice(lead.total)}
                                </TableCell>
                                <TableCell className="text-xs text-slate-400">
                                    {new Date(lead.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleSendReminder(lead.email)}
                                            title={t.abandonedHub.actions.sendReminder}
                                        >
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={handleCopyLink}
                                            title={t.abandonedHub.actions.recoveryLink}
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
                                            onClick={() => handleDelete(lead.email)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
