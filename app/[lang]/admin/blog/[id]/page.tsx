"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RichEditor } from "@/components/admin/rich-editor";
import { BlogPost, BLOG_CATEGORIES } from "@/lib/blog-schema";
import { ArrowLeft, Save, Loader2, Wand2, Eye, Search, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const STORAGE_KEY = "admin_blog_posts";

export default function EditBlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const { t, language } = useLanguage();
    const b = t.adminPanel?.blog?.form || {};
    const postId = params?.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [notFound, setNotFound] = useState(false);
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
        slug: "",
    });

    useEffect(() => {
        const posts: BlogPost[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const post = posts.find((p) => p.id === postId);

        if (post) {
            setFormData({
                title: post.title,
                content: post.content,
                excerpt: post.excerpt,
                featuredImage: post.featuredImage,
                category: post.category,
                tags: post.tags.join(", "),
                published: post.status === "published",
                metaTitle: post.seo.metaTitle,
                metaDescription: post.seo.metaDescription,
                slug: post.slug,
            });
        } else {
            setNotFound(true);
        }
    }, [postId]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const generateSEO = async () => {
        setIsGenerating(true);
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

        const posts: BlogPost[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const updatedPosts = posts.map((post) =>
            post.id === postId
                ? {
                    ...post,
                    title: formData.title,
                    content: formData.content,
                    excerpt: formData.excerpt,
                    featuredImage: formData.featuredImage,
                    category: formData.category,
                    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                    status: formData.published ? "published" as const : "draft" as const,
                    seo: {
                        metaTitle: formData.metaTitle,
                        metaDescription: formData.metaDescription,
                        ogImage: formData.featuredImage,
                    },
                    updatedAt: new Date().toISOString(),
                    publishedAt: formData.published && !post.publishedAt
                        ? new Date().toISOString()
                        : post.publishedAt,
                }
                : post
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
        await new Promise((r) => setTimeout(r, 500));
        setIsLoading(false);
        router.push(`/${language}/admin/blog`);
    };

    const handleDelete = () => {
        if (!confirm(t.admin.blog.toasts.deleteConfirm)) return;
        const posts: BlogPost[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const filtered = posts.filter((p) => p.id !== postId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        router.push(`/${language}/admin/blog`);
    };

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-bold mb-4">{b.notFound}</h1>
                <Button asChild>
                    <Link href={`/${language}/admin/blog`}>{b.backToList}</Link>
                </Button>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">{b.editTitle}</h1>
                    <p className="text-muted-foreground">{b.editSubtitle}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDelete} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {b.delete}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/${language}/blog/${formData.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            {t.admin.blog.actions.preview}
                        </Link>
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {b.saveChanges}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <Input
                                placeholder={b.titlePlaceholder}
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0"
                            />
                        </CardContent>
                    </Card>

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
                    <Card>
                        <CardHeader>
                            <CardTitle>{b.statusTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Label>{formData.published ? t.admin.blog.status.published : t.admin.blog.status.draft}</Label>
                                <Switch
                                    checked={formData.published}
                                    onCheckedChange={(checked) => handleChange("published", checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

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
                                    <img src={formData.featuredImage} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                {b.seoTitle}
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={generateSEO} disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
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
                            </div>
                            <div className="space-y-2">
                                <Label>{b.metaDescLabel}</Label>
                                <Textarea
                                    placeholder={b.metaDescPlaceholder}
                                    value={formData.metaDescription}
                                    onChange={(e) => handleChange("metaDescription", e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
