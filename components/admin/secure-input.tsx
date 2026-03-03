"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { ShieldCheck, Eye, MoreHorizontal, Download, CheckCircle2 } from "lucide-react";

interface SecureInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    label: string;
    id: string;
}

export function SecureInput({
    value,
    onChange,
    placeholder,
    label,
    id
}: SecureInputProps) {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [showCopySuccess, setShowCopySuccess] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
    };

    // Safely access translations for UX labels
    const ux = t?.adminSettings?.common?.ux || {
        show: "Show",
        hide: "Hide",
        copy: "Copy",
        copied: "Copied!",
        secure: "Secure"
    };

    return (
        <div className="space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <Label htmlFor={id} className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    {label}
                    <ShieldCheck className="h-3 w-3 text-indigo-500" />
                </Label>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        onClick={() => setIsVisible(!isVisible)}
                    >
                        {isVisible ? <Eye className="h-3 w-3 mr-1.5" /> : <MoreHorizontal className="h-3 w-3 mr-1.5" />}
                        {isVisible ? ux.hide : ux.show}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        onClick={handleCopy}
                        disabled={!value}
                    >
                        {showCopySuccess ? <CheckCircle2 className="h-3 w-3 mr-1.5 text-emerald-500" /> : <Download className="h-3 w-3 mr-1.5" />}
                        {showCopySuccess ? ux.copied : ux.copy}
                    </Button>
                </div>
            </div>
            <div className="relative group">
                <Input
                    id={id}
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "font-mono text-xs h-11 transition-all border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm",
                        !isVisible && "tracking-[0.3em]"
                    )}
                />
                {!isVisible && value && (
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">
                            {ux.secure}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
