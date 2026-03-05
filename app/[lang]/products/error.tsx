'use client';

import { Button } from '@/components/ui/button';

export default function ProductsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Nie można załadować produktów</h2>
                <p className="text-slate-500 mb-6 text-sm">
                    Wystąpił problem z ładowaniem katalogu produktów. Spróbuj ponownie.
                </p>
                <Button onClick={reset} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                    Odśwież
                </Button>
            </div>
        </div>
    );
}
