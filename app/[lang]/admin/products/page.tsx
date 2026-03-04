"use client";
import { useParams } from "next/navigation";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Product, PRODUCT_CATEGORIES } from "@/lib/product-schema";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    Sparkles,
    Package,
    Zap,
    X,
    ExternalLink
} from "lucide-react";
import { TranslationMerger, NamespaceGuard } from "@/components/language-provider";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "admin_products";

// Sample products for demo
const SAMPLE_PRODUCTS: Product[] = [
    {
        id: "prod_1",
        title: "Lesson Plans: A1-A2 Bundle",
        description: "Ready-made lesson plans for beginners",
        price: 199,
        salePrice: 149,
        images: ["https://placehold.co/400x300"],
        category: "lesson-plans",
        teachingMode: "stationary",
        tags: ["a1", "a2", "beginner"],
        status: "published",
        slug: "lesson-plans-a1-a2",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-01T12:00:00Z",
    },
    {
        id: "prod_2",
        title: "Grammar Masterclass for Teachers",
        description: "How to teach grammar complexities",
        price: 129,
        images: ["https://placehold.co/400x300"],
        category: "lesson-plans",
        teachingMode: "online",
        tags: ["grammar", "methodology"],
        status: "published",
        slug: "grammar-masterclass",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-01T12:00:00Z",
    },
    {
        id: "prod_3",
        title: "Business English Resources Pack",
        description: "Materials for corporate client sessions",
        price: 249,
        salePrice: 199,
        images: ["https://placehold.co/400x300"],
        category: "bundles",
        teachingMode: "hybrid",
        tags: ["business", "corporate"],
        status: "draft",
        slug: "business-english-pack",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-01T12:00:00Z",
        source: {
            url: "https://www.kamilaenglish.com/product",
            importedAt: "2024-01-01T12:00:00Z",
            aiEnhanced: true,
        },
    },
];

