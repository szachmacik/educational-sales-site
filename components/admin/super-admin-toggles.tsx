"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings2, Plus, X, ShieldAlert, ShieldCheck, Zap, Sparkles, Gamepad2, Trophy, BarChart3, Presentation, Coins, Star, Award, Building, Eye, Camera, ExternalLink, TrendingUp, DollarSign, Brain, Calculator, Shield, FileText } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";
import { useFeatures } from "@/lib/feature-context";
import { Download, Upload, FileJson } from "lucide-react";
import { LEGAL_DOCUMENTS } from "@/lib/legal-docs-data";

export function SuperAdminToggles() {
    const { t } = useLanguage();
    const st = t.adminPanel.dashboard.superAdmin || {};
    const { features, getFlag, setFlag, toggleFlag, exportConfig, importConfig } = useFeatures();

    // Local state for beta lists (these will stay local or be moved to feature-context if needed)
    const [marketInput, setMarketInput] = useState("");
    const [marketBeta, setMarketBeta] = useState<string[]>([]);
    const [viewerInput, setViewerInput] = useState("");
    const [viewerBeta, setViewerBeta] = useState<string[]>([]);
    const [legalConfig, setLegalConfig] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const savedViewers = localStorage.getItem("feature_apiViewer_beta");
        if (savedViewers) setViewerBeta(JSON.parse(savedViewers));
        const savedMarkets = localStorage.getItem("feature_marketplace_beta");
        if (savedMarkets) setMarketBeta(JSON.parse(savedMarkets));

        const storedLegal = localStorage.getItem("legal_docs_config");
        if (storedLegal) setLegalConfig(JSON.parse(storedLegal));
    }, []);

    const toggleLegalClause = (id: string, defaultValue: boolean) => {
        const newConfig = { ...legalConfig };
        const currentValue = newConfig[id] !== undefined ? newConfig[id] : defaultValue;
        newConfig[id] = !currentValue;
        setLegalConfig(newConfig);
        localStorage.setItem('legal_docs_config', JSON.stringify(newConfig));
        toast.success("Zapisano zmianę w dokumencie prawnym");
    };

    const handleExport = () => {
        const config = exportConfig();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saas-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        toast.success("Konfiguracja SaaS wyeksportowana pomyślnie");
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (importConfig(content)) {
                toast.success("Konfiguracja SaaS zaimportowana pomyślnie! Odśwież stronę jeśli zmiany nie są widoczne.");
            } else {
                toast.error("Błąd podczas importu konfiguracji.");
            }
        };
        reader.readAsText(file);
    };





    const handleBaseLinkerSync = async () => {
        const toastId = toast.loading("Synchronizacja z BaseLinker...");
        try {
            // Simulated API call wait
            await new Promise(r => setTimeout(r, 2000));
            toast.success("Zsynchronizowano 15 nowych produktów (Zabawki, Książki) z hurtowni.", { id: toastId });
        } catch (error) {
            toast.error("Błąd synchronizacji z BaseLinker.", { id: toastId });
        }
    };

    const addViewerBeta = () => {
        if (!viewerInput || !viewerInput.includes("@")) return;
        const newList = [...new Set([...viewerBeta, viewerInput.toLowerCase()])];
        setViewerBeta(newList);
        localStorage.setItem("feature_apiViewer_beta", JSON.stringify(newList));
        setViewerInput("");
        toast.success(`Dodano ${viewerInput} do wczesnego dostępu`);
    };

    const addMarketBeta = () => {
        if (!marketInput || !marketInput.includes("@")) return;
        const newList = [...new Set([...marketBeta, marketInput.toLowerCase()])];
        setMarketBeta(newList);
        localStorage.setItem("feature_marketplace_beta", JSON.stringify(newList));
        setMarketInput("");
        toast.success(`Dodano ${marketInput} do wczesnego dostępu`);
    };

    const removeBeta = (type: 'viewer' | 'market', email: string) => {
        if (type === 'viewer') {
            const newList = viewerBeta.filter(e => e !== email);
            setViewerBeta(newList);
            localStorage.setItem("feature_apiViewer_beta", JSON.stringify(newList));
        } else {
            const newList = marketBeta.filter(e => e !== email);
            setMarketBeta(newList);
            localStorage.setItem("feature_marketplace_beta", JSON.stringify(newList));
        }
    };

    return (
        <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-xl">
            <CardHeader className="border-b border-indigo-100 bg-white/50 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                        <Settings2 className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black text-slate-800">{st.title || "SuperAdmin: Deployment Management"}</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">{st.subtitle || "Global Feature Toggles for new B2B modules"}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                {/* Section 0: SaaS Mobility Center (Portability) */}
                <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-90" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
                                <Zap className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white px-0 py-0 leading-tight">SaaS Mobility Center</h3>
                                <p className="text-indigo-100/80 font-medium text-sm">Exportuj i importuj konfigurację między platformami (SaaS-ready)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={handleExport} className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-6 rounded-xl gap-2 shadow-lg transition-all active:scale-95">
                                <Download className="h-4 w-4" /> EXPORT CONFIG
                            </Button>
                            <label className="cursor-pointer">
                                <div className="bg-indigo-500/30 hover:bg-indigo-500/50 text-white border border-white/20 font-bold px-6 py-2.5 rounded-xl gap-2 shadow-lg transition-all active:scale-95 flex items-center">
                                    <Upload className="h-4 w-4 mr-2" /> IMPORT JSON
                                </div>
                                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Section 0: System Status */}
                    <div className="md:col-span-2 space-y-6 bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors pointer-events-none" />
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-red-500" />
                                    <h3 className="font-bold text-lg">System Maintenance</h3>
                                </div>
                                <p className="text-sm text-slate-400">Blokada dostępu dla użytkowników (Admin-only access).</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Switch checked={getFlag("feature_maintenance_mode")} onCheckedChange={() => toggleFlag("feature_maintenance_mode")} className="data-[state=checked]:bg-red-500" />
                                <Badge variant={getFlag("feature_maintenance_mode") ? "destructive" : "outline"} className={getFlag("feature_maintenance_mode") ? "bg-red-900/50 text-red-200 border-red-500" : "text-slate-200 border-slate-700"}>
                                    {getFlag("feature_maintenance_mode") ? "MAINTENANCE ON" : "LIVE MODE"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Demo / Sandbox Simulator Mode */}
                    <div className="md:col-span-2 space-y-6 bg-slate-50 text-slate-800 p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors pointer-events-none" />
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Gamepad2 className="h-5 w-5 text-indigo-500" />
                                    <h3 className="font-bold text-lg">Global API Simulator (Demo Mode)</h3>
                                </div>
                                <p className="text-sm text-slate-500">Symuluje odpowiedzi API (InFakt, Stripe, Gemini) zapobiegając używaniu prawdziwych tokenów i danych.</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Switch checked={getFlag("feature_simulator_mode")} onCheckedChange={() => toggleFlag("feature_simulator_mode")} className="data-[state=checked]:bg-indigo-500" />
                                <Badge variant={getFlag("feature_simulator_mode") ? "default" : "outline"} className={getFlag("feature_simulator_mode") ? "bg-indigo-100 text-indigo-700 font-bold border-indigo-200" : "text-slate-400 border-slate-200"}>
                                    {getFlag("feature_simulator_mode") ? "SIMULATOR ON" : "PRODUCTION"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Module 1: API Viewer */}
                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-500" />
                                    <h3 className="font-bold text-lg text-slate-900">{st.apiViewer?.title || "External API Portal"}</h3>
                                </div>
                                <p className="text-sm text-slate-500">{st.apiViewer?.desc || "1-Click portal generator for schools (Phase 12)."}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Switch checked={getFlag("feature_apiViewer_global")} onCheckedChange={() => toggleFlag("feature_apiViewer_global")} className="data-[state=checked]:bg-emerald-500" />
                                <Badge variant={getFlag("feature_apiViewer_global") ? "default" : "outline"} className={getFlag("feature_apiViewer_global") ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "text-slate-400"}>
                                    {getFlag("feature_apiViewer_global") ? (st.apiViewer?.on || "Global ON") : (st.apiViewer?.off || "Paused")}
                                </Badge>
                            </div>
                        </div>

                        {!getFlag("feature_apiViewer_global") && (
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-indigo-700">
                                    <ShieldAlert className="h-4 w-4" />
                                    {st.apiViewer?.earlyAccess || "Early Access List (Gold List)"}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="email@szkola.pl"
                                        value={viewerInput}
                                        onChange={(e) => setViewerInput(e.target.value)}
                                        className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                    />
                                    <Button onClick={addViewerBeta} size="icon" className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {viewerBeta.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {viewerBeta.map(email => (
                                            <Badge key={email} variant="outline" className="bg-amber-50 text-amber-900 border-amber-200 py-1.5 px-3 flex items-center gap-2">
                                                {email}
                                                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeBeta('viewer', email)} />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Section 1.5: Internal Features Control */}
                    <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100 space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Star className="h-6 w-6 text-amber-500" />
                                {st.internalFeatures?.title || "Internal Features & Shop Security"}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">{st.internalFeatures?.desc || "Control the visibility of core modules in your B2C shop. Separately decide if these features are technically solid and should be allowed in B2B External Portals."}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Internal Feature 1: Games */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Gamepad2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{st.internalFeatures?.games || "Interactive Games"}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{st.internalFeatures?.gamesDesc || "Arcade Room"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">{st.internalFeatures?.ownShop || "Own Shop (B2C)"}</span>
                                        <Switch checked={getFlag("feature_internal_games_global")} onCheckedChange={() => toggleFlag("feature_internal_games_global")} className="data-[state=checked]:bg-emerald-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">{st.internalFeatures?.externalExport || "External Export (B2B)"}</span>
                                        <Switch checked={getFlag("feature_export_games_b2b")} onCheckedChange={() => toggleFlag("feature_export_games_b2b")} className="data-[state=checked]:bg-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Internal Feature 2: Gamification */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{st.internalFeatures?.gamification || "Gamification"}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{st.internalFeatures?.gamificationDesc || "Badges, progress"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">{st.internalFeatures?.ownShop || "Own Shop (B2C)"}</span>
                                        <Switch checked={getFlag("feature_internal_gamification_global")} onCheckedChange={() => toggleFlag("feature_internal_gamification_global")} className="data-[state=checked]:bg-emerald-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">{st.internalFeatures?.externalExport || "External Export (B2B)"}</span>
                                        <Switch checked={getFlag("feature_export_gamification_b2b")} onCheckedChange={() => toggleFlag("feature_export_gamification_b2b")} className="data-[state=checked]:bg-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Internal Feature 3: Wallet */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Coins className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{st.internalFeatures?.wallet || "Teacher Wallet"}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{st.internalFeatures?.walletDesc || "Points program"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">{st.internalFeatures?.ownShop || "Own Shop (B2C)"}</span>
                                        <Switch checked={getFlag("feature_internal_wallet_global")} onCheckedChange={() => toggleFlag("feature_internal_wallet_global")} className="data-[state=checked]:bg-emerald-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">{st.internalFeatures?.externalExport || "External Export (B2B)"}</span>
                                        <Switch checked={getFlag("feature_export_wallet_b2b")} onCheckedChange={() => toggleFlag("feature_export_wallet_b2b")} className="data-[state=checked]:bg-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Phase 20 Features */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">AI Workshop</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Creative Studio Tools</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">Global UI</span>
                                    <Switch checked={getFlag("feature_ai_workshop")} onCheckedChange={() => toggleFlag("feature_ai_workshop")} className="data-[state=checked]:bg-purple-500" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">Certificates</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Automatic issuance</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">Global UI</span>
                                    <Switch checked={getFlag("feature_certificates")} onCheckedChange={() => toggleFlag("feature_certificates")} className="data-[state=checked]:bg-amber-500" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Building className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">Placówki Flow</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Educational B2B Invoices</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">Special Logic</span>
                                    <Switch checked={getFlag("feature_institutional_invoicing")} onCheckedChange={() => toggleFlag("feature_institutional_invoicing")} className="data-[state=checked]:bg-blue-500" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Eye className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">OCR Vision</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Data extraction</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">Scanner UI</span>
                                    <Switch checked={getFlag("feature_ocr_scanner")} onCheckedChange={() => toggleFlag("feature_ocr_scanner")} className="data-[state=checked]:bg-emerald-500" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                                        <ExternalLink className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">BaseLinker</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Physical Products Sync</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">Sync Engine</span>
                                        <Switch checked={getFlag("feature_baselinker_global")} onCheckedChange={() => toggleFlag("feature_baselinker_global")} className="data-[state=checked]:bg-orange-500" />
                                    </div>
                                    {getFlag("feature_baselinker_global") && (
                                        <Button
                                            onClick={handleBaseLinkerSync}
                                            size="sm"
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-[10px] h-8 font-bold gap-2 animate-in fade-in"
                                        >
                                            <Zap className="h-3 w-3" /> WYMUSZ SYNC TERAZ
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Marketing & Scaling (Phase 25) */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900">Marketing & Scalability</h3>
                                <p className="text-sm text-slate-500">Automated Ad-Tech & Tracking</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">Ad-Tech Tracker</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Google & Meta Pixels</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">Global Pixels</span>
                                    <Switch checked={getFlag("feature_marketing_tracking")} onCheckedChange={() => toggleFlag("feature_marketing_tracking")} className="data-[state=checked]:bg-red-500" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Presentation className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">Shopping Feed</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Google Merchant Center</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">Feed XML</span>
                                    <Switch checked={getFlag("feature_google_shopping_feed")} onCheckedChange={() => toggleFlag("feature_google_shopping_feed")} className="data-[state=checked]:bg-blue-500" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">BaseLinker Sync</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Produkty fizyczne (Hurtownie)</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-400">Status: Gotowy</span>
                                    <Button size="sm" onClick={handleBaseLinkerSync} disabled={!getFlag("feature_baselinker_global")} className="h-7 text-[10px] px-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none shadow-none">
                                        POBIERZ DANE
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center shrink-0">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">Meta CAPI</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Conversions API (Server)</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">Graph API</span>
                                    <Switch checked={getFlag("feature_meta_capi")} onCheckedChange={() => toggleFlag("feature_meta_capi")} className="data-[state=checked]:bg-pink-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Module 3: Monetization & AI Intelligence */}
                    <div className="md:col-span-2 space-y-6 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-500/20 p-3 rounded-2xl backdrop-blur-md border border-indigo-500/30">
                                        <TrendingUp className="h-8 w-8 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white px-0 py-0 leading-tight">Monetization & API Intelligence</h3>
                                        <p className="text-indigo-300/60 font-medium text-sm">Zarządzaj marżą i optymalizuj koszty AI</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1.5 rounded-full font-bold">LIVE METRICS</Badge>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Markup Control */}
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
                                    <div className="flex items-center gap-2 text-white font-bold mb-2">
                                        <DollarSign className="h-5 w-5 text-emerald-400" />
                                        Prowizja & Marża (Markup)
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/60 text-sm">Aktualny Narzut</span>
                                            <span className="text-2xl font-black text-white">{getFlag("feature_api_markup", 50)}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.min(Number(getFlag("feature_api_markup", 50)) / 2, 100)}%` }} />
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            {[20, 50, 100, 200].map(m => (
                                                <Button
                                                    key={m}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setFlag("feature_api_markup", m);
                                                        toast.success(`Narzut ustawiony na ${m}%`);
                                                    }}
                                                    className={`bg-transparent border-white/10 text-white/60 hover:bg-white/10 hover:text-white rounded-xl flex-1 h-10 font-bold border-none transition-all ${Number(getFlag("feature_api_markup", 50)) === m ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50' : ''}`}
                                                >
                                                    +{m}%
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* AI Market Insights */}
                                <div className="bg-indigo-500/10 rounded-3xl p-6 border border-indigo-500/20 space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Brain className="h-20 w-20 text-indigo-400" />
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-300 font-bold relative z-10">
                                        <Zap className="h-5 w-5 text-yellow-400" />
                                        AI Market Insight
                                    </div>
                                    <p className="text-indigo-100/80 text-sm leading-relaxed font-medium relative z-10 transition-all">
                                        {Number(getFlag("feature_api_markup", 50)) < 100
                                            ? `"Twoja marża (${getFlag("feature_api_markup", 50)}%) jest bardzo niska. Korporacje (SaaS) zazwyczaj nakładają 300% - 500% na tokeny AI, aby pokryć koszty infrastruktury."`
                                            : `"Twoja marża (${getFlag("feature_api_markup", 50)}%) jest na poziomie rynkowym. Pozwala to na stabilny rozwój i darmowe limity dla lojalnych użytkowników."`}
                                    </p>
                                    <div className="pt-2">
                                        <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30 uppercase tracking-tighter">
                                            {Number(getFlag("feature_api_markup", 50)) < 100 ? "Sugestia AI: Zwiększ o 20-50%" : "Status: Optymalna Rentowność"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Break-even Calculator */}
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
                                    <div className="flex items-center gap-2 text-white font-bold mb-2">
                                        <Calculator className="h-5 w-5 text-purple-400" />
                                        Break-even Analysis
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs py-2 border-b border-white/5">
                                            <span className="text-white/40">Koszt bazowy API (AI/OCR)</span>
                                            <span className="text-white font-mono">$0.002</span>
                                        </div>
                                        <div className="flex justify-between text-xs py-2 border-b border-white/5">
                                            <span className="text-white/40">Twój Narzut ({getFlag("feature_api_markup", 50)}%)</span>
                                            <span className="text-white font-mono">+${(0.002 * (Number(getFlag("feature_api_markup", 50)) / 100)).toFixed(4)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs py-2 text-emerald-400 font-bold">
                                            <span>Zysk na jednej operacji</span>
                                            <span className="font-mono">+${(0.002 * (Number(getFlag("feature_api_markup", 50)) / 100)).toFixed(4)}</span>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl mt-4">
                                            <div className="text-[10px] text-white/40 uppercase font-black mb-1">Darmowy Limit (Groszowe sprawy)</div>
                                            <div className="text-sm text-white font-medium">5 darmowych prób dziennie kosztuje Cię <span className="text-white font-bold">$0.01</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Module 4: Data Intelligence & Anonymous Telemetry */}
                    <div className={`space-y-6 p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${getFlag("feature_data_intelligence") ? 'bg-slate-50 border-indigo-200 shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-75'}`}>
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg transition-colors ${getFlag("feature_data_intelligence") ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Eye className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">Data Intelligence (Silent)</h3>
                                </div>
                                <p className="text-sm text-slate-500">Anonimowe zbieranie danych o zachowaniu (GTM-style).</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Switch checked={getFlag("feature_data_intelligence")} onCheckedChange={() => toggleFlag("feature_data_intelligence")} className="data-[state=checked]:bg-indigo-500" />
                                <Badge variant={getFlag("feature_data_intelligence") ? "default" : "outline"} className={getFlag("feature_data_intelligence") ? "bg-indigo-100 text-indigo-700 font-bold" : "text-slate-400"}>
                                    {getFlag("feature_data_intelligence") ? "AKTYWNE" : "WYŁĄCZONE"}
                                </Badge>
                            </div>
                        </div>

                        {getFlag("feature_data_intelligence") && (
                            <div className="pt-4 border-t border-indigo-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/60 p-4 rounded-xl border border-indigo-50/50">
                                        <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Most Used</div>
                                        <div className="text-sm font-bold text-indigo-600">AI Game Workshop</div>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-xl border border-indigo-50/50">
                                        <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Retention Risk</div>
                                        <div className="text-sm font-bold text-emerald-600">LOW (92%)</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-medium">
                                    <Zap className="h-3 w-3" />
                                    Dane są w 100% anonimizowane przez hashing przed zapisem.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Module 5: Ethical Monetization (Sponsorships) */}
                    <div className={`space-y-6 p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${getFlag("feature_ethical_monetization") ? 'bg-amber-50 border-amber-200 shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-75'}`}>
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg transition-colors ${getFlag("feature_ethical_monetization") ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">Ethical Monetization (Silent)</h3>
                                </div>
                                <p className="text-sm text-slate-500">Zarabiaj na darmowych kontach bez reklam (Partner Impressions).</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Switch checked={getFlag("feature_ethical_monetization")} onCheckedChange={() => toggleFlag("feature_ethical_monetization")} className="data-[state=checked]:bg-amber-500" />
                                <Badge variant={getFlag("feature_ethical_monetization") ? "default" : "outline"} className={getFlag("feature_ethical_monetization") ? "bg-amber-100 text-amber-700 font-bold" : "text-slate-400"}>
                                    {getFlag("feature_ethical_monetization") ? "AKTYWNE" : "WYŁĄCZONE"}
                                </Badge>
                            </div>
                        </div>

                        {getFlag("feature_ethical_monetization") && (
                            <div className="pt-4 border-t border-amber-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="bg-white/60 p-4 rounded-xl border border-amber-50/50">
                                    <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Monthly impressions</div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-2xl font-black text-amber-600">12,450</div>
                                        <div className="text-sm font-bold text-emerald-600">Est. Revenue: ~$250</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-white text-slate-500 border-slate-100">LEGO Edu (Silent)</Badge>
                                    <Badge variant="secondary" className="bg-white text-slate-500 border-slate-100">Nat Geo Learner</Badge>
                                    <Badge variant="secondary" className="bg-white text-slate-500 border-slate-100">+3 more partners</Badge>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Product Revenue Heatmap (Sponsorship Potential)</div>
                                    <div className="space-y-2">
                                        {[
                                            { name: "Mega Pack: Scenariusze A1-A2", views: 4500, rev: 90 },
                                            { name: "Wordwall: Home Vocabulary", views: 3200, rev: 64 },
                                            { name: "Grammar Master Quiz", views: 2800, rev: 56 }
                                        ].map((prod) => (
                                            <div key={prod.name} className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-[11px] mb-1">
                                                        <span className="font-bold text-slate-700 truncate max-w-[180px]">{prod.name}</span>
                                                        <span className="text-emerald-600 font-bold">${prod.rev}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-amber-100/50">
                                                        <div className="h-full bg-amber-400" style={{ width: `${(prod.rev / 100) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-amber-500 font-medium bg-amber-100/30 p-2 rounded-lg">
                                    <ShieldCheck className="h-3 w-3" />
                                    COPPA Compliant: Reklamy są niewidoczne, zbieramy tylko statystyki wyświetleń modułów partnerów.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Module 6: Proactive Store Optimizations (Premium UX) */}
                    <div className={`space-y-6 p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${getFlag("feature_smart_recommendations") || getFlag("feature_quick_cockpit") ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-75'}`}>
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg transition-colors ${getFlag("feature_smart_recommendations") || getFlag("feature_quick_cockpit") ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">Premium Proactive Features</h3>
                                </div>
                                <p className="text-sm text-slate-500">Funkcje inspirowane Amazon/Apple dla zwiększenia konwersji i wygody.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-indigo-50 shadow-sm">
                                <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        Smart Recommendations
                                        <Badge variant="outline" className="text-[9px] uppercase font-black text-indigo-400 border-indigo-200">Amazon Style</Badge>
                                    </div>
                                    <p className="text-xs text-slate-500">Automatyczne podpowiedzi produktów na dashboardzie.</p>
                                </div>
                                <Switch checked={getFlag("feature_smart_recommendations")} onCheckedChange={() => toggleFlag("feature_smart_recommendations")} className="data-[state=checked]:bg-indigo-500" />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-indigo-50 shadow-sm">
                                <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        Quick Cockpit
                                        <Badge variant="outline" className="text-[9px] uppercase font-black text-emerald-400 border-emerald-200">Apple Style</Badge>
                                    </div>
                                    <p className="text-xs text-slate-500">Pasek szybkiego dostępu do najczęstszych akcji.</p>
                                </div>
                                <Switch checked={getFlag("feature_quick_cockpit")} onCheckedChange={() => toggleFlag("feature_quick_cockpit")} className="data-[state=checked]:bg-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Module 7: Educational Core Features (Management) */}
                    <div className={`space-y-6 p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${getFlag("feature_mixed_ability") || getFlag("feature_emergency_warmup") ? 'bg-rose-50 border-rose-200 shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-75'}`}>
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg transition-colors ${getFlag("feature_mixed_ability") || getFlag("feature_emergency_warmup") ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">Educational Core Management</h3>
                                </div>
                                <p className="text-sm text-slate-500">Zarządzaj kluczowymi funkcjami dydaktycznymi Twojego sklepu.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-rose-50 shadow-sm">
                                <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        Mixed-Ability Mode
                                        <Badge variant="outline" className="text-[9px] uppercase font-black text-rose-400 border-rose-200">Accessibility</Badge>
                                    </div>
                                    <p className="text-xs text-slate-500">Funkcje inkluzywności (OpenDyslexic, uproszczenia).</p>
                                </div>
                                <Switch checked={getFlag("feature_mixed_ability")} onCheckedChange={toggleFlag.bind(null, "feature_mixed_ability")} className="data-[state=checked]:bg-rose-500" />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-rose-50 shadow-sm">
                                <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        Emergency Warm-up
                                        <Badge variant="outline" className="text-[9px] uppercase font-black text-orange-400 border-orange-200">Zaraz Wchodzę!</Badge>
                                    </div>
                                    <p className="text-xs text-slate-500">Tryb awaryjny "0-Prep" dla nauczycieli.</p>
                                </div>
                                <Switch checked={getFlag("feature_emergency_warmup")} onCheckedChange={toggleFlag.bind(null, "feature_emergency_warmup")} className="data-[state=checked]:bg-orange-500" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    <h3 className="font-bold text-lg text-slate-900">{st.extensions?.title || "B2B Extensions"}</h3>
                                </div>
                                <p className="text-sm text-slate-500">{st.extensions?.desc || "Marketplace for AI tokens and services (Phase 13)."}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Switch checked={getFlag("feature_marketplace_global")} onCheckedChange={() => toggleFlag("feature_marketplace_global")} className="data-[state=checked]:bg-emerald-500" />
                                <Badge variant={getFlag("feature_marketplace_global") ? "default" : "outline"} className={getFlag("feature_marketplace_global") ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "text-slate-400"}>
                                    {getFlag("feature_marketplace_global") ? (st.apiViewer?.on || "Global ON") : (st.apiViewer?.off || "Paused")}
                                </Badge>
                            </div>
                        </div>

                        {!getFlag("feature_marketplace_global") && (
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-indigo-700">
                                    <ShieldAlert className="h-4 w-4" />
                                    Lista Wczesnego Dostępu (Złota Lista)
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="email@nauczyciel.pl"
                                        value={marketInput}
                                        onChange={(e) => setMarketInput(e.target.value)}
                                        className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                    />
                                    <Button onClick={addMarketBeta} size="icon" className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {marketBeta.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {marketBeta.map(email => (
                                            <Badge key={email} variant="outline" className="bg-amber-50 text-amber-900 border-amber-200 py-1.5 px-3 flex items-center gap-2">
                                                {email}
                                                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeBeta('market', email)} />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* Section 1.8: Modular Legal Documents */}
                    <div className="md:col-span-2 mt-8 pt-8 border-t border-slate-100 space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-slate-700" />
                                Modułowe Dokumenty Prawne (SaaS)
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Włączaj i wyłączaj konkretne paragrafy Regulaminu lub Polityki w zależności od kraju czy trybu sprzedaży. Numeracja punktów dostosuje się automatycznie.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.values(LEGAL_DOCUMENTS).map(doc => (
                                <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-slate-800">{doc.title}</h4>
                                        <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">{doc.clauses.length} paragrafów</Badge>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {doc.clauses.map(clause => {
                                            const isEnabled = legalConfig[clause.id] !== undefined ? legalConfig[clause.id] : clause.defaultEnabled;
                                            return (
                                                <div key={clause.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                    <div className="flex-1 pr-4">
                                                        <span className="text-xs font-bold text-slate-700 block mb-0.5">{clause.title}</span>
                                                        <span className="text-[10px] text-slate-400 truncate block max-w-[200px]">{typeof clause.content === 'string' ? clause.content.slice(0, 50) + "..." : "Treść złożona"}</span>
                                                    </div>
                                                    <Switch
                                                        disabled={clause.required}
                                                        checked={isEnabled}
                                                        onCheckedChange={() => toggleLegalClause(clause.id, clause.defaultEnabled)}
                                                        className="data-[state=checked]:bg-slate-800"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Button size="sm" variant="outline" className="w-full mt-2 text-xs font-bold h-8" asChild>
                                        <a href={`/pl/${doc.id === 'cookies' ? 'polityka-cookies' : 'regulamin'}`} target="_blank" rel="noreferrer">
                                            PODGLĄD DOKUMENTU na /pl
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Future Catalog mapped for the User */}
                    <div className="md:col-span-2 mt-8 pt-8 border-t-2 border-dashed border-indigo-100 space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Presentation className="h-6 w-6 text-indigo-500" />
                                {st.futureCatalog?.title || "Future B2B Module Catalog"} <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md ml-2">{st.futureCatalog?.subtitle || "In preparation"}</span>
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">{st.futureCatalog?.desc || "Features already existing in grandmother store, ready for future packaging."}</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Interactive Games */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
                                <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Gamepad2 className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{st.futureCatalog?.gamesApi || "Interactive Games (API)"}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">{st.futureCatalog?.gamesApiDesc || "Allow schools to embed Arcade Room."}</p>
                                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">{st.futureCatalog?.ready || "Ready for deployment"}</Badge>
                            </div>

                            {/* Gamification Engine */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-md transition-all group">
                                <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{st.futureCatalog?.gamificationEngine || "Gamification Engine"}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">{st.futureCatalog?.gamificationEngineDesc || "Badges, Certificates, Proficiency Tree."}</p>
                                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">{st.futureCatalog?.ready || "Ready for deployment"}</Badge>
                            </div>

                            {/* Advanced Telemetry & Progress */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
                                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{st.futureCatalog?.telemetry || "Clean Summaries"}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">{st.futureCatalog?.telemetryDesc || "Simple student summaries."}</p>
                                <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-200 bg-amber-50">{st.futureCatalog?.requiresPhase9 || "Requires Phase 9"}</Badge>
                            </div>

                            {/* White-label Affiliate */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-rose-300 hover:shadow-md transition-all group">
                                <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{st.futureCatalog?.affiliate || "B2B Affiliate Program"}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">{st.futureCatalog?.affiliateDesc || "Schools dropship your courses."}</p>
                                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">{st.futureCatalog?.ready || "Ready for deployment"}</Badge>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
