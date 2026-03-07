"use client"

import { useEffect, useState } from "react"

/**
 * Track a CSS media query match with SSR safety.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler)
      return () => mediaQuery.removeEventListener("change", handler)
    }
    // Legacy fallback
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [query])

  return matches
}

// Convenience hooks for common breakpoints (Tailwind defaults)
export const useIsSmall = () => useMediaQuery("(min-width: 640px)")
export const useIsMedium = () => useMediaQuery("(min-width: 768px)")
export const useIsLarge = () => useMediaQuery("(min-width: 1024px)")
export const useIsXLarge = () => useMediaQuery("(min-width: 1280px)")
export const usePrefersDark = () =>
  useMediaQuery("(prefers-color-scheme: dark)")
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)")
