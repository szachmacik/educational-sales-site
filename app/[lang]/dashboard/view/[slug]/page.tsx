"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { getProductBySlug, ProductWithSlug } from "@/lib/product-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Printer,
    ArrowLeft,
    Zap,
    Gamepad2,
    FileText,
    Play,
    Loader2,
    Sparkles,
    CheckCircle2
} from "lucide-react";

export default function ProductAccessPage() {
    const { slug, lang } = useParams();
    const router = useRouter();
    const { t } = useLanguage();
    const [product, setProduct] = useState<ProductWithSlug | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            const found = getProductBySlug(slug as string, lang as any || 'pl');
            if (found) {
                setProduct(found);
            }
            setLoading(false);
        }
    }, [slug, lang]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="font-bold text-slate-400">Loading access...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4 max-w-md px-6">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-50 mb-6">
                        <Zap className="h-10 w-10" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Materials Not Found</h1>
                    <p className="text-slate-500">We couldn't find the associated product. Please make sure the link is correct or try again from the dashboard.</p>
                    <Button onClick={() => router.back()} className="rounded-2xl">Go Back</Button>
                </div>
            </div>
        );
    }

    const isInteractive = !!product.source?.embedHtml || product.categories?.includes('games');
    const isPdf = product.categories?.includes('worksheets') || product.categories?.includes('flashcards');
    const isCourse = product.categories?.includes('lesson-plans');

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
            <style jsx global>{`
                @media print {
                    /* Hide everything by default */
                    body * {
                        visibility: hidden;
                    }
                    /* Background color white for print */
                    body {
                        background: white !important;
                    }
                    /* Target only the main content area */
                    .print-section, .print-section * {
                        visibility: visible;
                    }
                    .print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    /* Remove UI elements within the print section */
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
            <Header />

            <main className="flex-1 container max-w-6xl mx-auto py-12 px-4 no-print">
                {/* Top Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="group hover:bg-white rounded-2xl text-slate-500 font-bold"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                        {t.dashboard?.course?.backToDashboard || "Back to Library"}
                    </Button>

                    <div className="flex gap-2">
                        <Badge className="bg-white border-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full shadow-sm">
                            SKU: {product.id}
                        </Badge>
                        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-xs px-3 py-1 rounded-full shadow-sm font-bold">
                            Legal & Verified Access
                        </Badge>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white print-section">
                            <CardContent className="p-0">
                                {isInteractive && product.source?.embedHtml ? (
                                    <div className="group relative bg-slate-950">
                                        {/* Responsive aspect ratio container for interactive content */}
                                        <div className="relative w-full overflow-hidden" style={{ paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
                                            <div
                                                className="absolute inset-0 w-full h-full flex items-center justify-center"
                                                dangerouslySetInnerHTML={{
                                                    __html: product.source.embedHtml
                                                        .replace(/width="\d+"/, 'width="100%"')
                                                        .replace(/height="\d+"/, 'height="100%"')
                                                        .replace(/style="[^"]*"/, 'style="width: 100%; height: 100%; border: none;"')
                                                }}
                                            />
                                        </div>
                                        {/* Subtle overlay badge */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                                            <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 font-bold">
                                                Interactive Lesson
                                            </Badge>
                                        </div>
                                    </div>
                                ) : isPdf ? (
                                    <div className="flex flex-col">
                                        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between no-print">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-xl bg-red-500 flex items-center justify-center">
                                                    <FileText className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-slate-900 font-bold text-sm tracking-tight">Preview Reader</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.print()}
                                                className="rounded-xl border-slate-200 text-slate-600 hover:bg-white gap-2 font-bold"
                                            >
                                                <Printer className="h-4 w-4" />
                                                Print
                                            </Button>
                                        </div>
                                        {/* Simple PDF Preview Container - in a real app this would point to the asset URL */}
                                        <div className="aspect-[1/1.414] w-full bg-slate-100 flex items-center justify-center p-8 relative group">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none" />
                                            <div className="max-w-md w-full aspect-[1/1.414] bg-white shadow-2xl rounded-sm border border-slate-200 transform group-hover:scale-[1.01] transition-transform duration-500 flex flex-col p-8 overflow-hidden">
                                                <div className="h-4 w-3/4 bg-slate-100 rounded-full mb-6" />
                                                <div className="space-y-4">
                                                    <div className="h-2 w-full bg-slate-50 rounded-full text-[6px] text-slate-300 flex items-center px-2">Educational content security preview...</div>
                                                    <div className="h-2 w-5/6 bg-slate-50 rounded-full" />
                                                    <div className="h-2 w-full bg-slate-50 rounded-full" />
                                                    <div className="h-20 w-full bg-slate-50 rounded-2xl" />
                                                    <div className="h-2 w-4/6 bg-slate-50 rounded-full" />
                                                </div>
                                                <div className="mt-auto flex justify-between items-end">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-50" />
                                                    <div className="h-4 w-20 bg-slate-100 rounded-full" />
                                                </div>
                                                {/* Watermark */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                                                    <span className="text-4xl font-black text-slate-100 -rotate-45 uppercase tracking-[1em] opacity-50">PREVIEW</span>
                                                </div>
                                            </div>

                                            {/* In production this could be an iframe for PDF rendering:
                                                <iframe src={`${product.fileUrl}#toolbar=0`} className="w-full h-full border-none" />
                                            */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-indigo-50 flex items-center justify-center flex-col p-12 text-center group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-transparent pointer-events-none" />
                                        <div className="relative z-10 space-y-6">
                                            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto text-indigo-600 transform group-hover:scale-110 transition-transform duration-500">
                                                {isPdf ? <FileText className="h-10 w-10" /> : <Play className="h-10 w-10" />}
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{product.title}</h2>
                                            <p className="text-slate-500 max-w-sm mx-auto font-medium">
                                                {isPdf ? "Your PDF materials are ready for download and printing." : "Your lessons and course are ready to begin."}
                                            </p>
                                            <div className="flex gap-4 justify-center no-print">
                                                {isPdf && (
                                                    <Button
                                                        onClick={() => window.print()}
                                                        className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 gap-2 text-lg"
                                                    >
                                                        <Printer className="h-5 w-5" />
                                                        {t.dashboard?.materials?.print || "Print Materials"}
                                                    </Button>
                                                )}
                                                {isCourse && (
                                                    <Button
                                                        onClick={() => router.push(`/${lang}/dashboard/course/${product.slug}`)}
                                                        className="h-14 px-8 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-lg shadow-slate-200 gap-2 text-lg"
                                                    >
                                                        <Play className="h-5 w-5 fill-white" />
                                                        Open Lesson Plans
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Interactive Info / Instructions */}
                        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center gap-8">
                            <div className="shrink-0 w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <Sparkles className="h-10 w-10" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2">Teacher Instructions</h3>
                                <p className="text-indigo-50 opacity-90 leading-relaxed font-medium">You can embed this game directly in your online lesson or share your screen with students. PDF materials are best printed at 100% scale for readability.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Details & Metadata */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">About Your Product</h4>
                                    <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-indigo-200 pl-4">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Library Contents</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">PDF Materials</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Ready to Print</p>
                                            </div>
                                            <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                                        </div>

                                        {isInteractive && (
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                                                    <Gamepad2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">Interactive Game</p>
                                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Link: Wordwall/Genially</p>
                                                </div>
                                                <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                                    <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} variant="outline" className="w-full h-12 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                                        Report Material Error
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const link = window.location.href;
                                            navigator.clipboard.writeText(link);
                                            toast.success("Materials link copied!");
                                        }}
                                        variant="ghost"
                                        className="w-full h-12 rounded-2xl font-bold text-indigo-600 hover:bg-indigo-50"
                                    >
                                        Share Material
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Proof / Help */}
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                <img src="/placeholder.svg" alt="Support" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-900">Need Help?</h5>
                                <p className="text-xs text-slate-500 font-medium">Contact our support team, we respond within 15 minutes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
