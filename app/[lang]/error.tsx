'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service
        console.error('[Error Boundary]', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Coś poszło nie tak</h2>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                    Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do strony głównej.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                    >
                        Spróbuj ponownie
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/pl'}
                        className="rounded-xl border-slate-200"
                    >
                        Strona główna
                    </Button>
                </div>
                {error.digest && (
                    <p className="text-xs text-slate-400 mt-4">Kod błędu: {error.digest}</p>
                )}
            </div>
        </div>
    );
}
