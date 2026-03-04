"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sparkles,
    Send,
    X,
    MessageSquare,
    Bot,
    User,
    Maximize2,
    Minimize2,
    Zap,
    Image as ImageIcon,
    Video,
    Layout,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export function AIAssistant() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const d = t.adminPanel?.dashboard || {};
    const c = t.adminPanel?.assistant || {
        title: "AI Copilot",
        status: "Active Intelligence",
        welcome: "How can I help you today?",
        placeholder: "Ask me anything...",
        suggestions: {
            generate_visuals: "Generate 4K Visuals",
            social_post: "Create Social Post",
            avatar_script: "New AI Avatar Script",
            seo_optimize: "SEO Optimize Description",
            product_cover: "Generate Product Cover",
            sync_wordwall: "Sync with Wordwall",
            config_workshop: "Configure AI Workshop",
            test_api: "Test API Credentials",
            connect_canva: "Connect Canva Design",
            gen_strategy: "Generate Strategy",
            view_trends: "View Trends",
            open_workshop: "Open Workshop"
        },
        responses: {
            processing: "I'm processing your request. As your AI Copilot, I can help you manage products, generate creative assets, and optimize your store.",
            products_context: "You currently have {count} products in your store. I can help you generate descriptions or images for them in the AI Workshop.",
            product_example: "For example, I noticed \"{title}\". Would you like to optimize it?",
            workshop_info: "The AI Workshop is where you can generate images, videos, and social media posts. You can find it in the 'Workshop' tab of Settings or the dedicated Studio page.",
            wordwall_info: "To sync with Wordwall, go to the Products page and use the 'Interactive Import' button. I can also help you scrape metadata from any educational URL!",
            hello: "Hello! I'm your AI Copilot. I'm currently aware of {count} products and your store settings. How can I assist you today?"
        }
    };

    // Fetch real products for context
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/admin/products");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Assistant failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    // Context-aware suggestions
    const getSuggestions = () => {
        if (pathname?.includes('/admin/workshop')) {
            return [
                { icon: Sparkles, label: c.suggestions.generate_visuals },
                { icon: ImageIcon, label: c.suggestions.social_post },
                { icon: Bot, label: c.suggestions.flashcard_studio || "Flashcard Studio" }
            ];
        }
        if (pathname?.includes('/admin/products')) {
            return [
                { icon: Sparkles, label: c.suggestions.seo_optimize },
                { icon: ImageIcon, label: c.suggestions.product_cover },
                { icon: Zap, label: c.suggestions.sync_wordwall }
            ];
        }
        if (pathname?.includes('/admin/settings')) {
            return [
                { icon: Layout, label: c.suggestions.config_workshop },
                { icon: Bot, label: c.suggestions.test_api },
                { icon: ImageIcon, label: c.suggestions.connect_canva }
            ];
        }
        return [
            { icon: Zap, label: c.suggestions.gen_strategy },
            { icon: Sparkles, label: d?.activeAiLogs?.title || "View AI Logs" },
            { icon: Layout, label: c.suggestions.open_workshop }
        ];
    };

    const suggestions = getSuggestions();

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: '1',
                role: 'assistant',
                content: c.welcome,
                timestamp: Date.now()
            }]);
        }
    }, [c.welcome]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (overrideValue?: string) => {
        const messageText = overrideValue || inputValue;
        if (!messageText.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newUserMsg]);
        if (!overrideValue) setInputValue("");
        setIsTyping(true);

        // Smarter simulated responses
        setTimeout(() => {
            let responseText = c.responses.processing;

            const lowerMsg = messageText.toLowerCase();
            if (lowerMsg.includes("product") || lowerMsg.includes("produk") || lowerMsg.includes("items")) {
                const count = products.length;
                responseText = c.responses.products_context.replace("{count}", count.toString());
                if (count > 0) {
                    responseText += ` ${c.responses.product_example.replace("{title}", products[0].title)}`;
                }
            } else if (lowerMsg.includes("workshop") || lowerMsg.includes("studio") || lowerMsg.includes("creative") || lowerMsg.includes("warsztat")) {
                responseText = c.responses.workshop_info;
            } else if (lowerMsg.includes("wordwall") || lowerMsg.includes("sync") || lowerMsg.includes("import")) {
                responseText = c.responses.wordwall_info;
            } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("cześć") || lowerMsg.includes("hej")) {
                responseText = c.responses.hello.replace("{count}", products.length.toString());
            }

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in zoom-in duration-300">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all group border-none"
                    size="icon"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <Sparkles className="h-6 w-6 relative z-10 animate-pulse" />
                </Button>
            </div>
        );
    }

    return (
        <Card
            className={cn(
                "fixed bottom-6 right-6 z-[60] w-[400px] shadow-2xl transition-all duration-500 border-none glass-premium overflow-hidden flex flex-col",
                isMinimized ? "h-16" : "h-[600px] max-h-[80vh]"
            )}
        >
            <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black tracking-tight text-slate-800">{c.title}</CardTitle>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{c.status}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-lg"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardContent className="flex-1 p-0 flex flex-col min-h-0 bg-white/40">
                        <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
                            <div className="space-y-6">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
                                            msg.role === 'user' ? "bg-slate-900 text-white" : "bg-indigo-600 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                                        </div>
                                        <div className={cn(
                                            "rounded-2xl p-3 text-xs leading-relaxed border shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none"
                                                : "bg-white border-slate-100 text-slate-700 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3 animate-pulse">
                                        <div className="h-7 w-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-sm">
                                            <Bot className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Quick Actions */}
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                            {suggestions.map((s, idx) => (
                                <ActionChip
                                    key={idx}
                                    icon={s.icon}
                                    label={s.label}
                                    onClick={() => handleSend(s.label)}
                                />
                            ))}
                        </div>
                    </CardContent>

                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-white/20">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-10 group-focus-within:opacity-20 transition duration-300"></div>
                            <div className="relative flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-slate-200/60 shadow-sm focus-within:border-indigo-500/30 transition-all">
                                <Input
                                    className="border-none focus-visible:ring-0 bg-transparent text-xs font-medium placeholder:text-slate-300"
                                    placeholder={c.placeholder}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <Button
                                    size="icon"
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim() || isTyping}
                                    className={cn(
                                        "h-8 w-8 rounded-lg shrink-0 shadow-lg shadow-indigo-100 transition-all",
                                        inputValue.trim()
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : "bg-slate-100 text-slate-300"
                                    )}
                                >
                                    <Send className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
}

function ActionChip({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-100 text-[10px] font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all whitespace-nowrap shadow-sm group"
        >
            <Icon className="h-3 w-3" />
            {label}
            <ArrowRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all" />
        </button>
    );
}
