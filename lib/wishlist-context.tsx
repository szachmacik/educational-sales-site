"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistContextType {
    wishlistIds: string[];
    addToWishlist: (id: string) => void;
    removeFromWishlist: (id: string) => void;
    toggleWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
    count: number;
}

const WishlistContext = createContext<WishlistContextType>({
    wishlistIds: [],
    addToWishlist: () => {},
    removeFromWishlist: () => {},
    toggleWishlist: () => {},
    isInWishlist: () => false,
    clearWishlist: () => {},
    count: 0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("wishlist_products") || "[]");
            setWishlistIds(stored);
        } catch {}
    }, []);

    const save = (ids: string[]) => {
        setWishlistIds(ids);
        localStorage.setItem("wishlist_products", JSON.stringify(ids));
    };

    const addToWishlist = (id: string) => {
        if (!wishlistIds.includes(id)) save([...wishlistIds, id]);
    };

    const removeFromWishlist = (id: string) => {
        save(wishlistIds.filter(i => i !== id));
    };

    const toggleWishlist = (id: string) => {
        if (wishlistIds.includes(id)) removeFromWishlist(id);
        else addToWishlist(id);
    };

    const isInWishlist = (id: string) => wishlistIds.includes(id);

    const clearWishlist = () => save([]);

    return (
        <WishlistContext.Provider value={{
            wishlistIds,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            clearWishlist,
            count: wishlistIds.length,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
