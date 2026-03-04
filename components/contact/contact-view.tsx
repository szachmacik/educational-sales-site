"use client";

import { useState } from "react";
import { AIChat } from "@/components/contact/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Heart } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

export function ContactView() {
    const { t } = useLanguage();
    const c = t.contact || {};
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.target as HTMLFormElement;
        const data = {
            name: (form.querySelector('#name') as HTMLInputElement)?.value || '',
            email: (form.querySelector('#email') as HTMLInputElement)?.value || '',
            subject: (form.querySelector('#subject') as HTMLInputElement)?.value || '',
            message: (form.querySelector('#message') as HTMLTextAreaElement)?.value || '',
        };
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast.success(c.form?.success || "Wiadomość wysłana!", {
                    description: c.form?.successDesc || "Odpiszemy najszybciej jak to możliwe."
                });
                form.reset();
            } else {
                const err = await res.json();
                toast.error(c.form?.error || "Błąd wysyłania", {
                    description: err.message || "Spróbuj ponownie za chwilę."
                });
            }
        } catch {
            toast.error(c.form?.error || "Błąd wysyłania", {
                description: "Sprawdź połączenie internetowe i spróbuj ponownie."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative bg-white border-b overflow-hidden py-16 sm:py-24">
                <div className="absolute top-0 right-0 -m-20 opacity-10">
                    <MessageCircle className="w-96 h-96 text-indigo-600" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-2xl">
                        <h1 className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
                            {c.title}
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed mb-8">
                            {c.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 text-indigo-700 font-medium text-sm">
                                <Clock className="h-4 w-4" />
                                {c.aiBadge}
                            </div>
                            <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 text-rose-700 font-medium text-sm">
                                <Heart className="h-4 w-4" />
                                {c.trustBadge}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* Left: Traditional Contact */}
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-3">
                                    <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{c.emailTitle}</h3>
                                    <p className="text-slate-600 text-sm">{c.emailDesc}</p>
                                    <a href={`mailto:${c.info?.emailValue || 'kontakt@kamilaenglish.com'}`} className="text-indigo-600 font-bold hover:underline">
                                        {c.info?.emailValue || 'kontakt@kamilaenglish.com'}
                                    </a>
                                </div>
                            </div>

                            <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden rounded-3xl">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">{c.formTitle}</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{c.form?.name}</Label>
                                                <Input id="name" placeholder={c.form?.placeholders?.name || "John Doe"} required className="rounded-xl border-slate-200 h-11" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">{c.form?.email}</Label>
                                                <Input id="email" type="email" placeholder={c.form?.placeholders?.email || "jan@kamila.shor.dev"} required className="rounded-xl border-slate-200 h-11" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">{c.form?.subject}</Label>
                                            <Input id="subject" placeholder={c.form?.placeholders?.subject || "Question about..."} required className="rounded-xl border-slate-200 h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">{c.form?.message}</Label>
                                            <Textarea
                                                id="message"
                                                placeholder={c.form?.messagePlaceholder || "..."}
                                                className="min-h-[150px] rounded-xl border-slate-200"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl text-md font-bold shadow-lg shadow-indigo-100 gap-2 transition-all hover:scale-[1.02]"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? c.form?.sending : c.form?.send}
                                            {!isSubmitting && <Send className="h-4 w-4" />}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right: AI Chat */}
                        <div className="space-y-8 sticky top-32">
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-indigo-50 relative overflow-hidden">
                                <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                                <div className="relative">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{c.aiHelp}</h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed">
                                        {c.aiHelpDesc}
                                    </p>
                                    <div className="hidden lg:block">
                                        <AIChat />
                                    </div>
                                    <div className="lg:hidden text-center py-4">
                                        <p className="text-sm font-medium text-indigo-600 italic">{c.aiHelpMobile}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-8 px-8 opacity-50">
                                <MapPin className="h-5 w-5 text-slate-400" />
                                <span className="text-sm font-medium text-slate-500 italic">{c.addressTitle}: {c.addressValue}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
