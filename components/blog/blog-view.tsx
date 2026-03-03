"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlogPost, BLOG_CATEGORIES, SAMPLE_BLOG_POSTS } from "@/lib/blog-schema";
import { Calendar, User, ArrowRight } from "lucide-react";

const STORAGE_KEY = "admin_blog_posts";

export function BlogView() {
    const { t, language } = useLanguage();
    const blog = t?.blog;
    const blogTitle = blog?.title || "Blog";
    const blogSubtitle = blog?.subtitle || "";
    const blogEmpty = blog?.empty || "Brak artykułów.";
    const blogReadMore = blog?.readMore || "Czytaj dalej";
    // Initialize immediately with sample posts so blog renders on first load (SSR + CSR)
    const defaultPosts = SAMPLE_BLOG_POSTS.filter((p) => p.status === "published");
    const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Override with admin-created posts from localStorage if they exist
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const allPosts: BlogPost[] = JSON.parse(stored);
                const published = allPosts.filter((p) => p.status === "published");
                if (published.length > 0) {
                    setPosts(published);
                }
            } catch {
                // Keep default posts on parse error
            }
        }
    }, []);

    const getCategoryLabel = (value: string) => {
        return BLOG_CATEGORIES.find((c) => c.value === value)?.label || value;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language, {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        {blogTitle}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {blogSubtitle}
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">{blogEmpty}</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <Link key={post.id} href={`/${language}/blog/${post.slug}`}>
                                    <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div className="aspect-[16/9] overflow-hidden bg-muted">
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <CardHeader className="pb-2">
                                            <Badge variant="secondary" className="w-fit">
                                                {getCategoryLabel(post.category)}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <h2 className="font-serif text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {post.author}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(post.publishedAt || post.createdAt)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-primary text-sm font-medium pt-2 group-hover:gap-2 transition-all">
                                                {blogReadMore}
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
