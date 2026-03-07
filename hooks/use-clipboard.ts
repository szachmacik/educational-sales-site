"use client"

import { useCallback, useState } from "react"

interface UseClipboardOptions {
  /** How long (ms) to keep `copied` state true. Default: 2000 */
  timeout?: number
}

interface UseClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<void>
  error: string | null
}

/**
 * Copy text to clipboard with visual feedback.
 *
 * @example
 * const { copied, copy } = useClipboard()
 * <button onClick={() => copy(url)}>{copied ? 'Skopiowano!' : 'Kopiuj'}</button>
 */
export function useClipboard(
  options: UseClipboardOptions = {}
): UseClipboardReturn {
  const { timeout = 2000 } = options
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          // Fallback for older browsers
          const textarea = document.createElement("textarea")
          textarea.value = text
          textarea.style.position = "fixed"
          textarea.style.opacity = "0"
          document.body.appendChild(textarea)
          textarea.focus()
          textarea.select()
          document.execCommand("copy")
          document.body.removeChild(textarea)
        }
        setError(null)
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się skopiować")
        setCopied(false)
      }
    },
    [timeout]
  )

  return { copied, copy, error }
}
