"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  isRunning: boolean
}

/**
 * Countdown timer to a target date.
 * Useful for limited-time offers, flash sales, etc.
 *
 * @example
 * const { days, hours, minutes, seconds, isExpired } = useCountdown(new Date('2026-12-31'))
 */
export function useCountdown(targetDate: Date): CountdownState {
  const calculateTimeLeft = useCallback((): CountdownState => {
    const now = new Date().getTime()
    const target = targetDate.getTime()
    const diff = target - now

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isRunning: false }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
      isRunning: true,
    }
  }, [targetDate])

  const [state, setState] = useState<CountdownState>(calculateTimeLeft)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state.isExpired) return

    intervalRef.current = setInterval(() => {
      const next = calculateTimeLeft()
      setState(next)
      if (next.isExpired && intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [calculateTimeLeft, state.isExpired])

  return state
}
