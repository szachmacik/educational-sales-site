"use client";
export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import {
  RotateCcw,
  Package,
  FileText,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ZwrotyPage() {
  const { t, language } = useLanguage();
  const pl = language === 'pl';
  const uk = language === 'uk';

  const title = pl ? "Zwroty i Reklamacje" : uk ? "Повернення та Рекламації" : "Returns & Complaints";
  const updated = pl ? "Zasady obowiązujące od: 25 lutego 2026 r." : uk ? "Правила, що діють з: 25 лютого 2026 р." : "Policy effective from: February 25, 2026";

  const sections = [
    {
      icon: Package,
      title: pl ? "1. Produkty Fizyczne — Prawo Odstąpienia" : uk ? "1. Фізичні Продукти — Право на Відмову" : "1. Physical Products — Right of Withdrawal",
      content: pl
        ? `Zgodnie z Ustawą z dnia 30 maja 2014 r. o prawach konsumenta, masz prawo do odstąpienia od umowy zakupu produktu fizycznego w terminie **14 dni** od dnia otrzymania przesyłki, bez podania przyczyny.

**Warunki zwrotu:**
- Produkt musi być w stanie nienaruszonym, w oryginalnym opakowaniu
- Produkt nie może nosić śladów użytkowania
- Do zwrotu należy dołączyć dowód zakupu (paragon lub faktura)

**Jak złożyć zwrot:**
1. Wyślij e-mail na kontakt@kamilaenglish.com z informacją o chęci odstąpienia od umowy
2. Podaj numer zamówienia i powód zwrotu (opcjonalnie)
3. Otrzymasz adres do wysyłki zwrotnej w ciągu 2 dni roboczych
4. Wyślij produkt na własny koszt
5. Zwrot środków nastąpi w ciągu 14 dni od otrzymania przesyłki`
        : uk
        ? `Відповідно до Закону від 30 травня 2014 р. про права споживачів, ви маєте право відмовитися від договору купівлі фізичного продукту протягом **14 днів** від дня отримання посилки, без зазначення причини.

**Умови повернення:**
- Продукт повинен бути в непошкодженому стані, в оригінальній упаковці
- Продукт не повинен мати слідів використання
- До повернення необхідно додати підтвердження покупки (квитанція або рахунок-фактура)

**Як подати заявку на повернення:**
1. Надішліть електронний лист на kontakt@kamilaenglish.com з інформацією про бажання відмовитися від договору
2. Вкажіть номер замовлення та причину повернення (необов'язково)
3. Ви отримаєте адресу для зворотного відправлення протягом 2 робочих днів
4. Надішліть продукт за власний рахунок
5. Повернення коштів відбудеться протягом 14 днів після отримання посилки`
        : `In accordance with the Act of May 30, 2014 on consumer rights, you have the right to withdraw from the purchase contract for a physical product within **14 days** of receiving the shipment, without giving a reason.

**Return conditions:**
- The product must be in undamaged condition, in its original packaging
- The product must not show signs of use
- Proof of purchase (receipt or invoice) must be included with the return

**How to submit a return:**
1. Send an email to kontakt@kamilaenglish.com with information about your wish to withdraw from the contract
2. Provide the order number and reason for return (optional)
3. You will receive the return shipping address within 2 business days
4. Ship the product at your own expense
5. Refund will be processed within 14 days of receiving the shipment`,
    },
    {
      icon: FileText,
      title: pl ? "2. Produkty Cyfrowe — Treści Niematerialne" : uk ? "2. Цифрові Продукти — Нематеріальний Контент" : "2. Digital Products — Intangible Content",
      content: pl
        ? `Ze względu na charakter treści cyfrowych (pliki PDF, materiały do pobrania), które nie są zapisane na nośniku materialnym, **prawo do odstąpienia od umowy nie przysługuje**, jeżeli:

- Pobieranie materiału lub dostęp do niego **rozpoczął się za Twoją wyraźną zgodą** przed upływem terminu do odstąpienia od umowy
- Zostałeś poinformowany o utracie prawa do odstąpienia i potwierdziłeś to podczas zakupu

Podstawa prawna: Art. 38 pkt 13 Ustawy o prawach konsumenta.

**Wyjątki — kiedy możliwy jest zwrot:**
- Plik jest uszkodzony lub nie można go otworzyć
- Zawartość produktu znacząco odbiega od opisu
- Wystąpił błąd techniczny podczas zakupu (podwójne obciążenie)`
        : uk
        ? `Через характер цифрового контенту (PDF-файли, матеріали для завантаження), який не записаний на матеріальному носії, **право на відмову від договору не застосовується**, якщо:

- Завантаження матеріалу або доступ до нього **розпочалося за вашою явною згодою** до закінчення терміну для відмови від договору
- Ви були поінформовані про втрату права на відмову та підтвердили це під час покупки

Правова підстава: Ст. 38 п. 13 Закону про права споживачів.

**Винятки — коли можливе повернення:**
- Файл пошкоджений або не відкривається
- Вміст продукту суттєво відрізняється від опису
- Виникла технічна помилка під час покупки (подвійне списання)`
        : `Due to the nature of digital content (PDF files, downloadable materials), which is not stored on a physical medium, **the right of withdrawal does not apply** if:

- Downloading the material or accessing it **began with your explicit consent** before the withdrawal period expired
- You were informed about the loss of the right of withdrawal and confirmed this during purchase

Legal basis: Art. 38 point 13 of the Consumer Rights Act.

**Exceptions — when a refund is possible:**
- The file is damaged or cannot be opened
- The product content significantly differs from the description
- A technical error occurred during purchase (double charge)`,
    },
    {
      icon: AlertCircle,
      title: pl ? "3. Procedura Reklamacyjna" : uk ? "3. Процедура Рекламації" : "3. Complaint Procedure",
      content: pl
        ? `Jeśli zakupiony produkt posiada wadę lub nie spełnia opisanych właściwości, masz prawo do złożenia reklamacji.

**Jak złożyć reklamację:**
1. Wyślij e-mail na **kontakt@kamilaenglish.com** z tytułem "Reklamacja — [numer zamówienia]"
2. Opisz dokładnie problem i dołącz zrzuty ekranu lub zdjęcia (w przypadku produktów fizycznych)
3. Podaj preferowany sposób rozwiązania: wymiana, naprawa lub zwrot pieniędzy

**Terminy:**
- Reklamacje rozpatrujemy w ciągu **14 dni roboczych** od daty zgłoszenia
- W przypadku reklamacji uznanej — zwrot środków lub wymiana w ciągu 7 dni
- Odpowiedź na reklamację zostanie wysłana na adres e-mail podany podczas zakupu`
        : uk
        ? `Якщо придбаний продукт має дефект або не відповідає описаним властивостям, ви маєте право подати рекламацію.

**Як подати рекламацію:**
1. Надішліть електронний лист на **kontakt@kamilaenglish.com** з темою "Рекламація — [номер замовлення]"
2. Детально опишіть проблему та додайте скріншоти або фотографії (у випадку фізичних продуктів)
3. Вкажіть бажаний спосіб вирішення: заміна, ремонт або повернення грошей

**Терміни:**
- Рекламації розглядаємо протягом **14 робочих днів** від дати подачі
- У разі визнаної рекламації — повернення коштів або заміна протягом 7 днів
- Відповідь на рекламацію буде надіслана на адресу електронної пошти, вказану під час покупки`
        : `If the purchased product has a defect or does not meet the described properties, you have the right to file a complaint.

**How to file a complaint:**
1. Send an email to **kontakt@kamilaenglish.com** with the subject "Complaint — [order number]"
2. Describe the problem in detail and attach screenshots or photos (for physical products)
3. State your preferred resolution: replacement, repair, or refund

**Timelines:**
- Complaints are processed within **14 business days** from the date of submission
- For accepted complaints — refund or replacement within 7 days
- The complaint response will be sent to the email address provided during purchase`,
    },
    {
      icon: Mail,
      title: pl ? "4. Dane Kontaktowe" : uk ? "4. Контактні Дані" : "4. Contact Information",
      content: pl
        ? `**Adres e-mail:** kontakt@kamilaenglish.com
**Czas odpowiedzi:** do 24 godzin w dni robocze (pon–pt)

W tytule wiadomości prosimy podać:
- "Zwrot — [numer zamówienia]" — dla zwrotów
- "Reklamacja — [numer zamówienia]" — dla reklamacji
- "Pytanie — [temat]" — dla innych zapytań

Adres do korespondencji pocztowej zostanie podany po zgłoszeniu chęci zwrotu drogą mailową.`
        : uk
        ? `**Адреса електронної пошти:** kontakt@kamilaenglish.com
**Час відповіді:** до 24 годин у робочі дні (пн–пт)

У темі повідомлення просимо вказати:
- "Повернення — [номер замовлення]" — для повернень
- "Рекламація — [номер замовлення]" — для рекламацій
- "Питання — [тема]" — для інших запитів

Поштова адреса для кореспонденції буде надана після подачі заявки на повернення електронною поштою.`
        : `**Email address:** kontakt@kamilaenglish.com
**Response time:** within 24 hours on business days (Mon–Fri)

In the email subject, please include:
- "Return — [order number]" — for returns
- "Complaint — [order number]" — for complaints
- "Question — [topic]" — for other inquiries

The postal address for correspondence will be provided after submitting a return request by email.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 border-indigo-200 text-indigo-600 bg-indigo-50">
              <RotateCcw className="h-3 w-3 mr-1" />
              {pl ? "Polityka zwrotów" : uk ? "Політика повернень" : "Return Policy"}
            </Badge>
            <h1 className="font-serif text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-1 mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">{updated}</p>
          </div>
        </section>

        {/* Quick info alert */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Alert className="border-indigo-200 bg-indigo-50">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <AlertDescription className="text-indigo-700">
                {pl
                  ? "Produkty fizyczne — 14 dni na zwrot bez podania przyczyny. Produkty cyfrowe — brak prawa do zwrotu po pobraniu (zgodnie z prawem UE). Wyjątek: wada techniczna lub błąd w opisie."
                  : uk
                  ? "Фізичні продукти — 14 днів на повернення без зазначення причини. Цифрові продукти — немає права на повернення після завантаження (відповідно до законодавства ЄС). Виняток: технічний дефект або помилка в описі."
                  : "Physical products — 14 days to return without giving a reason. Digital products — no right of return after download (under EU law). Exception: technical defect or error in description."}
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Sections */}
        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-4xl space-y-8">
            {sections.map((section) => (
              <Card key={section.title} className="hover:border-indigo-200 hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <section.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm prose-slate max-w-none text-muted-foreground">
                    {section.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-foreground mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.match(/^\d+\./)) {
                        return <p key={i} className="ml-4">{line}</p>;
                      }
                      if (line.startsWith('- ')) {
                        return <p key={i} className="ml-4">• {line.slice(2)}</p>;
                      }
                      if (line === '') return <br key={i} />;
                      // Handle inline bold
                      const parts = line.split(/\*\*(.+?)\*\*/g);
                      return (
                        <p key={i}>
                          {parts.map((part, j) =>
                            j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-serif text-2xl font-bold mb-4">
              {pl ? "Potrzebujesz pomocy?" : uk ? "Потрібна допомога?" : "Need Help?"}
            </h2>
            <p className="text-white/80 mb-6">
              {pl ? "Nasz zespół odpowiada na e-maile w ciągu 24 godzin w dni robocze." : uk ? "Наша команда відповідає на електронні листи протягом 24 годин у робочі дні." : "Our team responds to emails within 24 hours on business days."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${language}/contact`}>
                <Button size="lg" variant="secondary">
                  <Mail className="h-4 w-4 mr-2" />
                  {pl ? "Napisz do nas" : uk ? "Написати нам" : "Contact Us"}
                </Button>
              </Link>
              <Link href={`/${language}/faq`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  {pl ? "Sprawdź FAQ" : uk ? "Перевірити FAQ" : "Check FAQ"}
                  <ArrowRight className="h-4 w-4 ml-2" />
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
