"use client";
export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BookOpen,
  GraduationCap,
  Heart,
  Users,
  Star,
  CheckCircle2,
  Globe,
  Lightbulb,
  Music,
  Palette,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ONasPage() {
  const { t, language } = useLanguage();

  const achievements = [
    { icon: GraduationCap, value: "15+", label: language === 'pl' ? "lat doświadczenia" : language === 'uk' ? "років досвіду" : "years of experience" },
    { icon: BookOpen, value: "200+", label: language === 'pl' ? "materiałów" : language === 'uk' ? "матеріалів" : "materials" },
    { icon: Users, value: "12 000+", label: language === 'pl' ? "nauczycieli" : language === 'uk' ? "вчителів" : "teachers" },
    { icon: Award, value: "50+", label: language === 'pl' ? "szkoleń" : language === 'uk' ? "тренінгів" : "trainings" },
  ];

  const values = [
    {
      icon: Heart,
      title: language === 'pl' ? "Pasja do nauczania" : language === 'uk' ? "Пристрасть до навчання" : "Passion for Teaching",
      desc: language === 'pl' ? "Każdy materiał tworzę z myślą o prawdziwych uczniach i ich potrzebach. Nauka powinna być radością, nie obowiązkiem." : language === 'uk' ? "Кожен матеріал я створюю з думкою про реальних учнів та їхні потреби. Навчання має бути радістю, а не обов'язком." : "Every material is created with real students and their needs in mind. Learning should be a joy, not a chore.",
    },
    {
      icon: CheckCircle2,
      title: language === 'pl' ? "Sprawdzone w praktyce" : language === 'uk' ? "Перевірено на практиці" : "Classroom-Tested",
      desc: language === 'pl' ? "Wszystkie materiały testowałam w swojej klasie zanim trafiły do sprzedaży. Wiem, że działają, bo sama ich używam." : language === 'uk' ? "Всі матеріали я тестувала у своєму класі перед продажем. Я знаю, що вони працюють, бо сама їх використовую." : "All materials were tested in my own classroom before going on sale. I know they work because I use them myself.",
    },
    {
      icon: Lightbulb,
      title: language === 'pl' ? "Kreatywność i innowacja" : language === 'uk' ? "Творчість та інновації" : "Creativity & Innovation",
      desc: language === 'pl' ? "Stale szukam nowych metod i podejść. Moje materiały łączą sprawdzoną pedagogikę z nowoczesnymi technikami nauczania." : language === 'uk' ? "Я постійно шукаю нові методи та підходи. Мої матеріали поєднують перевірену педагогіку з сучасними техніками навчання." : "I constantly seek new methods and approaches. My materials combine proven pedagogy with modern teaching techniques.",
    },
    {
      icon: Globe,
      title: language === 'pl' ? "Dostępność dla wszystkich" : language === 'uk' ? "Доступність для всіх" : "Accessible to All",
      desc: language === 'pl' ? "Tworzę materiały dla nauczycieli na każdym etapie kariery — od stażystów po doświadczonych pedagogów." : language === 'uk' ? "Я створюю матеріали для вчителів на кожному етапі кар'єри — від стажистів до досвідчених педагогів." : "I create materials for teachers at every stage of their career — from beginners to experienced educators.",
    },
  ];

  const timeline = [
    { year: "2008", event: language === 'pl' ? "Pierwsza praca jako nauczycielka j. angielskiego w przedszkolu" : language === 'uk' ? "Перша робота вчителькою англійської в дитячому садку" : "First job as an English teacher in a preschool" },
    { year: "2012", event: language === 'pl' ? "Pierwsze autorskie materiały dydaktyczne — Speakbook" : language === 'uk' ? "Перші авторські дидактичні матеріали — Speakbook" : "First original teaching materials — Speakbook" },
    { year: "2015", event: language === 'pl' ? "Uruchomienie platformy sprzedażowej i pierwsze 1000 sprzedanych pakietów" : language === 'uk' ? "Запуск торгової платформи та перші 1000 проданих пакетів" : "Launch of sales platform and first 1,000 packages sold" },
    { year: "2018", event: language === 'pl' ? "Przekroczenie 5000 nauczycieli w społeczności" : language === 'uk' ? "Перевищення 5000 вчителів у спільноті" : "Surpassing 5,000 teachers in the community" },
    { year: "2021", event: language === 'pl' ? "Uruchomienie platformy konkursowej Linguś i MatMiś" : language === 'uk' ? "Запуск конкурсної платформи Linguś та MatMiś" : "Launch of Linguś and MatMiś competition platforms" },
    { year: "2024", event: language === 'pl' ? "Ponad 12 000 nauczycieli i 200+ materiałów w katalogu" : language === 'uk' ? "Понад 12 000 вчителів та 200+ матеріалів у каталозі" : "Over 12,000 teachers and 200+ materials in the catalog" },
  ];

  const specializations = [
    language === 'pl' ? "Nauczanie dzieci 3-10 lat" : language === 'uk' ? "Навчання дітей 3-10 років" : "Teaching children aged 3-10",
    language === 'pl' ? "Metody aktywizujące" : language === 'uk' ? "Активізуючі методи" : "Active learning methods",
    language === 'pl' ? "Teatr i drama w edukacji" : language === 'uk' ? "Театр і драма в освіті" : "Theater and drama in education",
    language === 'pl' ? "Gry i zabawy językowe" : language === 'uk' ? "Мовні ігри та розваги" : "Language games and activities",
    language === 'pl' ? "Materiały sensoryczne" : language === 'uk' ? "Сенсорні матеріали" : "Sensory materials",
    language === 'pl' ? "Flashcardy i pomoce wizualne" : language === 'uk' ? "Флеш-картки та візуальні засоби" : "Flashcards and visual aids",
    language === 'pl' ? "Piosenki i rymowanki" : language === 'uk' ? "Пісні та вірші" : "Songs and rhymes",
    language === 'pl' ? "Projekty interdyscyplinarne" : language === 'uk' ? "Міждисциплінарні проекти" : "Interdisciplinary projects",
  ];

  const title = language === 'pl' ? "O nas" : language === 'uk' ? "Про нас" : "About Us";
  const subtitle = language === 'pl' ? "Poznaj historię Kamili Łobko-Koziej i misję, która stoi za każdym materiałem" : language === 'uk' ? "Дізнайтесь про історію Каміли Лобко-Козей та місію, що стоїть за кожним матеріалом" : "Discover the story of Kamila Łobko-Koziej and the mission behind every material";
  const shopCta = language === 'pl' ? "Przeglądaj materiały" : language === 'uk' ? "Переглянути матеріали" : "Browse Materials";
  const contactCta = language === 'pl' ? "Napisz do mnie" : language === 'uk' ? "Напишіть мені" : "Contact Me";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 lg:py-28">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Image */}
              <div className="relative mx-auto max-w-md lg:mx-0 order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -bottom-6 -right-6 h-full w-full rounded-3xl bg-indigo-100" />
                  <div className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl bg-purple-100" />
                  <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl">
                    <Image
                      src="/kamila-lobko-koziej.jpg"
                      alt="Kamila Łobko-Koziej"
                      width={500}
                      height={500}
                      className="aspect-square object-cover object-top"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 shadow-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                      <Heart className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {language === 'pl' ? "Tworzone z pasją" : language === 'uk' ? "Створено з пристрастю" : "Made with passion"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'pl' ? "dla nauczycieli" : language === 'uk' ? "для вчителів" : "for teachers"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <Badge variant="outline" className="mb-4 border-indigo-200 text-indigo-600 bg-indigo-50">
                  <Award className="h-3 w-3 mr-1" />
                  {language === 'pl' ? "Autorka materiałów edukacyjnych" : language === 'uk' ? "Авторка навчальних матеріалів" : "Author of Educational Materials"}
                </Badge>
                <h1 className="font-serif text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-5xl pb-1 mb-6">
                  Kamila Łobko-Koziej
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  {language === 'pl'
                    ? "Jestem nauczycielką języka angielskiego z ponad 15-letnim doświadczeniem w pracy z dziećmi w wieku przedszkolnym i wczesnoszkolnym. Moja pasja do nauczania i ciągłe poszukiwanie kreatywnych metod dydaktycznych zainspirowały mnie do tworzenia autorskich materiałów edukacyjnych."
                    : language === 'uk'
                    ? "Я вчителька англійської мови з понад 15-річним досвідом роботи з дітьми дошкільного та молодшого шкільного віку. Моя пристрасть до навчання та постійний пошук творчих дидактичних методів надихнули мене на створення авторських навчальних матеріалів."
                    : "I am an English language teacher with over 15 years of experience working with preschool and early school-age children. My passion for teaching and constant search for creative didactic methods inspired me to create original educational materials."}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                  {language === 'pl'
                    ? "Wierzę, że nauka języka obcego może być fascynującą przygodą dla każdego dziecka. Moje materiały łączą sprawdzone metody pedagogiczne z elementami zabawy, dzięki czemu zajęcia stają się angażujące i efektywne."
                    : language === 'uk'
                    ? "Я вірю, що вивчення іноземної мови може бути захоплюючою пригодою для кожної дитини. Мої матеріали поєднують перевірені педагогічні методи з елементами гри, завдяки чому заняття стають захоплюючими та ефективними."
                    : "I believe that learning a foreign language can be a fascinating adventure for every child. My materials combine proven pedagogical methods with elements of play, making lessons engaging and effective."}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
                  {achievements.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-background p-4 text-center hover:border-indigo-200 hover:shadow-md transition-all">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                        <item.icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <p className="font-serif text-2xl font-bold text-foreground">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href={`/${language}/products`}>
                    <Button size="lg" className="w-full sm:w-auto">{shopCta}</Button>
                  </Link>
                  <Link href={`/${language}/contact`}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">{contactCta}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-1 mb-4">
                {language === 'pl' ? "Moje wartości" : language === 'uk' ? "Мої цінності" : "My Values"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {language === 'pl' ? "Każdy materiał, który tworzę, oparty jest na tych fundamentach" : language === 'uk' ? "Кожен матеріал, який я створюю, базується на цих основах" : "Every material I create is built on these foundations"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4 p-6 rounded-2xl border border-border hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    <value.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-1 mb-4">
                {language === 'pl' ? "Specjalizacje" : language === 'uk' ? "Спеціалізації" : "Specializations"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
              {specializations.map((spec) => (
                <Badge key={spec} variant="secondary" className="text-sm py-2 px-4 bg-white border border-indigo-100 text-indigo-700">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-1 mb-4">
                {language === 'pl' ? "Historia" : language === 'uk' ? "Історія" : "History"}
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-100" />
              <div className="space-y-8">
                {timeline.map((item) => (
                  <div key={item.year} className="flex gap-6 items-start">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-lg z-10">
                      {item.year}
                    </div>
                    <div className="flex-1 pt-3">
                      <p className="text-foreground leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">
              {language === 'pl' ? "Gotowa, żeby Ci pomóc?" : language === 'uk' ? "Готова допомогти вам?" : "Ready to Help You?"}
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              {language === 'pl' ? "Przeglądaj ponad 200 materiałów edukacyjnych lub napisz do mnie bezpośrednio." : language === 'uk' ? "Перегляньте понад 200 навчальних матеріалів або напишіть мені безпосередньо." : "Browse over 200 educational materials or write to me directly."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${language}/products`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {shopCta}
                </Button>
              </Link>
              <Link href={`/${language}/contact`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-indigo-600">
                  {contactCta}
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
