"use client";
import Link from 'next/link';
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Home, Search, BookOpen, ShoppingBag } from "lucide-react";

export default function NotFound() {
  const { t, language } = useLanguage();
  const e = t.errors?.["404"];
  const title = e?.title || "Strona nie znaleziona";
  const message = e?.message || "Przepraszamy, ta strona nie istnieje lub została przeniesiona.";
  const back = e?.back || "Wróć do strony głównej";

  const quickLinks = [
    { href: `/${language}/products`, icon: ShoppingBag, label: language === 'pl' ? 'Sklep' : language === 'uk' ? 'Магазин' : 'Shop', desc: language === 'pl' ? 'Przeglądaj materiały' : language === 'uk' ? 'Переглянути матеріали' : 'Browse materials' },
    { href: `/${language}/blog`, icon: BookOpen, label: 'Blog', desc: language === 'pl' ? 'Artykuły i porady' : language === 'uk' ? 'Статті та поради' : 'Articles & tips' },
    { href: `/${language}/faq`, icon: Search, label: 'FAQ', desc: language === 'pl' ? 'Najczęstsze pytania' : language === 'uk' ? 'Часті запитання' : 'Common questions' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="relative mb-8">
            <span className="text-[10rem] font-black text-slate-100 leading-none select-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                <Search className="h-10 w-10 text-indigo-400" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
          <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">{message}</p>
          <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
            <Button size="lg" asChild className="rounded-full px-8 gap-2">
              <Link href={`/${language}`}><Home className="h-4 w-4" />{back}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 gap-2">
              <Link href={`/${language}/products`}>
                <ShoppingBag className="h-4 w-4" />
                {language === 'pl' ? 'Przeglądaj sklep' : language === 'uk' ? 'Переглянути магазин' : 'Browse shop'}
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <link.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{link.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
