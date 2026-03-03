"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LegalDocumentViewer } from "@/components/legal/legal-document-viewer";
import { LEGAL_DOCUMENTS } from "@/lib/legal-docs-data";
import { useEffect, useState } from "react";

export default function PolitykaPrywatnosciPage() {
    const [isSaaS, setIsSaaS] = useState(false);

    useEffect(() => {
        setIsSaaS(localStorage.getItem('feature_saas_mode') === 'true');
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1 container max-w-4xl mx-auto py-16 px-4 md:px-8">
                <LegalDocumentViewer
                    document={LEGAL_DOCUMENTS['cookies']}
                    brandName="Kamila English"
                    isSaaS={isSaaS}
                />
            </main>
            <Footer />
        </div>
    );
}
