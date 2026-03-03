"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { translations, Language, Translations } from "@/lib/translations";
import { formatPrice as formatPriceUtil } from "@/lib/currency";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    formatPrice: (value: number | string) => string;
    mergeTranslations: (newTranslations: Partial<Translations>) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    lang,
    dictionary
}: {
    children: React.ReactNode,
    lang?: string,
    dictionary?: Partial<Translations>
}) {
    const initialLang = (lang as Language) || 'pl';
    const [language, setLanguage] = useState<Language>(initialLang);
    const [rawT, setRawT] = useState<Translations>((dictionary || {}) as Translations);

    // Create a safe recursive proxy for 't' that returns an empty string-like proxy
    const proxyCache = useRef(new Map());

    const createSafeProxy = (target: any, path: string = ""): any => {
        // If it's a primitive (string/number), return it directly to allow rendering
        if (target !== null && typeof target !== 'object') {
            return target;
        }

        const tObj = (target && typeof target === 'object' && !Array.isArray(target)) ? target : {};

        if (proxyCache.current.has(target) && target !== null && typeof target === 'object') {
            return proxyCache.current.get(target);
        }

        const proxy = new Proxy(tObj, {
            get(target, prop) {
                // React internals - VERY IMPORTANT
                if (prop === '$$typeof' || prop === 'name' || prop === 'displayName' || prop === '__esModule') {
                    return undefined;
                }

                // Formatting/Metadata/String conversions
                if (prop === 'toString' || prop === 'valueOf' || prop === Symbol.toPrimitive) {
                    return () => "";
                }
                if (prop === 'toJSON') {
                    return () => "";
                }

                // Handle common array and string methods safely
                const methods: Record<string, any> = {
                    map: (cb: any) => (Array.isArray(target) ? target.map(cb) : []),
                    forEach: (cb: any) => (Array.isArray(target) ? target.forEach(cb) : undefined),
                    filter: (cb: any) => (Array.isArray(target) ? target.filter(cb) : []),
                    slice: (start: number, end?: number) => (Array.isArray(target) || typeof target === 'string' ? target.slice(start, end) : []),
                    split: (sep: string) => (typeof target === 'string' ? target.split(sep) : [""]),
                    join: (sep: string) => (Array.isArray(target) ? target.join(sep) : ""),
                    toLowerCase: () => (typeof target === 'string' ? target.toLowerCase() : ""),
                    toUpperCase: () => (typeof target === 'string' ? target.toUpperCase() : ""),
                    includes: (val: any) => (Array.isArray(target) || typeof target === 'string' ? target.includes(val) : false),
                    length: Array.isArray(target) || typeof target === 'string' ? target.length : 0,
                    replace: (s: any, r: any) => (typeof target === 'string' ? target.replace(s, r) : ""),
                    replaceAll: (s: any, r: any) => (typeof target === 'string' ? (target as any).replaceAll(s, r) : ""),
                    startsWith: (s: string) => (typeof target === 'string' ? target.startsWith(s) : false),
                    endsWith: (s: string) => (typeof target === 'string' ? target.endsWith(s) : false),
                };

                if (prop in methods) {
                    return methods[prop as string];
                }

                if (typeof prop === 'string') {
                    if (target && prop in target) {
                        const val = target[prop];
                        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                            return createSafeProxy(val, path ? `${path}.${prop}` : prop);
                        }
                        return val;
                    }

                    // For missing keys, return a NEW Proxy instead of just "".
                    if (prop !== 'constructor' && prop !== 'prototype' && typeof prop === 'string') {
                        // console.warn(`[LanguageProvider] Missing key: ${path ? path + '.' : ''}${prop}`);
                    }
                    return undefined;
                }

                return (target as any)?.[prop];
            },
        });

        if (target && typeof target === 'object') {
            proxyCache.current.set(target, proxy);
        }
        return proxy;
    };

    // Memoize the proxy object to prevent infinite re-renders in components that use it as a dependency
    const t = React.useMemo(() => createSafeProxy(rawT), [rawT]);

    useEffect(() => {
        if (lang && lang !== language) {
            setLanguage(lang as Language);
        }
    }, [lang]);

    const formatPrice = (value: number | string) => formatPriceUtil(value, language);

    const mergeTranslations = (newTranslations: Partial<Translations>) => {
        setRawT(prev => ({ ...prev, ...newTranslations }));
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice, mergeTranslations }}>
            <div suppressHydrationWarning>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

// Merges silently
export function TranslationMerger({ dictionary }: { dictionary: any }) {
    const { mergeTranslations } = useLanguage();
    const loadedRef = useRef(false);

    useEffect(() => {
        if (dictionary && !loadedRef.current) {
            mergeTranslations(dictionary);
            loadedRef.current = true;
        }
    }, [dictionary, mergeTranslations]);

    return null;
}

// Blocks rendering until merger happens (prevents crashing on unsafe access)
export function NamespaceGuard({ children, dictionary, namespace }: { children: React.ReactNode, dictionary: any, namespace?: string }) {
    const { mergeTranslations, t } = useLanguage();
    const [isReady, setIsReady] = useState(false);
    const loadedRef = useRef(false);

    useEffect(() => {
        if (dictionary && !loadedRef.current) {
            mergeTranslations(dictionary);
            loadedRef.current = true;
            setIsReady(true);
        } else if (!dictionary) {
            setIsReady(true);
        }
    }, [dictionary, mergeTranslations]);

    // During SSR / Build-time prerendering, don't render children that depend on dynamic t
    if (!isReady) {
        return <div className="min-h-screen animate-pulse bg-background"></div>;
    }

    return <>{children}</>;
}
