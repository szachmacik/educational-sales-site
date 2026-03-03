"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { getProducts } from "@/lib/product-service";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function SearchModal() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { language } = useLanguage();

    const products = getProducts(language);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (slug: string) => {
        setOpen(false);
        router.push(`/${language}/products/${slug}`);
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="relative"
                aria-label="Search"
            >
                <Search className="h-5 w-5" />
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Szukaj produktów, artykułów..." />
                <CommandList>
                    <CommandEmpty>Brak wyników wyszukiwania.</CommandEmpty>
                    <CommandGroup heading="Produkty">
                        {products.map((product) => (
                            <CommandItem
                                key={product.slug}
                                value={product.title}
                                onSelect={() => handleSelect(product.slug)}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div className="flex-1 truncate">{product.title}</div>
                                <div className="text-muted-foreground text-xs whitespace-nowrap">{product.price} PLN</div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
