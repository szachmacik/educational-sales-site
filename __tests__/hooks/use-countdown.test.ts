import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useCountdown } from "@/hooks/use-countdown"

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns expired state for past date", () => {
    const pastDate = new Date(Date.now() - 1000)
    const { result } = renderHook(() => useCountdown(pastDate))

    expect(result.current.isExpired).toBe(true)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.days).toBe(0)
    expect(result.current.hours).toBe(0)
    expect(result.current.minutes).toBe(0)
    expect(result.current.seconds).toBe(0)
  })

  it("returns running state for future date", () => {
    const futureDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    const { result } = renderHook(() => useCountdown(futureDate))

    expect(result.current.isExpired).toBe(false)
    expect(result.current.isRunning).toBe(true)
    expect(result.current.hours).toBe(1)
    expect(result.current.minutes).toBe(0)
  })

  it("counts down seconds correctly", () => {
    const futureDate = new Date(Date.now() + 5000) // 5 seconds
    const { result } = renderHook(() => useCountdown(futureDate))

    expect(result.current.seconds).toBeGreaterThanOrEqual(4)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.seconds).toBeGreaterThanOrEqual(3)
  })

  it("calculates days correctly", () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
    const { result } = renderHook(() => useCountdown(futureDate))

    expect(result.current.days).toBeGreaterThanOrEqual(1)
  })

  it("transitions to expired when time runs out", () => {
    const futureDate = new Date(Date.now() + 2000) // 2 seconds
    const { result } = renderHook(() => useCountdown(futureDate))

    expect(result.current.isExpired).toBe(false)

    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.isExpired).toBe(true)
    expect(result.current.isRunning).toBe(false)
  })
})
