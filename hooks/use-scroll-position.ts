"use client"

import { useEffect, useState } from "react"

interface ScrollPosition {
  x: number
  y: number
  direction: "up" | "down" | "none"
  isAtTop: boolean
  isAtBottom: boolean
  progress: number // 0-100 scroll progress
}

/**
 * Track scroll position with direction and progress.
 * Useful for sticky headers, progress bars, back-to-top buttons.
 *
 * @example
 * const { y, direction, isAtTop, progress } = useScrollPosition()
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: "none",
    isAtTop: true,
    isAtBottom: false,
    progress: 0,
  })

  useEffect(() => {
    let lastY = window.scrollY

    const handleScroll = () => {
      const x = window.scrollX
      const y = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.round((y / maxScroll) * 100) : 0

      setPosition({
        x,
        y,
        direction: y > lastY ? "down" : y < lastY ? "up" : "none",
        isAtTop: y <= 10,
        isAtBottom: y >= maxScroll - 10,
        progress,
      })
      lastY = y
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return position
}
