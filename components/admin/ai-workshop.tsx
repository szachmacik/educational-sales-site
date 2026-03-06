"use client";

import { useState, useEffect } from "react";
import { useLanguage, NamespaceGuard } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Sparkles,
    ImageIcon,
    Video,
    UserCircle2,
    Layout,
    Wand2,
    Download,
    Plus,
    CheckCircle2,
    RefreshCw,
    Smartphone,
    BrainCircuit,
    Package,
    ExternalLink,
    X,
    Zap
} from "lucide-react";
import { SocialMediaHub } from "./social-media-hub";
import { FlashcardGenerator } from "./flashcard-generator";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";

const STUDIOS = (w: any) => [
    { id: "images", name: w.studios.images, icon: ImageIcon, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "video", name: w.studios.video, icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "avatars", name: w.studios.avatars, icon: UserCircle2, color: "text-pink-500", bg: "bg-pink-50" },
    { id: "social", name: w.studios.social, icon: Smartphone, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "flashcards", name: w.studios.flashcards, icon: BrainCircuit, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "canva", name: w.studios.canva, icon: Layout, color: "text-teal-500", bg: "bg-teal-50" },
];

const PERSONAS = [
    { name: "Anna", role: "Primary Teacher", color: "bg-pink-100 text-pink-600" },
    { name: "Tom", role: "University Prof", color: "bg-blue-100 text-blue-600" },
    { name: "Alex", role: "Career Coach", color: "bg-emerald-100 text-emerald-600" }
];

