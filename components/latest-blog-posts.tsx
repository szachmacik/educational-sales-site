"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { SAMPLE_BLOG_POSTS } from "@/lib/blog-schema";
import { useScrollReveal } from "@/hooks/use-intersection";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "metodyka": "bg-blue-100 text-blue-700",
  "methodology": "bg-blue-100 text-blue-700",
  "metodика": "bg-blue-100 text-blue-700",
  "materiały": "bg-purple-100 text-purple-700",
  "materials": "bg-purple-100 text-purple-700",
  "матеріали": "bg-purple-100 text-purple-700",
  "gry": "bg-green-100 text-green-700",
  "games": "bg-green-100 text-green-700",
  "ігри": "bg-green-100 text-green-700",
  "motywacja": "bg-orange-100 text-orange-700",
  "motivation": "bg-orange-100 text-orange-700",
  "мотивація": "bg-orange-100 text-orange-700",
  "technologia": "bg-cyan-100 text-cyan-700",
  "technology": "bg-cyan-100 text-cyan-700",
  "технологія": "bg-cyan-100 text-cyan-700",
};

export function LatestBlogPosts() {
  const { t, language } = useLanguage();
  const reveal = useScrollReveal({ threshold: 0.1 });

  // Get 3 latest published posts
  const posts = SAMPLE_BLOG_POSTS
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (posts.length === 0) return null;

  const sectionTitle = language === 'pl'
    ? "Najnowsze artykuły"
    : language === 'uk'
    ? "Останні статті"
    : "Latest Articles";

  const sectionSub = language === 'pl'
    ? "Praktyczne wskazówki i inspiracje dla nauczycieli"
    : language === 'uk'
    ? "Практичні поради та натхнення для вчителів"
    : "Practical tips and inspiration for teachers";

  const viewAllLabel = language === 'pl'
    ? "Zobacz wszystkie artykuły"
    : language === 'uk'
    ? "Переглянути всі статті"
    : "View all articles";

  const readMoreLabel = language === 'pl'
    ? "Czytaj więcej"
    : language === 'uk'
    ? "Читати далі"
    : "Read more";

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={reveal.ref} className={cn("flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4", reveal.className)}>
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-1 sm:text-4xl">
              {sectionTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">{sectionSub}</p>
          </div>
          <Link href={`/${language}/blog`}>
            <Button variant="outline" className="flex-shrink-0">
              {viewAllLabel}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => {
            const categoryColor = CATEGORY_COLORS[post.category?.toLowerCase()] || "bg-slate-100 text-slate-600";
            return (
              <Link key={post.slug} href={`/${language}/blog/${post.slug}`}>
                <Card
                  className={cn(
                    "group h-full overflow-hidden border-border hover:border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient header instead of image */}
                  <div className={cn(
                    "h-40 flex items-end p-4",
                    index === 0
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                      : index === 1
                      ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                      : "bg-gradient-to-br from-violet-500 to-pink-600"
                  )}>
                    <Badge className={cn("text-xs font-medium border-0", categoryColor)}>
                      <Tag className="h-3 w-3 mr-1" />
                      {post.category}
                    </Badge>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-serif font-bold text-foreground leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime ? `${post.readingTime} min` : "5 min"}</span>
                      </div>
                      <span className="text-indigo-600 font-medium group-hover:underline">
                        {readMoreLabel} →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
