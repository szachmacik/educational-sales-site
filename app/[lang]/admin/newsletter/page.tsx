"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    Mail,
    Search,
    Download,
    Trash2,
    Users,
    TrendingUp,
    Calendar,
    RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
    email: string;
    createdAt: string;
}

export default function NewsletterAdminPage() {
    const params = useParams();
    const lang = (params?.lang as string) || "pl";

    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/newsletter");
            const data = await res.json();
            setCount(data.count || 0);
            setSubscribers(data.subscribers || []);
        } catch {
            toast.error("Błąd ładowania subskrybentów");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return subscribers;
        return subscribers.filter((s) =>
            s.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [subscribers, search]);

    const handleDelete = async (email: string) => {
        if (!confirm(`Usunąć subskrybenta ${email}?`)) return;
        setDeleting(email);
        try {
            const res = await fetch("/api/newsletter", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setSubscribers((prev) => prev.filter((s) => s.email !== email));
                setCount((prev) => prev - 1);
                toast.success("Subskrybent usunięty");
            } else {
                toast.error("Błąd usuwania");
            }
        } catch {
            toast.error("Błąd serwera");
        } finally {
            setDeleting(null);
        }
    };

    const handleExportCSV = () => {
        const header = "Email,Data zapisu\n";
        const rows = subscribers
            .map((s) => `${s.email},${new Date(s.createdAt).toLocaleString("pl-PL")}`)
            .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Wyeksportowano ${subscribers.length} subskrybentów`);
    };

    // Stats
    const last7days = subscribers.filter(
        (s) => new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const last30days = subscribers.filter(
        (s) => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Zarządzaj subskrybentami newslettera
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchSubscribers}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Odśwież
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleExportCSV}
                        disabled={subscribers.length === 0}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Eksportuj CSV
                    </Button>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{count}</p>
                                <p className="text-xs text-slate-500">Łącznie subskrybentów</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{last7days}</p>
                                <p className="text-xs text-slate-500">Nowych w ostatnich 7 dniach</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{last30days}</p>
                                <p className="text-xs text-slate-500">Nowych w ostatnich 30 dniach</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscriber list */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Lista subskrybentów</CardTitle>
                            <CardDescription>
                                {filtered.length} z {subscribers.length} subskrybentów
                            </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Szukaj po emailu..."
                                className="pl-9 h-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : subscribers.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">Brak subskrybentów</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Subskrybenci pojawią się tutaj po zapisaniu się do newslettera
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Email</TableHead>
                                        <TableHead>Data zapisu</TableHead>
                                        <TableHead className="text-right">Akcje</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((sub) => (
                                        <TableRow key={sub.email}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Mail className="h-3.5 w-3.5 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-sm">{sub.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(sub.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(sub.email)}
                                                    disabled={deleting === sub.email}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