export function AIWorkshop() {
    const { t } = useLanguage();
    const w = t.adminSettings?.workshop || {
        studio: "Studio",
        history: "History",
        studios: {
            images: "Image Studio",
            video: "Video Studio",
            avatars: "Avatar Studio",
            social: "Social Hub",
            flashcards: "Flashcards",
            canva: "Canva Studio"
        },
        actions: {
            reuse: "Reuse Prompt",
            generate: "Generate Asset",
            processing: "Processing...",
            attach: "Attach",
            change_product: "Change Product",
            connect: "Connect to Product"
        },
        labels: {
            persona: "Select AI Persona",
            script: "Script",
            prompt: "Creative Prompt",
            preview: "Preview",
            history_empty: "Your canvas awaits.",
            connect_desc: "Link this AI asset to your store inventory.",
            professional_suite: "Professional Creative Suite"
        }
    };

    const studios = useMemo(() => STUDIOS(w), [w]);
    const personas = PERSONAS;

    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeStudio, setActiveStudio] = useState<"images" | "video" | "avatars" | "canva" | "social" | "flashcards">("images");
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [generatedAssets, setGeneratedAssets] = useState<any[]>([]);
    const [selectedPersona, setSelectedPersona] = useState("Anna");
    const [viewMode, setViewMode] = useState<"studio" | "history">("studio");
    const [products, setProducts] = useState<any[]>([]);

    // Fetch real products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/admin/products");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products for workshop", error);
            }
        };
        fetchProducts();
    }, []);

    // Load history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("ai_workshop_history");
        if (saved) {
            try {
                setGeneratedAssets(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse AI history", e);
            }
        }
    }, []);

    // Save history when generatedAssets changes
    useEffect(() => {
        if (generatedAssets.length > 0) {
            localStorage.setItem("ai_workshop_history", JSON.stringify(generatedAssets));
        }
    }, [generatedAssets]);

    const currentStudio = useMemo(() => studios.find(s => s.id === activeStudio), [studios, activeStudio]);

    const handleGenerate = useCallback(async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: activeStudio === 'avatars' ? 'avatars' : activeStudio === 'video' ? 'video' : 'image',
                    prompt: prompt,
                    style: selectedPersona
                })
            });
            const data = await res.json();
            if (data.isMock) toast.info("Tryb Demo", { description: "Brak OPENAI_API_KEY." });
            else if (!res.ok) throw new Error(data.error);

            const newAsset = {
                id: Date.now(),
                type: activeStudio,
                url: data.data || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60",
                prompt,
                productId: selectedProduct?.id,
                productTitle: selectedProduct?.title,
                persona: activeStudio === 'avatars' ? selectedPersona : undefined,
                timestamp: new Date().toISOString()
            };
            setGeneratedAssets(prev => [newAsset, ...prev]);
            setPrompt("");
            toast.success("Generowanie zakończone sukcesem!");
        } catch (error: any) {
            toast.error("Błąd generowania", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    }, [prompt, activeStudio, selectedProduct, selectedPersona]);

    const handleAttach = useCallback(async (product: any) => {
        try {
            // Find the asset we want to attach (e.g. the most recent one)
            const recentAsset = generatedAssets.find(a => a.type === activeStudio);
            if (!recentAsset) {
                toast.error("No asset to attach");
                return;
            }

            // 1. Update the local products list
            const updatedProducts = products.map(p => {
                if (p.id === product.id) {
                    const currentImages = Array.isArray(p.images) ? p.images : [p.image];
                    return {
                        ...p,
                        images: [...currentImages, recentAsset.url]
                    };
                }
                return p;
            });

            // 2. Persist to API
            const response = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProducts)
            });

            if (response.ok) {
                setProducts(updatedProducts);
                setSelectedProduct(product);
                setIsProductPickerOpen(false);
                toast.success(`Asset successfully published to "${product.title}"`);
            } else {
                throw new Error("Failed to save product");
            }
        } catch (error) {
            toast.error("Failed to persist change to backend");
        }
    }, [generatedAssets, activeStudio, products]);

    return (
        <NamespaceGuard dictionary={t} namespace="adminSettings">
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Studio Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-2xl border border-white/20 shadow-inner">
                        <Button
                            variant={viewMode === "studio" ? "default" : "ghost"}
                            onClick={() => setViewMode("studio")}
                            className={cn("rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest", viewMode === "studio" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                        >{w.studio}</Button>
                        <Button
                            variant={viewMode === "history" ? "default" : "ghost"}
                            onClick={() => setViewMode("history")}
                            className={cn("rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest", viewMode === "history" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                        >{w.history} ({generatedAssets.length})</Button>
                    </div>
                    <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-white/20 shadow-inner flex-wrap">
                        {studios.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => { setActiveStudio(s.id as any); setViewMode("studio"); }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                                    activeStudio === s.id
                                        ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-100"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                                )}
                            >
                                <s.icon className={cn("h-4 w-4", activeStudio === s.id ? s.color : "text-slate-300")} />
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === "history" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {generatedAssets.map((asset) => (
                            <Card key={asset.id} className="border-none premium-card-ring glass-premium overflow-hidden group">
                                <div className="aspect-video relative overflow-hidden">
                                    <img src={asset.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <Badge className="bg-black/60 backdrop-blur-md text-white border-none text-[8px] font-black uppercase">{asset.type}</Badge>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <CardContent className="p-5">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            <span>{new Date(asset.timestamp).toLocaleDateString()}</span>
                                            <span>{new Date(asset.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 line-clamp-3 italic leading-relaxed break-words px-1 max-w-full">"{asset.prompt}"</p>
                                        <div className="flex items-center gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9 text-[10px] font-black uppercase" onClick={() => { setPrompt(asset.prompt); setViewMode("studio"); }}>{w.actions.reuse}</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {activeStudio === "social" ? (
                            <div className="lg:col-span-12">
                                <SocialMediaHub
                                    products={products}
                                    selectedProduct={selectedProduct}
                                    onSelectProduct={setSelectedProduct}
                                />
                            </div>
                        ) : activeStudio === "flashcards" ? (
                            <div className="lg:col-span-12">
                                <FlashcardGenerator
                                    products={products}
                                    selectedProduct={selectedProduct}
                                    onSelectProduct={setSelectedProduct}
                                />
                            </div>
                        ) : (
                            <>
                                <Card className="lg:col-span-4 border-none premium-card-ring ai-surface-glow bg-white/80 backdrop-blur-sm">
                                    <CardHeader className={cn(
                                        "p-6 rounded-t-3xl text-white transition-all duration-500",
                                        activeStudio === 'avatars' ? "bg-pink-500" : activeStudio === 'canva' ? "bg-teal-500" : (currentStudio ? currentStudio.bg.replace('bg-', 'bg-').replace('-50', '-500') : "bg-slate-900")
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                {currentStudio ? <currentStudio.icon className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-black uppercase tracking-tight">{currentStudio?.name || w.studios.images}</CardTitle>
                                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{w.labels.professional_suite}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        {activeStudio === 'avatars' && (
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase text-slate-400">{w.labels.persona}</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {personas.map((p) => (
                                                        <button
                                                            key={p.name}
                                                            onClick={() => setSelectedPersona(p.name)}
                                                            className={cn(
                                                                "p-2 rounded-xl border transition-all text-[10px] font-bold",
                                                                selectedPersona === p.name
                                                                    ? "border-pink-500 bg-pink-50 text-pink-700"
                                                                    : "border-slate-100 text-slate-600 hover:border-pink-300 hover:bg-pink-50"
                                                            )}
                                                        >
                                                            {p.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase text-slate-400">{activeStudio === 'avatars' ? w.labels.script : w.labels.prompt}</Label>
                                                <textarea
                                                    className="w-full h-32 rounded-3xl border border-slate-100 bg-slate-50/50 p-4 text-xs focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none font-medium shadow-inner"
                                                    placeholder={activeStudio === 'avatars' ? "..." : "..."}
                                                    value={prompt}
                                                    onChange={(e) => setPrompt(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                                onClick={handleGenerate}
                                                disabled={isGenerating || !prompt}
                                            >
                                                {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin mr-3" /> : (activeStudio === 'avatars' ? <UserCircle2 className="h-5 w-5 mr-3" /> : <Wand2 className="h-5 w-5 mr-3" />)}
                                                {isGenerating ? w.actions.processing : w.actions.generate}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="lg:col-span-8 space-y-6">
                                    <div className="flex items-center justify-between px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">{w.labels.preview}</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {isGenerating && (
                                            <Card className="aspect-square rounded-[2.5rem] border-2 border-dashed border-indigo-100 bg-indigo-50/20 flex flex-col items-center justify-center gap-4 animate-pulse">
                                                <Sparkles className="h-12 w-12 text-indigo-400" />
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{w.actions.processing}</p>
                                            </Card>
                                        )}

                                        {generatedAssets.filter(a => a.type === activeStudio).length === 0 && !isGenerating && (
                                            <div className="md:col-span-2 py-40 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                                <ImageIcon className="h-12 w-12 text-slate-300" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{w.labels.history_empty}</p>
                                            </div>
                                        )}

                                        {generatedAssets.filter(a => a.type === activeStudio).slice(0, 4).map((asset) => (
                                            <Card key={asset.id} className="group overflow-hidden rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/20 bg-white relative animate-in zoom-in-95 duration-500">
                                                <div className="aspect-square relative overflow-hidden">
                                                    <img src={asset.url} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-8">
                                                        <div className="flex gap-2">
                                                            <Button onClick={() => setIsProductPickerOpen(true)} className="flex-1 h-12 rounded-2xl bg-white text-slate-900 font-extrabold text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-50">
                                                                <Package className="h-4 w-4" />
                                                                {selectedProduct ? w.actions.change_product : w.actions.attach}
                                                            </Button>
                                                            <Button onClick={() => { toast.info("Eksport materiałów będzie dostępny wkrótce."); }} size="icon" className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-50/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-emerald-500 text-white rounded-full p-1"><CheckCircle2 className="h-3 w-3" /></Badge>
                                                        <span className="text-[10px] font-extrabold text-slate-500 uppercase truncate max-w-[120px]">
                                                            {selectedProduct ? `Attached: ${selectedProduct.title}` : "Ready"}
                                                        </span>
                                                    </div>
                                                    <ExternalLink className="h-4 w-4 text-slate-300" />
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Product Picker */}
                <Dialog open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
                    <DialogContent className="max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden p-0">
                        <DialogHeader className="p-8 bg-slate-900 text-white">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">{w.actions.connect}</DialogTitle>
                            <CardDescription className="text-slate-400 font-medium">{w.labels.connect_desc}</CardDescription>
                        </DialogHeader>
                        <div className="p-8 space-y-3 max-h-[400px] overflow-y-auto">
                            {products.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => handleAttach(p)}
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
        </NamespaceGuard>
    );
}
