"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlogPost, BLOG_CATEGORIES, ALL_BLOG_POSTS } from "@/lib/blog-schema";
import { Calendar, User, ArrowRight, Search, Clock, BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "admin_blog_posts";

export function BlogView() {
    const { t, language } = useLanguage();
    const blog = t?.blog;
    const blogTitle = blog?.title || "Blog";
    const blogSubtitle = blog?.subtitle || "Inspiracje, metodyka i materiały dla nauczycieli języka angielskiego";
    const blogEmpty = blog?.empty || "Brak artykułów pasujących do wybranych filtrów.";
    const blogReadMore = blog?.readMore || "Czytaj dalej";

    const defaultPosts = ALL_BLOG_POSTS.filter((p) => p.status === "published");
    const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");

    useEffect(() => {
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
        return new Date(dateString).toLocaleDateString(language === "pl" ? "pl-PL" : "en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Compute categories that actually have posts
    const usedCategories = useMemo(() => {
        const cats = new Set(posts.map((p) => p.category));
        return BLOG_CATEGORIES.filter((c) => cats.has(c.value));
    }, [posts]);

    // Filter posts by search + category
    const filteredPosts = useMemo(() => {
        let result = posts;
        if (activeCategory !== "all") {
            result = result.filter((p) => p.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.excerpt.toLowerCase().includes(q) ||
                    p.tags.some((tag) => tag.toLowerCase().includes(q))
            );
        }
        return result;
    }, [posts, activeCategory, searchQuery]);

    // Featured post = first/newest published
    const featuredPost = filteredPosts[0];
    const restPosts = filteredPosts.slice(1);

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/5 via-primary/3 to-background py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                        <BookOpen className="h-4 w-4" />
                        {language === "pl" ? "Wiedza i inspiracje" : "Knowledge & Inspiration"}
                    </div>
                    <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        {blogTitle}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {blogSubtitle}
                    </p>

                    {/* Search */}
                    <div className="mt-8 max-w-lg mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={language === "pl" ? "Szukaj artykułów..." : "Search articles..."}
                            className="pl-10 pr-10 h-12 rounded-full border-border/60 bg-background shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Category filter */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={cn(
                                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                                activeCategory === "all"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            {language === "pl" ? "Wszystkie" : "All"}
                        </button>
                        {usedCategories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={cn(
                                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                                    activeCategory === cat.value
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-24">
                            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">{blogEmpty}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                            >
                                {language === "pl" ? "Wyczyść filtry" : "Clear filters"}
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Featured post (first) */}
                            {featuredPost && (
                                <Link href={`/${language}/blog/${featuredPost.slug}`} className="group block mb-12">
                                    <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-muted">
                                            <img
                                                src={featuredPost.featuredImage}
                                                alt={featuredPost.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center p-8 lg:p-12 bg-card">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Badge variant="default" className="rounded-full">
                                                    {getCategoryLabel(featuredPost.category)}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                                    {language === "pl" ? "Wyróżniony artykuł" : "Featured"}
                                                </span>
                                            </div>
                                            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-4">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-4 w-4" />
                                                    {featuredPost.author}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                                                </div>
                                                {featuredPost.readingTime && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4" />
                                                        {featuredPost.readingTime} min
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                                                {blogReadMore}
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Rest of posts grid */}
                            {restPosts.length > 0 && (
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {restPosts.map((post) => (
                                        <Link key={post.id} href={`/${language}/blog/${post.slug}`}>
                                            <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                                                <div className="aspect-[16/9] overflow-hidden bg-muted">
                                                    <img
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                <CardHeader className="pb-2">
                                                    <Badge variant="secondary" className="w-fit rounded-full text-xs">
                                                        {getCategoryLabel(post.category)}
                                                    </Badge>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <h2 className="font-serif text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                                        {post.title}
                                                    </h2>
                                                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(post.publishedAt || post.createdAt)}
                                                        </div>
                                                        {post.readingTime && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {post.readingTime} min
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Tags */}
                                                    {post.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 pt-1">
                                                            {post.tags.slice(0, 3).map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                                                                >
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
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

                            {/* Post count */}
                            <p className="text-center text-sm text-muted-foreground mt-12">
                                {language === "pl"
                                    ? `Wyświetlono ${filteredPosts.length} z ${posts.length} artykułów`
                                    : `Showing ${filteredPosts.length} of ${posts.length} articles`}
                            </p>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
