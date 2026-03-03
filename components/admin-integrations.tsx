"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle2,
    AlertCircle,
    Wand2,
    ArrowRight,
    Search,
    Download,
    Terminal,
    Mail,
    MessageSquare,
    Layout,
    RefreshCw,
    Globe,
    Database,
    Cpu,
    FileUp,
    Settings,
    Layers,
    Bot,
    Plus as PlusIcon,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    GraduationCap,
    BookOpen,
    Languages,
    Coins,
    Zap
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SecureInput } from "@/components/admin/secure-input";
import { Product } from "@/lib/product-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTokens } from "@/lib/token-context";

export function AdminIntegrations({ embedded = false }: { embedded?: boolean }) {
    const { t } = useLanguage();

    // Safety check for translations
    if (typeof t.adminPanel === 'function' || typeof t.adminPanel?.integrations === 'function') {
        return <div className="p-8 text-center animate-pulse">{t?.adminPanel?.integrations?.loading || "Loading translations..."}</div>;
    }

    const it = t.adminPanel.integrations; // Alias for convenience
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [syncLog, setSyncLog] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("sync");
    const [products, setProducts] = useState<Product[]>([]);

    const marketplaces = useMemo(() => [
        {
            group: it.marketplaces.groups.poland, items: [
                { id: 'wp', name: it.marketplaces.names.wp, icon: Globe, color: 'text-blue-600' }
            ]
        },
        {
            group: it.marketplaces.groups.usa, items: [
                { id: 'tpt', name: it.marketplaces.names.tpt, icon: ShoppingBag, color: 'text-orange-600' },
                { id: 'etsy', name: it.marketplaces.names.etsy, icon: ShoppingCart, color: 'text-orange-500' }
            ]
        },
        {
            group: it.marketplaces.groups.dach, items: [
                { id: 'eduki', name: it.marketplaces.names.eduki, icon: GraduationCap, color: 'text-emerald-600' }
            ]
        },
        {
            group: it.marketplaces.groups.uk, items: [
                { id: 'tes', name: it.marketplaces.names.tes, icon: BookOpen, color: 'text-indigo-600' }
            ]
        },
        {
            group: it.marketplaces.groups.fr_es, items: [
                { id: 'mieux', name: it.marketplaces.names.mieux, icon: Languages, color: 'text-rose-600' }
            ]
        }
    ], [it]);

    // AI Agent State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("admin_products");
        if (stored) {
            setProducts(JSON.parse(stored));
        }
    }, []);

    const addLog = (msg: string) => {
        setSyncLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
    };

    const handleStartSync = async () => {
        setIsSyncing(true);
        setSyncProgress(0);
        setSyncLog([]);

        addLog(it.inventory.logs.init);
        await new Promise(r => setTimeout(r, 800));
        setSyncProgress(10);

        addLog(it.inventory.logs.auth);
        await new Promise(r => setTimeout(r, 600));
        setSyncProgress(30);

        addLog(it.inventory.logs.fetching);
        await new Promise(r => setTimeout(r, 1200));
        setSyncProgress(60);

        addLog(it.inventory.logs.syncing);
        await new Promise(r => setTimeout(r, 1000));
        setSyncProgress(90);

        addLog(it.inventory.logs.complete.replace("{count}", "12"));
        setSyncProgress(100);
        setIsSyncing(false);
        toast.success(it.inventory.toasts.sync_success);
    };

    const handleTptAnalysis = async (product: Product) => {
        setSelectedProduct(product);
        setIsAnalyzing(true);
        setAiAnalysis(null);

        // Simulate AI Agent thinking
        await new Promise(r => setTimeout(r, 2000));

        setAiAnalysis({
            optimizedTitle: `${product.title} - ${it.agent.mockAnalysis.optimizedTitleSuffix}`,
            suggestedPrice: it.agent.mockAnalysis.suggestedPrice,
            grades: it.agent.mockAnalysis.grades,
            subject: it.agent.mockAnalysis.subject,
            seoTags: it.agent.mockAnalysis.seoTags,
            description: it.agent.mockAnalysis.description.replace("{title}", product.title)
        });

        setIsAnalyzing(false);
        toast.info(it.inventory.toasts.analysis_done);
    };

    const activeChannels = [
        { id: 'wp', name: it.marketplaces.names.wp_full, status: 'online', products: 142, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'tpt', name: it.marketplaces.names.tpt, status: 'online', products: 45, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
        { id: 'eduki', name: it.marketplaces.names.eduki, status: 'ready', products: 12, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'tes', name: it.marketplaces.names.tes, status: 'ready', products: 8, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'mieux', name: it.marketplaces.names.mieux, status: 'connected', products: 5, icon: Languages, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const [selectedMarketplace, setSelectedMarketplace] = useState("eduki");
    const [pubStatus, setPubStatus] = useState<'idle' | 'agent_running' | 'success'>('idle');
    const [agentTask, setAgentTask] = useState("");

    // Safely consume tokens hook in client components
    const tokenData = useTokens();
    const tokens = tokenData?.tokens || 0;
    const isAdmin = tokenData?.isAdmin || false;
    const useTokensFn = tokenData?.useTokens;

    // Settings state
    const [isTestingWp, setIsTestingWp] = useState(false);
    const [isTestingManus, setIsTestingManus] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [wooConfig, setWooConfig] = useState({
        url: "",
        key: "",
        secret: ""
    });

    const [mlConfig, setMlConfig] = useState({
        apiKey: "",
        groupId: "",
        biSync: true
    });

    const [mcConfig, setMcConfig] = useState({
        apiKey: "",
        flowId: "",
        biSync: true
    });

    const updateWoo = (field: keyof typeof wooConfig, val: string) => {
        setWooConfig(prev => ({ ...prev, [field]: val }));
    };

    const updateMl = (field: keyof typeof mlConfig, val: any) => {
        setMlConfig(prev => ({ ...prev, [field]: val }));
    };

    const updateMc = (field: keyof typeof mcConfig, val: any) => {
        setMcConfig(prev => ({ ...prev, [field]: val }));
    };


    const currentMkt = useMemo(() =>
        marketplaces.flatMap(g => g.items).find(i => i.id === selectedMarketplace)
        , [selectedMarketplace, marketplaces]);

    const handleManusPublish = async () => {
        const cost = 25;
        if (!isAdmin && tokens < cost) {
            toast.error(it.inventory.toasts.no_tokens);
            return;
        }

        if (!isAdmin && useTokensFn) {
            useTokensFn(cost);
            toast.success(it.inventory.toasts.tokens_spent.replace("{count}", cost.toString()));
        }

        setPubStatus('agent_running');
        const mkt = marketplaces.flatMap(g => g.items).find(i => i.id === selectedMarketplace);
        setAgentTask(it.inventory.logs.agent_init.replace("{mkt}", mkt?.name || "Marketplace"));

        await new Promise(r => setTimeout(r, 1200));
        setAgentTask(it.inventory.logs.agent_login);

        await new Promise(r => setTimeout(r, 1500));
        setAgentTask(it.inventory.logs.agent_fill.replace("{title}", selectedProduct?.title || ""));

        await new Promise(r => setTimeout(r, 1500));
        setAgentTask(it.inventory.logs.agent_optimize);

        await new Promise(r => setTimeout(r, 2000));
        setAgentTask(it.inventory.logs.agent_done);
        setPubStatus('success');

        setTimeout(() => {
            setPubStatus('idle');
            setAgentTask("");
        }, 3000);
    };

    const handleTestWooCommerce = async () => {
        setIsTestingWp(true);
        toast.info(it.inventory.toasts.test_woo);
        await new Promise(r => setTimeout(r, 1500));
        setIsTestingWp(false);
        toast.success(it.inventory.toasts.woo_success);
    };

    const handleTestManus = async () => {
        setIsTestingManus(true);
        toast.info(it.inventory.toasts.test_manus);
        await new Promise(r => setTimeout(r, 1200));
        setIsTestingManus(false);
        toast.success(it.inventory.toasts.manus_success);
    };

    const handleSaveSettings = () => {
        setLastSaved(new Date().toLocaleTimeString());
        toast.success(it.settings.toasts.settings_saved);
    };

    const handleAddStore = () => {
        toast.info(it.inventory.toasts.new_channel);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {!embedded && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-700 bg-clip-text text-transparent pb-1">{it.title}</h1>
                            <p className="text-slate-500 font-medium mt-1">{it.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 border-slate-200" onClick={handleAddStore}>
                            <PlusIcon className="h-4 w-4" /> {it.addStore}
                        </Button>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                            <RefreshCw className="h-3 w-3 mr-1" /> {it.sync_status.replace("{date}", `${it.today} 12:15`)}
                        </Badge>
                    </div>
                </div>
            )}

            {/* Channels Summary Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {activeChannels.map((channel) => (
                    <Card key={channel.id} className="border-none shadow-sm premium-card-ring bg-white/80 backdrop-blur-sm p-4 hover:scale-[1.02] active:scale-95 transition-all">
                        <div className="flex flex-col gap-3">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner", channel.bg)}>
                                <channel.icon className={cn("h-6 w-6", channel.color)} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-black text-xs text-slate-900 truncate tracking-tight">{channel.name}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{channel.products} {it.inventory.stats.products_short}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
                    <TabsTrigger value="sync" className="rounded-xl gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 px-8 py-2.5 font-bold text-xs uppercase tracking-widest transition-all">
                        <Layers className="h-4 w-4" /> {it.tabs.sync}
                    </TabsTrigger>
                    <TabsTrigger value="tpt" className="rounded-xl gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 px-8 py-2.5 font-bold text-xs uppercase tracking-widest transition-all">
                        <Bot className="h-4 w-4" /> {it.tabs.agent}
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-xl gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 px-8 py-2.5 font-bold text-xs uppercase tracking-widest transition-all">
                        <Settings className="h-4 w-4" /> {it.tabs.settings}
                    </TabsTrigger>
                </TabsList>

                {/* TAB: SYNC */}
                <TabsContent value="sync" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-slate-200 shadow-sm overflow-hidden border-none ring-1 ring-slate-200">
                            <CardHeader className="bg-slate-50/50">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    {it.inventory.title}
                                    <Badge variant="outline" className="text-[10px] bg-white">{it.inventory.badge}</Badge>
                                </CardTitle>
                                <CardDescription>{it.inventory.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Database className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-bold">{it.inventory.source}</div>
                                                <div className="text-xs text-muted-foreground">{it.inventory.allFiles}</div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleStartSync}
                                            disabled={isSyncing}
                                            className="bg-slate-900 hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                                        >
                                            {isSyncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                                            {isSyncing ? it.inventory.syncBtn : it.inventory.updateBtn}
                                        </Button>
                                    </div>

                                    {isSyncing && (
                                        <div className="space-y-2 py-4 px-4 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-top-2">
                                            <div className="flex justify-between text-xs font-medium mb-1">
                                                <span>{it.inventory.progress}</span>
                                                <span>{syncProgress}%</span>
                                            </div>
                                            <Progress value={syncProgress} className="h-2 bg-slate-200" />
                                        </div>
                                    )}

                                    <div className="rounded-xl border bg-slate-950 p-4 font-mono text-xs text-slate-300 min-h-[160px]">
                                        <div className="flex items-center gap-2 mb-2 text-slate-500 pb-2 border-b border-slate-800">
                                            <Terminal className="h-3 w-3" />
                                            <span>{it.inventory.log}</span>
                                        </div>
                                        {syncLog.length === 0 && <p className="text-slate-600 italic">{it.inventory.waiting}</p>}
                                        {syncLog.map((log, i) => (
                                            <div key={i} className="mb-1 animate-in fade-in slide-in-from-left-2">{log}</div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="border-none ring-1 ring-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm">{it.schedule.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="text-xs font-medium">{it.schedule.daily02}</div>
                                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-100">{it.schedule.active}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-400">
                                        <div className="text-xs font-medium italic">{it.schedule.checkOnlyChanges}</div>
                                        <Badge variant="outline" className="text-[10px]">{it.schedule.disabled}</Badge>
                                    </div>
                                    <Button variant="ghost" className="w-full text-xs" size="sm" onClick={() => toast.info(it.inventory.toasts.edit_schedule)}>{it.schedule.changeCron}</Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-indigo-600 text-white border-none shadow-lg shadow-indigo-200">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-indigo-500 rounded-lg">
                                            <Cpu className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold">{it.aiTip.title}</div>
                                            <p className="text-xs text-indigo-100 leading-relaxed mb-3">
                                                {it.aiTip.description.replace("{count}", "5")}
                                            </p>
                                            <Button size="sm" variant="secondary" className="h-7 text-[10px] font-bold" onClick={() => {
                                                toast.success(it.inventory.toasts.importing);
                                                handleStartSync();
                                            }}>
                                                {it.aiTip.importBtn}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB: PUBLICATION AGENT */}
                <TabsContent value="tpt" className="space-y-6">
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* List of products to publish */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3">
                                <Layers className="h-4 w-4 text-indigo-500" /> {it.agent.catalogTitle}
                            </h3>

                            <div className="grid gap-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin text-wrap">
                                {products.map((p) => (
                                    <div
                                        key={p.id}
                                        className={cn(
                                            "p-2 rounded-xl border border-slate-100 cursor-pointer transition-all hover:bg-slate-50 flex gap-3 items-center",
                                            selectedProduct?.id === p.id && "bg-indigo-50/50 border-indigo-100 ring-1 ring-indigo-100"
                                        )}
                                        onClick={() => handleTptAnalysis(p)}
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-[10px] truncate">{p.title}</div>
                                            <div className="text-[9px] text-muted-foreground uppercase font-medium">{it.agent.ready}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AGENT CONTROL PANEL */}
                        <div className="lg:col-span-3 space-y-6">
                            {!selectedProduct ? (
                                <div className="h-[400px] rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
                                    <Bot className="h-10 w-10 text-slate-300 mb-4 animate-bounce" />
                                    <h3 className="font-bold text-slate-600">{it.agent.emptyState.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-2 max-w-[300px]">
                                        {it.agent.emptyState.description}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    {/* Selection Row */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                                        <div className="w-full sm:w-auto flex-1">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">{it.agent.selectMarket}</label>
                                            <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                                                <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-xl h-11">
                                                    <SelectValue placeholder={it.agent.selectMarket} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                    {marketplaces.map(group => (
                                                        <div key={group.group} className="px-2 py-1.5">
                                                            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">{group.group}</div>
                                                            {group.items.map(m => (
                                                                <SelectItem key={m.id} value={m.id} className="rounded-lg mt-1">
                                                                    <div className="flex items-center gap-2 py-1">
                                                                        <m.icon className={cn("h-4 w-4", m.color)} />
                                                                        <span className="font-medium">{m.name}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="hidden sm:block">
                                            <ArrowRight className="h-5 w-5 text-slate-300" />
                                        </div>
                                        <div className="w-full sm:w-auto flex-1">
                                            <div className="flex gap-4">
                                                <Button
                                                    onClick={handleManusPublish}
                                                    disabled={pubStatus === 'agent_running'}
                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                                                >
                                                    <Bot className="h-4 w-4" />
                                                    {pubStatus === 'agent_running' ? it.agent.working : isAdmin ? it.agent.launchAdmin : it.agent.launchPoints.replace("{count}", "25")}
                                                </Button>
                                                {!isAdmin && (
                                                    <div className="flex flex-col justify-center px-4 bg-slate-50 border rounded-xl min-w-[100px]">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">{it.agent.yourBalance}</div>
                                                        <div className="text-sm font-black text-slate-700 flex items-center gap-1">
                                                            <Coins className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                            {tokens} {it.agent.stats.points}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agent Intelligence Preview */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Card className="border-none ring-1 ring-slate-200 shadow-sm overflow-hidden bg-white">
                                            <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between font-bold">
                                                <div>
                                                    <CardTitle className="text-sm">{it.agent.analysisTitle.replace("{market}", currentMkt?.name || "")}</CardTitle>
                                                    <CardDescription className="text-[10px]">{it.agent.regionalOptimization}</CardDescription>
                                                </div>
                                                {currentMkt?.icon && <currentMkt.icon className={cn("h-6 w-6 opacity-30", currentMkt.color)} />}
                                            </CardHeader>
                                            <CardContent className="p-5 space-y-4">
                                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase">{it.agent.suggestedTitle}</div>
                                                    <div className="text-xs font-bold text-indigo-900 leading-tight">
                                                        {selectedMarketplace === 'eduki' ? it.agent.marketPrefix : ""} {selectedProduct.title}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{it.agent.suggestedPrice}</div>
                                                        <div className="text-xs font-bold">€{selectedMarketplace === 'eduki' ? "8.90" : "9.50"}</div>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{it.agent.sellingProb}</div>
                                                        <div className="text-xs font-bold text-emerald-600">{it.agent.veryHigh}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Real-time Status or Success */}
                                        <div className="space-y-4">
                                            {pubStatus === 'agent_running' ? (
                                                <div className="h-full p-6 rounded-3xl bg-slate-900 shadow-2xl animate-in zoom-in duration-300 flex flex-col justify-between">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
                                                            <div>
                                                                <div className="text-sm font-bold text-white uppercase tracking-tighter">{it.agent.manusMode}</div>
                                                                <div className="text-[11px] text-indigo-300 italic animate-pulse">{agentTask}</div>
                                                            </div>
                                                        </div>
                                                        <Progress value={65} className="h-1.5 bg-slate-800" />
                                                    </div>
                                                    <div className="text-[9px] text-slate-500 font-mono space-y-1">
                                                        <div>{">"} ACCESSING_WEB_VIEW: SUCCESS</div>
                                                        <div>{">"} INJECTING_CREDENTIALS: HIDDEN</div>
                                                        <div>{">"} FORM_DATA_PREPARATION: COMPLETED</div>
                                                    </div>
                                                </div>
                                            ) : pubStatus === 'success' ? (
                                                <div className="h-full p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-center space-y-3">
                                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                                    <h3 className="font-bold text-emerald-900">{it.agent.success.title}</h3>
                                                    <p className="text-[11px] text-emerald-700">{it.agent.success.description.replace("{market}", currentMkt?.name || "")}</p>
                                                    <Button
                                                        variant="ghost"
                                                        className="text-emerald-700 hover:bg-emerald-100 text-[10px] h-8 font-bold"
                                                        onClick={() => toast(it.agent.toasts.report_title, { description: it.agent.toasts.report_desc.replace("{time}", "4.2s") })}
                                                    >
                                                        {it.agent.success.viewLogs}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="h-full p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center">
                                                    <Bot className="h-8 w-8 text-slate-300 mb-2" />
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{it.agent.idle.title}</div>
                                                    <p className="text-[10px] text-slate-400 mt-2">{it.agent.idle.description.replace("{market}", currentMkt?.name || "")}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* TAB: SETTINGS */}
                <TabsContent value="settings" className="space-y-6">
                    <Card className="border-none ring-1 ring-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{it.settings.title}</CardTitle>
                                    <CardDescription>{it.settings.description}</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    {lastSaved && <span className="text-[10px] text-muted-foreground">{it.settings.lastSaved.replace("{time}", lastSaved)}</span>}
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs font-bold" onClick={handleSaveSettings}>
                                        {it.settings.saveAll}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-3 mb-6 text-sm mt-2">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                                        </div>
                                        {it.settings.woo.title}
                                    </h3>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">{it.settings.woo.url}</label>
                                        <Input
                                            placeholder="https://..."
                                            value={wooConfig.url}
                                            onChange={(e) => updateWoo("url", e.target.value)}
                                            className="rounded-xl border-slate-200 h-10"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <SecureInput
                                            id="woo-key"
                                            label={it.settings.woo.key}
                                            value={wooConfig.key}
                                            onChange={(val) => updateWoo("key", val)}
                                            placeholder="ck_..."
                                        />
                                        <SecureInput
                                            id="woo-secret"
                                            label={it.settings.woo.secret}
                                            value={wooConfig.secret}
                                            onChange={(val) => updateWoo("secret", val)}
                                            placeholder="cs_..."
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-4 pt-2">
                                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between flex-1">
                                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{it.settings.woo.connected}</span>
                                            <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-300 text-[9px]">{it.settings.woo.autoSync}</Badge>
                                        </div>
                                        <Button variant="outline" className="rounded-xl h-11 px-4 border-slate-200" onClick={handleTestWooCommerce} disabled={isTestingWp}>
                                            {isTestingWp ? <RefreshCw className="h-4 w-4 animate-spin" /> : it.settings.woo.test}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-3 mb-6 text-sm mt-2">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                                            <Bot className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        {it.settings.manus.title}
                                    </h3>
                                    <p className="text-[11px] text-muted-foreground bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                                        {it.settings.manus.description}
                                    </p>
                                    <div className="space-y-2 mb-4">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">{it.settings.manus.instance}</label>
                                        <Input value="manus-server-v2-prod" readOnly className="rounded-xl border-slate-200 h-10 bg-slate-50" />
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <Button variant="outline" size="sm" className="text-[10px] h-9 rounded-xl font-bold uppercase tracking-wider px-4 border-slate-200" onClick={handleTestManus} disabled={isTestingManus}>
                                            {isTestingManus ? <RefreshCw className="h-3 w-3 mr-2 animate-spin" /> : it.settings.manus.test}
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-[10px] h-9 rounded-xl font-bold uppercase tracking-wider px-4 border-slate-200" onClick={() => toast.info(it.agent.toasts.session_manager)}>
                                            {it.settings.manus.manage}
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-[10px] h-9 rounded-xl font-bold uppercase tracking-wider px-4 border-slate-200" onClick={() => toast.success(it.agent.toasts.proxy_success.replace("{ip}", "182.xx.xx.xx").replace("{location}", "Warszawa"))}>
                                            {it.settings.manus.proxy}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-3 mb-6 text-sm mt-2">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                                            <Zap className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        {it.settings.mailerlite.title}
                                    </h3>
                                    <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
                                        <SecureInput
                                            id="ml-key"
                                            label={it.settings.mailerlite.api_key}
                                            value={mlConfig.apiKey}
                                            onChange={(val) => updateMl("apiKey", val)}
                                            placeholder={it.settings.mailerlite.placeholder}
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-slate-400">{it.settings.mailerlite.groups}</label>
                                            <Input
                                                value={mlConfig.groupId}
                                                onChange={(e) => updateMl("groupId", e.target.value)}
                                                placeholder="e.g. 110293847"
                                                className="rounded-xl border-slate-200 h-10"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-emerald-100">
                                            <div className="space-y-0.5">
                                                <div className="text-[10px] font-bold uppercase text-emerald-800">Bi-directional Sync</div>
                                                <div className="text-[9px] text-emerald-600 italic">Sync subscribers both ways</div>
                                            </div>
                                            <Switch checked={mlConfig.biSync} onCheckedChange={(val) => updateMl("biSync", val)} />
                                        </div>
                                        {mlConfig.biSync && (
                                            <div className="p-3 bg-emerald-900 rounded-xl text-white space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Incoming Webhook URL</div>
                                                <div className="text-[10px] font-mono break-all opacity-80">https://api.kamilaenglish.com/webhooks/ml/incoming?key=...</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-3 mb-6 text-sm mt-2">
                                        <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center border border-sky-100 shadow-sm">
                                            <MessageSquare className="h-4 w-4 text-sky-600" />
                                        </div>
                                        {it.settings.manychat.title}
                                    </h3>
                                    <div className="space-y-4 p-5 rounded-2xl bg-blue-50/30 border border-blue-100/50">
                                        <SecureInput
                                            id="mc-key"
                                            label={it.settings.manychat.api_key}
                                            value={mcConfig.apiKey}
                                            onChange={(val) => updateMc("apiKey", val)}
                                            placeholder={it.settings.manychat.placeholder}
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-slate-400">{it.settings.manychat.automation_id}</label>
                                            <Input
                                                value={mcConfig.flowId}
                                                onChange={(e) => updateMc("flowId", e.target.value)}
                                                placeholder="e.g. flow_28394"
                                                className="rounded-xl border-slate-200 h-10"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-blue-100">
                                            <div className="space-y-0.5">
                                                <div className="text-[10px] font-bold uppercase text-blue-800">2-Way Automation</div>
                                                <div className="text-[9px] text-blue-600 italic">Trigger flows & receive status</div>
                                            </div>
                                            <Switch checked={mcConfig.biSync} onCheckedChange={(val) => updateMc("biSync", val)} />
                                        </div>
                                        {mcConfig.biSync && (
                                            <div className="p-3 bg-slate-900 rounded-xl text-white space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-blue-400">ManyChat Callback URL</div>
                                                <div className="text-[10px] font-mono break-all opacity-80">https://api.kamilaenglish.com/webhooks/mc/callback?verify=true</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
