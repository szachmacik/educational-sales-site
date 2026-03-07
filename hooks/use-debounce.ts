"use client"

import { useEffect, useState } from "react"

/**
 * Debounce a value — delays updating the returned value until after
 * `delay` ms have elapsed since the last change.
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 300)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
