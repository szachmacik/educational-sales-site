"use client"

import { useEffect, useRef } from "react"

/**
 * Track the previous value of a state or prop.
 * Useful for animations and transition effects.
 *
 * @example
 * const prevCount = usePrevious(count)
 * // prevCount holds the value from the last render
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
