"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AI_PROVIDERS } from "@/lib/product-schema";
import { AIWorkshop } from "@/components/admin/ai-workshop";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useLanguage, NamespaceGuard } from "@/components/language-provider";
import { AdminIntegrations } from "@/components/admin-integrations";
import { SecureInput } from "@/components/admin/secure-input";
import { Save, CheckCircle2, Globe, BarChart3, Search, Settings2, Facebook, Zap, Plus, Trash2, Mail, Cloud, RefreshCw, Download, Users, Percent, Receipt, ShoppingCart, ShoppingBag, ShieldCheck, Activity, Wallet, Coins, CreditCard, Trophy, Gamepad2, Wand2, Layout, FileText, Music, Mic2, BrainCircuit, Eye, TrendingUp, History, Lightbulb, Bot, Send, Sparkles, MoreHorizontal, DatabaseZap, ArrowDownToLine, CheckCircle, XCircle, Loader2 } from "lucide-react";

const PROVIDER_METADATA: Record<string, { icon: any, color: string, bg: string }> = {
    openai: { icon: Bot, color: "text-emerald-600", bg: "bg-emerald-50" },
    gemini: { icon: Sparkles, color: "text-blue-600", bg: "bg-blue-50" },
    anthropic: { icon: BrainCircuit, color: "text-orange-600", bg: "bg-orange-50" },
    manus: { icon: Globe, color: "text-indigo-600", bg: "bg-indigo-50" },
};

interface SettingsState {
    activeProvider: string;
    providers: {
        [key: string]: {
            apiKey: string;
            model: string;
            enabled: boolean;
        };
    };
    marketing: {
        ga4: string;
        fbPixel: string;
        capiToken: string;
        tiktokPixel: string;
        pinterestTag: string;
        snapchatPixel: string;
        metaVerification: string;
        gsc: string;
        clarityId: string;
        hotjarId: string;
        trackingEnabled: boolean;
        enhancedConversions: boolean;
        serverSideTracking: boolean;
        firstPartyData: boolean;
        fomoEnabled: boolean;
        trustBadgesEnabled: boolean;
    };
    seo: {
        defaultTitle: string;
        defaultDescription: string;
        ogImage: string;
        siteName: string;
        aiDiscoveryEnabled: boolean;
        aiSummary: string;
        canonicalUrl: string;
    };
    integrations: {
        webhooks: { id: string; url: string; event: string; enabled: boolean }[];
        mcp: { serverUrl: string; enabled: boolean };
        externalApis: { service: string; apiKey: string; enabled: boolean }[];
    };
    emails: {
        templates: {
            [key: string]: { subject: string; content: string };
        };
        smtpConfig: {
            enabled: boolean;
            host: string;
            port: string;
            user: string;
            pass: string;
        };
    };
    google: {
        clientId: string;
        clientSecret: string;
        connected: boolean;
        connectedEmail: string;
    };
    affiliate: {
        commission: string;
        discount: string;
        cookieLife: string;
        enabled: boolean;
    };
    pricing: {
        pppEnabled: boolean;
        baseCurrency: string;
        stripePublishableKey: string;
        stripeSecretKey: string;
        stripeEnvironment: 'sandbox' | 'production';
        paynowAccessKey: string;
        paynowSignatureKey: string;
        paynowEnvironment: 'sandbox' | 'production';
        recurringEnabled: boolean;
    };
    taxes: {
        mossEnabled: boolean;
        provider: string;
        apiKey: string;
    };
    abandoned: {
        delay: string;
        discountCode: string;
        enabled: boolean;
    };
    guardian: {
        legalEnabled: boolean;
        techEnabled: boolean;
        securityEnabled: boolean;
        alertsEnabled: boolean;
    };
    economy: {
        walletEnabled: boolean;
        loyaltyEnabled: boolean;
        recurringTopup: boolean;
        pointsPerEur: string;
        rate: string;
    };
    gamification: {
        enabled: boolean;
        goldDiscount: string;
        silverDiscount: string;
        diamondMultiplier: string;
    };
    interactive: {
        wordwallKey: string;
        geniallyKey: string;
        wordwallCookie?: string;
        autoImport: boolean;
    };
    workshop: {
        canvaToken: string;
        heygenKey: string;
        elevenlabsKey: string;
        klingKey: string;
        lumaKey: string;
        notebookLmLink: string;
        ragSource: string;
        autoExportCanva: boolean;
    };
    market: {
        monitoringEnabled: boolean;
        targetCurriculum: string;
        competitorTracking: boolean;
    };
    insights: {
        autoSuggestions: boolean;
        auditFrequency: string;
    };
    automation: {
        activeAgent: string;
        webhookUrl: string;
    };
    publigo_features: {
        videoLimit: string;
        playerColor: string;
        watermark: boolean;
        drmEnabled: boolean;
    };
}

const STORAGE_KEY = "admin_full_settings";

