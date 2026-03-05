"use client";
export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  BookOpen,
  HelpCircle,
  Mail,
  User,
  FileText,
  Shield,
  Cookie,
  RotateCcw,
  CreditCard,
  Map,
  Info,
  Trophy,
} from "lucide-react";

export default function MapaStronyPage() {
  const { t, language } = useLanguage();

  const pl = language === 'pl';
  const uk = language === 'uk';

  const sections = [
    {
      title: pl ? "Strony główne" : uk ? "Головні сторінки" : "Main Pages",
      icon: Home,
      links: [
        { href: `/${language}`, label: pl ? "Strona główna" : uk ? "Головна сторінка" : "Home" },
        { href: `/${language}/products`, label: pl ? "Sklep — materiały edukacyjne" : uk ? "Магазин — навчальні матеріали" : "Shop — Educational Materials" },
        { href: `/${language}/blog`, label: pl ? "Blog" : uk ? "Блог" : "Blog" },
        { href: `/${language}/o-nas`, label: pl ? "O nas" : uk ? "Про нас" : "About Us" },
        { href: `/${language}/contact`, label: pl ? "Kontakt" : uk ? "Контакт" : "Contact" },
      ],
    },
    {
      title: pl ? "Kategorie produktów" : uk ? "Категорії продуктів" : "Product Categories",
      icon: ShoppingBag,
      links: [
        { href: `/${language}/products?category=przedszkole`, label: pl ? "Przedszkole i żłobek" : uk ? "Дитячий садок і ясла" : "Preschool & Nursery" },
        { href: `/${language}/products?category=szkola-podstawowa`, label: pl ? "Szkoła podstawowa (kl. 1-6)" : uk ? "Початкова школа (кл. 1-6)" : "Primary School (Grades 1-6)" },
        { href: `/${language}/products?category=liceum`, label: pl ? "Liceum i dorośli" : uk ? "Ліцей і дорослі" : "High School & Adults" },
        { href: `/${language}/products?category=gry`, label: pl ? "Gry i zabawy" : uk ? "Ігри та розваги" : "Games & Activities" },
        { href: `/${language}/products?category=flashcards`, label: pl ? "Flashcardy" : uk ? "Флеш-картки" : "Flashcards" },
        { href: `/${language}/products?category=pory-roku`, label: pl ? "Pory roku i święta" : uk ? "Пори року та свята" : "Seasons & Holidays" },
        { href: `/${language}/products?category=culture`, label: pl ? "Kultura i projekty" : uk ? "Культура та проекти" : "Culture & Projects" },
      ],
    },
    {
      title: pl ? "Konto i zakupy" : uk ? "Обліковий запис та покупки" : "Account & Shopping",
      icon: User,
      links: [
        { href: `/${language}/login`, label: pl ? "Logowanie / Rejestracja" : uk ? "Вхід / Реєстрація" : "Login / Register" },
        { href: `/${language}/dashboard`, label: pl ? "Moje konto — zakupione materiały" : uk ? "Мій обліковий запис — куплені матеріали" : "My Account — Purchased Materials" },
        { href: `/${language}/cart`, label: pl ? "Koszyk" : uk ? "Кошик" : "Cart" },
        { href: `/${language}/checkout`, label: pl ? "Kasa — finalizacja zamówienia" : uk ? "Каса — завершення замовлення" : "Checkout" },
      ],
    },
    {
      title: pl ? "Pomoc i wsparcie" : uk ? "Допомога та підтримка" : "Help & Support",
      icon: HelpCircle,
      links: [
        { href: `/${language}/faq`, label: pl ? "FAQ — najczęstsze pytania" : uk ? "FAQ — найпоширеніші запитання" : "FAQ — Frequently Asked Questions" },
        { href: `/${language}/jak-kupic`, label: pl ? "Jak kupić?" : uk ? "Як купити?" : "How to Buy?" },
        { href: `/${language}/zwroty`, label: pl ? "Zwroty i reklamacje" : uk ? "Повернення та скарги" : "Returns & Complaints" },
        { href: `/${language}/contact`, label: pl ? "Formularz kontaktowy" : uk ? "Контактна форма" : "Contact Form" },
      ],
    },
    {
      title: pl ? "Informacje prawne" : uk ? "Правова інформація" : "Legal Information",
      icon: Shield,
      links: [
        { href: `/${language}/regulamin`, label: pl ? "Regulamin świadczenia usług" : uk ? "Правила надання послуг" : "Terms of Service" },
        { href: `/${language}/polityka-prywatnosci`, label: pl ? "Polityka prywatności (RODO)" : uk ? "Політика конфіденційності (GDPR)" : "Privacy Policy (GDPR)" },
        { href: `/${language}/polityka-cookies`, label: pl ? "Polityka cookies" : uk ? "Політика файлів cookie" : "Cookie Policy" },
      ],
    },
    {
      title: pl ? "Projekty i konkursy" : uk ? "Проекти та конкурси" : "Projects & Competitions",
      icon: Trophy,
      links: [
        { href: "https://lingus.edu.pl", label: pl ? "Linguś — Ogólnopolski Konkurs Języka Angielskiego" : uk ? "Linguś — Всепольський конкурс англійської мови" : "Linguś — National English Language Competition", external: true },
        { href: "https://matmis.edu.pl", label: pl ? "MatMiś — Ogólnopolski Konkurs Matematyczny" : uk ? "MatMiś — Всепольський математичний конкурс" : "MatMiś — National Mathematics Competition", external: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 mb-4">
              <Map className="h-4 w-4" />
              {pl ? "Mapa strony" : uk ? "Карта сайту" : "Sitemap"}
            </div>
            <h1 className="font-serif text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-1 mb-4">
              {pl ? "Mapa strony" : uk ? "Карта сайту" : "Sitemap"}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {pl ? "Pełna lista wszystkich stron i sekcji dostępnych na kamilaenglish.com" : uk ? "Повний список усіх сторінок та розділів, доступних на kamilaenglish.com" : "Complete list of all pages and sections available on kamilaenglish.com"}
            </p>
          </div>
        </section>

        {/* Sitemap grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section) => (
                <div key={section.title} className="rounded-2xl border border-border bg-card p-6 hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                      <section.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h2 className="font-bold text-foreground">{section.title}</h2>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        {(link as any).external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 flex-shrink-0" />
                            {link.label}
                            <span className="text-xs text-muted-foreground/50">↗</span>
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 flex-shrink-0" />
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
