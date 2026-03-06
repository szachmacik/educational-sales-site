"use client";


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Coupon, SAMPLE_COUPONS, generateCouponCode } from "@/lib/order-schema";
import { Plus, Ticket, Copy, Trash2, Calendar, Percent, Coins } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

import { toast } from "sonner";
const STORAGE_KEY = "admin_coupons";

export default function CouponsPage() {
    const { t, language } = useLanguage();
    const c = t.adminPanel?.coupons || {};
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "percent" as "percent" | "fixed",
        discountValue: 10,
        usageLimit: 100,
        minOrderValue: 0,
        expiresAt: "",
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setCoupons(JSON.parse(stored));
        } else {
            setCoupons(SAMPLE_COUPONS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_COUPONS));
        }
    }, []);

    const saveCoupons = (updated: Coupon[]) => {
        setCoupons(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleGenerateCode = () => {
        setNewCoupon((prev) => ({ ...prev, code: generateCouponCode() }));
    };

    const handleCreateCoupon = () => {
        if (!newCoupon.code) return;

        const coupon: Coupon = {
            code: newCoupon.code.toUpperCase(),
            discountType: newCoupon.discountType,
            discountValue: newCoupon.discountValue,
            usageLimit: newCoupon.usageLimit,
            usageCount: 0,
            minOrderValue: newCoupon.minOrderValue || undefined,
            expiresAt: newCoupon.expiresAt || undefined,
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        saveCoupons([...coupons, coupon]);
        setIsOpen(false);
        setNewCoupon({
            code: "",
            discountType: "percent",
            discountValue: 10,
            usageLimit: 100,
            minOrderValue: 0,
            expiresAt: "",
        });
    };

    const toggleActive = (code: string) => {
        const updated = coupons.map((c) =>
            c.code === code ? { ...c, isActive: !c.isActive } : c
        );
        saveCoupons(updated);
    };

    const deleteCoupon = (code: string) => {
        if (!confirm(c.toasts?.deleteConfirm || "Delete?")) return;
        saveCoupons(coupons.filter((c) => c.code !== code));
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString(language);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{c.title || "Coupons"}</h1>
                    <p className="text-muted-foreground">{c.subtitle}</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            {c.addCoupon}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{c.createCoupon}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>{c.form?.code}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newCoupon.code}
                                        onChange={(e) =>
                                            setNewCoupon((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                                        }
                                        placeholder={c.form?.placeholder}
                                    />
                                    <Button variant="outline" onClick={handleGenerateCode}>
                                        {c.form?.generate}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{c.form?.discountType}</Label>
                                    <Select
                                        value={newCoupon.discountType}
                                        onValueChange={(v) =>
                                            setNewCoupon((prev) => ({ ...prev, discountType: v as "percent" | "fixed" }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percent">{c.form?.percent}</SelectItem>
                                            <SelectItem value="fixed">{c.form?.fixed}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{c.form?.discountValue}</Label>
                                    <Input
                                        type="number"
                                        value={newCoupon.discountValue}
                                        onChange={(e) =>
                                            setNewCoupon((prev) => ({ ...prev, discountValue: Number(e.target.value) }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{c.form?.usageLimit}</Label>
                                    <Input
                                        type="number"
                                        value={newCoupon.usageLimit}
                                        onChange={(e) =>
                                            setNewCoupon((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{c.form?.minOrderValue}</Label>
                                    <Input
                                        type="number"
                                        value={newCoupon.minOrderValue}
                                        onChange={(e) =>
                                            setNewCoupon((prev) => ({ ...prev, minOrderValue: Number(e.target.value) }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{c.form?.expiresAt}</Label>
                                <Input
                                    type="date"
                                    value={newCoupon.expiresAt}
                                    onChange={(e) =>
                                        setNewCoupon((prev) => ({ ...prev, expiresAt: e.target.value }))
                                    }
                                />
                            </div>

                            <Button className="w-full" onClick={handleCreateCoupon}>
                                {c.createCoupon}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-100">
                                <Ticket className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{coupons.length}</p>
                                <p className="text-sm text-muted-foreground">{c.stats?.all}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-100">
                                <Percent className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{coupons.filter((c) => c.isActive).length}</p>
                                <p className="text-sm text-muted-foreground">{c.stats.active}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-blue-100">
                                <Coins className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">{c.stats.usage}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{c.table?.code}</TableHead>
                                <TableHead>{c.table?.discount}</TableHead>
                                <TableHead>{c.table?.usage}</TableHead>
                                <TableHead>{c.table?.expires}</TableHead>
                                <TableHead>{c.table?.status}</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.map((coupon) => (
                                <TableRow key={coupon.code}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="font-mono font-bold">{coupon.code}</code>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => copyCode(coupon.code)}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {coupon.discountType === "percent"
                                                ? `${coupon.discountValue}%`
                                                : `${coupon.discountValue} ${t.adminPanel.dashboard.currency}`}
                                        </Badge>
                                        {coupon.minOrderValue && (
                                            <span className="text-xs text-muted-foreground ml-2">
                                                (min. {coupon.minOrderValue} {t.adminPanel.dashboard.currency})
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{coupon.usageCount}</span>
                                        <span className="text-muted-foreground"> / {coupon.usageLimit}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(coupon.expiresAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={coupon.isActive}
                                            onCheckedChange={() => toggleActive(coupon.code)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteCoupon(coupon.code)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
