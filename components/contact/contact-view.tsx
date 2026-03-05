"use client";

import { useState, useCallback } from "react";
import { AIChat } from "@/components/contact/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Send, MessageCircle, Clock, Heart, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

interface FormFields {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data: FormFields): FormErrors {
    const errors: FormErrors = {};
    if (!data.name.trim() || data.name.trim().length < 2) {
        errors.name = 'Imię musi mieć co najmniej 2 znaki.';
    }
    if (!data.email.trim() || !validateEmail(data.email)) {
        errors.email = 'Podaj prawidłowy adres e-mail.';
    }
    if (!data.subject.trim() || data.subject.trim().length < 3) {
        errors.subject = 'Temat musi mieć co najmniej 3 znaki.';
    }
    if (!data.message.trim() || data.message.trim().length < 10) {
        errors.message = 'Wiadomość musi mieć co najmniej 10 znaków.';
    }
    return errors;
}

export function ContactView() {
    const { t } = useLanguage();
    const c = t.contact || {};
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormFields>({
        name: '', email: '', subject: '', message: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<keyof FormFields, boolean>>({
        name: false, email: false, subject: false, message: false
    });

    const handleChange = useCallback((field: keyof FormFields, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error on change if field was touched
        if (touched[field]) {
            const newErrors = validateForm({ ...formData, [field]: value });
            setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
        }
    }, [formData, touched]);

    const handleBlur = useCallback((field: keyof FormFields) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const newErrors = validateForm(formData);
        setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Mark all as touched
        setTouched({ name: true, email: true, subject: true, message: true });
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Popraw błędy w formularzu przed wysłaniem.');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast.success(c.form?.success || "Wiadomość wysłana!", {
                    description: c.form?.successDesc || "Odpiszemy najszybciej jak to możliwe."
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setErrors({});
                setTouched({ name: false, email: false, subject: false, message: false });
            } else {
                const err = await res.json().catch(() => ({}));
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

    const fieldClass = (field: keyof FormFields) =>
        `rounded-xl h-11 transition-colors ${errors[field] && touched[field]
            ? 'border-red-400 focus-visible:ring-red-300 bg-red-50'
            : 'border-slate-200'
        }`;

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
                                    <a
                                        href={`mailto:${c.info?.emailValue || 'kontakt@kamilaenglish.com'}`}
                                        className="text-indigo-600 font-bold hover:underline"
                                    >
                                        {c.info?.emailValue || 'kontakt@kamilaenglish.com'}
                                    </a>
                                </div>
                            </div>

                            <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden rounded-3xl">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">{c.formTitle}</h3>
                                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="name">{c.form?.name || 'Imię i nazwisko'}</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={e => handleChange('name', e.target.value)}
                                                    onBlur={() => handleBlur('name')}
                                                    placeholder={c.form?.placeholders?.name || "Jan Kowalski"}
                                                    className={fieldClass('name')}
                                                    aria-invalid={!!errors.name && touched.name}
                                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                                />
                                                {errors.name && touched.name && (
                                                    <p id="name-error" className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="email">{c.form?.email || 'E-mail'}</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => handleChange('email', e.target.value)}
                                                    onBlur={() => handleBlur('email')}
                                                    placeholder={c.form?.placeholders?.email || "jan@example.com"}
                                                    className={fieldClass('email')}
                                                    aria-invalid={!!errors.email && touched.email}
                                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                                />
                                                {errors.email && touched.email && (
                                                    <p id="email-error" className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="subject">{c.form?.subject || 'Temat'}</Label>
                                            <Input
                                                id="subject"
                                                value={formData.subject}
                                                onChange={e => handleChange('subject', e.target.value)}
                                                onBlur={() => handleBlur('subject')}
                                                placeholder={c.form?.placeholders?.subject || "Pytanie o..."}
                                                className={fieldClass('subject')}
                                                aria-invalid={!!errors.subject && touched.subject}
                                                aria-describedby={errors.subject ? 'subject-error' : undefined}
                                            />
                                            {errors.subject && touched.subject && (
                                                <p id="subject-error" className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                                    {errors.subject}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="message">{c.form?.message || 'Wiadomość'}</Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={e => handleChange('message', e.target.value)}
                                                onBlur={() => handleBlur('message')}
                                                placeholder={c.form?.messagePlaceholder || "Opisz swoje pytanie lub problem..."}
                                                className={`min-h-[150px] rounded-xl transition-colors ${errors.message && touched.message
                                                    ? 'border-red-400 focus-visible:ring-red-300 bg-red-50'
                                                    : 'border-slate-200'
                                                    }`}
                                                aria-invalid={!!errors.message && touched.message}
                                                aria-describedby={errors.message ? 'message-error' : undefined}
                                            />
                                            <div className="flex justify-between items-center">
                                                {errors.message && touched.message ? (
                                                    <p id="message-error" className="text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                                        {errors.message}
                                                    </p>
                                                ) : <span />}
                                                <span className={`text-xs ${formData.message.length > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {formData.message.length}/1000
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl text-md font-bold shadow-lg shadow-indigo-100 gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
                                            disabled={isSubmitting || formData.message.length > 1000}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    {c.form?.sending || 'Wysyłanie...'}
                                                </>
                                            ) : (
                                                <>
                                                    {c.form?.send || 'Wyślij wiadomość'}
                                                    <Send className="h-4 w-4" />
                                                </>
                                            )}
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
