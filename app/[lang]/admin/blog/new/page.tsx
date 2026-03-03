"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichEditor } from "@/components/admin/rich-editor";
import { BlogPost, BLOG_CATEGORIES, generateBlogId, generateBlogSlug } from "@/lib/blog-schema";
import { ArrowLeft, Save, Loader2, Wand2, Eye, Search } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const STORAGE_KEY = "admin_blog_posts";

export default function NewBlogPostPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const b = t.adminPanel?.blog?.form || {};
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        category: "",
        tags: "",
        published: false,
        metaTitle: "",
        metaDescription: "",
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const generateSEO = async () => {
        if (!formData.title) {
            toast.error(b.titleRequired);
            return;
        }
        setIsGenerating(true);

        // Simulate AI generation
        await new Promise((r) => setTimeout(r, 1500));

        setFormData((prev) => ({
            ...prev,
            metaTitle: `${prev.title} | Sklep Blog`,
            metaDescription: prev.excerpt || `Read article: ${prev.title}. Learn more on our blog.`,
        }));

        setIsGenerating(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newPost: BlogPost = {
            id: generateBlogId(),
            title: formData.title,
            slug: generateBlogSlug(formData.title),
            content: formData.content,
            excerpt: formData.excerpt,
            featuredImage: formData.featuredImage || "https://placehold.co/800x400",
            author: "Kamila Łobko-Koziej",
            category: formData.category || "inne",
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            status: formData.published ? "published" : "draft",
            seo: {
                metaTitle: formData.metaTitle || formData.title,
                metaDescription: formData.metaDescription || formData.excerpt,
                ogImage: formData.featuredImage || "",
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: formData.published ? new Date().toISOString() : undefined,
        };

        const existingPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingPosts, newPost]));

        await new Promise((r) => setTimeout(r, 500));
        setIsLoading(false);
        router.push(`/${language}/admin/blog`);
    };

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/${language}/admin/blog`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">{b.createTitle}</h1>
                    <p className="text-muted-foreground">{b.createSubtitle}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" type="button" asChild>
                        <Link href={`/${language}/blog/preview`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            {t.admin.blog.actions.preview}
                        </Link>
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {b.saving}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                {b.save}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <Card>
                        <CardContent className="pt-6">
                            <Input
                                placeholder={b.titlePlaceholder}
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                            />
                        </CardContent>
                    </Card>

                    {/* Content Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{b.contentTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RichEditor
                                value={formData.content}
                                onChange={(value) => handleChange("content", value)}
                                placeholder={b.contentPlaceholder}
                            />
                        </CardContent>
                    </Card>

                    {/* Excerpt */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{b.excerptTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder={b.excerptPlaceholder}
                                value={formData.excerpt}
                                onChange={(e) => handleChange("excerpt", e.target.value)}
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{b.statusTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="published">
                                    {formData.published ? t.admin.blog.status.published : t.admin.blog.status.draft}
                                </Label>
                                <Switch
                                    id="published"
                                    checked={formData.published}
                                    onCheckedChange={(checked) => handleChange("published", checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category & Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{b.categoryTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={b.categoryPlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {BLOG_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {t.admin.blog.categories[cat.value] || cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="space-y-2">
                                <Label>{b.tagsTitle}</Label>
                                <Input
                                    placeholder={b.tagsPlaceholder}
                                    value={formData.tags}
                                    onChange={(e) => handleChange("tags", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Featured Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{b.imageTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder={b.imagePlaceholder}
                                value={formData.featuredImage}
                                onChange={(e) => handleChange("featuredImage", e.target.value)}
                            />
                            {formData.featuredImage && (
                                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={formData.featuredImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                {b.seoTitle}
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={generateSEO}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Wand2 className="h-4 w-4 mr-1" />
                                        {b.generate}
                                    </>
                                )}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{b.metaTitleLabel}</Label>
                                <Input
                                    placeholder={b.metaTitlePlaceholder}
                                    value={formData.metaTitle}
                                    onChange={(e) => handleChange("metaTitle", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {b.charCount.replace("{count}", formData.metaTitle.length.toString()).replace("{max}", "60")}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>{b.metaDescLabel}</Label>
                                <Textarea
                                    placeholder={b.metaDescPlaceholder}
                                    value={formData.metaDescription}
                                    onChange={(e) => handleChange("metaDescription", e.target.value)}
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {b.charCount.replace("{count}", formData.metaDescription.length.toString()).replace("{max}", "160")}
                                </p>
                            </div>

                            {/* SEO Preview */}
                            {(formData.metaTitle || formData.metaDescription) && (
                                <div className="p-3 bg-muted rounded-lg space-y-1">
                                    <p className="text-xs text-muted-foreground">{b.seoPreview}</p>
                                    <p className="text-blue-600 text-sm font-medium line-clamp-1">
                                        {formData.metaTitle || formData.title}
                                    </p>
                                    <p className="text-xs text-green-700">kamilaenglish.com › blog</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {formData.metaDescription || formData.excerpt}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
