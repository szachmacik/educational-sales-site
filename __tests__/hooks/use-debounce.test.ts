import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useDebounce } from "@/hooks/use-debounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300))
    expect(result.current).toBe("initial")
  })

  it("does not update value before delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe("initial")
  })

  it("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe("updated")
  })

  it("resets timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    )

    rerender({ value: "b" })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: "c" })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: "final" })
    act(() => vi.advanceTimersByTime(300))

    expect(result.current).toBe("final")
  })

  it("uses default delay of 300ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe("initial")

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe("updated")
  })

  it("works with numbers", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: 0 } }
    )

    rerender({ value: 42 })
    act(() => vi.advanceTimersByTime(200))

    expect(result.current).toBe(42)
  })

  it("works with objects", () => {
    const obj1 = { name: "Alice" }
    const obj2 = { name: "Bob" }

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: obj1 } }
    )

    rerender({ value: obj2 })
    act(() => vi.advanceTimersByTime(100))

    expect(result.current).toEqual({ name: "Bob" })
  })
})
