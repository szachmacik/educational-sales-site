"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ShoppingBag, HelpCircle, FileText, ArrowRight } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { getProducts } from "@/lib/product-service";
import { ALL_BLOG_POSTS } from "@/lib/blog-schema";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/currency";

const QUICK_LINKS = [
    { label: { pl: "Wszystkie produkty", en: "All products", uk: "Всі продукти" }, href: "/products", icon: ShoppingBag },
    { label: { pl: "Blog", en: "Blog", uk: "Блог" }, href: "/blog", icon: BookOpen },
    { label: { pl: "FAQ", en: "FAQ", uk: "FAQ" }, href: "/faq", icon: HelpCircle },
    { label: { pl: "O nas", en: "About us", uk: "Про нас" }, href: "/o-nas", icon: FileText },
];

export function SearchModal() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const { language } = useLanguage();

    const products = useMemo(() => getProducts(language), [language]);
    const blogPosts = useMemo(() => ALL_BLOG_POSTS.filter((p) => p.status === "published"), []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const filteredProducts = useMemo(() => {
        if (!query) return products.slice(0, 5);
        const q = query.toLowerCase();
        return products
            .filter((p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.categories?.some((c) => c.toLowerCase().includes(q)))
            .slice(0, 6);
    }, [query, products]);

    const filteredPosts = useMemo(() => {
        if (!query) return blogPosts.slice(0, 3);
        const q = query.toLowerCase();
        return blogPosts
            .filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q)))
            .slice(0, 4);
    }, [query, blogPosts]);

    const handleSelectProduct = (slug: string) => { setOpen(false); setQuery(""); router.push(`/${language}/products/${slug}`); };
    const handleSelectPost = (slug: string) => { setOpen(false); setQuery(""); router.push(`/${language}/blog/${slug}`); };
    const handleSelectQuickLink = (href: string) => { setOpen(false); setQuery(""); router.push(`/${language}${href}`); };

    const placeholder = language === "pl" ? "Szukaj produktów, artykułów..." : language === "uk" ? "Пошук продуктів, статей..." : "Search products, articles...";
    const noResults = language === "pl" ? "Brak wyników wyszukiwania." : language === "uk" ? "Немає результатів." : "No results found.";

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="relative" aria-label="Search">
                <Search className="h-5 w-5" />
                <kbd className="pointer-events-none absolute -bottom-1 -right-1 hidden h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[9px] font-medium opacity-70 sm:flex">⌘K</kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery(""); }}>
                <CommandInput placeholder={placeholder} value={query} onValueChange={setQuery} />
                <CommandList>
                    <CommandEmpty>{noResults}</CommandEmpty>
                    {!query && (
                        <CommandGroup heading={language === "pl" ? "Szybkie linki" : language === "uk" ? "Швидкі посилання" : "Quick links"}>
                            {QUICK_LINKS.map((link) => {
                                const Icon = link.icon;
                                const label = (link.label as Record<string, string>)[language] || link.label.en;
                                return (
                                    <CommandItem key={link.href} value={label} onSelect={() => handleSelectQuickLink(link.href)} className="flex items-center gap-3 cursor-pointer">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-muted"><Icon className="h-3.5 w-3.5" /></div>
                                        <span>{label}</span>
                                        <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    )}
                    {filteredProducts.length > 0 && (
                        <>
                            {!query && <CommandSeparator />}
                            <CommandGroup heading={language === "pl" ? "Produkty" : language === "uk" ? "Продукти" : "Products"}>
                                {filteredProducts.map((product) => (
                                    <CommandItem key={product.slug} value={`product-${product.title}`} onSelect={() => handleSelectProduct(product.slug)} className="flex items-center gap-3 cursor-pointer">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-indigo-50 text-indigo-600"><ShoppingBag className="h-3.5 w-3.5" /></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="truncate font-medium text-sm">{product.title}</div>
                                            {product.categories?.[0] && <div className="text-xs text-muted-foreground truncate">{product.categories[0]}</div>}
                                        </div>
                                        <Badge variant="secondary" className="text-xs shrink-0 font-mono">{formatPrice(product.price, language)}</Badge>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                    {filteredPosts.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading={language === "pl" ? "Artykuły" : language === "uk" ? "Статті" : "Articles"}>
                                {filteredPosts.map((post) => (
                                    <CommandItem key={post.id} value={`post-${post.title}`} onSelect={() => handleSelectPost(post.slug)} className="flex items-center gap-3 cursor-pointer">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-rose-50 text-rose-600"><BookOpen className="h-3.5 w-3.5" /></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="truncate font-medium text-sm">{post.title}</div>
                                            <div className="text-xs text-muted-foreground truncate">{post.excerpt?.slice(0, 60)}...</div>
                                        </div>
                                        {post.readingTime && <span className="text-xs text-muted-foreground shrink-0">{post.readingTime} min</span>}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                    {query && (filteredProducts.length > 0 || filteredPosts.length > 0) && (
                        <>
                            <CommandSeparator />
                            <CommandGroup>
                                <CommandItem value="search-all" onSelect={() => { setOpen(false); router.push(`/${language}/products?search=${encodeURIComponent(query)}`); }} className="flex items-center gap-2 cursor-pointer text-indigo-600">
                                    <Search className="h-4 w-4" />
                                    <span>{language === "pl" ? `Szukaj "${query}" w sklepie` : language === "uk" ? `Шукати "${query}" в магазині` : `Search "${query}" in store`}</span>
                                    <ArrowRight className="ml-auto h-4 w-4" />
                                </CommandItem>
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
                <div className="flex items-center justify-between border-t px-3 py-2 text-[10px] text-muted-foreground">
                    <span>
                        <kbd className="rounded border px-1 font-mono">↑↓</kbd> {language === "pl" ? "nawigacja" : "navigate"}{" "}
                        <kbd className="rounded border px-1 font-mono">↵</kbd> {language === "pl" ? "otwórz" : "open"}{" "}
                        <kbd className="rounded border px-1 font-mono">Esc</kbd> {language === "pl" ? "zamknij" : "close"}
                    </span>
                    <span className="opacity-60">{language === "pl" ? `${products.length} produktów` : `${products.length} products`}</span>
                </div>
            </CommandDialog>
        </>
    );
}
