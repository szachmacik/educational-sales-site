"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Cart, CartItem, Coupon, calculateDiscount, SAMPLE_COUPONS } from "./order-schema";
import { Product } from "./product-schema";
import { ProductWithSlug } from "./product-service";

interface CartContextType {
    cart: Cart;
    addItem: (product: Product | ProductWithSlug, selectedLanguage?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    applyCoupon: (code: string, t: any) => { success: boolean; message: string };
    removeCoupon: () => void;
    clearCart: () => void;
    itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "shopping_cart";
const COUPONS_STORAGE_KEY = "admin_coupons";

function getEmptyCart(): Cart {
    return {
        items: [],
        couponDiscount: 0,
        subtotal: 0,
        total: 0,
    };
}

function calculateTotals(items: CartItem[], couponDiscount: number): { subtotal: number; total: number } {
    const subtotal = items.reduce((sum, item) => {
        const price = item.salePrice ?? item.price;
        return sum + price * item.quantity;
    }, 0);

    return {
        subtotal,
        total: Math.max(0, subtotal - couponDiscount),
    };
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>(getEmptyCart());
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch {
                setCart(getEmptyCart());
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addItem = useCallback((product: Product | ProductWithSlug, selectedLanguage?: string) => {
        setCart((prev) => {
            const existingIndex = prev.items.findIndex(
                (item) => item.productId === product.id && item.selectedLanguage === selectedLanguage
            );

            let newItems: CartItem[];
            if (existingIndex >= 0) {
                newItems = prev.items.map((item, i) =>
                    i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                const newItem: CartItem = {
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    salePrice: ("salePrice" in product ? product.salePrice : undefined),
                    quantity: 1,
                    image: ("images" in product ? product.images[0] : product.image) || "",
                    selectedLanguage,
                };
                newItems = [...prev.items, newItem];
            }

            const { subtotal, total } = calculateTotals(newItems, prev.couponDiscount);
            return { ...prev, items: newItems, subtotal, total };
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setCart((prev) => {
            const newItems = prev.items.filter((item) => item.productId !== productId);
            const { subtotal, total } = calculateTotals(newItems, prev.couponDiscount);
            return { ...prev, items: newItems, subtotal, total };
        });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prev) => {
            const newItems = prev.items.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            );
            const { subtotal, total } = calculateTotals(newItems, prev.couponDiscount);
            return { ...prev, items: newItems, subtotal, total };
        });
    }, []);

    const applyCoupon = useCallback((code: string, t: any): { success: boolean; message: string } => {
        const storedCoupons = localStorage.getItem(COUPONS_STORAGE_KEY);
        const coupons: Coupon[] = storedCoupons ? JSON.parse(storedCoupons) : SAMPLE_COUPONS;

        const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

        if (!coupon) {
            return { success: false, message: t.cart.couponInvalid || "Invalid coupon code" };
        }

        if (!coupon.isActive) {
            return { success: false, message: t.cart.couponInactive || "This coupon is no longer active" };
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return { success: false, message: t.cart.couponExpired || "This coupon has expired" };
        }

        if (coupon.usageCount >= coupon.usageLimit) {
            return { success: false, message: t.cart.couponLimitReached || "This coupon has reached its usage limit" };
        }

        const discount = calculateDiscount(coupon, cart.subtotal);
        if (discount === 0 && coupon.minOrderValue) {
            const currency = t.cart?.currencySymbol || "€";
            const msg = t.cart?.couponMinOrder || "Minimum order value: {minOrderValue} {currency}";
            return {
                success: false,
                message: msg.replace("{minOrderValue}", coupon.minOrderValue.toString()).replace("{currency}", currency)
            };
        }

        setCart((prev) => {
            const currentDiscount = calculateDiscount(coupon, prev.subtotal);
            return {
                ...prev,
                couponCode: coupon.code,
                couponDiscount: currentDiscount,
                total: Math.max(0, prev.subtotal - currentDiscount),
            };
        });

        if (coupon.discountType === "percent") {
            const msg = t.cart?.couponAppliedPercent || "Discount {percent}% applied!";
            return { success: true, message: msg.replace("{percent}", coupon.discountValue.toString()) };
        } else {
            const currency = t.cart?.currencySymbol || "€";
            const msg = t.cart?.couponAppliedFixed || "Discount {amount} {currency} applied!";
            return { success: true, message: msg.replace("{amount}", coupon.discountValue.toString()).replace("{currency}", currency) };
        }
    }, [cart.subtotal]);

    const removeCoupon = useCallback(() => {
        setCart((prev) => ({
            ...prev,
            couponCode: undefined,
            couponDiscount: 0,
            total: prev.subtotal,
        }));
    }, []);

    const clearCart = useCallback(() => {
        setCart(getEmptyCart());
    }, []);

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addItem,
                removeItem,
                updateQuantity,
                applyCoupon,
                removeCoupon,
                clearCart,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
