"use client";

import { AbandonedCartHub } from "@/components/admin/abandoned-cart-hub";
import { NamespaceGuard } from "@/components/language-provider";
import { translations } from "@/lib/translations";

export default function AbandonedContent({ lang }: { lang: string }) {
    const dictionary = (translations as Record<string, Record<string, unknown>>)[lang] || {}

    return (
        <NamespaceGuard dictionary={dictionary} namespace="abandonedHub">
            <div className="space-y-8 max-w-6xl">
                <AbandonedCartHub />
            </div>
        </NamespaceGuard>
    );
}
