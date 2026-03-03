"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogPost, BLOG_CATEGORIES, SAMPLE_BLOG_POSTS } from "@/lib/blog-schema";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    FileText,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

import { toast } from "sonner";
const STORAGE_KEY = "admin_blog_posts";

export default function BlogListPage() {
    const { t, language } = useLanguage();
    const b = t.adminPanel?.blog || {};
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setPosts(JSON.parse(stored));
        } else {
            setPosts(SAMPLE_BLOG_POSTS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_BLOG_POSTS));
        }
        setLoading(false);
    }, []);

    const toggleStatus = (id: string) => {
        const updated = posts.map((p) =>
            p.id === id
                ? {
                    ...p,
                    status: (p.status === "published" ? "draft" : "published") as "draft" | "published",
                    publishedAt: p.status === "draft" ? new Date().toISOString() : p.publishedAt,
                }
                : p
        );
        setPosts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const deletePost = (id: string) => {
        if (!confirm(b.toasts.deleteConfirm)) return;
        const updated = posts.filter((p) => p.id !== id);
        setPosts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const filteredPosts = useMemo(() => {
        return posts.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [posts, search]);

    const getCategoryLabel = (value: string) => {
        // @ts-ignore - dynamic key access
        return b.categories?.[value] || BLOG_CATEGORIES.find((c) => c.value === value)?.label || value;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{b.title || "Blog"}</h1>
                    <p className="text-muted-foreground">{b.subtitle}</p>
                </div>
                <Button asChild>
                    <Link href={`/${language}/admin/blog/new`}>
                        <Plus className="h-4 w-4 mr-2" />
                        {b.newPost || b.form?.createTitle || "New Post"}
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={b.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Posts Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">{b.empty}</p>
                            <Button className="mt-4" asChild>
                                <Link href={`/${language}/admin/blog/new`}>{b.writeFirst}</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-auto">{b.table?.title}</TableHead>
                                    <TableHead className="hidden md:table-cell">{b.table?.category}</TableHead>
                                    <TableHead className="w-[100px]">{b.table?.status}</TableHead>
                                    <TableHead className="hidden lg:table-cell text-right">{b.table?.date}</TableHead>
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPosts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="whitespace-normal min-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-14 rounded-lg bg-muted overflow-hidden shrink-0">
                                                    {post.featuredImage && (
                                                        <img
                                                            src={post.featuredImage}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm leading-tight line-clamp-2">{post.title}</p>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                                        {post.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant="secondary" className="whitespace-nowrap">{getCategoryLabel(post.category)}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={post.status === "published" ? "default" : "secondary"}
                                                className={cn(
                                                    "text-[10px] h-5 px-1.5",
                                                    post.status === "published"
                                                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                        : ""
                                                )}
                                            >
                                                {post.status === "published" ? b.status?.published : b.status?.draft}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-right">
                                            <div className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(post.publishedAt || post.createdAt)}
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
                                                        <Link href={`/${language}/admin/blog/${post.id}`}>
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            {b.actions?.edit}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/${language}/blog/${post.slug}`} target="_blank">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            {b.actions?.preview}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleStatus(post.id)}>
                                                        {post.status === "published" ? (
                                                            <>
                                                                <EyeOff className="h-4 w-4 mr-2" />
                                                                {b.actions?.hide}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                {b.actions?.publish}
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => deletePost(post.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        {b.actions?.delete}
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
        </div>
    );
}