export default function ProductsPage() {
    const params = useParams();
    const lang = (params?.lang as string) || 'pl';
    const { t, language } = useLanguage();

    // @ts-ignore
    const dictionary = translations[lang] || translations['pl'] || {};
    const p = t.adminPanel?.products || {};
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/admin/products");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (!localStorage.getItem(STORAGE_KEY)) {
                    // Fallback to samples only if server fails and no local storage
                    setProducts(SAMPLE_PRODUCTS);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) setProducts(JSON.parse(stored));
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const saveProducts = useCallback(async (updatedProducts: Product[]) => {
        try {
            await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProducts)
            });
            // Also update localStorage as a local cache
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
        } catch (error) {
            console.error("Failed to save products:", error);
            toast.error("Failed to save changes to server");
        }
    }, []);

    const toggleStatus = useCallback(async (id: string) => {
        const updated = products.map((p) =>
            p.id === id
                ? { ...p, status: (p.status === "published" ? "draft" : "published") as "draft" | "published" }
                : p
        );
        setProducts(updated);
        await saveProducts(updated);
    }, [products, saveProducts]);

    const deleteProduct = useCallback(async (id: string) => {
        if (!confirm(p.toasts?.deleteConfirm || "Are you sure?")) return;
        const updated = products.filter((p) => p.id !== id);
        setProducts(updated);
        await saveProducts(updated);
    }, [products, p.toasts?.deleteConfirm, saveProducts]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    const getCategoryLabel = (value: string) => {
        return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value;
    };

    return (
        <NamespaceGuard dictionary={dictionary}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{p.title || "Products"}</h1>
                        <p className="text-muted-foreground">{p.subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                            <Link href={`/${language}/admin/import`}>
                                <Zap className="mr-2 h-4 w-4" />
                                {p.importAi || "Import & Sync"}
                            </Link>
                        </Button>
                        <Button asChild className="bg-slate-900 hover:bg-slate-800">
                            <Link href={`/${language}/admin/products/new`}>
                                <Plus className="mr-2 h-4 w-4" />
                                {p.addProduct}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={p.search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">{p.noProducts}</p>
                                <Button className="mt-4" asChild>
                                    <Link href={`/${language}/admin/products/new`}>{p.addFirst}</Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{p.table.product}</TableHead>
                                        <TableHead className="hidden md:table-cell">{p.table.category}</TableHead>
                                        <TableHead className="w-[100px]">{p.table.price}</TableHead>
                                        <TableHead className="hidden lg:table-cell">{p.table.source}</TableHead>
                                        <TableHead>{p.table.status}</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="whitespace-normal min-w-[150px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                                                        {product.images?.[0] && (
                                                            <img
                                                                src={product.images?.[0]}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm leading-tight line-clamp-2">{product.title}</p>
                                                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                                            {product.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="secondary" className="whitespace-nowrap">
                                                    {/* @ts-ignore */}
                                                    {t.adminPanel?.products?.categories?.[product.category] || getCategoryLabel(product.category)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-sm whitespace-nowrap">{product.salePrice || product.price} {t.adminPanel?.dashboard?.currency}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    {product.source?.url ? (
                                                        <a
                                                            href={product.source.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 p-1 px-2 h-7 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                                                            title={p.source_badges?.openSource || "Open source (Wordwall/Genially/Tpt)"}
                                                        >
                                                            <ExternalLink className="h-3.3 w-3.3" />
                                                            {product.source.url.includes('wordwall') ? 'Wordwall' :
                                                                product.source.url.includes('genial.ly') ? 'Genially' : 'Source'}
                                                        </a>
                                                    ) : (
                                                        <>
                                                            <Badge variant="outline" className="p-1 px-1.5 h-6 bg-blue-50 text-blue-600 border-blue-100" title={t.adminPanel?.products?.source_badges?.wordpress || "WordPress / Publigo"}>
                                                                W
                                                            </Badge>
                                                            <Badge variant="outline" className="p-1 px-1.5 h-6 bg-orange-50 text-orange-600 border-orange-100" title={t.adminPanel?.products?.source_badges?.tpt || "Teachers Pay Teachers"}>
                                                                T
                                                            </Badge>
                                                        </>
                                                    )}
                                                    {product.source?.aiEnhanced && (
                                                        <Badge variant="outline" className="p-1 px-1.5 h-6 bg-purple-50 text-purple-600 border-purple-100" title={t.adminPanel?.products?.source_badges?.ai_optimized || "Zoptymalizowane przez AI"}>
                                                            <Zap className="h-3 w-3" />
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {product.source?.embedHtml && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                            onClick={() => {
                                                                setPreviewProduct(product);
                                                                setShowPreviewDialog(true);
                                                            }}
                                                            title={p.preview?.interactivePreview || "Interactive preview"}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Badge
                                                        variant={product.status === "published" ? "default" : "secondary"}
                                                        className={cn("text-[10px] h-5 px-1.5", product.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : "")}
                                                    >
                                                        {product.status === "published" ? p.status.published : p.status.draft}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/${language}/admin/products/${product.id}`}>
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                {p.actions.edit}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/${language}/dashboard/view/${product.slug}`} target="_blank">
                                                                <Eye className="h-4 w-4 mr-2 text-indigo-500" />
                                                                {p.actions.viewAccess}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => {
                                                            const origin = typeof window !== 'undefined' ? window.location.origin : '';
                                                            const link = `${origin}/pay/${product.slug}`;
                                                            navigator.clipboard.writeText(link);
                                                            toast.success(p.toasts.linkCopied.replace("{link}", link));
                                                        }}>
                                                            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                                                            {p.actions.copyLink}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toggleStatus(product.id)}>
                                                            {product.status === "published" ? (
                                                                <>
                                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                                    {p.actions.hide}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    {p.actions.publish}
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => deleteProduct(product.id)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            {p.actions.delete}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Interactive Preview Dialog */}
                <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white border-slate-200 rounded-[2.5rem] shadow-2xl">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-slate-900 font-black text-xl">{previewProduct?.title}</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">
                                        Interactive preview (Wordwall / Genially)
                                    </DialogDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowPreviewDialog(false)} className="text-slate-400 hover:text-slate-600 rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="relative w-full overflow-hidden bg-slate-100" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                            {previewProduct?.source?.embedHtml ? (
                                <div
                                    className="absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-8"
                                    dangerouslySetInnerHTML={{
                                        __html: previewProduct.source.embedHtml
                                            .replace(/width="\d+"/, 'width="100%"')
                                            .replace(/height="\d+"/, 'height="100%"')
                                            .replace(/style="[^"]*"/, 'style="width: 100%; height: 100%; border: none; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);"')
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-medium p-12 text-center">
                                    <EyeOff className="h-12 w-12 mb-4 opacity-20" />
                                    <p>{p.preview?.noPreview || "No interactive preview available for this product."}</p>
                                    <p className="text-sm mt-2">{p.preview?.onlyExternal || "Preview is available only for products imported from external platforms."}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowPreviewDialog(false)} className="rounded-xl font-bold">
                                {p.actions?.close || "Close"}
                            </Button>
                            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold px-8 shadow-lg shadow-indigo-100" asChild>
                                <Link href={`/${language}/admin/products/${previewProduct?.id}`}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    {p.actions?.edit || "Edit Product"}
                                </Link>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </NamespaceGuard>
    );
}
