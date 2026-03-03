"use client";

import { useEffect, useState } from "react";
import { LegalDocument } from "@/lib/legal-docs-data";
import { Clock, FileText, ListOrdered } from "lucide-react";

interface LegalDocumentViewerProps {
    document: LegalDocument;
    brandName?: string;
    isSaaS?: boolean;
}

export function LegalDocumentViewer({ document, brandName = "Sklepu", isSaaS = false }: LegalDocumentViewerProps) {
    const [enabledClauses, setEnabledClauses] = useState<Record<string, boolean>>({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Load enabled clause states from localStorage
        const storedConfig = localStorage.getItem('legal_docs_config');
        const config: Record<string, boolean> = storedConfig ? JSON.parse(storedConfig) : {};

        const initialEnabled: Record<string, boolean> = {};
        document.clauses.forEach(clause => {
            if (clause.required) {
                initialEnabled[clause.id] = true;
            } else {
                initialEnabled[clause.id] = config[clause.id] !== undefined ? config[clause.id] : clause.defaultEnabled;
            }
        });
        setEnabledClauses(initialEnabled);
    }, [document]);

    if (!isMounted) return null; // Avoid hydration mismatch

    // Filter and chronologically number active clauses
    const activeClauses = document.clauses.filter(clause => enabledClauses[clause.id]);

    const displayTitle = isSaaS ? document.title : `${document.title} ${brandName}`;

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
            {/* Sidebar Table of Contents */}
            <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-28 space-y-6 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <ListOrdered className="h-4 w-4 text-indigo-500" /> Spis Treści
                    </h4>
                    <nav className="flex flex-col gap-3 border-l-2 border-indigo-100 pl-4 py-1">
                        {activeClauses.map((clause, index) => (
                            <a
                                key={clause.id}
                                href={`#${clause.id}`}
                                className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed"
                            >
                                <span className="text-indigo-400 font-bold mr-1">{index + 1}.</span> {clause.title}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Document Content */}
            <article className="flex-1 prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-slate-100 print:border-black">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight print:text-5xl">
                            {displayTitle}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                                <Clock className="h-3.5 w-3.5" /> Ostatnia aktualizacja: {document.lastUpdated}
                            </span>
                            <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full">
                                <FileText className="h-3.5 w-3.5" /> Wersja 2.0 (SaaS Ready)
                            </span>
                        </div>
                    </div>
                </div>

                <section className="space-y-10">
                    {activeClauses.map((clause, index) => {
                        const sectionNumber = document.id === 'regulamin' ? `§${index + 1}. ` : `${index + 1}. `;

                        return (
                            <div key={clause.id} id={clause.id} className="scroll-mt-28">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4 print:text-black">
                                    {sectionNumber}{clause.title}
                                </h2>
                                <div className="text-slate-600 leading-relaxed text-[15px] space-y-4 print:text-black">
                                    {typeof clause.content === 'string' ? (
                                        <p>{clause.content}</p>
                                    ) : (
                                        clause.content
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </article >
        </div >
    );
}