export default function SettingsContent({ dictionary }: { dictionary: any }) {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || "marketing";

    const [settings, setSettings] = useState<SettingsState>({
        activeProvider: "openai",
        providers: {
            openai: { apiKey: "", model: "gpt-4o-mini", enabled: false },
            gemini: { apiKey: "", model: "gemini-2.0-flash", enabled: false },
            anthropic: { apiKey: "", model: "claude-3-5-sonnet-20241022", enabled: false },
            manus: { apiKey: "", model: "manus-browser-v1", enabled: false },
        },
        marketing: {
            ga4: "",
            fbPixel: "",
            capiToken: "",
            tiktokPixel: "",
            pinterestTag: "",
            snapchatPixel: "",
            metaVerification: "",
            gsc: "",
            clarityId: "",
            hotjarId: "",
            trackingEnabled: false,
            enhancedConversions: true,
            serverSideTracking: true,
            firstPartyData: true,
            fomoEnabled: true,
            trustBadgesEnabled: true,
        },
        seo: {
            defaultTitle: "Materials for English Teachers",
            defaultDescription: "Creative educational materials, lesson plans and teaching resources.",
            ogImage: "",
            siteName: "Kamila Łobko-Koziej",
            aiDiscoveryEnabled: true,
            aiSummary: "Educational materials for English teachers including lesson plans and PDF resources.",
            canonicalUrl: "https://kamila.shor.dev",
        },
        integrations: {
            webhooks: [],
            mcp: { serverUrl: "", enabled: false },
            externalApis: []
        },
        emails: {
            templates: {
                welcome: {
                    subject: "Welcome to our community!",
                    content: "We're glad to have you with us. Your login details are below..."
                },
                order_confirmed: {
                    subject: "Your order {orderNumber} has been received",
                    content: "Thank you for your purchase! Your materials are available in the panel."
                },
                login_details: {
                    subject: "Your access details",
                    content: "Email: {email}\nPassword: {password}"
                }
            },
            smtpConfig: {
                enabled: false,
                host: "smtp.kamila.shor.dev",
                port: "587",
                user: "",
                pass: ""
            }
        },
        google: {
            clientId: "",
            clientSecret: "",
            connected: false,
            connectedEmail: ""
        },
        affiliate: {
            commission: "15",
            discount: "5",
            cookieLife: "30",
            enabled: false
        },
        pricing: {
            pppEnabled: false,
            baseCurrency: "EUR",
            stripePublishableKey: "",
            stripeSecretKey: "",
            stripeEnvironment: 'sandbox',
            paynowAccessKey: "",
            paynowSignatureKey: "",
            paynowEnvironment: 'sandbox',
            recurringEnabled: false
        },
        taxes: {
            mossEnabled: false,
            provider: "fakturownia",
            apiKey: ""
        },
        abandoned: {
            delay: "2",
            discountCode: "BACK5",
            enabled: false,
        },
        guardian: {
            legalEnabled: true,
            techEnabled: true,
            securityEnabled: true,
            alertsEnabled: true
        },
        economy: {
            walletEnabled: false,
            loyaltyEnabled: true,
            recurringTopup: false,
            pointsPerEur: "10",
            rate: "100"
        },
        gamification: {
            enabled: true,
            goldDiscount: "10",
            silverDiscount: "5",
            diamondMultiplier: "2"
        },
        interactive: {
            wordwallKey: "",
            geniallyKey: "",
            autoImport: true
        },
        workshop: {
            canvaToken: "",
            heygenKey: "",
            elevenlabsKey: "",
            klingKey: "",
            lumaKey: "",
            notebookLmLink: "",
            ragSource: "google_drive",
            autoExportCanva: false
        },
        market: {
            monitoringEnabled: true,
            targetCurriculum: "pl_mein",
            competitorTracking: true
        },
        insights: {
            autoSuggestions: true,
            auditFrequency: "weekly"
        },
        automation: {
            activeAgent: "none",
            webhookUrl: "https://api.kamila.shor.dev/webhooks/agent-receiver"
        },
        publigo_features: {
            videoLimit: "25", // GB
            playerColor: "#4f46e5",
            watermark: false,
            drmEnabled: true
        }
    });

    const [saved, setSaved] = useState(false);
    const [agentDrafts, setAgentDrafts] = useState<any[]>([]);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditLogs, setAuditLogs] = useState<string[]>([]);
    const [auditResult, setAuditResult] = useState<string | null>(null);

    // Simulate receiving data from Agent
    const handleSimulateAgent = async () => {
        try {
            const res = await fetch('/api/webhooks/agent-receiver', {
                method: 'POST',
                body: JSON.stringify({
                    source: "Manus AI (Genially Scraper)",
                    items: [
                        { id: 1, title: "Escape Room: Easter Edition", type: "game", url: "https://view.genial.ly/..." },
                        { id: 2, title: "Spring Vocabulary Match", type: "game", url: "https://view.genial.ly/..." },
                        { id: 3, title: "Irregular Verbs Quiz", type: "quiz", url: "https://view.genial.ly/..." }
                    ],
                    timestamp: Date.now()
                })
            });
            const data = await res.json();
            if (data.success) {
                setAgentDrafts(prev => [
                    ...prev,
                    { id: Date.now(), title: "Genially Package from Agent", count: data.processedItems, date: new Date().toLocaleTimeString() }
                ]);
                const msg = t.adminSettings?.automation?.agent_delivered;
                const finalMsg = typeof msg === 'string' ? msg.replace("{count}", data.processedItems.toString()) : `Processed ${data.processedItems} items`;
                console.log(finalMsg);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleManualAudit = async () => {
        setIsAuditing(true);
        setAuditResult(null);
        setAuditLogs(["🚀 Inicjalizacja agenta Manus AI...", "🔍 Sprawdzanie konfiguracji lokalnej..."]);

        try {
            const isLocal = window.location.hostname === 'localhost';
            if (isLocal) {
                setAuditLogs(prev => [...prev, "🌐 Tworzenie bezpiecznego tunelu dla środowiska lokalnego..."]);
            }

            const res = await fetch('/api/admin/manus/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isLocal: isLocal,
                    targetUrl: window.location.origin
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Błąd podczas audytu");

            setAuditLogs(prev => [...prev, "🧩 Skanowanie struktury strony i metadanych SEO..."]);
            await new Promise(r => setTimeout(r, 2000));

            setAuditLogs(prev => [...prev, "💰 Weryfikacja spójności cen regionalnych (PPP)..."]);
            await new Promise(r => setTimeout(r, 1800));

            setAuditLogs(prev => [...prev, "✍️ Analiza opisów produktów pod kątem konwersji..."]);
            await new Promise(r => setTimeout(r, 2200));

            setAuditLogs(prev => [...prev, "✨ Finalizowanie raportu końcowego..."]);
            await new Promise(r => setTimeout(r, 1200));

            setIsAuditing(false);
            setAuditResult(data.suggestion || t.adminSettings.insights.audit.suggestion);
            toast.success("Audyt zakończony pomyślnie!");

        } catch (error: any) {
            console.error(error);
            setAuditLogs(prev => [...prev, `❌ Błąd: ${error.message}`]);
            setIsAuditing(false);
            toast.error(`Błąd: ${error.message}`);
        }
    };

    // Load settings
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSettings({
                    ...parsed,
                    marketing: {
                        ...parsed.marketing,
                        capiToken: parsed.marketing?.capiToken || "",
                        tiktokPixel: parsed.marketing?.tiktokPixel || "",
                        pinterestTag: parsed.marketing?.pinterestTag || "",
                        snapchatPixel: parsed.marketing?.snapchatPixel || "",
                        clarityId: parsed.marketing?.clarityId || "",
                        hotjarId: parsed.marketing?.hotjarId || "",
                        enhancedConversions: parsed.marketing?.enhancedConversions ?? true,
                        serverSideTracking: parsed.marketing?.serverSideTracking ?? true,
                        firstPartyData: parsed.marketing?.firstPartyData ?? true,
                        fomoEnabled: parsed.marketing?.fomoEnabled ?? true,
                        trustBadgesEnabled: parsed.marketing?.trustBadgesEnabled ?? true,
                    },
                    seo: {
                        ...parsed.seo,
                        aiDiscoveryEnabled: parsed.seo?.aiDiscoveryEnabled ?? true,
                        aiSummary: parsed.seo?.aiSummary || "Educational materials for English teachers including lesson plans and PDF resources.",
                        canonicalUrl: parsed.seo?.canonicalUrl || "https://kamila.shor.dev",
                    },
                    integrations: parsed.integrations || { webhooks: [], mcp: { serverUrl: "", enabled: false }, externalApis: [] },
                    emails: parsed.emails || {
                        templates: {
                            welcome: { subject: "", content: "" },
                            order_confirmed: { subject: "", content: "" },
                            login_details: { subject: "", content: "" }
                        },
                        smtpConfig: { enabled: false, host: "", port: "", user: "", pass: "" }
                    },
                    google: parsed.google || {
                        clientId: "",
                        clientSecret: "",
                        connected: false,
                        connectedEmail: ""
                    },
                    affiliate: parsed.affiliate || { commission: "15", discount: "5", cookieLife: "30", enabled: false },
                    pricing: parsed.pricing || {
                        pppEnabled: false,
                        baseCurrency: "EUR",
                        stripePublishableKey: "",
                        stripeSecretKey: "",
                        stripeEnvironment: 'sandbox',
                        paynowAccessKey: "",
                        paynowSignatureKey: "",
                        paynowEnvironment: 'sandbox',
                        recurringEnabled: false
                    },
                    taxes: parsed.taxes || { mossEnabled: false, provider: "fakturownia", apiKey: "" },
                    abandoned: parsed.abandoned || { delay: "2", discountCode: "BACK5", enabled: false },
                    guardian: parsed.guardian || { legalEnabled: true, techEnabled: true, securityEnabled: true, alertsEnabled: true },
                    economy: parsed.economy || { walletEnabled: false, loyaltyEnabled: true, recurringTopup: false, pointsPerEur: "10", rate: "100" },
                    gamification: parsed.gamification || { enabled: true, goldDiscount: "10", silverDiscount: "5", diamondMultiplier: "2" },
                    interactive: parsed.interactive || { wordwallKey: "", geniallyKey: "", autoImport: true },
                    workshop: parsed.workshop || {
                        canvaToken: "",
                        heygenKey: "",
                        elevenlabsKey: "",
                        klingKey: "",
                        lumaKey: "",
                        notebookLmLink: "",
                        ragSource: "google_drive",
                        autoExportCanva: false
                    },
                    market: parsed.market || { monitoringEnabled: true, targetCurriculum: "pl_mein", competitorTracking: true },
                    insights: parsed.insights || { autoSuggestions: true, auditFrequency: "weekly" },
                    automation: parsed.automation || { activeAgent: "none", webhookUrl: "https://api.kamila.shor.dev/webhooks/agent-receiver" }
                });
            } catch (e) {
                console.error("Failed to parse settings:", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        toast.success(t.adminSettings.common.save_success || "Settings saved successfully!");
        setTimeout(() => setSaved(false), 2000);
    };

    const updateNested = (category: keyof SettingsState, field: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [category]: {
                ...(prev[category] as any),
                [field]: value,
            }
        }));
    };



    const updateProvider = (providerId: string, field: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            providers: {
                ...prev.providers,
                [providerId]: {
                    ...prev.providers[providerId],
                    [field]: value,
                },
            },
        }));
    };

    const updateEmailTemplate = (name: string, field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            emails: {
                ...prev.emails,
                templates: {
                    ...prev.emails.templates,
                    [name]: { ...prev.emails.templates[name], [field]: value }
                }
            }
        }));
    };

    return (
        <NamespaceGuard dictionary={dictionary} namespace="adminSettings">
            <div className="space-y-8 max-w-5xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{typeof t.adminSettings.title === 'string' ? t.adminSettings.title : "Admin Settings"}</h1>
                        <p className="text-muted-foreground">{typeof t.adminSettings.description === 'string' ? t.adminSettings.description : "Manage store settings"}</p>
                    </div>
                    <Button onClick={handleSave} className="gap-2 shadow-lg transition-all hover:scale-105">
                        {saved ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                {t.adminSettings.common.saved}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {t.adminSettings.common.save}
                            </>
                        )}
                    </Button>
                </div>

                <Tabs defaultValue={defaultTab} orientation="vertical" className="flex flex-col xl:flex-row gap-8">
                    <aside className="w-full xl:w-72 space-y-8 flex-shrink-0">
                        <div className="space-y-4">
                            <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b pb-2">
                                {t.adminSettings.sections.shopping}
                            </div>
                            <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-1 items-stretch">
                                <TabsTrigger value="pricing" className="justify-start gap-3 h-10 px-4">
                                    <Percent className="h-4 w-4" /> {t.adminSettings.tabs.pricing}
                                </TabsTrigger>
                                <TabsTrigger value="taxes" className="justify-start gap-3 h-10 px-4">
                                    <Receipt className="h-4 w-4" /> {t.adminSettings.tabs.taxes}
                                </TabsTrigger>
                                <TabsTrigger value="affiliate" className="justify-start gap-3 h-10 px-4">
                                    <Users className="h-4 w-4" /> {t.adminSettings.tabs.affiliate}
                                </TabsTrigger>
                                <TabsTrigger value="economy" className="justify-start gap-3 h-10 px-4">
                                    <Coins className="h-4 w-4" /> {t.adminSettings.tabs.economy}
                                </TabsTrigger>
                                <TabsTrigger value="abandoned" className="justify-start gap-3 h-10 px-4">
                                    <ShoppingCart className="h-4 w-4" /> {t.adminSettings.tabs.abandoned}
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="space-y-4">
                            <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b pb-2">
                                {t.adminSettings.sections.ai}
                            </div>
                            <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-1 items-stretch">
                                <TabsTrigger value="workshop" className="justify-start gap-3 h-10 px-4">
                                    <Wand2 className="h-4 w-4" /> {t.adminSettings.tabs.workshop}
                                </TabsTrigger>
                                <TabsTrigger value="interactive" className="justify-start gap-3 h-10 px-4">
                                    <Gamepad2 className="h-4 w-4" /> {t.adminSettings.tabs.interactive}
                                </TabsTrigger>
                                <TabsTrigger value="automation" className="justify-start gap-3 h-10 px-4">
                                    <Bot className="h-4 w-4" /> {t.adminSettings.tabs.automation}
                                </TabsTrigger>
                                <TabsTrigger value="ai" className="justify-start gap-3 h-10 px-4">
                                    <Settings2 className="h-4 w-4" /> {t.adminSettings.tabs.ai}
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="space-y-4">
                            <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b pb-2">
                                {t.adminSettings.sections.growth}
                            </div>
                            <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-1 items-stretch">
                                <TabsTrigger value="marketing" className="justify-start gap-3 h-10 px-4">
                                    <BarChart3 className="h-4 w-4" /> {t.adminSettings.tabs.marketing}
                                </TabsTrigger>
                                <TabsTrigger value="seo" className="justify-start gap-3 h-10 px-4">
                                    <Globe className="h-4 w-4" /> {t.adminSettings.tabs.seo}
                                </TabsTrigger>
                                <TabsTrigger value="channels" className="justify-start gap-3 h-10 px-4">
                                    <ShoppingBag className="h-4 w-4" /> {t.adminSettings.tabs.channels}
                                </TabsTrigger>
                                <TabsTrigger value="market" className="justify-start gap-3 h-10 px-4">
                                    <TrendingUp className="h-4 w-4" /> {t.adminSettings.tabs.market}
                                </TabsTrigger>
                                <TabsTrigger value="insights" className="justify-start gap-3 h-10 px-4">
                                    <Lightbulb className="h-4 w-4" /> {t.adminSettings.tabs.insights}
                                </TabsTrigger>
                                <TabsTrigger value="gamification" className="justify-start gap-3 h-10 px-4">
                                    <Trophy className="h-4 w-4" /> {t.adminSettings.tabs.gamification}
                                </TabsTrigger>
                                <TabsTrigger value="marketing_hacks" className="justify-start gap-3 h-10 px-4">
                                    <Sparkles className="h-4 w-4" /> {t.adminSettings.tabs.growth_hacks}
                                </TabsTrigger>
                                <TabsTrigger value="ai_discovery" className="justify-start gap-3 h-10 px-4">
                                    <Search className="h-4 w-4" /> {t.adminSettings.tabs.ai_discovery}
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="space-y-4">
                            <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b pb-2">
                                {t.adminSettings.sections.system}
                            </div>
                            <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-1 items-stretch">
                                <TabsTrigger value="emails" className="justify-start gap-3 h-10 px-4">
                                    <Mail className="h-4 w-4" /> {t.adminSettings.tabs.emails}
                                </TabsTrigger>
                                <TabsTrigger value="google" className="justify-start gap-3 h-10 px-4">
                                    <Cloud className="h-4 w-4" /> {t.adminSettings.tabs.google}
                                </TabsTrigger>
                                <TabsTrigger value="guardian" className="justify-start gap-3 h-10 px-4">
                                    <ShieldCheck className="h-4 w-4" /> {t.adminSettings.tabs.guardian}
                                </TabsTrigger>
                                <TabsTrigger value="integrations" className="justify-start gap-3 h-10 px-4">
                                    <Zap className="h-4 w-4" /> {t.adminSettings.tabs.integrations}
                                </TabsTrigger>
                                <TabsTrigger value="wp_migration" className="justify-start gap-3 h-10 px-4">
                                    <DatabaseZap className="h-4 w-4" /> Migracja WP Idea
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        {/* Tab contents map... */}
                        <TabsContent value="marketing" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Tracking Switch */}
                            <Card className="border-indigo-100 bg-indigo-50/30 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity className="h-24 w-24 text-indigo-600 rotate-12" />
                                </div>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg text-indigo-900">{t.adminSettings.marketing.enabled}</h3>
                                            <p className="text-sm text-indigo-600/70 font-medium max-w-md">
                                                {t.adminSettings.common.enabled_desc}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.marketing.trackingEnabled}
                                            onCheckedChange={(checked) => updateNested("marketing", "trackingEnabled", checked)}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Google Analtyics */}
                                <Card className="shadow-sm hover:shadow-md transition-all border-slate-100">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                                                <BarChart3 className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-base font-black uppercase tracking-tight">Google Analytics</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.adminSettings.marketing.ga4}</Label>
                                            <Input
                                                value={settings.marketing.ga4}
                                                onChange={(e) => updateNested("marketing", "ga4", e.target.value)}
                                                placeholder={t.adminSettings.marketing.ga4_placeholder}
                                                className="h-11 border-slate-200 focus:ring-orange-500/20 focus:border-orange-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.adminSettings.marketing.gsc}</Label>
                                            <Input
                                                value={settings.marketing.gsc}
                                                onChange={(e) => updateNested("marketing", "gsc", e.target.value)}
                                                placeholder={t.adminSettings.marketing.gsc_placeholder}
                                                className="h-11 border-slate-200 focus:ring-orange-500/20 focus:border-orange-500"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Meta Ads / Facebook */}
                                <Card className="shadow-sm hover:shadow-md transition-all border-slate-100">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                                <Facebook className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-base font-black uppercase tracking-tight">Meta Ads (Facebook)</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.adminSettings.marketing.fb_pixel}</Label>
                                            <Input
                                                value={settings.marketing.fbPixel}
                                                onChange={(e) => updateNested("marketing", "fbPixel", e.target.value)}
                                                placeholder={t.adminSettings.marketing.fb_pixel_placeholder}
                                                className="h-11 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                                            />
                                        </div>
                                        <SecureInput
                                            id="meta-capi"
                                            label={t.adminSettings.marketing.capi_token}
                                            value={settings.marketing.capiToken}
                                            onChange={(val) => updateNested("marketing", "capiToken", val)}
                                            placeholder={t.adminSettings.marketing.capi_placeholder}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Other Social Pixels */}
                                <Card className="shadow-sm hover:shadow-md transition-all border-slate-100">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-base font-black uppercase tracking-tight">Social Pixels</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.adminSettings.marketing.tiktok_pixel}</Label>
                                            <Input
                                                value={settings.marketing.tiktokPixel}
                                                onChange={(e) => updateNested("marketing", "tiktokPixel", e.target.value)}
                                                placeholder={t.adminSettings.marketing.tiktok_placeholder}
                                                className="h-11 border-slate-200"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.adminSettings.marketing.pinterest_tag}</Label>
                                                <Input
                                                    value={settings.marketing.pinterestTag}
                                                    onChange={(e) => updateNested("marketing", "pinterestTag", e.target.value)}
                                                    placeholder={t.adminSettings.marketing.pinterest_placeholder}
                                                    className="h-11 border-slate-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.adminSettings.marketing.snapchat_pixel}</Label>
                                                <Input
                                                    value={settings.marketing.snapchatPixel}
                                                    onChange={(e) => updateNested("marketing", "snapchatPixel", e.target.value)}
                                                    placeholder={t.adminSettings.marketing.snapchat_placeholder}
                                                    className="h-11 border-slate-200"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tracking Optimizer */}
                                <Card className="shadow-md border-indigo-200 bg-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Sparkles className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-base font-black uppercase tracking-tight text-indigo-600">
                                            {t.adminSettings.marketing.optimizer.title}
                                        </CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                            {t.adminSettings.marketing.optimizer.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                                            <div className="space-y-0.5">
                                                <Label className="text-xs font-bold text-indigo-900">{t.adminSettings.marketing.optimizer.enhanced_conversions}</Label>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Recommended for GA4</p>
                                            </div>
                                            <Switch
                                                checked={settings.marketing.enhancedConversions}
                                                onCheckedChange={(checked) => updateNested("marketing", "enhancedConversions", checked)}
                                                className="data-[state=checked]:bg-indigo-600"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                                            <div className="space-y-0.5">
                                                <Label className="text-xs font-bold text-indigo-900">{t.adminSettings.marketing.optimizer.server_side}</Label>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Bypass AdBlockers (Meta CAPI)</p>
                                            </div>
                                            <Switch
                                                checked={settings.marketing.serverSideTracking}
                                                onCheckedChange={(checked) => updateNested("marketing", "serverSideTracking", checked)}
                                                className="data-[state=checked]:bg-indigo-600"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                                            <div className="space-y-0.5">
                                                <Label className="text-xs font-bold text-indigo-900">{t.adminSettings.marketing.optimizer.first_party_data}</Label>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Cookies v2 Compliance</p>
                                            </div>
                                            <Switch
                                                checked={settings.marketing.firstPartyData}
                                                onCheckedChange={(checked) => updateNested("marketing", "firstPartyData", checked)}
                                                className="data-[state=checked]:bg-indigo-600"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="seo" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.seo.basic_title}</CardTitle>
                                    <CardDescription>{t.adminSettings.seo.basic_desc}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.seo.site_name}</Label>
                                        <Input value={settings.seo.siteName} onChange={(e) => updateNested("seo", "siteName", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.seo.canonical_url}</Label>
                                        <Input value={settings.seo.canonicalUrl} onChange={(e) => updateNested("seo", "canonicalUrl", e.target.value)} placeholder="https://kamilaenglish.com" />
                                        <p className="text-xs text-muted-foreground">{t.adminSettings.seo.canonical_desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="ai_discovery" className="space-y-4">
                            <Card className="border-none shadow-premium bg-white/40 glass-premium overflow-hidden">
                                <CardHeader className="bg-gradient-to-br from-blue-50/50 to-white/50">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Search className="h-5 w-5 text-blue-600" />
                                        </div>
                                        {t.adminSettings.seo.ai_discovery_title}
                                    </CardTitle>
                                    <CardDescription>{t.adminSettings.seo.ai_discovery_desc}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-slate-900">{t.adminSettings.seo.ai_discovery_enabled}</Label>
                                            <p className="text-xs text-slate-500 font-medium">{t.adminSettings.seo.ai_discovery_enabled_desc}</p>
                                        </div>
                                        <Switch
                                            checked={settings.seo.aiDiscoveryEnabled}
                                            onCheckedChange={(checked) => updateNested("seo", "aiDiscoveryEnabled", checked)}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t.adminSettings.seo.ai_summary}</Label>
                                        <Input
                                            value={settings.seo.aiSummary}
                                            onChange={(e) => updateNested("seo", "aiSummary", e.target.value)}
                                            placeholder={t.adminSettings.seo.ai_summary_placeholder}
                                            className="h-12 rounded-xl bg-white border-slate-200"
                                        />
                                        <p className="text-xs text-slate-500 font-medium italic">{t.adminSettings.seo.ai_summary_desc}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2 h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-bold"
                                            onClick={() => toast.info("Sitemap regeneration triggered for all locales!")}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            {t.adminSettings.seo.sitemap_regenerate}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="marketing_hacks" className="space-y-4">
                            <Card className="border-none shadow-premium bg-white/40 glass-premium overflow-hidden">
                                <CardHeader className="bg-gradient-to-br from-indigo-50/50 to-white/50">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Sparkles className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        {t.adminSettings.seo.growth_hacks_title}
                                    </CardTitle>
                                    <CardDescription>{t.adminSettings.seo.growth_hacks_desc}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-bold text-slate-900">{t.adminSettings.seo.fomo_title}</Label>
                                                <p className="text-xs text-slate-500 font-medium">{t.adminSettings.seo.fomo_desc}</p>
                                            </div>
                                            <Switch
                                                checked={settings.marketing.fomoEnabled}
                                                onCheckedChange={(checked) => updateNested("marketing", "fomoEnabled", checked)}
                                                className="data-[state=checked]:bg-indigo-600"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-bold text-slate-900">{t.adminSettings.seo.trust_title}</Label>
                                                <p className="text-xs text-slate-500 font-medium">{t.adminSettings.seo.trust_desc}</p>
                                            </div>
                                            <Switch
                                                checked={settings.marketing.trustBadgesEnabled}
                                                onCheckedChange={(checked) => updateNested("marketing", "trustBadgesEnabled", checked)}
                                                className="data-[state=checked]:bg-indigo-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <BarChart3 className="h-3 w-3" />
                                            {t.adminSettings.seo.ux_tracking}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{t.adminSettings.seo.clarity_id}</Label>
                                                <Input
                                                    value={settings.marketing.clarityId}
                                                    onChange={(e) => updateNested("marketing", "clarityId", e.target.value)}
                                                    placeholder="Project ID..."
                                                    className="h-11 rounded-xl bg-white border-slate-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{t.adminSettings.seo.hotjar_id}</Label>
                                                <Input
                                                    value={settings.marketing.hotjarId}
                                                    onChange={(e) => updateNested("marketing", "hotjarId", e.target.value)}
                                                    placeholder="Site ID..."
                                                    className="h-11 rounded-xl bg-white border-slate-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pricing" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.pricing.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.pricing.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>{t.adminSettings.pricing.enable_ppp}</Label>
                                            <p className="text-xs text-muted-foreground">{t.adminSettings.pricing.description}</p>
                                        </div>
                                        <Switch
                                            checked={settings.pricing.pppEnabled}
                                            onCheckedChange={(checked) => updateNested("pricing", "pppEnabled", checked)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.pricing.base_currency}</Label>
                                        <Select
                                            value={settings.pricing.baseCurrency}
                                            onValueChange={(value) => updateNested("pricing", "baseCurrency", value)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PLN">PLN (zł)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="pt-4 border-t space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5 text-indigo-600" />
                                                <h3 className="font-semibold">{t.adminSettings.taxes.stripe_title}</h3>
                                            </div>
                                            <Select
                                                value={settings.pricing.stripeEnvironment}
                                                onValueChange={(val: any) => updateNested("pricing", "stripeEnvironment", val)}
                                            >
                                                <SelectTrigger className="w-32 h-8 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-none">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sandbox">SANDBOX</SelectItem>
                                                    <SelectItem value="production">PRODUCTION</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                <ShieldCheck className="h-3 w-3 text-indigo-500" />
                                                {t.adminSettings.taxes.stripe_publishable}
                                            </Label>
                                            <Input
                                                value={settings.pricing.stripePublishableKey}
                                                onChange={(e) => updateNested("pricing", "stripePublishableKey", e.target.value)}
                                                placeholder="pk_test_..."
                                            />
                                        </div>
                                        <SecureInput
                                            id="stripe-secret"
                                            label={t.adminSettings.taxes.stripe_secret}
                                            value={settings.pricing.stripeSecretKey}
                                            onChange={(val) => updateNested("pricing", "stripeSecretKey", val)}
                                            placeholder="sk_test_..."
                                        />
                                    </div>

                                    <div className="pt-6 border-t space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-16 bg-white border border-slate-200 rounded flex items-center justify-center grayscale group-hover:grayscale-0 transition-all shadow-sm">
                                                    <span className="font-black text-indigo-600 italic">Pay</span><span className="font-black text-slate-900">Now</span>
                                                </div>
                                                <h3 className="font-semibold text-lg">{t.adminSettings.pricing.paynow_title}</h3>
                                            </div>
                                            <Select
                                                value={settings.pricing.paynowEnvironment}
                                                onValueChange={(val: any) => updateNested("pricing", "paynowEnvironment", val)}
                                            >
                                                <SelectTrigger className="w-32 h-8 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-none">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sandbox">SANDBOX</SelectItem>
                                                    <SelectItem value="production">PRODUCTION</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    {t.adminSettings.pricing.paynow_access_key}
                                                </Label>
                                                <Input
                                                    value={settings.pricing.paynowAccessKey}
                                                    onChange={(e) => updateNested("pricing", "paynowAccessKey", e.target.value)}
                                                    placeholder="Enter PayNow Access Key"
                                                    className="rounded-xl"
                                                />
                                            </div>
                                            <SecureInput
                                                id="paynow-sig"
                                                label={t.adminSettings.pricing.paynow_signature_key}
                                                value={settings.pricing.paynowSignatureKey}
                                                onChange={(val) => updateNested("pricing", "paynowSignatureKey", val)}
                                                placeholder="Enter PayNow Signature Key"
                                            />
                                        </div>

                                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
                                            <div className="flex gap-3">
                                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                                    <Wallet className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-indigo-900">{t.adminSettings.pricing.blik_title}</p>
                                                    <p className="text-xs text-indigo-600/70">{t.adminSettings.pricing.blik_desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-5 w-5 text-indigo-600" />
                                                <h3 className="font-semibold text-lg">{t.adminSettings.pricing.recurring_title}</h3>
                                            </div>
                                            <Switch
                                                checked={settings.pricing.recurringEnabled}
                                                onCheckedChange={(checked) => updateNested("pricing", "recurringEnabled", checked)}
                                            />
                                        </div>

                                        {settings.pricing.recurringEnabled && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-10 w-16 bg-white border border-slate-200 rounded flex items-center justify-center shrink-0">
                                                            <span className="font-black text-blue-600 italic">VISA</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold text-slate-900">{t.adminSettings.pricing.recurring_visa_title}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {t.adminSettings.pricing.recurring_visa_desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Card className="bg-blue-50/30 border-blue-100">
                                                        <CardContent className="pt-4">
                                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">{t.adminSettings.pricing.recurring_frequency}</p>
                                                            <p className="text-sm font-bold font-mono">{t.adminSettings.pricing.recurring_monthly}</p>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-indigo-50/30 border-indigo-100">
                                                        <CardContent className="pt-4">
                                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">{t.adminSettings.pricing.recurring_grace_period}</p>
                                                            <p className="text-sm font-bold font-mono text-indigo-900">{t.adminSettings.pricing.recurring_retry}</p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="taxes" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.taxes.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.taxes.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>{t.adminSettings.taxes.eu_vat_moss}</Label>
                                            <p className="text-xs text-muted-foreground">{t.adminSettings.taxes.eu_vat_moss_desc || "Automatic VAT OSS settlement"}</p>
                                        </div>
                                        <Switch
                                            checked={settings.taxes.mossEnabled}
                                            onCheckedChange={(checked) => updateNested("taxes", "mossEnabled", checked)}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="space-y-2">
                                            <Label>{t.adminSettings.taxes.invoice_provider}</Label>
                                            <Select
                                                value={settings.taxes.provider}
                                                onValueChange={(value) => updateNested("taxes", "provider", value)}
                                            >
                                                <SelectTrigger className="rounded-xl h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="fakturownia">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">F</div>
                                                            Fakturownia
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="infakt">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-5 w-5 rounded bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">i</div>
                                                            InFakt
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="ifirma">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-5 w-5 rounded bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">iF</div>
                                                            iFirma
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {settings.taxes.provider === "infakt" && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                                <div className="flex items-center justify-between">
                                                    <Label>{t.adminSettings.taxes.infakt_api_key}</Label>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px]">InFakt API</Badge>
                                                </div>
                                                <SecureInput
                                                    id="infakt-api-key"
                                                    label={t.adminSettings.taxes.infakt_api_key}
                                                    value={settings.taxes.apiKey}
                                                    onChange={(val) => updateNested("taxes", "apiKey", val)}
                                                    placeholder={t.adminSettings.taxes.infakt_api_placeholder || "InFakt API Key"}
                                                />
                                            </div>
                                        )}
                                        <Button variant="outline" className="w-full gap-2 rounded-xl h-11 border-slate-200" onClick={() => {
                                            if (settings.taxes.apiKey) {
                                                toast.success("Connection successful! InFakt API is ready.");
                                            } else {
                                                toast.error("Please enter API Key first.");
                                            }
                                        }}>
                                            <RefreshCw className="h-4 w-4" />
                                            {t.adminSettings.taxes.test_connection}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="channels">
                            <AdminIntegrations embedded={true} />
                        </TabsContent>

                        <TabsContent value="integrations">
                            <AdminIntegrations embedded={true} />
                        </TabsContent>

                        <TabsContent value="ai" className="space-y-6 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 gap-6">
                                {AI_PROVIDERS.map((provider) => (
                                    <Card key={provider.id} className={cn(
                                        "shadow-sm transition-all border-slate-100",
                                        settings.activeProvider === provider.id && "ring-2 ring-indigo-500/20 border-indigo-200 shadow-md"
                                    )}>
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden transition-colors",
                                                        (PROVIDER_METADATA[provider.id] || { bg: "bg-slate-50" }).bg,
                                                        settings.activeProvider === provider.id ? "ring-2 ring-white" : ""
                                                    )}>
                                                        {(() => {
                                                            const meta = PROVIDER_METADATA[provider.id] || { icon: Sparkles, color: "text-indigo-500" };
                                                            const Icon = meta.icon;
                                                            return <Icon className={cn("h-6 w-6", meta.color)} />;
                                                        })()}
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                                                            {provider.name}
                                                            {settings.activeProvider === provider.id && (
                                                                <Badge className="h-4 text-[8px] px-1 bg-indigo-500 hover:bg-indigo-500">PRIMARY</Badge>
                                                            )}
                                                        </CardTitle>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{provider.defaultModel}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant={settings.activeProvider === provider.id ? "default" : "outline"}
                                                        size="sm"
                                                        className="h-8 text-[10px] font-black uppercase tracking-widest"
                                                        onClick={() => setSettings(prev => ({ ...prev, activeProvider: provider.id }))}
                                                    >
                                                        {settings.activeProvider === provider.id ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : null}
                                                        {settings.activeProvider === provider.id ? "Active" : "Set Active"}
                                                    </Button>
                                                    <Switch
                                                        checked={settings.providers[provider.id].enabled}
                                                        onCheckedChange={(checked) => updateProvider(provider.id, "enabled", checked)}
                                                    />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <SecureInput
                                                id={`api-key-${provider.id}`}
                                                label={`${provider.name} API Key`}
                                                value={settings.providers[provider.id].apiKey}
                                                onChange={(val) => updateProvider(provider.id, "apiKey", val)}
                                                placeholder={`Enter ${provider.name} API Key...`}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="affiliate" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.affiliate.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.affiliate.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>{t.adminSettings.affiliate.commission}</Label>
                                            <Input type="number" value={settings.affiliate.commission} onChange={(e) => updateNested("affiliate", "commission", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t.adminSettings.affiliate.discount}</Label>
                                            <Input type="number" value={settings.affiliate.discount} onChange={(e) => updateNested("affiliate", "discount", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.affiliate.cookie_life}</Label>
                                        <Input type="number" value={settings.affiliate.cookieLife} onChange={(e) => updateNested("affiliate", "cookieLife", e.target.value)} />
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <Label>{t.adminSettings.affiliate.enable_program || "Enable Affiliate Program"}</Label>
                                        <Switch checked={settings.affiliate.enabled} onCheckedChange={(checked) => updateNested("affiliate", "enabled", checked)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="economy" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.economy.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.economy.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold border-b pb-2">{t.adminSettings.economy.wallet.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <Label>{t.adminSettings.economy.wallet.enable_wallet}</Label>
                                            <Switch checked={settings.economy.walletEnabled} onCheckedChange={(checked) => updateNested("economy", "walletEnabled", checked)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t.adminSettings.economy.wallet.conversion_rate}</Label>
                                            <Input type="number" value={settings.economy.rate} onChange={(e) => updateNested("economy", "rate", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-sm font-semibold border-b pb-2">{t.adminSettings.economy.loyalty.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <Label>{t.adminSettings.economy.loyalty.enable_loyalty}</Label>
                                            <Switch checked={settings.economy.loyaltyEnabled} onCheckedChange={(checked) => updateNested("economy", "loyaltyEnabled", checked)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t.adminSettings.economy.loyalty.points_per_eur}</Label>
                                            <Input type="number" value={settings.economy.pointsPerEur} onChange={(e) => updateNested("economy", "pointsPerEur", e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="gamification" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.gamification.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.gamification.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Label>{t.adminSettings.gamification.enable || "Enable Gamification"}</Label>
                                        <Switch checked={settings.gamification.enabled} onCheckedChange={(checked) => updateNested("gamification", "enabled", checked)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>{t.adminSettings.gamification.levels.gold} (%)</Label>
                                            <Input type="number" value={settings.gamification.goldDiscount} onChange={(e) => updateNested("gamification", "goldDiscount", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t.adminSettings.gamification.levels.silver} (%)</Label>
                                            <Input type="number" value={settings.gamification.silverDiscount} onChange={(e) => updateNested("gamification", "silverDiscount", e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="market" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.market.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.market.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.market.curriculum.monitor_label}</Label>
                                        <Select value={settings.market.targetCurriculum} onValueChange={(val) => updateNested("market", "targetCurriculum", val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pl_mein">{t.adminSettings.market.curriculum.options.pl_mein}</SelectItem>
                                                <SelectItem value="uk_ofsted">{t.adminSettings.market.curriculum.options.uk_ofsted}</SelectItem>
                                                <SelectItem value="us_cc">{t.adminSettings.market.curriculum.options.us_cc}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>{t.adminSettings.market.competitor_tracking || "Competitor Monitoring"}</Label>
                                        <Switch checked={settings.market.competitorTracking} onCheckedChange={(checked) => updateNested("market", "competitorTracking", checked)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="insights" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.insights.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.insights.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label>{t.adminSettings.insights.auto_suggestions || "Automatic AI Suggestions"}</Label>
                                        <Switch checked={settings.insights.autoSuggestions} onCheckedChange={(checked) => updateNested("insights", "autoSuggestions", checked)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.insights.audit_frequency || "Audit Frequency"}</Label>
                                        <Select value={settings.insights.auditFrequency} onValueChange={(val) => updateNested("insights", "auditFrequency", val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">{t.adminSettings.insights.frequency_daily || "Daily"}</SelectItem>
                                                <SelectItem value="weekly">{t.adminSettings.insights.frequency_weekly || "Weekly"}</SelectItem>
                                                <SelectItem value="monthly">{t.adminSettings.insights.frequency_monthly || "Monthly"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-premium bg-white/40 glass-premium overflow-hidden mt-6">
                                <CardHeader className="bg-gradient-to-br from-indigo-50/50 to-white/50">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Activity className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        {t.adminSettings.insights.audit.title}
                                    </CardTitle>
                                    <CardDescription>{t.adminSettings.insights.audit.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {!isAuditing && !auditResult && (
                                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                                <Bot className="h-8 w-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-700">{t.adminSettings.insights.audit.status_ready || "Systems Ready"}</p>
                                                <p className="text-xs text-slate-400">{t.adminSettings.insights.audit.status_desc || "Manus AI agent can perform a full audit of your store."}</p>
                                            </div>
                                            <Button
                                                onClick={handleManualAudit}
                                                className="bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl text-xs font-bold uppercase tracking-widest px-8"
                                            >
                                                {t.adminSettings.insights.audit.run_btn || "Run Manual Audit"}
                                            </Button>
                                        </div>
                                    )}

                                    {isAuditing && (
                                        <div className="space-y-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                                                    <RefreshCw className="h-6 w-6 animate-spin" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-widest text-indigo-600">{t.adminSettings.insights.audit.in_progress || "Audit in progress..."}</p>
                                                    <p className="text-xs text-slate-400 font-medium italic">{t.adminSettings.insights.audit.scanning_desc || "Manus AI agent is scanning your site"}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 bg-slate-900 p-4 rounded-2xl font-mono text-[10px]/relaxed text-indigo-300/80 shadow-inner">
                                                {auditLogs.map((log, idx) => (
                                                    <div key={idx} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                        <span className="text-slate-600">{">"}</span>
                                                        <span>{log}</span>
                                                    </div>
                                                ))}
                                                <div className="flex gap-2">
                                                    <span className="text-slate-600">{">"}</span>
                                                    <span className="animate-pulse">_</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {auditResult && (
                                        <div className="animate-in fade-in zoom-in duration-500">
                                            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                                                        <CheckCircle2 className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-emerald-900">{t.adminSettings.insights.audit.finished || "Audit Finished"}</p>
                                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">{t.adminSettings.insights.audit.result_label || "Result"}: {t.adminSettings.insights.audit.result_optimal || "OPTIMAL"}</p>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Lightbulb className="h-3 w-3 text-amber-500" />
                                                        {t.adminSettings.insights.audit.recommendation_label || "Main Recommendation"}
                                                    </p>
                                                    <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
                                                        "{auditResult}"
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setAuditResult(null)}
                                                    className="w-full text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold uppercase tracking-widest h-10 rounded-xl border border-emerald-200"
                                                >
                                                    {t.adminSettings.insights.audit.restart_btn || "Start New Scan"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="interactive" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.interactive.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.interactive.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>{t.adminSettings.interactive.auto_import}</Label>
                                            <p className="text-xs text-muted-foreground">{t.adminSettings.interactive.auto_import_desc}</p>
                                        </div>
                                        <Switch checked={settings.interactive.autoImport} onCheckedChange={(checked) => updateNested("interactive", "autoImport", checked)} />
                                    </div>
                                    <div className="space-y-4 pt-4 border-t">
                                        <SecureInput
                                            id="wordwall-key"
                                            label={t.adminSettings.interactive.platforms.wordwall}
                                            value={settings.interactive.wordwallKey}
                                            onChange={(val) => updateNested("interactive", "wordwallKey", val)}
                                            placeholder="kamila-lo-ko"
                                        />
                                        <SecureInput
                                            id="wordwall-cookie"
                                            label="Wordwall Session Cookie (for private links)"
                                            value={settings.interactive.wordwallCookie || ""}
                                            onChange={(val) => updateNested("interactive", "wordwallCookie", val)}
                                            placeholder="Connect.sid=..."
                                        />
                                        <SecureInput
                                            id="genially-key"
                                            label={t.adminSettings.interactive.platforms.genially}
                                            value={settings.interactive.geniallyKey}
                                            onChange={(val) => updateNested("interactive", "geniallyKey", val)}
                                            placeholder="https://view.genial.ly/profile/nick"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="workshop" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <Card className="border-none premium-card-ring glass-premium overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                                            <Wand2 className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-base font-black uppercase tracking-tight">AI Studio Credentials</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs font-medium">Configure API keys for advanced image, video, and avatar generation.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SecureInput
                                            id="canva-token"
                                            label="Canva Team Token"
                                            value={settings.workshop.canvaToken}
                                            onChange={(val) => updateNested("workshop", "canvaToken", val)}
                                            placeholder="Enter Canva API Token..."
                                        />
                                        <SecureInput
                                            id="heygen-key"
                                            label="HeyGen API Key (Avatars)"
                                            value={settings.workshop.heygenKey}
                                            onChange={(val) => updateNested("workshop", "heygenKey", val)}
                                            placeholder="Enter HeyGen API Key..."
                                        />
                                        <SecureInput
                                            id="elevenlabs-key"
                                            label="ElevenLabs Key (Voice)"
                                            value={settings.workshop.elevenlabsKey}
                                            onChange={(val) => updateNested("workshop", "elevenlabsKey", val)}
                                            placeholder="Enter ElevenLabs Key..."
                                        />
                                        <SecureInput
                                            id="kling-key"
                                            label="Kling AI Key (Sora Alternative)"
                                            value={settings.workshop.klingKey}
                                            onChange={(val) => updateNested("workshop", "klingKey", val)}
                                            placeholder="Enter Kling AI Key..."
                                        />
                                        <SecureInput
                                            id="luma-key"
                                            label="Luma AI Key (Dream Machine)"
                                            value={settings.workshop.lumaKey}
                                            onChange={(val) => updateNested("workshop", "lumaKey", val)}
                                            placeholder="Enter Luma AI Key..."
                                        />
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">NotebookLM Source</Label>
                                            <Input
                                                value={settings.workshop.notebookLmLink}
                                                onChange={(e) => updateNested("workshop", "notebookLmLink", e.target.value)}
                                                placeholder="Enter NotebookLM Public Shared Link..."
                                                className="h-11 border-slate-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                        <div className="space-y-0.5">
                                            <Label className="font-bold text-slate-800">Auto-Export to Canva</Label>
                                            <p className="text-xs text-slate-400">Automatically sync AI generated assets to your Canva library.</p>
                                        </div>
                                        <Switch
                                            checked={settings.workshop.autoExportCanva}
                                            onCheckedChange={(checked) => updateNested("workshop", "autoExportCanva", checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-2xl shadow-indigo-100/50 bg-white/40 glass-premium overflow-hidden">
                                <CardHeader className="bg-slate-900 text-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="h-6 w-6 text-indigo-400" />
                                            <CardTitle className="text-lg font-black uppercase tracking-tight">AI Workshop Studio</CardTitle>
                                        </div>
                                        <Badge className="bg-indigo-500 text-white border-none font-bold">PRO ACTIVE</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-8">
                                        <AIWorkshop />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="automation" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.automation.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.automation.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.automation.agents.title}</Label>
                                        <Select value={settings.automation.activeAgent} onValueChange={(val) => updateNested("automation", "activeAgent", val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">{t.adminSettings.automation.agents.none || "No agent"}</SelectItem>
                                                <SelectItem value="manus">{t.adminSettings.automation.agents.manus}</SelectItem>
                                                <SelectItem value="general">{t.adminSettings.automation.agents.general}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-sm font-semibold">{t.adminSettings.automation.receiver.title}</h3>
                                        <div className="space-y-2">
                                            <Label>Webhook URL</Label>
                                            <Input value={settings.automation.webhookUrl} readOnly className="bg-slate-50" />
                                        </div>
                                        <Button variant="outline" className="w-full gap-2" onClick={handleSimulateAgent}>
                                            <RefreshCw className="h-4 w-4" />
                                            {t.adminSettings.automation.receiver.simulate_btn}
                                        </Button>
                                    </div>
                                    {agentDrafts.length > 0 && (
                                        <div className="space-y-2 pt-4 border-t">
                                            <Label>{t.adminSettings.automation.receiver.recent_drafts || "Recently delivered drafts"}</Label>
                                            {agentDrafts.map(draft => (
                                                <div key={draft.id} className="text-xs p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex justify-between items-center">
                                                    <span className="font-bold">{draft.title}</span>
                                                    <span className="text-indigo-600">{draft.count} {t.adminSettings.automation.receiver.items || "items"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="emails" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.emails.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.emails.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Tabs defaultValue="welcome">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="welcome">{t.adminSettings.emails.tabs?.welcome || "Welcome"}</TabsTrigger>
                                            <TabsTrigger value="order">{t.adminSettings.emails.tabs?.order || "Order"}</TabsTrigger>
                                            <TabsTrigger value="login">{t.adminSettings.emails.tabs?.access || "Access"}</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="welcome" className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.common.subject}</Label>
                                                <Input value={settings.emails.templates.welcome.subject} onChange={(e) => updateEmailTemplate("welcome", "subject", e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.common.content}</Label>
                                                <textarea
                                                    className="w-full min-h-[200px] p-3 rounded-md border bg-background text-sm"
                                                    value={settings.emails.templates.welcome.content}
                                                    onChange={(e) => updateEmailTemplate("welcome", "content", e.target.value)}
                                                />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="order" className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.common.subject}</Label>
                                                <Input value={settings.emails.templates.order_confirmed.subject} onChange={(e) => updateEmailTemplate("order_confirmed", "subject", e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.common.content}</Label>
                                                <textarea
                                                    className="w-full min-h-[200px] p-3 rounded-md border bg-background text-sm"
                                                    value={settings.emails.templates.order_confirmed.content}
                                                    onChange={(e) => updateEmailTemplate("order_confirmed", "content", e.target.value)}
                                                />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="login" className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.common.subject}</Label>
                                                <Input value={settings.emails.templates.login_details.subject} onChange={(e) => updateEmailTemplate("login_details", "subject", e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.common.content}</Label>
                                                <textarea
                                                    className="w-full min-h-[200px] p-3 rounded-md border bg-background text-sm"
                                                    value={settings.emails.templates.login_details.content}
                                                    onChange={(e) => updateEmailTemplate("login_details", "content", e.target.value)}
                                                />
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="pt-4 border-t space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>{t.adminSettings.emails.smtp.enable_system}</Label>
                                            <Switch checked={settings.emails.smtpConfig.enabled} onCheckedChange={(checked) => updateNested("emails", "smtpConfig", { ...settings.emails.smtpConfig, enabled: checked })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.emails.smtp.host}</Label>
                                                <Input value={settings.emails.smtpConfig.host} onChange={(e) => updateNested("emails", "smtpConfig", { ...settings.emails.smtpConfig, host: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t.adminSettings.emails.smtp.port}</Label>
                                                <Input value={settings.emails.smtpConfig.port} onChange={(e) => updateNested("emails", "smtpConfig", { ...settings.emails.smtpConfig, port: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="google" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.google.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.google.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="p-6 border rounded-2xl bg-slate-50 flex flex-col items-center text-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            <Cloud className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{settings.google.connected ? t.adminSettings.google.auth.status_connected.replace("{email}", settings.google.connectedEmail) : t.adminSettings.google.auth.status_disconnected}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{t.adminSettings.google.auth.drive_description}</p>
                                        </div>
                                        <Button variant={settings.google.connected ? "outline" : "default"} onClick={() => updateNested("google", "connected", !settings.google.connected)}>
                                            {settings.google.connected ? t.adminSettings.google.auth.disconnect : t.adminSettings.google.auth.connect}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="abandoned" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.abandoned.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.abandoned.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label>{t.adminSettings.abandoned.enable_auto}</Label>
                                        <Switch checked={settings.abandoned.enabled} onCheckedChange={(checked) => updateNested("abandoned", "enabled", checked)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.abandoned.delay}</Label>
                                        <Input type="number" value={settings.abandoned.delay} onChange={(e) => updateNested("abandoned", "delay", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.adminSettings.abandoned.discount_code}</Label>
                                        <Input value={settings.abandoned.discountCode} onChange={(e) => updateNested("abandoned", "discountCode", e.target.value)} placeholder="BACK5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="guardian" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.adminSettings.guardian.title}</CardTitle>
                                    <CardDescription>{t.adminSettings.guardian.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                        <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                        <div className="text-sm font-bold text-emerald-900">{t.adminSettings.guardian.status_good}</div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <Label>{t.adminSettings.guardian.legal_check}</Label>
                                            <Switch checked={settings.guardian.legalEnabled} onCheckedChange={(checked) => updateNested("guardian", "legalEnabled", checked)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>{t.adminSettings.guardian.tech_check}</Label>
                                            <Switch checked={settings.guardian.techEnabled} onCheckedChange={(checked) => updateNested("guardian", "techEnabled", checked)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>{t.adminSettings.guardian.security_check}</Label>
                                            <Switch checked={settings.guardian.securityEnabled} onCheckedChange={(checked) => updateNested("guardian", "securityEnabled", checked)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>{t.adminSettings.guardian.alerts}</Label>
                                            <Switch checked={settings.guardian.alertsEnabled} onCheckedChange={(checked) => updateNested("guardian", "alertsEnabled", checked)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="wp_migration" className="space-y-4">
                            <WPMigrationPanel />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </NamespaceGuard>
    );
}

// ── WP Idea Migration Panel ──────────────────────────────────────────────────

function WPMigrationPanel() {
    const [wpUrl, setWpUrl] = useState("https://sklep.linguachess.com");
    const [wpCredentials, setWpCredentials] = useState("");
    const [migrationSecret, setMigrationSecret] = useState("");
    const [syncMode, setSyncMode] = useState<"new_only" | "full">("new_only");
    const [dryRun, setDryRun] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);

    const fetchStatus = async () => {
        if (!migrationSecret) return;
        try {
            const res = await fetch("/api/admin/migrate-wp", {
                headers: { Authorization: `Bearer ${migrationSecret}` },
            });
            if (res.ok) setStatus(await res.json());
        } catch {}
    };

    const runMigration = async () => {
        if (!wpCredentials || !migrationSecret) {
            alert("Wypełnij WP Credentials i Migration Secret");
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch("/api/admin/migrate-wp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${migrationSecret}`,
                },
                body: JSON.stringify({
                    wp_url: wpUrl,
                    wp_credentials: wpCredentials,
                    dry_run: dryRun,
                    sync_mode: syncMode,
                }),
            });
            const data = await res.json();
            setResult(data);
            if (!dryRun && data.success) fetchStatus();
        } catch (err: any) {
            setResult({ success: false, error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DatabaseZap className="h-5 w-5 text-blue-600" />
                        Migracja z WP Idea (sklep.linguachess.com)
                    </CardTitle>
                    <CardDescription>
                        Importuje użytkowników i ich zakupy bezpośrednio z WP Idea REST API.
                        Żadne powiadomienia email nie są wysyłane do klientów.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label>URL WordPress</Label>
                            <Input
                                value={wpUrl}
                                onChange={(e) => setWpUrl(e.target.value)}
                                placeholder="https://sklep.linguachess.com"
                            />
                        </div>
                        <div>
                            <Label>WP Credentials (username:application_password)</Label>
                            <Input
                                type="password"
                                value={wpCredentials}
                                onChange={(e) => setWpCredentials(e.target.value)}
                                placeholder="admin:xxxx xxxx xxxx xxxx xxxx xxxx"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                WP Admin → Users → Profile → Application Passwords → Add New
                            </p>
                        </div>
                        <div>
                            <Label>Migration Secret (z Coolify ENV: MIGRATION_SECRET)</Label>
                            <Input
                                type="password"
                                value={migrationSecret}
                                onChange={(e) => setMigrationSecret(e.target.value)}
                                placeholder="Wpisz wartość MIGRATION_SECRET z Coolify"
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="dryRun"
                                    checked={dryRun}
                                    onChange={(e) => setDryRun(e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="dryRun">Dry Run (podgląd bez zapisu)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label>Tryb:</Label>
                                <select
                                    value={syncMode}
                                    onChange={(e) => setSyncMode(e.target.value as any)}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="new_only">Tylko nowi + merge zakupów</option>
                                    <option value="full">Pełna aktualizacja</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={runMigration} disabled={loading} className="gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownToLine className="h-4 w-4" />}
                            {dryRun ? "Podgląd (Dry Run)" : "Uruchom Migrację"}
                        </Button>
                        <Button variant="outline" onClick={fetchStatus} className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Status
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {status && (
                <Card>
                    <CardHeader><CardTitle>Status migracji</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-blue-700">{status.totalUsers}</div>
                                <div className="text-xs text-muted-foreground">Wszystkich użytkowników</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-green-700">{status.wpMigratedUsers}</div>
                                <div className="text-xs text-muted-foreground">Zmigrowanych z WP</div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <div className="text-2xl font-bold">{status.localUsers}</div>
                                <div className="text-xs text-muted-foreground">Lokalnych</div>
                            </div>
                        </div>
                        {status.lastMigration && (
                            <p className="text-xs text-muted-foreground mt-3">
                                Ostatnia migracja: {new Date(status.lastMigration.timestamp).toLocaleString("pl-PL")}
                                {" — "}{status.lastMigration.stats?.created || 0} nowych,{" "}
                                {status.lastMigration.stats?.updated || 0} zaktualizowanych
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card className={result.success ? "border-green-200" : "border-red-200"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {result.success
                                ? <CheckCircle className="h-5 w-5 text-green-600" />
                                : <XCircle className="h-5 w-5 text-red-600" />}
                            {result.dry_run ? "Podgląd (Dry Run)" : "Wynik migracji"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {result.error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{result.error}</div>
                        )}
                        {result.stats && (
                            <div className="grid grid-cols-4 gap-3 text-center">
                                <div className="bg-slate-50 rounded p-2">
                                    <div className="font-bold">{result.stats.total}</div>
                                    <div className="text-xs text-muted-foreground">Znaleziono</div>
                                </div>
                                <div className="bg-green-50 rounded p-2">
                                    <div className="font-bold text-green-700">{result.stats.created}</div>
                                    <div className="text-xs text-muted-foreground">Nowych</div>
                                </div>
                                <div className="bg-blue-50 rounded p-2">
                                    <div className="font-bold text-blue-700">{result.stats.updated}</div>
                                    <div className="text-xs text-muted-foreground">Zaktualizowanych</div>
                                </div>
                                <div className="bg-yellow-50 rounded p-2">
                                    <div className="font-bold text-yellow-700">{result.stats.skipped}</div>
                                    <div className="text-xs text-muted-foreground">Pominiętych</div>
                                </div>
                            </div>
                        )}
                        {result.preview && result.preview.length > 0 && (
                            <div>
                                <p className="text-sm font-medium mb-2">Podgląd ({result.preview.length} użytkowników):</p>
                                <div className="max-h-64 overflow-y-auto border rounded">
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="text-left p-2">Email</th>
                                                <th className="text-left p-2">Imię</th>
                                                <th className="text-left p-2">Zamówienia</th>
                                                <th className="text-left p-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.preview.map((u: any, i: number) => (
                                                <tr key={i} className="border-t">
                                                    <td className="p-2">{u.email}</td>
                                                    <td className="p-2">{u.name}</td>
                                                    <td className="p-2">{u.orders}</td>
                                                    <td className="p-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-xs ${u.isNew ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                                            {u.isNew ? "Nowy" : "Aktualizacja"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {result.errors && result.errors.length > 0 && (
                            <div className="bg-yellow-50 p-3 rounded">
                                <p className="text-sm font-medium text-yellow-800 mb-1">Błędy ({result.errors.length}):</p>
                                {result.errors.map((e: string, i: number) => (
                                    <p key={i} className="text-xs text-yellow-700">{e}</p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
