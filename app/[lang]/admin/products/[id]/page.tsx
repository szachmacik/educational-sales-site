"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, NamespaceGuard } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Product, PRODUCT_CATEGORIES } from "@/lib/product-schema";
import { ArrowLeft, Save, Loader2, Wand2, Trash2, ImagePlus, X, Search, ExternalLink } from "lucide-react";

const STORAGE_KEY = "admin_products";

export default function EditProductPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
    const { lang, id: productId } = React.use(params);
    const { t, language, formatPrice } = useLanguage();
    const router = useRouter();

    // @ts-ignore
    const dictionary = translations[lang] || translations['pl'] || {};
    const p = (t.adminPanel?.products as any) || {};
    const common = t.adminSettings?.common || {};

    const [isLoading, setIsLoading] = useState(false);
    const [isRewriting, setIsRewriting] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        shortDescription: "",
        price: "",
        salePrice: "",
        category: "",
        tags: "",
        published: false,
        imageUrl: "",
        metaTitle: "",
        metaDescription: "",
        slug: "",
        sourceUrl: "",
    });

    const [performance, setPerformance] = useState({ revenue: 0, salesCount: 0, conversionRate: 0 });

    useEffect(() => {
        const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const product = products.find((p) => p.id === productId);

        if (product) {
            setFormData({
                title: product.title,
                description: product.description,
                shortDescription: product.shortDescription || "",
                price: product.price.toString(),
                salePrice: product.salePrice?.toString() || "",
                category: product.category,
                tags: product.tags.join(", "),
                published: product.status === "published",
                imageUrl: "",
                metaTitle: "",
                metaDescription: "",
                slug: product.slug,
                sourceUrl: product.source?.url || "",
            });
            setImages(product.images);

            // Calculate sales stats
            const orders = JSON.parse(localStorage.getItem("admin_orders") || "[]");
            const productOrders = orders.filter((o: any) =>
                o.status === "completed" && o.items.some((item: any) => item.productId === productId)
            );

            const revenue = productOrders.reduce((sum: number, o: any) => {
                const item = o.items.find((i: any) => i.productId === productId);
                return sum + (item.price * item.quantity);
            }, 0);

            setPerformance({
                revenue,
                salesCount: productOrders.length,
                conversionRate: productOrders.length > 0 ? 4.2 : 0
            });
        } else {
            setNotFound(true);
        }
    }, [productId]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addImage = () => {
        if (formData.imageUrl && !images.includes(formData.imageUrl)) {
            setImages((prev) => [...prev, formData.imageUrl]);
            setFormData((prev) => ({ ...prev, imageUrl: "" }));
        }
    };

    const removeImage = (url: string) => {
        setImages((prev) => prev.filter((img) => img !== url));
    };

    const rewriteWithAI = async () => {
        if (!formData.description) return;
        setIsRewriting(true);

        await new Promise((r) => setTimeout(r, 2000));

        setFormData((prev) => ({
            ...prev,
            description: `✨ BESTSELLER for teachers! ✨\n\n${prev.description}\n\n📚 What you get:\n• Instant access to materials\n• PDF format – ready to print\n• Detailed teacher instructions\n\n⭐ Recommended by hundreds of teachers!`,
        }));

        setIsRewriting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const updatedProducts = products.map((product) =>
            product.id === productId
                ? {
                    ...product,
                    title: formData.title,
                    description: formData.description,
                    shortDescription: formData.shortDescription || undefined,
                    price: parseFloat(formData.price) || 0,
                    salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
                    images: images.length > 0 ? images : product.images,
                    category: formData.category,
                    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                    status: formData.published ? "published" as const : "draft" as const,
                    updatedAt: new Date().toISOString(),
                    source: {
                        ...product.source,
                        url: formData.sourceUrl || product.source?.url,
                    }
                }
                : product
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
        await new Promise((r) => setTimeout(r, 500));
        setIsLoading(false);
        router.push(`/${language}/admin/products`);
    };

    const handleDelete = () => {
        if (!confirm(common.delete_confirm || "Are you sure?")) return;
        const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const filtered = products.filter((p) => p.id === productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        router.push(`/${language}/admin/products`);
    };

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-bold mb-4">{p.details?.notFound || "Product not found"}</h1>
                <Button asChild>
                    <Link href={`/${language}/admin/products`}>{p.details?.back || "Back to list"}</Link>
                </Button>
            </div>
        );
    }

    return (
        <NamespaceGuard dictionary={dictionary}>
            <div className="max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${language}/admin/products`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{p.details?.edit_title || "Edit Product"}</h1>
                        <p className="text-muted-foreground">{p.details?.edit_subtitle || "Edit existing digital product"}</p>
                    </div>
                    <Button variant="outline" onClick={handleDelete} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-emerald-50 border-emerald-100">
                        <CardContent className="pt-4">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Total Revenue</p>
                            <p className="text-xl font-black text-emerald-900">{formatPrice ? formatPrice(performance.revenue) : `€${performance.revenue}`}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-100">
                        <CardContent className="pt-4">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Units Sold</p>
                            <p className="text-xl font-black text-blue-900">{performance.salesCount}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-indigo-50 border-indigo-100">
                        <CardContent className="pt-4">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Conversion Rate</p>
                            <p className="text-xl font-black text-indigo-900">{performance.conversionRate}%</p>
                        </CardContent>
                    </Card>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{p.details?.basic_info || "Basic Information"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{p.details?.title_label || "Product Title"}</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{p.details?.short_desc_label || "Short Description"}</Label>
                                <Input
                                    value={formData.shortDescription}
                                    onChange={(e) => handleChange("shortDescription", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>{p.details?.full_desc_label || "Full Description"}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={rewriteWithAI}
                                        disabled={isRewriting}
                                    >
                                        {isRewriting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Wand2 className="h-4 w-4 mr-1" />
                                                {p.details?.rewrite_ai || "Rewrite with AI"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    rows={8}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{p.details?.pricing || "Pricing"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{p.details?.regular_price || "Regular Price"} (EUR)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{p.details?.sale_price || "Sale Price"} (EUR)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.salePrice}
                                        onChange={(e) => handleChange("salePrice", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{p.details?.category_tags || "Category & Tags"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={p.details?.select_category || "Select category"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRODUCT_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="space-y-2">
                                <Label>{p.details?.tags_label || "Tags"}</Label>
                                <Input
                                    value={formData.tags}
                                    onChange={(e) => handleChange("tags", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Source & Traceability */}
                    <Card className="border-indigo-100 bg-indigo-50/20">
                        <CardHeader className="pb-3 text-indigo-900">
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                <CardTitle className="text-sm font-black uppercase tracking-widest">{p.details?.source_title || "Source & Traceability"}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Source URL (Wordwall/Genially/TPT)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.sourceUrl}
                                        onChange={(e) => handleChange("sourceUrl", e.target.value)}
                                        placeholder="https://wordwall.net/resource/..."
                                        className="border-indigo-200 focus:ring-indigo-500"
                                    />
                                    {formData.sourceUrl && (
                                        <Button variant="outline" size="icon" asChild className="shrink-0 border-indigo-200 text-indigo-600 bg-white">
                                            <a href={formData.sourceUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                                <p className="text-[10px] text-indigo-400 font-medium">Link to the original content for AI sync and internal tracking</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{p.details?.images || "Images"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://kamila.shor.dev/image.jpg"
                                    value={formData.imageUrl}
                                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                                />
                                <Button type="button" variant="outline" onClick={addImage}>
                                    <ImagePlus className="h-4 w-4" />
                                </Button>
                            </div>
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {images.map((url, i) => (
                                        <div key={i} className="relative group">
                                            <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(url)}
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status & Submit */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Switch
                                        checked={formData.published}
                                        onCheckedChange={(checked) => handleChange("published", checked)}
                                    />
                                    <Label>{formData.published ? (p.status?.published || "Published") : (p.status?.draft || "Draft")}</Label>
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                    {p.details?.save_changes || "Save changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </NamespaceGuard>
    );
}
