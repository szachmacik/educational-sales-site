"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, NamespaceGuard } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Product, PRODUCT_CATEGORIES, generateId, generateSlug } from "@/lib/product-schema";
import { ArrowLeft, Save, Loader2, ImagePlus, X } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "admin_products";

export default function NewProductPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const { t, language } = useLanguage();
    const router = useRouter();

    // @ts-ignore
    const dictionary = translations[lang] || translations['pl'] || {};
    const p = t.adminPanel?.products || {};
    const common = t.adminSettings?.common || {};
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        shortDescription: "",
        price: "",
        salePrice: "",
        category: "lesson-plans",
        teachingMode: "online" as 'online' | 'stationary' | 'hybrid',
        externalUrl: "",
        autoGenerateLesson: true,
        tags: "",
        published: false,
        imageUrl: "",
    });
    const [images, setImages] = useState<string[]>([]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newProduct: Product = {
            id: generateId(),
            title: formData.title,
            description: formData.description,
            shortDescription: formData.shortDescription || undefined,
            price: parseFloat(formData.price) || 0,
            salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
            images: images.length > 0 ? images : ["https://placehold.co/400x300"],
            category: formData.category || "other",
            teachingMode: formData.teachingMode,
            externalUrl: formData.externalUrl || undefined,
            autoGenerateLesson: formData.autoGenerateLesson,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            status: formData.published ? "published" : "draft",
            slug: generateSlug(formData.title),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Save to localStorage
        const existingProducts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingProducts, newProduct]));

        await new Promise((r) => setTimeout(r, 500));
        setIsLoading(false);
        router.push(`/${language}/admin/products`);
    };

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
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{p.details?.new_title || "New Product"}</h1>
                        <p className="text-muted-foreground">{p.details?.new_subtitle || "Add a new digital product to the store"}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{p.details?.basic_info || "Basic Information"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">{p.details?.title_label || "Product Title"} *</Label>
                                <Input
                                    id="title"
                                    placeholder={p.details?.title_placeholder || "e.g. Worksheet - Grammar A1"}
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shortDescription">{p.details?.short_desc_label || "Short Description"}</Label>
                                <Input
                                    id="shortDescription"
                                    placeholder={p.details?.short_desc_placeholder || "One-sentence product description"}
                                    value={formData.shortDescription}
                                    onChange={(e) => handleChange("shortDescription", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{p.details?.full_desc_label || "Full Description"} *</Label>
                                <Textarea
                                    id="description"
                                    placeholder={p.details?.full_desc_placeholder || "Detailed product description..."}
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
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
                                    <Label htmlFor="price">{p.details?.regular_price || "Regular Price"} (EUR) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="99.00"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salePrice">{p.details?.sale_price || "Sale Price"} (EUR)</Label>
                                    <Input
                                        id="salePrice"
                                        type="number"
                                        step="0.01"
                                        placeholder="79.00"
                                        value={formData.salePrice}
                                        onChange={(e) => handleChange("salePrice", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category & Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{p.details?.category_tags || "Category & Tags"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{p.details?.category_label || "Category"}</Label>
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
                            </div>

                            <div className="space-y-4 pt-2">
                                <Label>{p.details?.teaching_mode || "Teaching Mode"}</Label>
                                <Select
                                    value={formData.teachingMode}
                                    onValueChange={(value) => handleChange("teachingMode", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={p.details?.select_mode || "Select mode"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">{p.details?.mode_online || "Online"}</SelectItem>
                                        <SelectItem value="stationary">{p.details?.mode_stationary || "In-class"}</SelectItem>
                                        <SelectItem value="hybrid">{p.details?.mode_hybrid || "Hybrid"}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.category === 'games' && (
                                <div className="space-y-2 pt-2 border-t mt-4 border-slate-100">
                                    <Label htmlFor="externalUrl">{p.details?.external_url || "Link to game (e.g. Wordwall, Genially)"}</Label>
                                    <Input
                                        id="externalUrl"
                                        placeholder="https://wordwall.net/..."
                                        value={formData.externalUrl}
                                        onChange={(e) => handleChange("externalUrl", e.target.value)}
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <Switch
                                            id="autoGenerateLesson"
                                            checked={formData.autoGenerateLesson}
                                            onCheckedChange={(checked) => handleChange("autoGenerateLesson", checked)}
                                        />
                                        <Label htmlFor="autoGenerateLesson" className="text-xs font-normal">
                                            {p.details?.auto_generate_desc || "Automatically generate lesson structure based on material"}
                                        </Label>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="tags">{p.details?.tags_label || "Tags (separated by commas)"}</Label>
                                <Input
                                    id="tags"
                                    placeholder="grammar, a1, beginner"
                                    value={formData.tags}
                                    onChange={(e) => handleChange("tags", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{p.details?.images || "Images"}</CardTitle>
                            <CardDescription>{p.details?.images_desc || "Add product images (URL)"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://example.com/image.jpg"
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
                                            <img
                                                src={url}
                                                alt=""
                                                className="h-20 w-20 rounded-lg object-cover"
                                            />
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
                                        id="published"
                                        checked={formData.published}
                                        onCheckedChange={(checked) => handleChange("published", checked)}
                                    />
                                    <Label htmlFor="published">
                                        {formData.published ? (p.status?.published || "Published") : (p.status?.draft || "Draft")}
                                    </Label>
                                </div>

                                <Button type="submit" disabled={isLoading} className="gap-2">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {p.details?.saving || "Saving..."}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            {p.details?.save_product || "Save Product"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </NamespaceGuard>
    );
}
