"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { getProducts } from "@/lib/product-service";
import { CATEGORY_COLORS } from "@/lib/product-catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Search, Filter, ArrowUpDown, LayoutGrid, List, X, Scale, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { toast } = useToast();
    const allProducts = getProducts(language);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [selectedAge, setSelectedAge] = React.useState("all");
    const [sortBy, setSortBy] = React.useState("default");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const minPrice = allProducts.length > 0 ? Math.floor(Math.min(...allProducts.map(p => p.price))) : 0;
    const maxPrice = allProducts.length > 0 ? Math.ceil(Math.max(...allProducts.map(p => p.price))) : 1000;
    const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 9999]);
    React.useEffect(() => {
        if (allProducts.length > 0) setPriceRange([minPrice, maxPrice]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minPrice, maxPrice]);

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

    const filteredProducts = React.useMemo(() => {
        let result = allProducts.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.categories.includes(selectedCategory);
            const matchesAge = selectedAge === "all" || product.categories.includes(selectedAge);
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            return matchesSearch && matchesCategory && matchesAge && matchesPrice;
        });
        if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
        else if (sortBy === "name-asc") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        return result;
    }, [allProducts, searchQuery, selectedCategory, selectedAge, sortBy]);

    const sortLabels: Record<string, string> = {
        default: language === 'pl' ? 'Domyślna kolejność' : 'Default order',
        'price-asc': language === 'pl' ? 'Cena: rosnąco' : 'Price: low to high',
        'price-desc': language === 'pl' ? 'Cena: malejąco' : 'Price: high to low',
        'name-asc': language === 'pl' ? 'Nazwa A-Z' : 'Name A-Z',
    };

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
                            <div className="relative">
                                <Input
                                    placeholder={t.shop?.searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pr-8"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                {t.shop?.categories}
                            </h3>
                            <div className="flex flex-col gap-1">
                                {CATEGORY_ORDER.map((key) => {
                                    const label = categoryNames[key] || key;
                                    const count = key === "all"
                                        ? allProducts.length
                                        : allProducts.filter(p => p.categories.includes(key)).length;
                                    if (key !== "all" && count === 0) return null;
                                    return (
                                        <Button
                                            key={key}
                                            variant={selectedCategory === key ? "secondary" : "ghost"}
                                            className="justify-between"
                                            onClick={() => setSelectedCategory(key)}
                                        >
                                            <span className="flex items-center gap-2">
                                                {selectedCategory === key && (
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: key === 'all' ? 'currentColor' : `#${CATEGORY_COLORS[key] || '000'}` }}
                                                    />
                                                )}
                                                {label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{count}</span>
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
                                {ageTags.map((tag) => {
                                    const count = allProducts.filter(p => p.categories.includes(tag.id)).length;
                                    if (count === 0) return null;
                                    return (
                                        <Button
                                            key={tag.id}
                                            variant={selectedAge === tag.id ? "secondary" : "ghost"}
                                            className="justify-between"
                                            onClick={() => setSelectedAge(tag.id)}
                                        >
                                            {tag.label}
                                            <span className="text-xs text-muted-foreground">{count}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price range slider */}
                        {allProducts.length > 0 && (
                            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 space-y-3">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                                    {language === 'pl' ? 'Zakres cen' : 'Price range'}
                                </p>
                                <Slider
                                    min={minPrice}
                                    max={maxPrice}
                                    step={1}
                                    value={[priceRange[0], priceRange[1]]}
                                    onValueChange={(v) => setPriceRange([v[0], v[1]])}
                                    className="mt-2"
                                />
                                <div className="flex items-center justify-between text-sm font-medium text-foreground">
                                    <span>{formatPrice(priceRange[0])}</span>
                                    <span>{formatPrice(priceRange[1])}</span>
                                </div>
                                {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
                                        onClick={() => setPriceRange([minPrice, maxPrice])}
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        {language === 'pl' ? 'Resetuj filtr ceny' : 'Reset price filter'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-6 space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <p className="text-muted-foreground">
                                    {(t.shop?.found || "").replace('{count}', filteredProducts.length.toString())}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-48 h-9 text-sm">
                                            <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                                            <SelectValue>{sortLabels[sortBy]}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">{sortLabels.default}</SelectItem>
                                            <SelectItem value="price-asc">{sortLabels['price-asc']}</SelectItem>
                                            <SelectItem value="price-desc">{sortLabels['price-desc']}</SelectItem>
                                            <SelectItem value="name-asc">{sortLabels['name-asc']}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex border rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                            title={language === 'pl' ? 'Siatka' : 'Grid'}
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                            title={language === 'pl' ? 'Lista' : 'List'}
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(selectedCategory !== "all" || selectedAge !== "all" || searchQuery) && (
                                <div className="flex flex-wrap gap-2">
                                    {searchQuery && (
                                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 cursor-pointer" onClick={() => setSearchQuery("")}>
                                            🔍 {searchQuery}
                                            <span className="ml-2">×</span>
                                        </Badge>
                                    )}
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
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory("all"); setSelectedAge("all"); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground">
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
                        ) : viewMode === "list" ? (
                            /* List view */
                            <div className="space-y-4">
                                {filteredProducts.map((product) => (
                                    <Link href={`/${language}/products/${product.slug}`} key={product.title} className="group block">
                                        <Card className="overflow-hidden transition-all hover:shadow-md border-muted">
                                            <div className="flex gap-4 p-4">
                                                <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <Badge
                                                                className="mb-1 text-xs"
                                                                style={{
                                                                    backgroundColor: `#${CATEGORY_COLORS[product.categories[0]]}` || '#000',
                                                                    color: 'white',
                                                                    borderColor: 'transparent'
                                                                }}
                                                            >
                                                                {categoryNames[product.categories[0]] || product.categories[0]}
                                                            </Badge>
                                                            <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                                                {product.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                                                {product.description}
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <p className="font-bold text-lg text-primary">{formatPrice(product.price)}</p>
                                                            <Button
                                                                size="sm"
                                                                className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
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
                                                                    toast({ title: t.shop?.added || "Added", description: product.title });
                                                                }}
                                                            >
                                                                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                                                                {t.shop?.add || "Add"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* Grid view */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <Link href={`/${language}/products/${product.slug}`} key={product.title} className="group">
                                        <Card className="h-full transition-all hover:shadow-lg border-muted overflow-hidden flex flex-col">
                                            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    loading="eager"
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
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleWishlist(product.slug);
                                                        toast({ title: isInWishlist(product.slug) ? (language === 'pl' ? 'Usunięto z listy życzeń' : 'Removed from wishlist') : (language === 'pl' ? 'Dodano do listy życzeń' : 'Added to wishlist'), description: product.title });
                                                    }}
                                                    className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                                                >
                                                    <Heart className={`h-4 w-4 transition-colors ${isInWishlist(product.slug) ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-400'}`} />
                                                </button>
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
                                                    <div className="flex items-center gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 border-slate-200 hover:border-violet-400 hover:bg-violet-50"
                                                            title={language === 'pl' ? 'Porównaj' : 'Compare'}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                try {
                                                                    const stored: string[] = JSON.parse(localStorage.getItem('compare_products') || '[]');
                                                                    if (stored.length >= 4) { toast({ title: language === 'pl' ? 'Maks. 4 produkty' : 'Max 4 products' }); return; }
                                                                    if (!stored.includes(product.slug)) {
                                                                        localStorage.setItem('compare_products', JSON.stringify([...stored, product.slug]));
                                                                        toast({ title: language === 'pl' ? 'Dodano do porównania' : 'Added to compare', description: product.title });
                                                                    }
                                                                } catch {}
                                                            }}
                                                        >
                                                            <Scale className="h-3.5 w-3.5 text-slate-500" />
                                                        </Button>
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
