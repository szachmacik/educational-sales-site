import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { TranslationMerger, NamespaceGuard } from "@/components/language-provider";
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

// Prevent static prerendering of all admin pages — they use client-side auth and hooks
export const dynamic = 'force-dynamic';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AIAssistant } from '@/components/admin/ai-assistant';
import { Button } from '@/components/ui/button';
import { Menu, Home, Globe, User } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { toast } from "sonner";
async function getAdminDictionary(lang: string) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, 'admin.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return null;
    }
}

export default async function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const dict = await getAdminDictionary(lang);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-50/50">
                <TranslationMerger dictionary={dict} />
                <AdminSidebar />
                <SidebarInset className="flex w-full flex-col">
                    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white/80 backdrop-blur-md px-4 md:px-8">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="flex md:hidden">
                                <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Sidebar</span>
                                </Button>
                            </SidebarTrigger>
                            <div className="hidden md:flex items-center text-sm font-bold text-slate-500">
                                <Link href={`/${lang}`} className="hover:text-indigo-600 transition-colors">
                                    {dict?.adminPanel?.sidebar?.menu?.home || "Homepage"}
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1" />

                        <div className="flex items-center gap-6">
                            <LanguageSwitcher />

                            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                            <div className="flex items-center gap-3 bg-slate-100/50 p-1.5 pr-3 rounded-full border border-slate-200/60 hover:bg-slate-100 transition-colors cursor-pointer group">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover:scale-105">
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">AD</AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:flex flex-col items-start leading-tight">
                                    <span className="text-xs font-black text-slate-900 tracking-tight">
                                        {dict?.adminPanel?.sidebar?.menu?.role || "Administrator"}
                                    </span>
                                    <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <span className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
                                        {dict?.adminPanel?.sidebar?.menu?.online || "Online"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-x-hidden">
                        <div className="mx-auto max-w-7xl p-4 md:p-8">
                            <NamespaceGuard dictionary={dict} namespace="admin">
                                {children}
                            </NamespaceGuard>
                        </div>
                    </main>
                    <AIAssistant />
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
