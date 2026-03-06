import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { BlogPost, BLOG_CATEGORIES, ALL_BLOG_POSTS } from "@/lib/blog-schema";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import fs from 'fs/promises';
import path from 'path';

const STORAGE_KEY = "admin_blog_posts";

async function getDictionary(lang: string, namespace: string = 'common') {
    const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

// Get post data (server-side uses sample data, client hydrates from localStorage)
function getPost(slug: string): BlogPost | null {
    // For SSR/SSG, use sample data
    const post = ALL_BLOG_POSTS.find(
        (p) => p.slug === slug && p.status === "published"
    );
    return post || null;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) {
        return { title: "Not found" };
    }

    return {
        title: post.seo.metaTitle || post.title,
        description: post.seo.metaDescription || post.excerpt,
        openGraph: {
            title: post.seo.metaTitle || post.title,
            description: post.seo.metaDescription || post.excerpt,
            images: post.seo.ogImage ? [post.seo.ogImage] : [post.featuredImage],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: post.seo.metaTitle || post.title,
            description: post.seo.metaDescription || post.excerpt,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string, lang: string }>;
}) {
    const { slug, lang } = await params;
    const post = getPost(slug);
    const commonDict = await getDictionary(lang);
    const blogDict = await getDictionary(lang, 'blog');
    const t = { ...commonDict, ...blogDict };

    if (!post) {
        notFound();
    }

    const getCategoryLabel = (value: string) => {
        return BLOG_CATEGORIES.find((c) => c.value === value)?.label || value;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang, {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // JSON-LD Schema for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.featuredImage,
        author: {
            "@type": "Person",
            name: post.author,
        },
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1">
                    {/* Hero with Featured Image */}
                    <section className="relative h-[40vh] min-h-[300px] bg-muted">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.featuredImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="mx-auto max-w-3xl">
                                <Badge variant="secondary" className="mb-4">
                                    {getCategoryLabel(post.category)}
                                </Badge>
                                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {post.title}
                                </h1>
                                <div className="flex items-center gap-4 mt-4 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {post.author}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(post.publishedAt || post.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content */}
                    <article className="py-12">
                        <div className="mx-auto max-w-3xl px-4 sm:px-6">
                            {/* Back Link */}
                            <Link
                                href={`/${lang}/blog`}
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {t.blog.backToBlog}
                            </Link>

                            {/* Article Content */}
                            <div
                                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-primary"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t">
                                    {post.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                             {/* Share */}
                             <div className="flex items-center gap-4 mt-8 pt-8 border-t">
                                 <span className="text-sm text-muted-foreground font-bold">{t.blog.share}</span>
                                 <div className="flex gap-2">
                                     <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-sky-50 hover:text-sky-600 transition-colors" asChild>
                                         <a
                                             href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://kamilaenglish.com/${lang}/blog/${post.slug}`)}`}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                         >
                                             Twitter
                                         </a>
                                     </Button>
                                     <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-colors" asChild>
                                         <a
                                             href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://kamilaenglish.com/${lang}/blog/${post.slug}`)}`}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                         >
                                             Facebook
                                         </a>
                                     </Button>
                                 </div>
                             </div>
                         </div>
                     </article>

                     {/* Related Posts */}
                     <section className="py-16 bg-slate-50 border-t border-slate-100">
                         <div className="mx-auto max-w-5xl px-4 sm:px-6">
                             <div className="flex items-center justify-between mb-8">
                                 <div>
                                     <h2 className="text-2xl font-serif font-bold text-slate-900">{t.blog.relatedPosts || "Zobacz również"}</h2>
                                     <p className="text-sm text-slate-500 mt-1">Inspiracje dopasowane do Twoich zainteresowań</p>
                                 </div>
                                 <Link href={`/${lang}/blog`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                                     {t.blog.allPosts || "Wszystkie wpisy"}
                                     <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                 </Link>
                             </div>

                             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {ALL_BLOG_POSTS
                                     .filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
                                     .slice(0, 3)
                                     .map((rp) => (
                                         <Link key={rp.id} href={`/${lang}/blog/${rp.slug}`} className="group h-full">
                                             <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                                 <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                                                     <div
                                                         className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                                         style={{ backgroundImage: `url(${rp.featuredImage})` }}
                                                     />
                                                     <div className="absolute top-3 left-3">
                                                         <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none shadow-sm capitalize">
                                                             {getCategoryLabel(rp.category)}
                                                         </Badge>
                                                     </div>
                                                 </div>
                                                 <div className="p-5 flex-1 flex flex-col">
                                                     <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                                         {rp.title}
                                                     </h3>
                                                     <p className="text-xs text-slate-500 line-clamp-2 mt-auto">
                                                         {rp.excerpt}
                                                     </p>
                                                 </div>
                                             </div>
                                         </Link>
                                     ))}
                             </div>
                         </div>
                     </section>
                 </main>


                <Footer />
            </div>
        </>
    );
}
