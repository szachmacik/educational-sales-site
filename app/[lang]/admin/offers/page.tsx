"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Sparkles,
    Gift,
    Zap,
    ArrowRight,
    Copy,
    Check,
    Megaphone,
    Target,
    BarChart3,
    Eye,
    CheckCircle2,
    X
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function OfferGeneratorPage() {
    const { t, language } = useLanguage();
    const o = t.adminPanel?.offers || {
        title: "AI Offer Generator",
        subtitle: "Create high-converting offers in seconds.",
        beta: "Beta Growth Suite",
        parameters: {
            title: "Campaign Parameters",
            description: "Define the goal of your offer",
            promotion_type: "Promotion Type",
            occasional: "Occasional",
            evergreen: "Evergreen",
            product: "Product / Service",
            product_placeholder: "e.g. Lesson Plan Bundle A1-C1",
            benefit: "Main Benefit",
            benefit_placeholder: "What will the customer gain?",
            discount: "Discount (%)",
            generate: "Generate AI Offer",
            analyzing: "Analyzing market..."
        },
        preview: {
            ai_project: "AI PROJECT",
            effectiveness: "Effectiveness: {score}%",
            title: "Special Early Bird Offer",
            subtitle: "Review the generated campaign before publishing",
            ad_copy_label: "Ad Slogan",
            conversion_label: "Conversion",
            vs_avg: "+{diff}% vs avg",
            discount_code_label: "Your discount code",
            copied: "Copied",
            copy: "Copy",
            reject: "Reject and change parameters",
            accept: "Accept and Publish Offer"
        },
        loading: {
            title: "AI Magic in progress...",
            description: "\"Analyzing market trends and optimizing sales psychology for your products.\"",
            progress_label: "Competitor analysis..."
        },
        toasts: {
            copied: "Discount code copied!",
            ready: "Offer ready for review!"
        }
    };

    const [generating, setGenerating] = useState(false);
    const [offerType, setOfferType] = useState("holiday");
    const [copied, setCopied] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleCopy = () => {
        navigator.clipboard.writeText("OFFER2024-AI-ULTIMATE");
        setCopied(true);
        toast.success(o.toasts.copied);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateOffer = async () => {
        setGenerating(true);
        setProgress(0);

        for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(r => setTimeout(r, 150));
        }

        setGenerating(false);
        setPreviewOpen(true);
        toast.success(o.toasts.ready);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-indigo-600 animate-pulse" />
                        {o.title}
                    </h1>
                    <p className="text-slate-500 font-medium text-lg mt-1">{o.subtitle}</p>
                </div>
                <Badge variant="outline" className="px-4 py-1.5 border-indigo-200 bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider">
                    {o.beta}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-indigo-200 transition-all duration-300">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-indigo-900">
                            <Target className="h-5 w-5 text-indigo-600" />
                            {o.parameters.title}
                        </CardTitle>
                        <CardDescription>{o.parameters.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">{o.parameters.promotion_type}</Label>
                            <Tabs value={offerType} onValueChange={setOfferType} className="w-full">
                                <TabsList className="grid grid-cols-2 w-full bg-slate-100/80 p-1">
                                    <TabsTrigger value="holiday" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">{o.parameters.occasional}</TabsTrigger>
                                    <TabsTrigger value="evergreen" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">{o.parameters.evergreen}</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">{o.parameters.product}</Label>
                            <Input placeholder={o.parameters.product_placeholder} className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">{o.parameters.benefit}</Label>
                            <Textarea placeholder={o.parameters.benefit_placeholder} className="min-h-[100px] border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">{o.parameters.discount}</Label>
                            <Input type="number" defaultValue={20} className="border-slate-200" />
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-12 text-lg font-bold shadow-lg shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                            onClick={generateOffer}
                            disabled={generating}
                        >
                            {generating ? (
                                <>
                                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                                    {o.parameters.analyzing}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    {o.parameters.generate}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    {/* Preview Content */}
                </div>
            </div>

            {/* Premium Preview Modal */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-3xl border-none shadow-2xl p-0 overflow-hidden bg-white rounded-3xl">
                    <div className="absolute top-0 right-0 p-4 z-50">
                        <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full hover:bg-slate-100">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="bg-indigo-600 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Gift className="h-48 w-48 text-white rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-yellow-400 text-indigo-900 border-none font-black px-3">{o.preview.ai_project}</Badge>
                                <span className="text-indigo-200 text-xs font-bold tracking-widest uppercase">{o.preview.effectiveness.replace("{score}", "94")}</span>
                            </div>
                            <h2 className="text-3xl font-black">{o.preview.title}</h2>
                            <p className="text-indigo-100 font-medium">{o.preview.subtitle}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative group">
                            <div className="absolute -top-3 -left-2">
                                <Sparkles className="h-8 w-8 text-yellow-500 fill-yellow-400" />
                            </div>
                            <p className="text-slate-700 leading-relaxed text-lg font-medium italic">
                                {language === 'pl'
                                    ? '"Zdobądź dostęp do kompletnego ekosystemu narzędzi dla nauczycieli języka angielskiego z 20% rabatem. Oszczędź 15 godzin tygodniowo na przygotowaniach!"'
                                    : '"Get access to a complete ecosystem of tools for English teachers with a 20% discount. Save 15 hours a week on preparations!"'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-slate-100 p-4 space-y-2 shadow-sm">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Megaphone className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{o.preview.ad_copy_label}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900 leading-tight">
                                    {language === 'pl'
                                        ? '"Ucz mądrzej, nie mocniej. Automatyzacja Twoich lekcji zaczyna się tutaj."'
                                        : '"Teach smarter, not harder. Your lesson automation starts here."'}
                                </p>
                            </Card>
                            <Card className="border-slate-100 p-4 space-y-2 shadow-sm">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <BarChart3 className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{o.preview.conversion_label}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black">8.2%</span>
                                    <span className="text-[10px] text-green-600 font-black">{o.preview.vs_avg.replace("{diff}", "2.4")}</span>
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{o.preview.discount_code_label}</Label>
                            <div className="flex items-center gap-4 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
                                <code className="text-xl font-mono font-black text-yellow-400 flex-1">OFFER2024-AI-ULTIMATE</code>
                                <Button variant="ghost" onClick={handleCopy} className="text-indigo-100 hover:text-white hover:bg-white/10 px-4">
                                    {copied ? <CheckCircle2 className="h-5 w-5 mr-2 text-green-400" /> : <Copy className="h-5 w-5 mr-2" />}
                                    {copied ? o.preview.copied : o.preview.copy}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-slate-50 border-t flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" onClick={() => setPreviewOpen(false)} className="rounded-xl border-slate-200 h-12 font-bold flex-1">
                            {o.preview.reject}
                        </Button>
                        <Button onClick={() => setPreviewOpen(false)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-12 font-black px-8 flex-1 shadow-lg shadow-indigo-100">
                            {o.preview.accept}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Full Screen Loading Overlay */}
            {
                generating && (
                    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                        <div className="max-w-md w-full p-8 text-center space-y-6">
                            <div className="relative">
                                <Zap className="h-16 w-16 text-indigo-600 mx-auto fill-indigo-100 animate-bounce" />
                                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-4 right-1/4 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">{o.loading.title}</h3>
                                <p className="text-slate-500 font-medium italic">{o.loading.description}</p>
                            </div>
                            <div className="space-y-4">
                                <Progress value={progress} className="h-2 bg-slate-100" />
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                    <span>{o.loading.progress_label}</span>
                                    <span>{progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
