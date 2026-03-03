"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useIntersection(options: UseIntersectionOptions = {}) {
    const { threshold = 0, rootMargin = "200px 0px", triggerOnce = true } = options;
    const ref = useRef<HTMLDivElement>(null);
    // Start as visible to avoid flash of invisible content in proxy/iframe environments
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible };
}

// Simpler hook that just returns a className based on visibility
export function useScrollReveal(options: UseIntersectionOptions = {}) {
    const { ref, isVisible } = useIntersection(options);
    return {
        ref,
        className: isVisible ? "scroll-reveal visible" : "scroll-reveal",
    };
}
