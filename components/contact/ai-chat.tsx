import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, MessageSquare, X, Minus, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    choices?: string[];
}

export function AIChat() {
    const { t } = useLanguage();
    const chat = t.contact.aiChat;

    // Safety check in case chat translation is missing
    if (!chat) return null;

    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: chat.welcome }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFloating, setIsFloating] = useState(false);
    const [step, setStep] = useState<'initial' | 'client_check' | 'data_collection' | 'chat'>('client_check');
    const [userData, setUserData] = useState({ isClient: false, email: "", name: "" });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isMinimized]);

    // Check if scrolled past hero to show floating
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setIsFloating(true);
            } else {
                setIsFloating(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Simple keyword matcher using translated knowledge base
    const getResponse = (userMsg: string) => {
        const lowerInput = userMsg.toLowerCase();

        // Map keywords to translation keys in chat.knowledge
        // This is a simple implementation. In a real app, this would be smarter or backend-driven.
        const knowledgeMap = [
            { keys: ['price', 'cost', 'pay', 'cena', 'koszt', 'płatnoś'], response: chat.knowledge?.price },
            { keys: ['delivery', 'ship', 'send', 'dostaw', 'wysyłk', 'kiedy'], response: chat.knowledge?.delivery },
            { keys: ['kindergarten', 'preschool', 'kids', 'przedszkol', 'dzieci', 'młodsz'], response: chat.knowledge?.preschool },
            { keys: ['contact', 'email', 'phone', 'kontakt', 'telefon', 'rozmow'], response: chat.knowledge?.contact },
            { keys: ['invoice', 'vat', 'tax', 'faktur'], response: chat.knowledge?.invoice },
            { keys: ['method', 'teach', 'metod', 'jak uczyć'], response: chat.knowledge?.methods },
        ];

        for (const item of knowledgeMap) {
            if (item.keys.some(k => lowerInput.includes(k)) && item.response) {
                return item.response;
            }
        }
        return chat.responses.fallback;
    };

    const processResponse = async (userMsg: string) => {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1000));

        if (step === 'client_check') {
            const lowerLabel = userMsg.toLowerCase();
            // Check for both localized "Yes"/"No" and generic indications
            if (lowerLabel.includes(chat.options.yes.toLowerCase()) || lowerLabel.includes('tak') || lowerLabel.includes('yes')) {
                setUserData(prev => ({ ...prev, isClient: true }));
                setMessages(prev => [...prev, { role: 'assistant', content: chat.responses.clientYes }]);
                setStep('chat');
            } else {
                setUserData(prev => ({ ...prev, isClient: false }));
                setMessages(prev => [...prev, { role: 'assistant', content: chat.responses.clientNo }]);
                setStep('data_collection');
            }
        } else if (step === 'data_collection') {
            setUserData(prev => ({ ...prev, info: userMsg }));
            setMessages(prev => [...prev, { role: 'assistant', content: chat.responses.dataSaved }]);
            setStep('chat');
        } else {
            const response = getResponse(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }
        setIsTyping(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        await processResponse(msg);
    };

    const handleChoice = async (choice: string) => {
        setMessages(prev => [...prev, { role: 'user', content: choice }]);
        await processResponse(choice);
    };

    if (isMinimized) {
        return (
            <div className={cn(
                "fixed bottom-6 right-6 z-50 transition-all duration-500",
                !isFloating && "hidden lg:block relative bottom-0 right-0"
            )}>
                <Button
                    onClick={() => setIsMinimized(false)}
                    className="h-16 w-16 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-2xl p-0 group overflow-hidden"
                >
                    <MessageSquare className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
                    <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" />
                </Button>
            </div>
        );
    }

    const chatContent = (
        <Card className={cn(
            "w-full h-[600px] flex flex-col shadow-2xl border-indigo-100 overflow-hidden bg-slate-50/30 backdrop-blur-sm transition-all duration-300",
            isFloating && "fixed bottom-6 right-6 z-50 w-[400px] max-w-[90vw] animate-in slide-in-from-bottom-10"
        )}>
            <CardHeader className="bg-indigo-600 text-white py-4 px-6 shrink-0 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold">{chat.title}</CardTitle>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] text-indigo-100 font-medium uppercase tracking-wider">{chat.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsMinimized(true)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={cn(
                        "flex w-full",
                        m.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                        <div className={cn(
                            "max-w-[85%] flex gap-3 items-start",
                            m.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}>
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                m.role === 'user' ? "bg-indigo-100" : "bg-white border border-indigo-100"
                            )}>
                                {m.role === 'user' ? <User className="h-4 w-4 text-indigo-600" /> : <Sparkles className="h-4 w-4 text-amber-500" />}
                            </div>
                            <div className="space-y-2">
                                <div className={cn(
                                    "px-4 py-3 rounded-2xl text-sm shadow-sm",
                                    m.role === 'user'
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-white text-slate-700 border border-indigo-50 rounded-tl-none"
                                )}>
                                    {m.content}
                                </div>
                                {i === messages.length - 1 && step === 'client_check' && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <Button size="sm" variant="outline" className="rounded-full border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50" onClick={() => handleChoice(chat.options.yes)}>
                                            {chat.options.yes}
                                        </Button>
                                        <Button size="sm" variant="outline" className="rounded-full border-slate-200 text-slate-600 bg-white hover:bg-slate-50" onClick={() => handleChoice(chat.options.no)}>
                                            {chat.options.no}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] flex gap-3 items-start">
                            <div className="h-8 w-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="bg-white border border-indigo-50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 text-slate-400 text-xs italic">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                {chat.thinking}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <div className="p-4 bg-white border-t border-indigo-100">
                <div className="flex gap-2">
                    <Input
                        placeholder={step === 'data_collection' ? (chat.dataInputPlaceholder || "Enter name and email...") : chat.inputPlaceholder}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="rounded-xl border-slate-200 focus-visible:ring-indigo-600"
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );

    return chatContent;
}


