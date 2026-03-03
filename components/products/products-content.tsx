"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { getProducts } from "@/lib/product-service";
import { CATEGORY_COLORS } from "@/lib/product-catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Search, Filter } from "lucide-react";

const CATEGORY_ORDER = [
    "all",
    "mega-pack",
    "scenariusze",
    "zlobek",
    "special-lessons",
    "speakbook",
    "stories",
    "culture",
    "pory-roku",
    "teatr",
    "flashcards",
    "gry",
    "inne"
];

const AGE_TAGS_IDS = ['zlobek', 'przedszkole', 'klasy-1-3', 'klasy-4-6', 'klasy-7-8', 'liceum'];

export function ProductsContent({ lang }: { lang: string }) {
    const { t, language, formatPrice } = useLanguage();
    const { addItem } = useCart();
    const { toast } = useToast();
    const allProducts = getProducts(language);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [selectedAge, setSelectedAge] = React.useState("all");

    const categoryNames: Record<string, string> = {
        "all": t.shop?.all || "All",
        ...Object.keys(t.categories?.items || {}).reduce((acc, key) => {
            // @ts-ignore
            const cat = t.categories.items[key];
            if (cat) acc[key] = cat.title;
            return acc;
        }, {} as Record<string, string>)
    };

    const ageTags = AGE_TAGS_IDS.map(id => ({
        id,
        // @ts-ignore
        label: t.categories?.items?.[id]?.title || id
    }));

    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.categories.includes(selectedCategory);
        const matchesAge = selectedAge === "all" || product.categories.includes(selectedAge);
        return matchesSearch && matchesCategory && matchesAge;
    });

    return (
        <main className="flex-1">
            <div className="bg-muted/30 py-12 border-b">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-serif font-bold mb-4">{t.shop?.header}</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {t.shop?.sub}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 shrink-0 space-y-8">
                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                {t.shop?.search}
                            </h3>
                            <Input
                                placeholder={t.shop?.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                {t.shop?.categories}
                            </h3>
                            <div className="flex flex-col gap-1">
                                {CATEGORY_ORDER.map((key) => {
                                    const label = categoryNames[key] || key;
                                    return (
                                        <Button
                                            key={key}
                                            variant={selectedCategory === key ? "secondary" : "ghost"}
                                            className="justify-start"
                                            onClick={() => setSelectedCategory(key)}
                                        >
                                            {selectedCategory === key && (
                                                <span
                                                    className="w-2 h-2 rounded-full mr-2"
                                                    style={{ backgroundColor: key === 'all' ? 'currentColor' : `#${CATEGORY_COLORS[key] || '000'}` }}
                                                />
                                            )}
                                            {label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <span className="text-lg">👶</span>
                                {t.shop?.age}
                            </h3>
                            <div className="flex flex-col gap-1">
                                <Button
                                    variant={selectedAge === "all" ? "secondary" : "ghost"}
                                    className="justify-start"
                                    onClick={() => setSelectedAge("all")}
                                >
                                    {t.shop?.all}
                                </Button>
                                {ageTags.map((tag) => (
                                    <Button
                                        key={tag.id}
                                        variant={selectedAge === tag.id ? "secondary" : "ghost"}
                                        className="justify-start"
                                        onClick={() => setSelectedAge(tag.id)}
                                    >
                                        {tag.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground">
                                    {(t.shop?.found || "").replace('{count}', filteredProducts.length.toString())}
                                </p>
                            </div>

                            {/* Active Filters */}
                            {(selectedCategory !== "all" || selectedAge !== "all") && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategory !== "all" && (
                                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 cursor-pointer" onClick={() => setSelectedCategory("all")}>
                                            {t.shop?.filterCategory} {categoryNames[selectedCategory] || selectedCategory}
                                            <span className="ml-2">×</span>
                                        </Badge>
                                    )}
                                    {selectedAge !== "all" && (
                                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 cursor-pointer" onClick={() => setSelectedAge("all")}>
                                            {t.shop?.filterAge} {ageTags.find(t => t.id === selectedAge)?.label || selectedAge}
                                            <span className="ml-2">×</span>
                                        </Badge>
                                    )}
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory("all"); setSelectedAge("all"); }} className="text-muted-foreground hover:text-foreground">
                                        {t.shop?.clearFilters}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                                <p className="text-lg font-semibold mb-2">{t.shop?.notFound}</p>
                                <p className="text-sm">{t.shop?.notFoundSub}</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSelectedCategory("all"); setSelectedAge("all"); setSearchQuery(""); }}
                                    className="mt-4 text-primary"
                                >
                                    {t.shop?.clearAll}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <Link href={`/${language}/products/${product.slug}`} key={product.title} className="group">
                                        <Card className="h-full transition-all hover:shadow-lg border-muted overflow-hidden flex flex-col">
                                            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <Badge
                                                    className="absolute top-3 right-3 shadow-sm"
                                                    style={{
                                                        backgroundColor: `#${CATEGORY_COLORS[product.categories[0]]}` || '#000',
                                                        color: 'white',
                                                        borderColor: 'transparent'
                                                    }}
                                                >
                                                    {categoryNames[product.categories[0]] || product.categories[0]}
                                                </Badge>
                                            </div>
                                            <CardContent className="p-5 flex flex-col flex-1">
                                                <h3 className="font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                    {product.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                                    <span className="font-bold text-lg">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addItem({
                                                                id: product.slug,
                                                                title: product.title,
                                                                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                                                                images: [product.image || ''],
                                                                description: product.description,
                                                                category: product.categories[0],
                                                                slug: product.slug,
                                                                tags: product.categories,
                                                                status: 'published',
                                                                createdAt: new Date().toISOString(),
                                                                updatedAt: new Date().toISOString()
                                                            });
                                                            toast({
                                                                title: t.shop?.added || "Added",
                                                                description: product.title
                                                            });
                                                        }}
                                                    >
                                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                                        {t.shop?.add || "Add"}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
