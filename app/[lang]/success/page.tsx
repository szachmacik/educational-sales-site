"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("order");
  const payment = searchParams?.get("payment");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push("/pl/dashboard");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const isSimulated = payment === "simulated";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dziękujemy za zakup! 🎉
        </h1>

        {isSimulated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
            <strong>Tryb testowy</strong> — płatność zasymulowana. W trybie
            produkcyjnym nastąpi przekierowanie do bramki płatniczej.
          </div>
        )}

        <p className="text-gray-600 mb-2">
          Twoje zamówienie zostało przyjęte i przetworzone.
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Numer zamówienia:{" "}
            <span className="font-mono font-medium text-gray-700">
              {orderId}
            </span>
          </p>
        )}

        <p className="text-gray-600 mb-6">
          Materiały są już dostępne w Twoim{" "}
          <Link href="/pl/dashboard" className="text-purple-600 font-medium hover:underline">
            panelu klienta
          </Link>
          . Link do pobrania został również wysłany na Twój adres e-mail.
        </p>

        <div className="space-y-3">
          <Link
            href="/pl/dashboard"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Przejdź do panelu klienta
          </Link>
          <Link
            href="/pl/products"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Kontynuuj zakupy
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Automatyczne przekierowanie do panelu za {countdown}s...
        </p>
      </div>
    </div>
  );
}
