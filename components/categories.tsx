"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, FileText, Sparkles, BookOpen, Theater, Gamepad2 } from "lucide-react";
import { PRODUCTS, CATEGORY_COLORS, getProductImage } from "@/lib/product-catalog";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-intersection";

// Get first product image for each category
const getFirstProductImageForCategory = (cat: string) => {
  const product = PRODUCTS.find(p => p.categories?.includes(cat));
  return product ? getProductImage(product) : "/placeholder.svg";
};

// Count products in category
const countCategory = (cat: string) => PRODUCTS.filter(p => p.categories?.includes(cat)).length;

export function Categories() {
  const { t, language } = useLanguage();
  const reveal = useScrollReveal({ threshold: 0.1 });

  const categories = [
    {
      id: "zlobek",
      icon: Package,
      gradient: "from-blue-400 to-indigo-500",
      bgGradient: "from-blue-400/10 to-indigo-500/10",
      count: countCategory('zlobek'),
    },
    {
      id: "przedszkole",
      icon: Package,
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-400/10 to-red-500/10",
      count: countCategory('przedszkole'),
    },
    {
      id: "klasy-1-3",
      icon: Package,
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-400/10 to-emerald-500/10",
      count: countCategory('klasy-1-3'),
    },
    {
      id: "klasy-4-6",
      icon: Package,
      gradient: "from-purple-400 to-violet-500",
      bgGradient: "from-purple-400/10 to-violet-500/10",
      count: countCategory('klasy-4-6'),
    },
    {
      id: "klasy-7-8",
      icon: Package,
      gradient: "from-gray-400 to-slate-500",
      bgGradient: "from-gray-400/10 to-slate-500/10",
      count: countCategory('klasy-7-8'),
    },
    {
      id: "mega-pack",
      icon: Package,
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-500/10 to-rose-600/10",
      count: countCategory('mega-pack'),
    },
    {
      id: "scenariusze",
      icon: FileText,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-500/10 to-green-600/10",
      count: countCategory('scenariusze'),
    },
    {
      id: "special-lessons",
      icon: Sparkles,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-600/10",
      count: countCategory('special-lessons'),
    },
    {
      id: "speakbook",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-600/10",
      count: countCategory('speakbook'),
    },
    {
      id: "stories",
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 to-purple-600/10",
      count: countCategory('stories'),
    },
    {
      id: "teatr",
      icon: Theater,
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-500/10 to-rose-600/10",
      count: countCategory('teatr') + countCategory('gry'),
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={reveal.ref} className={cn("mb-16 text-center", reveal.className)}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Package className="h-4 w-4" />
            {t.categories.badge}
          </div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-5xl pb-1">
            {t.categories.header}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t.categories.sub}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const productImage = getFirstProductImageForCategory(category.id);
            const Icon = category.icon;
            // Get translation for this category
            const trans = (t.categories.items as any)[category.id];
            const title = trans?.title || category.id;
            const description = trans?.description || "";
            const label = trans?.label || "";

            return (
              <Link
                key={category.id}
                href={`/${language}/products?category=${category.id}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/50",
                  "bg-gradient-to-br", category.bgGradient,
                  "transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-border premium-card-ring hover-lift"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Preview Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={productImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent",
                    "opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                  )} />

                  {/* Icon Badge */}
                  <div className={cn(
                    "absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl",
                    "bg-gradient-to-br", category.gradient,
                    "shadow-lg transition-transform duration-300 group-hover:scale-110"
                  )}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                    <span className="text-sm font-bold text-foreground">{category.count}</span>
                    <span className="text-sm text-muted-foreground ml-1">{label}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-card/80 backdrop-blur-sm">
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                    <span>{t.categories.browse}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA to see all products */}
        <div className="mt-12 text-center">
          <Link
            href={`/${language}/products`}
            className={cn(
              "inline-flex items-center gap-3 px-8 py-4 rounded-full",
              "bg-gradient-to-r from-primary to-primary/80",
              "text-primary-foreground font-semibold text-lg",
              "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
              "transition-all duration-300 hover:scale-105"
            )}
          >
            <span>{t.categories.viewCatalog}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
