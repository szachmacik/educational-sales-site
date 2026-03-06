"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    BookOpen,
    Download,
    Palette,
    Wand2,
    RefreshCw,
    Plus,
    Layers,
    ExternalLink,
    CheckCircle2,
    Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Flashcard {
    id: string;
    front: string;
    back: string;
    imageUrl?: string;
}

interface FlashcardGeneratorProps {
    products?: any[];
    selectedProduct?: any;
    onSelectProduct?: (product: any) => void;
}

export function FlashcardGenerator({ products = [], selectedProduct, onSelectProduct }: FlashcardGeneratorProps) {
    const { t, language } = useLanguage();
    const f = t.adminSettings?.workshop?.flashcards || {
        title: "AI Flashcard Studio",
        subtitle: "Transform topics into beautiful, ready-to-print flashcard sets.",
        badge: "Smart Learning",
        branding_kit: "Branding Kit",
        export_canva: "Export to Canva",
        smart_generator: "Smart Generator",
        topic_label: "Topic or Context",
        topic_placeholder: "e.g. Life Cycle of a Frog",
        style_label: "Visual Style",
        styles: {
            academic: "Academic",
            playful: "Playful",
            minimal: "Minimal",
            canva_ai: "Canva AI"
        },
        generate_btn: "Generate Deck",
        generating: "Generating...",
        live_preview: "Live Preview",
        cards_prepared: "{count} Cards Prepared",
        empty: "No cards generated yet",
        add_custom: "Add Custom Card"
    };

    const [topic, setTopic] = useState("");
    const [style, setStyle] = useState("academic");
    const [isGenerating, setIsGenerating] = useState(false);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);

    const handleSelectProduct = (product: any) => {
        onSelectProduct?.(product);
        setIsProductPickerOpen(false);
        setTopic(product.title);
        toast.success(`Context set to: ${product.title}`);
    };

    const generateFlashcards = async () => {
        if (!topic) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "flashcards", prompt: topic, style })
            });
            const data = await res.json();
            if (data.isMock) toast.info("Tryb Demo", { description: "Dodaj OPENAI_API_KEY aby użyć prawdziwego AI." });
            else if (!res.ok) throw new Error(data.error);
            setFlashcards(data.data);
            toast.success("Deck generated successfully!");
        } catch (error: any) {
            toast.error("Generation failed", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Generator Controls */}
            <Card className="lg:col-span-4 border-none premium-card-ring bg-white/40 glass-premium overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black uppercase tracking-widest">{f.badge}</Badge>
                        <Wand2 className="h-4 w-4 text-indigo-400" />
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{f.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-xs font-medium leading-relaxed">{f.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            {f.topic_label}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsProductPickerOpen(true)}
                                className="h-6 px-2 text-[8px] border-slate-200 hover:bg-slate-100 rounded-lg gap-1.5"
                            >
                                <Package className="h-3 w-3" />
                                {selectedProduct ? selectedProduct.title : "Link Product"}
                            </Button>
                        </label>
                        <textarea
                            className="w-full h-32 rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none shadow-inner"
                            placeholder={f.topic_placeholder}
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.style_label}</label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(f.styles).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setStyle(key)}
                                    className={cn(
                                        "h-12 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ring-offset-2",
                                        style === key
                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02] ring-2 ring-slate-900"
                                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                                    )}
                                >
                                    {label as string}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
                        onClick={generateFlashcards}
                        disabled={isGenerating || !topic}
                    >
                        {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin mr-3" /> : <Sparkles className="h-5 w-5 mr-3" />}
                        {isGenerating ? f.generating : f.generate_btn}
                    </Button>

                    <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                        <Button onClick={() => { toast.info("Eksport do PDF będzie dostępny wkrótce."); }} variant="outline" className="h-12 rounded-xl text-[9px] font-black uppercase border-slate-100">
                            {f.branding_kit}
                        </Button>
                        <Button onClick={() => { toast.info("Eksport do Anki będzie dostępny wkrótce."); }} variant="outline" className="h-12 rounded-xl text-[9px] font-black uppercase border-slate-100 gap-2">
                            <Layers className="h-3.5 w-3.5 text-indigo-500" />
                            {f.export_canva}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Area */}
            <Card className="lg:col-span-8 border-none premium-card-ring bg-slate-50/50 overflow-hidden min-h-[600px] flex flex-col">
                <CardHeader className="bg-white/80 backdrop-blur-sm border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">{f.live_preview}</CardTitle>
                        <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {f.cards_prepared.replace('{count}', flashcards.length.toString())}
                        </CardDescription>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => { toast.info("Zapis do biblioteki będzie dostępny wkrótce."); }} variant="secondary" className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest bg-white shadow-sm border-slate-100">
                            {f.add_custom}
                        </Button>
                        <Button onClick={() => toast.info("Otwieranie kreatora...")} disabled={flashcards.length === 0} className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg shadow-slate-200">
                            <Download className="h-3.5 w-3.5 mr-2" />
                            PDF Export
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-12 flex-1 flex flex-col items-center justify-center">
                    {flashcards.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-8 w-full">
                            {flashcards.map((card, idx) => (
                                <div key={card.id} className="group perspective-1000">
                                    <div className="relative aspect-[3/4] w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] cursor-pointer">
                                        {/* Front */}
                                        <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center backface-hidden">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600">
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">{card.front}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-auto">Front Side • Card #{idx + 1}</p>
                                        </div>
                                        {/* Back */}
                                        <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center text-center backface-hidden [transform:rotateY(180deg)]">
                                            <Sparkles className="h-8 w-8 text-indigo-400 mb-6 opacity-40" />
                                            <div className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/50 pr-2"><p className="text-sm md:text-base font-bold text-white leading-relaxed break-words">{card.back}</p></div>
                                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-auto">AI Generated Definition</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="h-24 w-24 rounded-[2rem] bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-100 mx-auto mb-6">
                                <Palette className="h-12 w-12" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{f.empty}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Product Picker */}
            <Dialog open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
                <DialogContent className="max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden p-0">
                    <DialogHeader className="p-8 bg-slate-900 text-white text-left">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Select Context</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">Link a product to auto-fill the topic.</DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-3 max-h-[400px] overflow-y-auto">
                        {products.map((p: any) => (
                            <div
                                key={p.id}
                                onClick={() => handleSelectProduct(p)}
                                className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 hover:border-indigo-500/50 hover:bg-indigo-50/50 cursor-pointer transition-all group"
                            >
                                <div className="h-16 w-16 rounded-2xl bg-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                                </div>
                                <span className="font-extrabold text-slate-700 group-hover:text-indigo-900 text-lg">{p.title}</span>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
