"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Eye, Coins } from "lucide-react";
import { getProducts } from "@/lib/product-service";
import { useEffect, useState } from "react";
import { ProductWithSlug } from "@/lib/product-service";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_COLORS } from "@/lib/product-catalog";

export function Products() {
  const [products, setProducts] = useState<ProductWithSlug[]>([]);
  const { t, language, formatPrice } = useLanguage();
  const { addItem } = useCart();
  const { toast: toastUI } = useToast();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products with current language
    setLoading(true);
    const allProducts = getProducts(language);
    // Filter for "Bestsellers"
    const sorted = [...allProducts].sort((a, b) => b.price - a.price).slice(0, 8);
    setProducts(sorted);

    // Simulate slight delay for skeleton demo or handle async fetch if needed
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-4xl pb-1">
              {t.products.header}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {t.products.sub}
            </p>
          </div>
          <Link href={`/${language}/products`}>
            <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} variant="outline" className="gap-2 bg-transparent">
              {t.products.all}
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            // Skeleton Loaders
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-4 animate-pulse">
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-1/2 bg-muted rounded" />
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
                <div className="h-8 w-1/3 bg-muted rounded mt-auto" />
              </div>
            ))
          ) : (
            products.map((product) => (
              <div
                key={product.slug}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col premium-card-ring hover-lift shadow-premium"
              >
                {/* Badge for Categories */}
                <Badge
                  className="absolute left-4 top-4 z-10"
                  style={{ backgroundColor: `#${CATEGORY_COLORS[product.categories[0]] || '000000'}`, color: 'white' }}
                >
                  {(t.categories.items as any)[product.categories[0]]?.title || product.categories[0]}
                </Badge>

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/10 group-hover:opacity-100">
                    <Button
                      size="sm"
                      className="gap-2 shadow-lg"
                      onClick={() => {
                        addItem({
                          id: product.slug,
                          title: product.title,
                          price: product.price,
                          images: [product.image],
                          description: product.description,
                          category: product.categories[0],
                          slug: product.slug,
                          tags: product.categories,
                          status: 'published',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        });
                        toast({
                          title: t.products?.toastAdded || "Added to cart",
                          description: product.title,
                        });
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {t.products.addToCart}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Rating Placeholder */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 opacity-60">
                      <Star className="h-4 w-4 fill-slate-200 text-slate-300" />
                      <span className="text-sm font-medium text-slate-500">
                        Brak ocen
                      </span>
                    </div>
                  </div>

                  <Link href={`/${language}/products/${product.slug}`} className="hover:underline">
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="line-clamp-2 text-sm text-muted-foreground flex-grow mb-4">
                    {product.description || ""}
                  </p>

                  {/* Price */}
                  <div className="mt-auto flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-amber-700 w-fit animate-in fade-in slide-in-from-left-4 duration-500">
                      <Coins className="h-3 w-3 fill-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-tight">
                        {Math.floor(product.price * 100).toLocaleString()} {t.points?.name || "PTS"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

