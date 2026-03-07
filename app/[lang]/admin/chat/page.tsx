"use client";


import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bot, User, Send, Plus, MessageSquare, Database, Globe, FileText, Store, Sparkles, MoreHorizontal, Menu, X } from "lucide-react";
import { AI_PROVIDERS } from "@/lib/product-schema";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    model?: string;
}

interface ChatSession {
    id: string;
    title: string;
    date: string;
}

export default function AdminChatPage() {
    const { t } = useLanguage();
    const c = t.adminPanel?.chat || {};
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: c.welcome,
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [selectedModel, setSelectedModel] = useState<string>(AI_PROVIDERS[0].defaultModel);
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock history using translations
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    useEffect(() => {
        const ms = (c as Record<string, unknown>).mockSessions as Record<string, {title?: string; date?: string}> | undefined;
        if (ms) {
            setSessions([
                { id: '1', title: ms.s1?.title || 'Analiza', date: ms.s1?.date || 'Dzisiaj' },
                { id: '2', title: ms.s2?.title || 'Opisy', date: ms.s2?.date || 'Wczoraj' },
                { id: '3', title: ms.s3?.title || 'Debug', date: ms.s3?.date || '2 dni temu' },
            ]);
        }
    }, [c]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        // Real API call to admin chat endpoint
        try {
            const res = await fetch('/api/admin/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newUserMsg.content }),
            });
            const data = await res.json();
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: res.ok ? data.response : (data.error || 'Wystąpił błąd. Spróbuj ponownie.'),
                timestamp: Date.now(),
                model: selectedModel
            };
            setMessages(prev => [...prev, botResponse]);
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.',
                timestamp: Date.now(),
                model: selectedModel
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in fade-in duration-500 relative">
            {/* Sidebar History */}
            <aside className={cn(
                "w-64 bg-white/50 backdrop-blur-xl border border-slate-200 rounded-3xl flex flex-col shadow-sm ring-1 ring-slate-100 transition-transform duration-300 z-40 fixed inset-y-0 left-0 lg:relative lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <Button onClick={() => { toast.info("Nowy szablon rozmowy będzie dostępny wkrótce."); }} variant="outline" className="flex-1 justify-start gap-3 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-600 rounded-2xl h-11 transition-all">
                        <Plus className="h-4 w-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">{c.newChat}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="lg:hidden ml-2 h-11 w-11 rounded-2xl" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
                        {c.history}
                    </p>
                    <ScrollArea className="h-[calc(100vh-18rem)]">
                        <div className="space-y-2 pr-4">
                            {sessions.map(session => (
                                <button
                                    key={session.id}
                                    className="w-full text-left px-4 py-3 rounded-2xl text-sm hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all truncate flex flex-col gap-1 group"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <span className="font-bold text-slate-700 truncate block group-hover:text-indigo-600">{session.title}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{session.date}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden rounded-3xl"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100 overflow-hidden relative ring-1 ring-slate-100 min-w-0">

                {/* Chat Header */}
                <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 lg:px-8 bg-slate-50/30 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 min-w-0">
                        <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 shrink-0 border border-slate-200 rounded-xl" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100 animate-pulse shrink-0">
                            <Sparkles className="h-5 w-5 lg:h-6 lg:w-6" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-black text-base lg:text-xl text-slate-900 tracking-tight leading-none truncate">{c.title || "AI Chat"}</h2>
                            <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium mt-1 lg:mt-1.5 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span className="truncate">{c.subtitle}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden xl:flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                            {AI_PROVIDERS.slice(0, 3).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedModel(p.defaultModel)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                        selectedModel.includes(p.id) || (p.id === 'openai' && selectedModel.startsWith('gpt'))
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                    )}
                                >
                                    {p.name.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger className="w-[200px] h-11 text-xs font-bold rounded-xl border-slate-200 bg-white">
                                <SelectValue placeholder={c.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-200 shadow-2xl">
                                {AI_PROVIDERS.map(provider => (
                                    <div key={provider.id}>
                                        <div className="px-3 py-2 text-[10px] font-black text-slate-400 bg-slate-50 uppercase tracking-widest border-y border-slate-100 first:border-t-0">
                                            {provider.name}
                                        </div>
                                        {provider.models.map(model => (
                                            <SelectItem key={model} value={model} className="text-xs font-medium py-2.5 cursor-pointer">
                                                {model}
                                            </SelectItem>
                                        ))}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-5 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md",
                                msg.role === 'user'
                                    ? "bg-slate-900 text-white"
                                    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                            )}>
                                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                            </div>

                            <div className={cn(
                                "rounded-3xl p-5 text-sm leading-relaxed shadow-sm border",
                                msg.role === 'user'
                                    ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none"
                                    : "bg-white border-slate-100 text-slate-800 rounded-tl-none"
                            )}>
                                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                                {msg.role === 'assistant' && msg.model && (
                                    <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-1.5 py-1 px-2.5 bg-slate-50 rounded-full border border-slate-100">
                                            <Sparkles className="h-3 w-3 text-indigo-500" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                {c.generatedBy.replace("{model}", msg.model)}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-300 font-mono">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-5 mr-auto max-w-3xl animate-pulse">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center shadow-md">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-none p-5 shadow-sm flex items-center gap-1.5">
                                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* Context / Tools Badges */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                            <BadgeIcon icon={Database} label={c.capabilities?.database} active />
                            <BadgeIcon icon={Store} label={c.capabilities?.store} active />
                            <BadgeIcon icon={Globe} label={c.capabilities?.web} active={selectedModel.includes('manus') || selectedModel.includes('search')} />
                            <BadgeIcon icon={FileText} label={c.capabilities?.files} />
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
                            <div className="relative flex items-end gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-indigo-500/50 transition-all">
                                <Button onClick={() => { toast.info("Nagrywanie głosu będzie dostępne wkrótce."); }} variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0">
                                    <Plus className="h-5 w-5" />
                                </Button>
                                <textarea
                                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none min-h-[44px] max-h-48 py-3 text-sm font-medium placeholder:text-slate-300 no-scrollbar"
                                    placeholder={c.inputPlaceholder}
                                    rows={1}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className={cn(
                                        "h-11 w-11 rounded-xl shrink-0 transition-all shadow-lg shadow-indigo-100",
                                        inputValue.trim()
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95"
                                            : "bg-slate-100 text-slate-300"
                                    )}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-[10px] text-center font-bold text-slate-300 uppercase tracking-widest">
                            {c.disclaimer}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function BadgeIcon({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button onClick={() => { toast.info("Nowa rozmowa zostanie dodana wkrótce."); }} className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
            active
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-background border-border text-muted-foreground hover:bg-muted"
        )}>
            <Icon className="h-3 w-3" />
            {label}
            {active && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-0.5" />}
        </button>
    );
}
