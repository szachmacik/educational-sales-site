"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Facebook,
    Instagram,
    Linkedin,
    Sparkles,
    Youtube,
    CheckCircle2,
    RefreshCw,
    Image as ImageIcon,
    Package,
    TrendingUp,
    ExternalLink
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SocialMediaHubProps {
    products?: any[];
    selectedProduct?: any;
    onSelectProduct?: (product: any) => void;
}

export function SocialMediaHub({ products = [], selectedProduct, onSelectProduct }: SocialMediaHubProps) {
    const { t, language } = useLanguage();
    const s = t.adminSettings?.workshop?.social_hub || {
        title: "Social Media Hub",
        subtitle: "Post Generator & Optimization",
        platforms: {
            instagram: "Instagram",
            facebook: "Facebook",
            linkedin: "LinkedIn",
            youtube: "YouTube"
        },
        labels: {
            select_product: "Select Product to Promote",
            pick_placeholder: "Pick from Product Library...",
            campaign_context: "Campaign Context / Prompt",
            prompt_placeholder: "What are we promoting today? (e.g., 'New Flashcard Set for Christmas')",
            ai_copy: "AI Generated Copy",
            thinking: "Thinking...",
            regenerate: "Regenerate Copy",
            copy_placeholder: "AI will generate your post content here...",
            media_asset: "Media Asset",
            auto_selected: "Auto-Selected",
            select_asset: "Select Asset",
            from_gallery: "From Product Gallery",
            viral_growth: "Viral Growth",
            score: "Score",
            ai_expectancy: "AI expects {percent}% higher engagement on {platform}.",
            live_mockup: "Live Mockup Preview",
            mockup_placeholder: "Your mockup copy will appear here...",
            export: "Export to Socials"
        }
    };

    const platforms = [
        { id: "instagram", name: s.platforms.instagram, icon: Instagram, color: "text-pink-500", bg: "bg-pink-50" },
        { id: "facebook", name: s.platforms.facebook, icon: Facebook, color: "text-blue-600", bg: "bg-blue-50" },
        { id: "linkedin", name: s.platforms.linkedin, icon: Linkedin, color: "text-indigo-600", bg: "bg-indigo-50" },
        { id: "youtube", name: s.platforms.youtube, icon: Youtube, color: "text-red-600", bg: "bg-red-50" },
    ];

    const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCopy, setGeneratedCopy] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);

    const handleSelectProduct = (product: any) => {
        onSelectProduct?.(product);
        setIsProductPickerOpen(false);
        const contextMsg = language === 'pl'
            ? `Stwórz wiralowy post promujący ${product.title} zoptymalizowany pod ${selectedPlatform}. Skup się na wysokim zaangażowaniu i wartości edukacyjnej.`
            : `Create a viral promotional post for ${product.title} optimized for ${selectedPlatform}. Focus on high engagement and educational value.`;
        setPrompt(contextMsg);
        toast.success(`Connected to ${product.title}`);
    };

    const generatePost = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "social", platform: selectedPlatform, prompt })
            });
            const data = await res.json();
            if (data.isMock) toast.info("Tryb Demo", { description: "Brak OPENAI_API_KEY w .env.local" });
            else if (!res.ok) throw new Error(data.error);
            setGeneratedCopy(data.data);
            toast.success("AI Copy Generated!");
        } catch (error: any) {
            toast.error("Generation failed", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-500">
            {/* Control Panel */}
            <Card className="lg:col-span-12 border-none premium-card-ring bg-white/40 glass-premium overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50/30 backdrop-blur-sm border-b border-white/20 p-6">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">{s.title}</CardTitle>
                        <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.subtitle}</CardDescription>
                    </div>
                    <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-white/20 shadow-inner">
                        {platforms.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPlatform(p.id)}
                                className={cn(
                                    "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                    selectedPlatform === p.id
                                        ? "bg-white shadow-md ring-1 ring-slate-100"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                                )}
                            >
                                <p.icon className={cn("h-5 w-5", selectedPlatform === p.id ? p.color : "text-slate-300")} />
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Editor Side */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.labels.select_product}</label>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsProductPickerOpen(true)}
                                    className="w-full h-14 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all justify-start gap-4 px-6 group"
                                >
                                    <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                        <Package className="h-4 w-4" />
                                    </div>
                                    <span className={cn("text-xs font-bold", selectedProduct ? "text-slate-900" : "text-slate-400")}>
                                        {selectedProduct ? selectedProduct.title : s.labels.pick_placeholder}
                                    </span>
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.labels.campaign_context}</label>
                                <textarea
                                    className="w-full h-32 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none shadow-inner"
                                    placeholder={s.labels.prompt_placeholder}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <Button
                                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                    onClick={generatePost}
                                    disabled={isGenerating || !prompt}
                                >
                                    {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin mr-3" /> : <Sparkles className="h-5 w-5 mr-3" />}
                                    {isGenerating ? s.labels.thinking : s.labels.regenerate}
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.labels.ai_copy}</label>
                                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 min-h-[120px] max-h-[300px] overflow-y-auto relative group">
                                    <p className="text-xs font-bold text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                                        {generatedCopy || s.labels.copy_placeholder}
                                    </p>
                                    {generatedCopy && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { navigator.clipboard.writeText(generatedCopy); toast.success("Copied!"); }}
                                            className="absolute top-2 right-2 rounded-xl h-8 px-3 text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Copy
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Media Side */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.labels.media_asset}</label>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] font-black uppercase">{s.labels.auto_selected}</Badge>
                                </div>
                                <div className="aspect-square rounded-[3rem] bg-slate-100/50 border border-slate-100 items-center justify-center flex relative overflow-hidden group">
                                    {selectedAsset ? (
                                        <img src={selectedAsset} alt="Selected" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <ImageIcon className="h-12 w-12" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">{s.labels.media_asset}</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <Button onClick={() => { toast.info("Podgląd posta będzie dostępny wkrótce."); }} variant="secondary" className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 shadow-2xl">
                                            {s.labels.from_gallery}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-200/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{s.labels.viral_growth}</span>
                                        </div>
                                        <span className="text-xl font-black">94%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-white w-[94%]" />
                                    </div>
                                    <p className="text-[10px] font-bold opacity-80 leading-relaxed italic">
                                        {s.labels.ai_expectancy.replace('{percent}', '24').replace('{platform}', selectedPlatform)}
                                    </p>
                                </div>
                                <Button onClick={() => { toast.info("Publikowanie w mediach społecznościowych będzie dostępne po skonfigurowaniu integracji."); }} className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]">
                                    {s.labels.export}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Product Picker */}
            <Dialog open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
                <DialogContent className="max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden p-0">
                    <DialogHeader className="p-8 bg-slate-900 text-white text-left">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">{s.labels.select_product}</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">{s.labels.pick_placeholder}</DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-3 max-h-[400px] overflow-y-auto">
                        {products.map((p) => (
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

            {/* Mockup Preview Card */}
            <Card className="lg:col-span-12 border-none premium-card-ring overflow-hidden">
                <CardHeader className="p-6 bg-slate-50/30 border-b border-white/20">
                    <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.labels.live_mockup}</CardTitle>
                </CardHeader>
                <CardContent className="p-12 flex justify-center bg-slate-50/20">
                    <div className="w-[380px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                                <span className="text-xs font-black">Twój Fanpage</span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="aspect-square bg-slate-50 flex items-center justify-center">
                            {selectedAsset ? (
                                <img src={selectedAsset} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="h-12 w-12 text-slate-200" />
                            )}
                        </div>
                        <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[250px] scrollbar-thin scrollbar-thumb-slate-200">
                            <div className="flex gap-4">
                                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                                <RefreshCw className="h-5 w-5 text-slate-300" />
                                <Send className="h-5 w-5 text-slate-300 ml-auto" />
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic break-words whitespace-pre-wrap">
                                {generatedCopy || s.labels.mockup_placeholder}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Fixed import for Send icon as it was missing in the top imports
import { Send } from "lucide-react";
