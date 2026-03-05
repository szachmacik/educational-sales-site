"use client";
export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  CreditCard,
  Download,
  HelpCircle,
  CheckCircle2,
  Shield,
  Zap,
  Clock,
  Mail,
  ArrowRight,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function JakKupicPage() {
  const { t, language } = useLanguage();
  const pl = language === 'pl';
  const uk = language === 'uk';

  const title = pl ? "Jak kupować?" : uk ? "Як купувати?" : "How to Buy?";
  const subtitle = pl
    ? "Zakup materiałów edukacyjnych jest prosty i bezpieczny. Oto jak to działa krok po kroku."
    : uk
    ? "Купівля навчальних матеріалів проста та безпечна. Ось як це працює крок за кроком."
    : "Purchasing educational materials is simple and secure. Here's how it works step by step.";

  const steps = [
    {
      icon: Search,
      number: "01",
      title: pl ? "Znajdź materiały" : uk ? "Знайдіть матеріали" : "Find Materials",
      desc: pl
        ? "Przeglądaj nasz katalog ponad 200 materiałów edukacyjnych. Skorzystaj z filtrów kategorii (przedszkole, szkoła podstawowa, gry, flashcardy), wyszukiwarki lub sortowania po cenie. Każdy produkt ma szczegółowy opis i podgląd zawartości."
        : uk
        ? "Перегляньте наш каталог понад 200 навчальних матеріалів. Використовуйте фільтри категорій (дитячий садок, початкова школа, ігри, флеш-картки), пошук або сортування за ціною. Кожен продукт має детальний опис та попередній перегляд вмісту."
        : "Browse our catalog of over 200 educational materials. Use category filters (preschool, primary school, games, flashcards), search, or price sorting. Each product has a detailed description and content preview.",
      tip: pl ? "💡 Kliknij produkt, aby zobaczyć szczegółowy opis i przykładowe strony" : uk ? "💡 Натисніть на продукт, щоб побачити детальний опис та зразки сторінок" : "💡 Click a product to see a detailed description and sample pages",
    },
    {
      icon: ShoppingCart,
      number: "02",
      title: pl ? "Dodaj do koszyka" : uk ? "Додайте до кошика" : "Add to Cart",
      desc: pl
        ? "Kliknij \"Dodaj do koszyka\" na stronie produktu lub bezpośrednio z listy. Możesz dodać wiele produktów i przeglądać koszyk w dowolnym momencie. Koszyk jest zapisywany automatycznie — możesz wrócić do zakupów później."
        : uk
        ? "Натисніть \"Додати до кошика\" на сторінці продукту або безпосередньо зі списку. Ви можете додати кілька продуктів і переглянути кошик у будь-який момент. Кошик зберігається автоматично — ви можете повернутися до покупок пізніше."
        : "Click \"Add to Cart\" on the product page or directly from the list. You can add multiple products and view your cart at any time. The cart is saved automatically — you can return to shopping later.",
      tip: pl ? "💡 Masz kod rabatowy? Wpisz go w koszyku lub podczas finalizacji zamówienia" : uk ? "💡 Маєте промокод? Введіть його в кошику або під час оформлення замовлення" : "💡 Have a discount code? Enter it in the cart or during checkout",
    },
    {
      icon: CreditCard,
      number: "03",
      title: pl ? "Bezpieczna płatność" : uk ? "Безпечна оплата" : "Secure Payment",
      desc: pl
        ? "Przejdź do kasy i wypełnij formularz z danymi do faktury. Wybierz preferowaną metodę płatności: PayNow (BLIK, przelew, karta), Stripe (karta kredytowa/debetowa) lub ZEN.COM. Wszystkie transakcje są szyfrowane SSL."
        : uk
        ? "Перейдіть до каси та заповніть форму з даними для рахунку-фактури. Виберіть бажаний спосіб оплати: PayNow (BLIK, переказ, картка), Stripe (кредитна/дебетова картка) або ZEN.COM. Усі транзакції зашифровані SSL."
        : "Go to checkout and fill in the invoice details form. Choose your preferred payment method: PayNow (BLIK, transfer, card), Stripe (credit/debit card), or ZEN.COM. All transactions are SSL encrypted.",
      tip: pl ? "💡 BLIK to najszybsza metoda — płatność w kilka sekund przez aplikację bankową" : uk ? "💡 BLIK — найшвидший метод — оплата за кілька секунд через банківський додаток" : "💡 BLIK is the fastest method — payment in seconds via your banking app",
    },
    {
      icon: Download,
      number: "04",
      title: pl ? "Natychmiastowy dostęp" : uk ? "Миттєвий доступ" : "Instant Access",
      desc: pl
        ? "Po potwierdzeniu płatności otrzymasz e-mail z potwierdzeniem zamówienia. Materiały cyfrowe (PDF, pliki) są dostępne do pobrania natychmiast w Twoim panelu użytkownika. Dostęp jest bezterminowy — pobierz pliki kiedy chcesz."
        : uk
        ? "Після підтвердження оплати ви отримаєте електронний лист із підтвердженням замовлення. Цифрові матеріали (PDF, файли) доступні для завантаження одразу в панелі користувача. Доступ безстроковий — завантажуйте файли коли завгодно."
        : "After payment confirmation, you'll receive an order confirmation email. Digital materials (PDF, files) are available for immediate download in your user panel. Access is permanent — download files whenever you want.",
      tip: pl ? "💡 Sprawdź folder SPAM jeśli nie otrzymałeś e-maila potwierdzającego" : uk ? "💡 Перевірте папку СПАМ, якщо ви не отримали підтверджувальний лист" : "💡 Check your SPAM folder if you didn't receive the confirmation email",
    },
  ];

  const paymentMethods = [
    { name: "BLIK", desc: pl ? "Szybka płatność przez aplikację bankową" : uk ? "Швидка оплата через банківський додаток" : "Fast payment via banking app", badge: pl ? "Najpopularniejsza" : uk ? "Найпопулярніший" : "Most Popular" },
    { name: "Karta kredytowa / debetowa", desc: pl ? "Visa, Mastercard, American Express" : uk ? "Visa, Mastercard, American Express" : "Visa, Mastercard, American Express", badge: null },
    { name: "Przelew bankowy", desc: pl ? "Natychmiastowy przelew online" : uk ? "Миттєвий онлайн-переказ" : "Instant online transfer", badge: null },
    { name: "PayNow", desc: pl ? "Agregator płatności — wszystkie metody w jednym" : uk ? "Агрегатор платежів — усі методи в одному" : "Payment aggregator — all methods in one", badge: null },
    { name: "Stripe", desc: pl ? "Bezpieczne płatności kartą" : uk ? "Безпечні платежі карткою" : "Secure card payments", badge: null },
    { name: "ZEN.COM", desc: pl ? "Nowoczesna platforma płatnicza" : uk ? "Сучасна платіжна платформа" : "Modern payment platform", badge: null },
  ];

  const devices = [
    { icon: Monitor, label: pl ? "Komputer" : uk ? "Комп'ютер" : "Computer" },
    { icon: Tablet, label: pl ? "Tablet" : uk ? "Планшет" : "Tablet" },
    { icon: Smartphone, label: pl ? "Smartfon" : uk ? "Смартфон" : "Smartphone" },
  ];

  const guarantees = [
    { icon: Shield, title: pl ? "Bezpieczne płatności" : uk ? "Безпечні платежі" : "Secure Payments", desc: pl ? "Szyfrowanie SSL 256-bit" : uk ? "Шифрування SSL 256-bit" : "SSL 256-bit encryption" },
    { icon: Zap, title: pl ? "Natychmiastowy dostęp" : uk ? "Миттєвий доступ" : "Instant Access", desc: pl ? "Pobierz od razu po płatności" : uk ? "Завантажте одразу після оплати" : "Download immediately after payment" },
    { icon: Clock, title: pl ? "Dostęp na zawsze" : uk ? "Доступ назавжди" : "Lifetime Access", desc: pl ? "Bez subskrypcji, bez limitu czasu" : uk ? "Без підписки, без обмеження часу" : "No subscription, no time limit" },
    { icon: CheckCircle2, title: pl ? "Sprawdzone materiały" : uk ? "Перевірені матеріали" : "Tested Materials", desc: pl ? "Testowane w prawdziwych klasach" : uk ? "Перевірено в реальних класах" : "Tested in real classrooms" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 border-indigo-200 text-indigo-600 bg-indigo-50">
              <HelpCircle className="h-3 w-3 mr-1" />
              {pl ? "Przewodnik zakupowy" : uk ? "Посібник з покупок" : "Shopping Guide"}
            </Badge>
            <h1 className="font-serif text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-1 mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {subtitle}
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="flex gap-6 md:gap-10">
                  {/* Step number + connector */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                      <step.icon className="h-7 w-7" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="mt-4 h-full w-0.5 min-h-[3rem] bg-gradient-to-b from-indigo-200 to-transparent" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-indigo-400 tracking-widest">{step.number}</span>
                      <h2 className="font-serif text-xl font-bold text-foreground">{step.title}</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">{step.desc}</p>
                    <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700">
                      {step.tip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment methods */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-center mb-8">
              {pl ? "Dostępne metody płatności" : uk ? "Доступні методи оплати" : "Available Payment Methods"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <div key={method.name} className="relative rounded-xl border border-border bg-white p-4 hover:border-indigo-200 hover:shadow-md transition-all">
                  {method.badge && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-indigo-600 text-white">
                      {method.badge}
                    </Badge>
                  )}
                  <p className="font-bold text-foreground text-sm mb-1">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Devices */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-serif text-2xl font-bold mb-4">
              {pl ? "Dostęp na każdym urządzeniu" : uk ? "Доступ на будь-якому пристрої" : "Access on Any Device"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {pl ? "Pobrane pliki PDF możesz otwierać na komputerze, tablecie i smartfonie — bez żadnych dodatkowych aplikacji." : uk ? "Завантажені PDF-файли можна відкривати на комп'ютері, планшеті та смартфоні — без жодних додаткових програм." : "Downloaded PDF files can be opened on your computer, tablet, and smartphone — without any additional apps."}
            </p>
            <div className="flex justify-center gap-8">
              {devices.map((device) => (
                <div key={device.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                    <device.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{device.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-serif text-2xl font-bold text-center mb-8">
              {pl ? "Nasze gwarancje" : uk ? "Наші гарантії" : "Our Guarantees"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {guarantees.map((g) => (
                <Card key={g.title} className="text-center hover:border-indigo-200 hover:shadow-md transition-all">
                  <CardContent className="pt-6 pb-4">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                      <g.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="font-bold text-sm text-foreground mb-1">{g.title}</p>
                    <p className="text-xs text-muted-foreground">{g.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ teaser + CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-serif text-2xl font-bold mb-4">
              {pl ? "Masz pytania?" : uk ? "Маєте запитання?" : "Have Questions?"}
            </h2>
            <p className="text-white/80 mb-6">
              {pl ? "Sprawdź nasze FAQ lub napisz do nas bezpośrednio — odpowiadamy w ciągu 24 godzin." : uk ? "Перегляньте наші FAQ або напишіть нам безпосередньо — відповідаємо протягом 24 годин." : "Check our FAQ or write to us directly — we respond within 24 hours."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${language}/faq`}>
                <Button size="lg" variant="secondary">
                  {pl ? "Przejdź do FAQ" : uk ? "Перейти до FAQ" : "Go to FAQ"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href={`/${language}/contact`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {pl ? "Napisz do nas" : uk ? "Написати нам" : "Contact Us"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
