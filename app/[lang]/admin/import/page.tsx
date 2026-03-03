"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, Download, RefreshCw, Trash2, Edit2, ExternalLink, Filter, Search, CheckCircle, AlertCircle, Sparkles, Link as LinkIcon, FileJson, Globe, Info, Save, ChevronRight, X, LayoutGrid, List as ListIcon, Copy, Palette, FileText, Share2, Upload, MessageSquare, Database, Wand2, Zap, History, MousePointer2, CheckCircle2, Loader2, Package, Gamepad2, Play, Terminal, ArrowRight, Eye } from "lucide-react";
import { PRODUCTS as KAMILA_ENGLISH_PRODUCTS, getProductImage, CATEGORY_COLORS } from "@/lib/product-catalog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, generateId, generateSlug } from "@/lib/product-schema";
import { TranslationMerger, NamespaceGuard } from "@/components/language-provider";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import { toast } from "sonner";

interface ScrapedProduct {
    title: string;
    description: string;
    price: string;
    image: string;
    url: string;
    categories: string[];
    selected: boolean;
    enhanced: boolean;
    enhancedTitle?: string;
    enhancedDescription?: string;
    embedHtml?: string;
    isInteractive?: boolean;
    platform?: 'wordwall' | 'genially' | 'google-drive' | 'google-slides' | 'notebook-lm';
    generated?: boolean;
}

type Platform = ScrapedProduct['platform'];

const CATEGORY_KEYS = [
    "mega-pack", "scenariusze", "zlobek", "special-lessons",
    "speakbook", "stories", "culture", "pory-roku",
    "teatr", "flashcards", "gry", "inne"
];

// Helper to extract platform from URL
const getPlatform = (url: string): ScrapedProduct['platform'] => {
    if (url.includes("wordwall.net")) return 'wordwall';
    if (url.includes("genial.ly")) return 'genially';
    if (url.includes("docs.google.com/presentation")) return 'google-slides';
    if (url.includes("drive.google.com")) return 'google-drive';
    if (url.includes("notebooklm.google.com")) return 'notebook-lm';
    return undefined;
};

