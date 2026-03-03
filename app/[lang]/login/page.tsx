import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LanguageProvider } from "@/components/language-provider";
import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';
import { deepMerge } from '@/lib/utils';

// Prevent static prerendering — page uses client-side hooks
export const dynamic = 'force-dynamic';

async function getDictionary(lang: string, namespace: string) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return {};
    }
}

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    const auth = await getDictionary(lang, 'auth');
    const dictionary = deepMerge(common, auth);

    return (
        <LanguageProvider lang={lang} dictionary={dictionary}>
            <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
                {/* Animated blobs */}
                <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-purple-500/20 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

                {/* Left branding panel — hidden on mobile */}
                <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-12 relative z-10">
                    <Link href={`/${lang}`} className="flex items-center gap-3">
                        <StaticLogo />
                    </Link>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            {[
                                { emoji: "📚", title: "Materiały edukacyjne", desc: "Tysiące ćwiczeń językowych dla każdego poziomu" },
                                { emoji: "🏆", title: "Gamifikacja nauki", desc: "Punkty, odznaki i streaki motywujące do nauki" },
                                { emoji: "🏫", title: "Plany szkolne", desc: "Licencje grupowe dla placówek i nauczycieli" },
                            ].map((item) => (
                                <div key={item.title} className="flex items-start gap-4 group">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-white/20 transition-colors">
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{item.title}</p>
                                        <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex -space-x-2">
                                {["🧒", "👩‍🏫", "🏫"].map((e, i) => (
                                    <div key={i} className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm border-2 border-indigo-900">{e}</div>
                                ))}
                            </div>
                            <p className="text-white/70 text-xs font-medium">Dołącz do tysięcy uczniów i nauczycieli</p>
                        </div>
                    </div>

                    <p className="text-white/30 text-xs">© {new Date().getFullYear()} Kamila Łobko-Koziej. {dictionary.footer?.rights || 'Wszelkie prawa zastrzeżone.'}</p>
                </div>

                {/* Right form panel */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8">
                        <Link href={`/${lang}`} className="flex items-center gap-3">
                            <StaticLogo />
                        </Link>
                    </div>

                    <Suspense fallback={<LoginFormFallback />}>
                        <LoginForm />
                    </Suspense>

                    <p className="mt-6 text-white/30 text-xs text-center lg:hidden">© {new Date().getFullYear()} Kamila Łobko-Koziej</p>
                </div>
            </div>
        </LanguageProvider>
    );
}

function LoginFormFallback() {
    return (
        <div className="w-full max-w-md h-[480px] rounded-2xl bg-white/10 animate-pulse border border-white/10" />
    );
}

function StaticLogo() {
    return (
        <div className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 100 100" className="drop-shadow-md">
                <defs><clipPath id="hc"><path d="M50 88.5C50 88.5 10 60 10 35C10 20 22 10 35 10C42 10 48 13 50 18C52 13 58 10 65 10C78 10 90 20 90 35C90 60 50 88.5 50 88.5Z" /></clipPath></defs>
                <g clipPath="url(#hc)">
                    <rect x="0" y="0" width="100" height="100" fill="#012169" />
                    <path d="M0 0L100 100M100 0L0 100" stroke="white" strokeWidth="16" />
                    <path d="M0 0L100 100M100 0L0 100" stroke="#C8102E" strokeWidth="6" />
                    <rect x="42" y="0" width="16" height="100" fill="white" />
                    <rect x="0" y="40" width="100" height="20" fill="white" />
                    <rect x="45" y="0" width="10" height="100" fill="#C8102E" />
                    <rect x="0" y="43" width="100" height="14" fill="#C8102E" />
                </g>
                <path d="M50 88.5C50 88.5 10 60 10 35C10 20 22 10 35 10C42 10 48 13 50 18C52 13 58 10 65 10C78 10 90 20 90 35C90 60 50 88.5 50 88.5Z" fill="none" stroke="white" strokeWidth="3" />
            </svg>
            <div className="hidden flex-col sm:flex">
                <span className="font-serif text-lg font-bold leading-tight tracking-tight text-white">Materiały Edukacyjne</span>
                <span className="text-xs text-white/60">by Kamila Łobko-Koziej ♥</span>
            </div>
        </div>
    );
}
