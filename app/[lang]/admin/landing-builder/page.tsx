"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Layout,
    Layers,
    MousePointer2,
    Eye,
    Save,
    Sparkles,
    Image as ImageIcon,
    Type,
    Square,
    Zap,
    Smartphone,
    Monitor,
    ChevronLeft,
    X,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

export default function LandingBuilderPage() {
    const { language, t } = useLanguage();
    const trans = t.adminPanel?.landingBuilder || {};
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const [saving, setSaving] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [progress, setProgress] = useState(0);

    type BlockType = "hero" | "text" | "image" | "button" | "ai";
    const [blocks, setBlocks] = useState<{ id: string, type: BlockType }[]>([
        { id: "mock-hero", type: "hero" }
    ]);
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: Math.random().toString(36).substr(2, 9), type }]);
        toast.success(`Dodano blok: ${type}`);
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleDragStart = (e: React.DragEvent, idx: number) => {
        setDraggedIdx(idx);
        e.dataTransfer.effectAllowed = "move";
        // Ghost image transparency fix
        const dragImage = e.currentTarget as HTMLElement;
        dragImage.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const dragImage = e.currentTarget as HTMLElement;
        dragImage.style.opacity = '1';
        setDraggedIdx(null);
    };

    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, dropIdx: number) => {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === dropIdx) return;
        
        const newBlocks = [...blocks];
        const [moved] = newBlocks.splice(draggedIdx, 1);
        newBlocks.splice(dropIdx, 0, moved);
        setBlocks(newBlocks);
        setDraggedIdx(null);
        toast.info("Zmieniono kolejność bloków");
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success(trans.toasts.saved);
        }, 1200);
    };

    const handleOptimize = async () => {
        setOptimizing(true);
        setProgress(0);

        const steps = [20, 45, 70, 95, 100];
        for (const s of steps) {
            setProgress(s);
            await new Promise(r => setTimeout(r, 400));
        }

        setOptimizing(false);
        setPreviewOpen(true);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/30">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href={`/${language}/admin`}>
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                            <Layout className="h-5 w-5 text-indigo-600" />
                            {trans.title}
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                            {trans.draftVersion.replace("{name}", "New Materials Pack")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                    <Button
                        variant={viewMode === "desktop" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("desktop")}
                        className="rounded-xl px-3"
                    >
                        <Monitor className="h-4 w-4 mr-2" />
                        {trans.desktop}
                    </Button>
                    <Button
                        variant={viewMode === "mobile" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("mobile")}
                        className="rounded-xl px-3"
                    >
                        <Smartphone className="h-4 w-4 mr-2" />
                        {trans.mobile}
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} variant="outline" className="rounded-2xl border-slate-200 font-bold">
                        <Eye className="h-4 w-4 mr-2" />
                        {trans.preview}
                    </Button>
                    <Button
                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? trans.saving : trans.save}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Sidebar - Elements */}
                <div className="w-80 flex flex-col gap-6">
                    <Card className="flex-1 border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">{trans.elements}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div onClick={() => addBlock("text")} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center gap-2 group">
                                    <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                        <Type className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">{trans.text}</span>
                                </div>
                                <div onClick={() => addBlock("image")} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center gap-2 group">
                                    <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                        <ImageIcon className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">{trans.image}</span>
                                </div>
                                <div onClick={() => addBlock("button")} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center gap-2 group">
                                    <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                        <Square className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">{trans.button}</span>
                                </div>
                                <div onClick={() => addBlock("ai")} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center gap-2 group">
                                    <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                        <Sparkles className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">{trans.aiBlock}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{trans.canvas}</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                                        <Layers className="h-4 w-4 text-indigo-600" />
                                        <span className="text-sm font-bold text-indigo-900">{trans.hero}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                                        <Layers className="h-4 w-4" />
                                        <span className="text-sm font-bold">{trans.features}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                                        <Layers className="h-4 w-4" />
                                        <span className="text-sm font-bold">{trans.pricing}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-indigo-600 text-white p-6 rounded-3xl border-none shadow-xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-yellow-400" />
                                <span className="font-bold text-sm tracking-tight">{trans.aiMagic.title}</span>
                            </div>
                            <p className="text-xs text-indigo-100 leading-relaxed font-medium">{trans.aiMagic.desc}</p>
                            <Button
                                variant="secondary"
                                className="w-full bg-white text-indigo-600 font-black h-10 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-700/50"
                                onClick={handleOptimize}
                            >
                                {trans.aiMagic.optimize}
                            </Button>
                        </div>
                        <Zap className="absolute -bottom-4 -right-4 h-24 w-24 text-white opacity-10 rotate-12 transition-transform group-hover:scale-110" />
                    </Card>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 bg-slate-100/50 rounded-[2.5rem] border-4 border-white shadow-inner flex justify-center p-8 overflow-y-auto">
                    <div className={`transition-all duration-500 bg-white shadow-2xl overflow-hidden rounded-2xl ${viewMode === "desktop" ? "w-full max-w-4xl min-h-[1200px]" : "w-[375px] h-[667px]"
                        }`}>
                        {/* Canvas Content */}
                        <div className="w-full min-h-full flex flex-col">
                            <div className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
                                <div className="h-6 w-24 bg-slate-100 rounded-md animate-pulse" />
                                <div className="flex gap-4">
                                    <div className="h-4 w-12 bg-slate-100 rounded-md" />
                                    <div className="h-4 w-12 bg-slate-100 rounded-md" />
                                </div>
                            </div>

                            <div className="p-8 space-y-4 flex-1">
                                {blocks.length === 0 && (
                                    <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-medium">
                                        Dodaj bloki z panelu bocznego
                                    </div>
                                )}
                                {blocks.map((block, idx) => (
                                    <div
                                        key={block.id}
                                        draggable
                                        className={cn(
                                            "relative group border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50/10 rounded-3xl transition-all cursor-grab active:cursor-grabbing p-6",
                                            draggedIdx === idx && "opacity-50 border-dashed border-indigo-400 bg-indigo-50/20"
                                        )}
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDrop={(e) => handleDrop(e, idx)}
                                    >
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {block.type === "hero" && (
                                            <div className="space-y-12 py-8">
                                                <div className="space-y-6 text-center">
                                                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1 text-xs font-black uppercase tracking-widest">
                                                        {trans.mock?.newCourse}
                                                    </Badge>
                                                    <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                                        {trans.mock?.heroTitle?.split("{joy}")[0]}
                                                        <span className="text-indigo-600">{trans.mock?.joy}</span>
                                                        {trans.mock?.heroTitle?.split("{joy}")[1]}
                                                    </h2>
                                                    <p className="max-w-xl mx-auto text-lg text-slate-500 font-medium">{trans.mock?.heroDesc}</p>
                                                    <div className="flex gap-4 justify-center pt-4 pointer-events-none">
                                                        <Button className="h-14 px-8 rounded-2xl bg-indigo-600 text-lg font-bold shadow-xl shadow-indigo-100">{trans.mock?.buyNow}</Button>
                                                        <Button variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold border-slate-200">{trans.mock?.learnMore}</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {block.type === "text" && (
                                            <div className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 text-left pointer-events-none text-slate-700 space-y-2">
                                                <h3 className="font-bold text-xl">Wprowadź tekst</h3>
                                                <p className="text-slate-500">To jest przykładowy blok tekstowy, który można edytować w przyszłości.</p>
                                            </div>
                                        )}
                                        {block.type === "image" && (
                                            <div className="aspect-video bg-indigo-50/50 rounded-3xl border-2 border-dashed border-indigo-200 flex items-center justify-center pointer-events-none">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-4 rounded-full bg-white shadow-sm text-indigo-400">
                                                        <ImageIcon className="h-8 w-8" />
                                                    </div>
                                                    <span className="text-sm font-bold text-indigo-400">{trans.mock?.addImage}</span>
                                                </div>
                                            </div>
                                        )}
                                        {block.type === "button" && (
                                            <div className="flex justify-center py-4 pointer-events-none">
                                                <Button className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold">{trans.button}</Button>
                                            </div>
                                        )}
                                        {block.type === "ai" && (
                                            <div className="w-full p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white text-center pointer-events-none space-y-2 shadow-lg">
                                                <Sparkles className="h-8 w-8 mx-auto text-yellow-300" />
                                                <h3 className="font-bold text-xl">Blok AI</h3>
                                                <p className="text-indigo-100 text-sm">Zawartość generowana dynamicznie na podstawie prompu bazowego.</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Optimization Preview Modal */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-5xl border-none shadow-2xl p-0 overflow-hidden bg-white rounded-3xl">
                    <DialogHeader className="p-8 bg-indigo-600 text-white">
                        <DialogTitle className="text-3xl font-black flex items-center gap-3">
                            <Sparkles className="h-8 w-8 text-yellow-400" />
                            {trans.optimization.title}
                        </DialogTitle>
                        <DialogDescription className="text-indigo-100 font-medium text-lg">
                            {trans.optimization.desc.replace("{count}", "3").replace("{percent}", "15")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-slate-300" />
                                {trans.optimization.current}
                            </h4>
                            <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50 opacity-60">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{trans.mock.heroTitle.replace("{joy}", trans.mock.joy)}</h3>
                                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">{trans.mock.heroDesc}</p>
                                <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} className="w-full h-12 rounded-xl bg-slate-200 text-slate-400 font-bold" disabled>{trans.mock.buyNow}</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                                {trans.optimization.aiSuggestion}
                            </h4>
                            <div className="border-2 border-indigo-100 rounded-2xl p-6 bg-indigo-50/30 relative">
                                <Badge className="absolute -top-3 right-4 bg-green-500 border-none font-black text-[10px]">{trans.optimization.recommendation}</Badge>
                                <h3 className="text-2xl font-black text-indigo-900 mb-4 tracking-tight leading-tight">
                                    {trans.optimization.suggestionTitle}
                                </h3>
                                <p className="text-sm text-indigo-700/80 mb-6 font-semibold leading-relaxed">
                                    {trans.optimization.suggestionDesc}
                                </p>
                                <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} className="w-full h-12 rounded-xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-200">
                                    {trans.optimization.suggestionButton}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8 space-y-4">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4 items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-black text-indigo-900">{trans.optimization.paletteTitle}</p>
                                <p className="text-xs text-indigo-700/60 font-medium">{trans.optimization.paletteDesc}</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-slate-50 border-t flex gap-4">
                        <Button variant="ghost" onClick={() => setPreviewOpen(false)} className="rounded-xl h-12 font-bold px-6 text-slate-500 hover:text-red-500">
                            {trans.optimization.skip}
                        </Button>
                        <Button
                            onClick={() => {
                                setPreviewOpen(false);
                                toast.success(trans.optimization.success);
                            }}
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-12 font-black px-8 shadow-lg shadow-indigo-100 flex-1"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {trans.optimization.apply}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Optimization Progress Overlay */}
            {optimizing && (
                <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="max-w-md w-full p-12 text-center space-y-8">
                        <div className="relative inline-block">
                            <Layout className="h-20 w-20 text-indigo-600 animate-pulse" />
                            <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{trans.optimization.processing}</h3>
                            <p className="text-slate-500 font-medium italic">{trans.optimization.processingDesc}</p>
                        </div>
                        <div className="space-y-4">
                            <Progress value={progress} className="h-2.5 bg-slate-100" />
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-600 px-1">
                                <span className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                                    {progress < 40 ? trans.optimization.analysingHeaders : progress < 80 ? trans.optimization.pickingColors : trans.optimization.renderingPreview}
                                </span>
                                <span>{progress}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