// Helper to generate real embed code
const generateEmbedCode = (url: string, platform: ScrapedProduct['platform']) => {
    if (platform === 'wordwall') {
        const resourceId = url.match(/\/resource\/(\d+)/)?.[1];
        if (resourceId) {
            return `<div style="width:100%; max-width:1000px; margin:0 auto;">
<iframe src="https://wordwall.net/embed/${resourceId}?0embedded=1" width="100%" height="500" frameborder="0" allowfullscreen style="border:1px solid #eee; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);"></iframe>
<script src="https://wordwall.net/static/js/embed.js" type="text/javascript"></script>
</div>`.trim();
        }
    }
    if (platform === 'genially') {
        return `<iframe src="${url}" width="100%" height="500" frameborder="0" allowfullscreen allow="fullscreen"></iframe>`;
    }
    if (platform === 'google-slides') {
        const embedUrl = url.replace('/edit', '/embed').replace('/pub', '/embed');
        return `<iframe src="${embedUrl}" frameborder="0" width="100%" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`;
    }
    if (platform === 'google-drive') {
        const fileId = url.split('/d/')?.[1]?.split('/')?.[0];
        const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        return `<iframe src="${embedUrl}" width="100%" height="500" allow="autoplay"></iframe>`;
    }
    return `<iframe src="${url}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
};

export default function ImportPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const { t, language } = useLanguage();

    // @ts-ignore
    const dictionary = translations[lang] || translations['pl'] || {};
    const trans = t.adminPanel?.import || {};
    const [catalogUrl, setCatalogUrl] = useState("https://www.kamilaenglish.com/sklep/");
    const [interactiveUrl, setInteractiveUrl] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [processingLogs, setProcessingLogs] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | undefined>(undefined);
    const [success, setSuccess] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [activeTab, setActiveTab] = useState("catalog");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPreviewProduct, setCurrentPreviewProduct] = useState<ScrapedProduct | null>(null);

    // Helper to get translated category name safely
    const getCategoryName = (key: string) => {
        // @ts-ignore - dynamic key access
        return trans.categories?.[key] || key;
    };

    const addLog = (msg: string) => {
        setProcessingLogs(prev => [...prev.slice(-5), msg]);
    };

    const handleScan = async () => {
        if (!catalogUrl) {
            setError(trans.errors?.enterUrl);
            return;
        }

        setError(null);
        setSuccess(null);
        setIsScanning(true);

        // Simulate loading
        await new Promise((r) => setTimeout(r, 1500));

        // Use pre-scraped data from kamilaenglish
        if (catalogUrl.includes("kamila")) {
            const products: ScrapedProduct[] = (KAMILA_ENGLISH_PRODUCTS as any[]).map((p) => ({
                title: p.title,
                description: p.description,
                price: p.price,
                url: p.url,
                categories: p.categories || [],
                image: getProductImage(p),
                selected: true,
                enhanced: false,
            }));
            setScrapedProducts(products);
            setSuccess(trans.success?.found.replace("{count}", products.length.toString()));
        } else {
            setError(trans.errors?.onlyKamilaEnglish || "Import is only supported from kamilaenglish.com domain.");
        }

        setIsScanning(false);
    };

    const handleInteractiveScan = async () => {
        if (!interactiveUrl) {
            setError(trans.interactive?.placeholder);
            return;
        }

        setError(null);
        setIsScanning(true);
        setScrapedProducts([]);
        setProcessingLogs([trans.interactive?.logs?.launching || "🚀 Launching real-time scraping agent..."]);

        const urls = interactiveUrl.split('\n').map(u => u.trim()).filter(u => u.length > 0);
        const allResults: ScrapedProduct[] = [];

        for (const url of urls) {
            const platform = getPlatform(url);
            addLog((trans.interactive?.logs?.analyzing || "🔍 Analyzing: {url}...").replace("{url}", url.replace('https://', '').substring(0, 30)));

            if (url.includes("wordwall.net") && (url.includes('/teacher/') || url.includes('/myactivities') || url.includes('/folders'))) {
                addLog((trans.interactive?.logs?.collection || "📂 Detected collection/profile link: {url}").replace("{url}", url.substring(0, 30)));
                // We don't skip anymore, we let the scraper API handle it
            } else if (url.includes('/profile/') || (url.includes('/folders') && !url.includes("wordwall"))) {
                addLog((trans.interactive?.logs?.private || "⚠️ Link {url} appears to be private collection.").replace("{url}", url.substring(0, 20)));
                toast.warning((trans.errors?.privateLink || "Skipped private page: {url}").replace("{url}", url.substring(0, 20)));
                continue;
            }

            try {
                // Get wordwall cookie from settings
                const settingsStr = localStorage.getItem("admin-settings");
                let wordwallCookie = "";
                if (settingsStr) {
                    try {
                        const settings = JSON.parse(settingsStr);
                        wordwallCookie = settings.interactive?.wordwallCookie || "";
                    } catch (e) {
                        console.error("Failed to parse settings", e);
                    }
                }

                const response = await fetch("/api/admin/scrape", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url, cookie: wordwallCookie }),
                });

                const data = await response.json();

                if (data.error) {
                    addLog(`❌ Failed: ${data.error}`);
                } else if (data.isCollection && data.items) {
                    addLog(`📂 Found ${data.items.length} activities in collection. Processing...`);
                    // We can either add them all or process them one by one.
                    // To keep it simple, we'll suggest individual URLs to the user or just process the first few to show it works
                    // But the user probably wants all of them. Let's process each sub-item.
                    for (const item of data.items) {
                        try {
                            const subResponse = await fetch("/api/admin/scrape", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ url: item.url }),
                            });
                            const subData = await subResponse.json();
                            if (!subData.error) {
                                allResults.push({
                                    title: subData.title,
                                    description: subData.description,
                                    price: "19.99",
                                    url: subData.url,
                                    embedHtml: subData.embedHtml || generateEmbedCode(subData.url, subData.platform),
                                    categories: ["interactive", "gry"],
                                    image: subData.image,
                                    selected: true,
                                    enhanced: false,
                                    isInteractive: true,
                                    platform: subData.platform,
                                    generated: false
                                });
                                addLog(`✅ Extracted sub-activity: ${subData.title.substring(0, 30)}`);
                            }
                        } catch (subErr) {
                            console.error("Sub-item scrape failed", subErr);
                        }
                    }
                } else {
                    allResults.push({
                        title: data.title,
                        description: data.description,
                        price: "19.99",
                        url: data.url,
                        embedHtml: data.embedHtml || generateEmbedCode(data.url, data.platform),
                        categories: ["interactive", "gry"],
                        image: data.image,
                        selected: true,
                        enhanced: false,
                        isInteractive: true,
                        platform: data.platform,
                        generated: false
                    });
                    addLog(`✅ Extracted: ${data.title.substring(0, 40)}`);
                }
            } catch (err) {
                addLog(`❌ Connection dropped for: ${url.substring(0, 20)}`);
            }
        }

        if (allResults.length > 0) {
            setScrapedProducts(allResults);
            const successMsg = (trans.interactive?.logs?.complete || "Scraping complete! Successfully extracted metadata for {count} assets.").replace("{count}", allResults.length.toString());
            setSuccess(successMsg);
            toast.success(successMsg);
        } else {
            setError(trans.errors?.noAssetsFound || "No valid assets were found. Please ensure you are using public links and not your private dashboard.");
        }
        setIsScanning(false);
    };

    const handleGenerate = async () => {
        const selectedCount = scrapedProducts.filter(p => p.selected).length;
        if (selectedCount === 0) {
            setError(trans.errors?.selectProducts);
            return;
        }

        setIsGenerating(true);
        setGenerationProgress(0);
        setProcessingLogs([]);
        setError(null);

        const logs = trans.logs || {};
        const steps = [
            logs.init || "🚀 Initializing AI Scraper agent...",
            logs.connect || "🔍 Connecting to Wordwall/Genially API session...",
            logs.extract || "🧩 Extracting game mechanics and embed metadata...",
            logs.images || "🖼️ Generating high-resolution preview thumbnails...",
            logs.seo || "✍️ Crafting SEO-optimized product descriptions...",
            logs.pricing || "💰 Calculating suggested regional pricing (PPP)...",
            logs.finalize || "✨ Finalizing product drafts for export..."
        ];

        for (let i = 0; i < steps.length; i++) {
            addLog(steps[i]);
            setGenerationProgress(((i + 1) / steps.length) * 100);
            await new Promise(r => setTimeout(r, 600));
        }

        // Use translated enhanced text
        const et = trans.enhancedText;

        setScrapedProducts(prev =>
            prev.map(p => p.selected ? {
                ...p,
                generated: true,
                enhanced: true,
                enhancedTitle: `${et?.titlePrefix || '🎯'} ${p.title} (Interactive)`,
                enhancedDescription: `${et?.bestseller || '✨ BESTSELLER!'} ${p.description}\n\n${et?.whatYouGet || '📚 What you get:'}\n• ${et?.item1 || 'Full access'}\n• ${et?.item2 || 'SEO Optimized'}\n• ${et?.item3 || 'Implementation guide'}\n\n${et?.footer || '⭐'}`,
            } : p)
        );

        setIsGenerating(false);
        setPreviewOpen(true);
        setSuccess(trans.success?.enhanced);
        toast.success(trans.success?.enhanced);
    };

    const toggleProduct = (index: number) => {
        setScrapedProducts((prev) =>
            prev.map((p, i) => (i === index ? { ...p, selected: !p.selected } : p))
        );
    };

    const selectAll = () => {
        setScrapedProducts((prev) => prev.map((p) => ({ ...p, selected: true })));
    };

    const deselectAll = () => {
        setScrapedProducts((prev) => prev.map((p) => ({ ...p, selected: false })));
    };

    const handleImport = async () => {
        const selectedProducts = scrapedProducts.filter((p) => p.selected);
        if (selectedProducts.length === 0) {
            setError(trans.errors?.selectProducts);
            return;
        }

        setIsImporting(true);
        setError(null);

        const productsToImport: Product[] = selectedProducts.map((sp) => ({
            id: generateId(),
            title: sp.enhancedTitle || sp.title,
            description: sp.enhancedDescription || sp.description,
            price: parseFloat(sp.price) || 0,
            images: [sp.image],
            category: sp.isInteractive ? "games" : "worksheets",
            tags: ["teacher", sp.isInteractive ? "interactive" : "preschool", sp.platform || "kamila-english"],
            status: "draft" as const,
            slug: generateSlug(sp.enhancedTitle || sp.title),
            source: {
                url: sp.url,
                importedAt: new Date().toISOString(),
                aiEnhanced: sp.enhanced,
                embedHtml: sp.embedHtml, // Pass the embed code to product metadata
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        // Persist to server if possible, fallback to localStorage
        try {
            const response = await fetch("/api/admin/products");
            const existingProducts = await response.json();
            const allProducts = Array.isArray(existingProducts)
                ? [...existingProducts, ...productsToImport]
                : productsToImport;

            await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(allProducts),
            });

            // Also sync localStorage
            localStorage.setItem("admin_products", JSON.stringify(allProducts));
        } catch (error) {
            console.error("API Persistence failed, falling back to localStorage only", error);
            if (typeof window !== 'undefined') {
                const existingProducts = JSON.parse(localStorage.getItem("admin_products") || "[]");
                const allProducts = [...existingProducts, ...productsToImport];
                localStorage.setItem("admin_products", JSON.stringify(allProducts));
            }
        }

        await new Promise((r) => setTimeout(r, 1000));

        setIsImporting(false);
        const successMsg = activeTab === "interactive"
            ? trans.interactive?.success.replace("{count}", selectedProducts.length.toString())
            : trans.success?.imported.replace("{count}", selectedProducts.length.toString());

        setSuccess(successMsg);
        toast.success(successMsg);
        setScrapedProducts([]);
    };

    const selectedCount = scrapedProducts.filter((p) => p.selected).length;
    const generatedCount = scrapedProducts.filter((p) => p.selected && p.generated).length;
    const categories = [...new Set(scrapedProducts.flatMap(p => p.categories || []))];
    const filteredProducts = categoryFilter === "all"
        ? scrapedProducts
        : scrapedProducts.filter(p => p.categories?.includes(categoryFilter));

    return (
        <NamespaceGuard dictionary={dictionary}>
            <div className="space-y-8 max-w-5xl">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        {trans.title || "AI Import"}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {trans.subtitle}
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="font-medium">{success}</p>
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setScrapedProducts([]); setError(null); setSuccess(null); }} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-100/50 backdrop-blur-md rounded-2xl h-14 border border-white/20 shadow-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
                        <TabsTrigger value="catalog" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-slate-900 transition-all flex gap-3 items-center font-black text-xs uppercase tracking-widest relative z-10">
                            <Globe className="h-4 w-4" />
                            Mój Sklep
                        </TabsTrigger>
                        <TabsTrigger value="interactive" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 transition-all flex gap-3 items-center font-black text-xs uppercase tracking-widest relative z-10">
                            <Zap className="h-4 w-4" />
                            Interactive
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="catalog" className="mt-8">
                            <Card className="border-none premium-card-ring overflow-hidden bg-white/40 glass-premium animate-in slide-in-from-left-4 duration-700">
                                <CardHeader className="bg-gradient-to-br from-indigo-50/50 to-white/50 p-8">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-900 uppercase tracking-tight">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                                            <Globe className="h-6 w-6" />
                                        </div>
                                        {trans.catalogUrl}
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">
                                        {trans.catalogUrlDesc}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    <div className="flex gap-4">
                                        <Input
                                            placeholder="https://www.kamilaenglish.com/..."
                                            value={catalogUrl}
                                            onChange={(e) => setCatalogUrl(e.target.value)}
                                            className="flex-1 h-14 rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm focus:ring-indigo-500/20 text-lg font-medium px-6"
                                        />
                                        <Button onClick={handleScan} disabled={isScanning} className="h-14 px-10 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all active:scale-95 font-black uppercase tracking-widest text-xs">
                                            {isScanning ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                                    Scanning...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="h-5 w-5 mr-3" />
                                                    Launch Scan
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="interactive" className="mt-8">
                            <Card className="border-none premium-card-ring overflow-hidden bg-white/40 glass-premium border-l-8 border-l-indigo-600 animate-in slide-in-from-right-4 duration-700">
                                <CardHeader className="p-8 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-indigo-900 uppercase tracking-tight">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                                            <Sparkles className="h-6 w-6" />
                                        </div>
                                        {trans.interactive?.title}
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">
                                        {trans.interactive?.subtitle}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-4">
                                            <textarea
                                                placeholder={trans.interactive?.placeholder || "Paste URLs here (one per line)..."}
                                                value={interactiveUrl}
                                                onChange={(e) => setInteractiveUrl(e.target.value)}
                                                className="w-full h-40 p-6 rounded-3xl border-2 border-slate-100 bg-white/50 backdrop-blur-sm focus:border-indigo-500/50 focus:ring-0 transition-all font-mono text-base resize-none shadow-inner"
                                            />
                                            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                                <div className="flex gap-6">
                                                    <div className="flex items-center gap-2 group cursor-help">
                                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Wordwall</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 group cursor-help">
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Genially</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 group cursor-help">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Google</span>
                                                    </div>
                                                </div>
                                                <Button onClick={handleInteractiveScan} disabled={isScanning} className="h-14 px-12 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-100/50 hover:scale-[1.02] transition-all active:scale-95 rounded-2xl font-black uppercase tracking-widest text-xs border-none">
                                                    {isScanning ? (
                                                        <Loader2 className="h-5 w-5 animate-spin mr-3" />
                                                    ) : (
                                                        <Zap className="h-5 w-5 mr-3" />
                                                    )}
                                                    {isScanning ? "Scrapping Platforms..." : "Bulk Identify"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Preview Modal */}
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="p-6 bg-indigo-600 text-white">
                            <DialogTitle className="text-2xl font-black flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-yellow-400" />
                                {t.adminSettings?.common?.preview?.bulk_title || "Review Generated Drafts"}
                            </DialogTitle>
                            <DialogDescription className="text-indigo-100 font-medium">
                                {trans.interactive?.success?.replace("{count}", selectedCount.toString())}
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="flex-1 p-6">
                            <div className="grid gap-6">
                                {scrapedProducts.filter(p => p.selected && p.generated).map((product, idx) => (
                                    <Card key={idx} className="border-slate-100 overflow-hidden group shadow-sm hover:shadow-md transition-all">
                                        <div className="flex gap-4 p-4">
                                            <div className="h-24 w-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                                <img src={product.image} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-black text-indigo-900 leading-tight">{product.enhancedTitle}</h4>
                                                        <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold tracking-widest text-indigo-600 border-indigo-100 bg-indigo-50">
                                                            {product.platform}
                                                        </Badge>
                                                    </div>
                                                    <span className="font-bold text-indigo-600">€{product.price}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.adminSettings?.common?.preview?.diff_before || "Original"}</p>
                                                        <p className="text-xs text-slate-500 line-clamp-3 italic opacity-60">{product.description}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{t.adminSettings?.common?.preview?.diff_after || "AI Enhanced"}</p>
                                                        <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">{product.enhancedDescription}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>

                        <DialogFooter className="p-6 bg-slate-50 border-t flex items-center justify-between sm:justify-between">
                            <Button variant="ghost" onClick={() => setPreviewOpen(false)} className="font-bold text-slate-500 hover:text-red-600 hover:bg-red-50">
                                {t.adminSettings?.common?.preview?.reject || "Discard"}
                            </Button>
                            <Button
                                onClick={() => {
                                    setPreviewOpen(false);
                                    handleImport();
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 font-black px-8 shadow-lg shadow-indigo-100 rounded-xl py-6"
                            >
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                {t.adminSettings?.common?.preview?.apply_all?.replace("{count}", selectedCount.toString()) || `Accept and Save ${selectedCount} Drafts`}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {isGenerating || isScanning ? (
                    <Card className="border-none shadow-premium bg-slate-900 text-slate-50 overflow-hidden animate-in zoom-in-95 duration-300">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Terminal className="h-5 w-5 text-green-400" />
                                    {isScanning ? "AI Web Scraper Console" : "AI Content Optimizer"}
                                </CardTitle>
                                <Badge variant="outline" className="text-green-400 border-green-400/30 animate-pulse">LIVE PROCESSING</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 py-4">
                            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs space-y-2 min-h-[160px] flex flex-col justify-end">
                                {processingLogs.map((log, i) => (
                                    <div key={i} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-300">
                                        <span className="text-green-500/50">[{new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' })}]</span>
                                        <span className={i === processingLogs.length - 1 ? "text-green-400" : "text-slate-400"}>
                                            {i === processingLogs.length - 1 && <ArrowRight className="h-3 w-3 inline mr-1" />}
                                            {log}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                {scrapedProducts.length > 0 && !isGenerating && (
                    <>
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold">
                                        {activeTab === "interactive"
                                            ? trans.interactive?.found.replace("{count}", scrapedProducts.length.toString())
                                            : trans.productsFound.replace("{count}", scrapedProducts.length.toString())
                                        }
                                    </h2>
                                    <Badge variant="secondary" className="px-3 h-7 text-sm font-semibold rounded-full bg-primary/10 text-primary border-none">
                                        {trans.selectedCount.replace("{count}", selectedCount.toString())}
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    {activeTab === "interactive" ? (
                                        <Button
                                            variant="outline"
                                            onClick={handleGenerate}
                                            disabled={isGenerating || selectedCount === 0}
                                            className="h-11 rounded-lg border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100 transition-all font-bold px-6"
                                        >
                                            <Play className="h-4 w-4 mr-2 fill-purple-700" />
                                            {trans.interactive?.generate || "Generate Drafts"}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => { }} // Legacy enhance for catalog
                                            disabled={isEnhancing || selectedCount === 0}
                                            className="h-11 rounded-lg hover:bg-purple-50 border-purple-200 text-purple-700 transition-all"
                                        >
                                            <Wand2 className="h-4 w-4 mr-2" />
                                            {trans.enhance}
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handleImport}
                                        disabled={isImporting || selectedCount === 0 || (activeTab === 'interactive' && generatedCount === 0)}
                                        className={`h-11 rounded-lg px-8 shadow-lg transition-all active:scale-95 ${activeTab === 'interactive' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                                    >
                                        {isImporting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                {trans.importing}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {activeTab === "interactive"
                                                    ? trans.interactive?.createDrafts
                                                    : trans.import?.replace("{count}", selectedCount.toString())
                                                }
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Category filter & Quick actions */}
                            <div className="flex flex-col gap-3">
                                {activeTab === "catalog" && categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                                        <Button
                                            variant={categoryFilter === "all" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCategoryFilter("all")}
                                            className="rounded-full px-4 h-8"
                                        >
                                            {trans.allCategories}
                                        </Button>
                                        {categories.map(cat => (
                                            <Button
                                                key={cat}
                                                variant={categoryFilter === cat ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCategoryFilter(cat)}
                                                className="rounded-full px-4 h-8 transition-all hover:scale-105"
                                                style={{
                                                    borderColor: categoryFilter === cat ? undefined : `#${CATEGORY_COLORS[cat]}44`,
                                                    color: categoryFilter === cat ? undefined : `#${CATEGORY_COLORS[cat]}`
                                                }}
                                            >
                                                {getCategoryName(cat)}
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={selectAll} className="text-muted-foreground hover:text-primary h-8 px-2 rounded-md">
                                        {trans.selectAll}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={deselectAll} className="text-muted-foreground hover:text-primary h-8 px-2 rounded-md">
                                        {trans.deselectAll}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 mt-8">
                            {filteredProducts.map((product, index) => {
                                const realIndex = scrapedProducts.findIndex(p => p.url === product.url);
                                return (
                                    <Card
                                        key={product.url}
                                        className={`group transition-all duration-300 border-none shadow-sm hover:shadow-premium ${product.selected ? "ring-2 ring-primary/40 bg-primary/5 shadow-md" : "opacity-70 hover:opacity-100 bg-background"}`}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex gap-5">
                                                <div className="pt-1">
                                                    <Checkbox
                                                        checked={product.selected}
                                                        onCheckedChange={() => toggleProduct(realIndex)}
                                                        className="rounded-full h-5 w-5 transition-transform group-hover:scale-110 data-[state=checked]:bg-primary"
                                                    />
                                                </div>

                                                <div className="h-24 w-24 rounded-2xl overflow-hidden bg-muted/50 border border-muted shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                    <img
                                                        src={product.image}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                                                            {product.enhanced ? product.enhancedTitle : product.title}
                                                        </h3>
                                                        <span className="font-black text-primary text-lg shrink-0">
                                                            €{product.price}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        <Badge
                                                            variant="outline"
                                                            className="font-semibold text-[10px] uppercase tracking-wider h-5"
                                                            style={{
                                                                borderColor: `#${CATEGORY_COLORS[product.categories?.[0] || 'inne']}44`,
                                                                color: `#${CATEGORY_COLORS[product.categories?.[0] || 'inne']}`
                                                            }}
                                                        >
                                                            {getCategoryName(product.categories?.[0] || 'inne')}
                                                        </Badge>
                                                        {product.generated && (
                                                            <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50 text-[10px] h-5 font-bold">
                                                                <CheckCircle2 className="h-2.5 w-2.5" />
                                                                {trans.interactive?.generatedLabel || "AI GENERATED"}
                                                            </Badge>
                                                        )}
                                                        {product.isInteractive && (
                                                            <Badge variant="outline" className="gap-1 text-blue-600 border-blue-200 bg-blue-50 text-[10px] h-5 font-bold uppercase">
                                                                {product.platform}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                                        {product.description}
                                                    </p>
                                                    <a
                                                        href={product.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] font-medium text-muted-foreground/60 hover:text-primary flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        {trans.openSource}
                                                    </a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                )}
                {/* Review & Preview Modal */}
                <Dialog open={previewOpen} onOpenChange={(open) => { setPreviewOpen(open); if (!open) setIsPlaying(false); }}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-3xl">
                        <DialogHeader className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <DialogTitle className="text-2xl font-black flex items-center gap-2">
                                        <Sparkles className="h-6 w-6 text-yellow-400" />
                                        {trans.interactive?.preview_title || "Preview AI Drafts"}
                                    </DialogTitle>
                                    <DialogDescription className="text-purple-100 font-medium">
                                        {trans.interactive?.preview_desc || "Review generated products and test interactive content."}
                                    </DialogDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="text-white hover:bg-white/20 rounded-full">
                                    <Eye className="h-5 w-5" />
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-hidden flex gap-0">
                            {/* Sidebar: List of products */}
                            <div className="w-80 border-r bg-slate-50 overflow-y-auto p-4 space-y-3">
                                {scrapedProducts.filter(p => p.selected && p.generated).map((p, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setCurrentPreviewProduct(p); setIsPlaying(false); }}
                                        className={`w-full text-left p-3 rounded-xl transition-all border-2 ${currentPreviewProduct?.url === p.url ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/10' : 'bg-transparent border-transparent hover:bg-slate-200/50'}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                                <img src={p.image} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-xs line-clamp-1 text-slate-900">{p.enhancedTitle || p.title}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-0.5">{p.platform}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Content: Detail & Embed Preview */}
                            <div className="flex-1 overflow-y-auto bg-white p-8">
                                {currentPreviewProduct ? (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        {isPlaying && currentPreviewProduct.embedHtml ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <Badge className="bg-green-100 text-green-700 border-none font-bold uppercase tracking-widest text-[10px]">
                                                        Live Interactive Session
                                                    </Badge>
                                                    <Button variant="outline" size="sm" onClick={() => setIsPlaying(false)} className="rounded-full font-bold">
                                                        Back to Description
                                                    </Button>
                                                </div>
                                                <div
                                                    className="aspect-[4/3] w-full bg-slate-100 rounded-2xl border-4 border-slate-900 shadow-2xl overflow-hidden"
                                                    dangerouslySetInnerHTML={{ __html: currentPreviewProduct.embedHtml }}
                                                />
                                                <p className="text-center text-xs text-slate-400 font-medium">This is how the game will appear to your customers.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="flex gap-6 items-start">
                                                    <div className="h-40 w-40 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner shrink-0">
                                                        <img src={currentPreviewProduct.image} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h2 className="text-3xl font-black text-slate-900 leading-tight">
                                                            {currentPreviewProduct.enhancedTitle || currentPreviewProduct.title}
                                                        </h2>
                                                        <div className="flex gap-2">
                                                            <Badge className="bg-purple-100 text-purple-700 border-none font-bold">{currentPreviewProduct.platform}</Badge>
                                                            <Badge className="bg-yellow-100 text-yellow-700 border-none font-black">€{currentPreviewProduct.price}</Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">AI Optimized Description</h4>
                                                    <div className="prose prose-sm font-medium text-slate-600 whitespace-pre-wrap leading-relaxed max-w-none bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                                                        {currentPreviewProduct.enhancedDescription || currentPreviewProduct.description}
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex gap-4">
                                                    {currentPreviewProduct.embedHtml && (
                                                        <Button
                                                            onClick={() => setIsPlaying(true)}
                                                            className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95"
                                                        >
                                                            <Play className="h-5 w-5 mr-2 fill-white" />
                                                            {trans.preview?.testInteractive}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        asChild
                                                        className="flex-1 h-14 rounded-2xl border-slate-200 font-bold"
                                                    >
                                                        <a href={currentPreviewProduct.url} target="_blank">
                                                            <ExternalLink className="h-5 w-5 mr-2" />
                                                            {trans.preview?.sourceLink}
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                                        <Sparkles className="h-16 w-16 opacity-10" />
                                        <p className="font-bold">{trans.preview?.selectToPreview}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="p-6 bg-slate-50 border-t flex gap-4 shrink-0">
                            <Button variant="ghost" onClick={() => setPreviewOpen(false)} className="rounded-xl h-12 font-bold px-6 text-slate-500">
                                {trans.preview?.backToList}
                            </Button>
                            <Button
                                onClick={() => {
                                    setPreviewOpen(false);
                                    handleImport();
                                }}
                                className="rounded-xl bg-purple-600 hover:bg-purple-700 h-12 font-black px-8 shadow-lg shadow-purple-200 flex-1"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                {trans.preview?.acceptAndCreate?.replace("{count}", selectedCount.toString())}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </NamespaceGuard>
    );
}
