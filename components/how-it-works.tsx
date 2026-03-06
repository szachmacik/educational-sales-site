"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = {
  pl: [
    {
      icon: ShoppingCart,
      step: "01",
      title: "Wybierz materiały",
      description: "Przeglądaj ponad 1200 gotowych materiałów edukacyjnych. Filtruj po poziomie, kategorii i cenie. Dodaj do koszyka.",
      color: "bg-indigo-100 text-indigo-600",
      accent: "border-indigo-200",
    },
    {
      icon: CheckCircle2,
      step: "02",
      title: "Zapłać bezpiecznie",
      description: "Płatność przez PayNow, Stripe lub ZEN. Transakcja szyfrowana SSL. Akceptujemy karty, BLIK i przelewy.",
      color: "bg-emerald-100 text-emerald-600",
      accent: "border-emerald-200",
    },
    {
      icon: Download,
      step: "03",
      title: "Pobierz od razu",
      description: "Natychmiast po płatności otrzymujesz dostęp do plików PDF/ZIP. Pobierz na komputer lub tablet.",
      color: "bg-amber-100 text-amber-600",
      accent: "border-amber-200",
    },
    {
      icon: BookOpen,
      step: "04",
      title: "Używaj wielokrotnie",
      description: "Drukuj ile razy chcesz. Licencja na użytek własny. Możesz korzystać rok po roku z tymi samymi uczniami.",
      color: "bg-rose-100 text-rose-600",
      accent: "border-rose-200",
    },
  ],
  en: [
    {
      icon: ShoppingCart,
      step: "01",
      title: "Choose your materials",
      description: "Browse over 1200 ready-made educational materials. Filter by level, category and price. Add to cart.",
      color: "bg-indigo-100 text-indigo-600",
      accent: "border-indigo-200",
    },
    {
      icon: CheckCircle2,
      step: "02",
      title: "Pay securely",
      description: "Payment via PayNow, Stripe or ZEN. SSL encrypted transaction. We accept cards, BLIK and bank transfers.",
      color: "bg-emerald-100 text-emerald-600",
      accent: "border-emerald-200",
    },
    {
      icon: Download,
      step: "03",
      title: "Download instantly",
      description: "Immediately after payment you get access to PDF/ZIP files. Download to your computer or tablet.",
      color: "bg-amber-100 text-amber-600",
      accent: "border-amber-200",
    },
    {
      icon: BookOpen,
      step: "04",
      title: "Use repeatedly",
      description: "Print as many times as you want. Personal use license. Use year after year with the same students.",
      color: "bg-rose-100 text-rose-600",
      accent: "border-rose-200",
    },
  ],
  uk: [
    {
      icon: ShoppingCart,
      step: "01",
      title: "Оберіть матеріали",
      description: "Перегляньте понад 1200 готових навчальних матеріалів. Фільтруйте за рівнем, категорією та ціною.",
      color: "bg-indigo-100 text-indigo-600",
      accent: "border-indigo-200",
    },
    {
      icon: CheckCircle2,
      step: "02",
      title: "Оплатіть безпечно",
      description: "Оплата через PayNow, Stripe або ZEN. Транзакція зашифрована SSL. Приймаємо картки та перекази.",
      color: "bg-emerald-100 text-emerald-600",
      accent: "border-emerald-200",
    },
    {
      icon: Download,
      step: "03",
      title: "Завантажте одразу",
      description: "Одразу після оплати ви отримуєте доступ до файлів PDF/ZIP. Завантажте на комп'ютер або планшет.",
      color: "bg-amber-100 text-amber-600",
      accent: "border-amber-200",
    },
    {
      icon: BookOpen,
      step: "04",
      title: "Використовуйте багаторазово",
      description: "Друкуйте скільки завгодно. Ліцензія для особистого використання. Використовуйте рік за роком.",
      color: "bg-rose-100 text-rose-600",
      accent: "border-rose-200",
    },
  ],
};

const LABELS = {
  pl: { heading: "Jak to działa?", sub: "Prosty proces w 4 krokach — od wyboru do gotowych materiałów w Twoich rękach.", cta: "Zacznij przeglądać" },
  en: { heading: "How does it work?", sub: "A simple 4-step process — from selection to ready materials in your hands.", cta: "Start browsing" },
  uk: { heading: "Як це працює?", sub: "Простий процес у 4 кроки — від вибору до готових матеріалів у ваших руках.", cta: "Почати перегляд" },
};

export function HowItWorks() {
  const { language } = useLanguage();
  const lang = (language as keyof typeof STEPS) in STEPS ? (language as keyof typeof STEPS) : "pl";
  const steps = STEPS[lang];
  const labels = LABELS[lang] || LABELS.pl;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Jak kupować?
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            {labels.heading}
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            {labels.sub}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-200 via-emerald-200 via-amber-200 to-rose-200 z-0" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={`relative bg-white rounded-2xl border-2 ${step.accent} p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group z-10`}
              >
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.description}</p>

                {/* Arrow connector (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white border-2 border-slate-200 rounded-full items-center justify-center shadow-sm">
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href={`/${language}/products`}>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-10 shadow-lg shadow-indigo-200 gap-2 font-bold">
              {labels.cta} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-slate-400 mt-3 font-medium">
            {lang === "pl" ? "Ponad 1200 materiałów gotowych do pobrania" : lang === "en" ? "Over 1200 materials ready to download" : "Понад 1200 матеріалів готових до завантаження"}
          </p>
        </div>
      </div>
    </section>
  );
}
