import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { usePrevious } from "@/hooks/use-previous"

describe("usePrevious", () => {
  it("returns undefined on first render", () => {
    const { result } = renderHook(() => usePrevious("initial"))
    expect(result.current).toBeUndefined()
  })

  it("returns previous value after update", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: "first" } }
    )

    rerender({ value: "second" })
    expect(result.current).toBe("first")
  })

  it("tracks multiple updates", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 1 } }
    )

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)

    rerender({ value: 4 })
    expect(result.current).toBe(3)
  })

  it("works with objects", () => {
    const obj1 = { name: "Alice" }
    const obj2 = { name: "Bob" }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } }
    )

    rerender({ value: obj2 })
    expect(result.current).toEqual({ name: "Alice" })
  })

  it("works with boolean values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: false } }
    )

    rerender({ value: true })
    expect(result.current).toBe(false)

    rerender({ value: false })
    expect(result.current).toBe(true)
  })
})
