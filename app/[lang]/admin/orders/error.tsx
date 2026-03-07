"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function AdminOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[AdminOrders Error]", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Coś poszło nie tak</h2>
        <p className="text-muted-foreground text-sm">
          Nie udało się załadować zamówienia. Spróbuj ponownie lub wróć do strony głównej.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Spróbuj ponownie
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/">Strona główna</a>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="text-left mt-4 p-3 bg-muted rounded text-xs">
            <summary className="cursor-pointer font-medium">Szczegóły błędu (dev)</summary>
            <pre className="mt-2 overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  )
}
