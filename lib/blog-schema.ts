// Blog post schema and types

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    category: string;
    tags: string[];
    status: 'draft' | 'published';
    readingTime?: number; // minutes
    seo: {
        metaTitle: string;
        metaDescription: string;
        ogImage: string;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
}

export interface BlogFormData {
    title: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    category: string;
    tags: string[];
    status: 'draft' | 'published';
    metaTitle: string;
    metaDescription: string;
}

// Blog categories
export const BLOG_CATEGORIES = [
    { value: "metodyka", label: "Metodyka nauczania" },
    { value: "materialy", label: "Materiały dydaktyczne" },
    { value: "technologia", label: "Technologia w edukacji" },
    { value: "inspiracje", label: "Inspiracje i pomysły" },
    { value: "recenzje", label: "Recenzje" },
    { value: "wydarzenia", label: "Wydarzenia" },
    { value: "inne", label: "Inne" },
] as const;

// Generate slug from title
export function generateBlogSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Generate unique ID
export function generateBlogId(): string {
    return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Estimate reading time from HTML content
export function estimateReadingTime(content: string): number {
    const text = content.replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

// Sample blog posts for demo
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
    {
        id: "post_wellbeing",
        title: "Nauczyciel w harmonii: Jak zadbać o siebie w intensywnym roku szkolnym?",
        slug: "nauczyciel-w-harmonii-dobrostan",
        content: `<h2>Znaczenie dobrostanu</h2>
<p>Dobrostan nauczyciela to nie luksus, to konieczność. Tylko wypoczęty i zrównoważony nauczyciel może skutecznie inspirować swoich uczniów. W dzisiejszym szybko zmieniającym się świecie edukacji, dbanie o własne zdrowie psychiczne staje się fundamentem efektywnej pracy z dziećmi.</p>
<h2>5 kroków do lepszego samopoczucia</h2>
<ul>
    <li><strong>Wyznacz wyraźne granice</strong> między pracą a domem. Pamiętaj, że odpoczynek to część Twojej pracy, a nie ucieczka od niej.</li>
    <li><strong>Celebruj małe sukcesy</strong> swoich uczniów. Każdy uśmiech dziecka czy poprawnie wypowiedziane zdanie to dowód na to, że Twoja praca ma sens.</li>
    <li><strong>Znajdź czas na hobby</strong> niezwiązane z edukacją. Może to być sport, gotowanie czy ogrodnictwo – cokolwiek, co pozwala Ci oderwać myśli od szkolnych wyzwań.</li>
    <li><strong>Dbaj o regularny sen</strong> i aktywność fizyczną. Twój umysł potrzebuje tlenu i regeneracji, by pracować na najwyższych obrotach.</li>
    <li><strong>Buduj wspierającą sieć relacji</strong> z innymi nauczycielami. Współdzielenie doświadczeń i wzajemne wsparcie potrafią zdziałać cuda w trudniejszych momentach.</li>
</ul>
<h2>Techniki mindfulness dla nauczycieli</h2>
<p>Coraz więcej szkół wprowadza praktyki mindfulness nie tylko dla uczniów, ale i dla kadry pedagogicznej. Nawet 5 minut świadomego oddechu przed lekcją może diametralnie zmienić Twoją energię i nastawienie.</p>
<blockquote><p>„Nie możesz wylać z pustego kubka. Zadbaj o siebie, by móc dawać innym." — popularne powiedzenie wśród coachów edukacyjnych</p></blockquote>
<h2>Kiedy szukać pomocy?</h2>
<p>Wypalenie zawodowe to realne zjawisko dotykające nawet 40% nauczycieli. Jeśli czujesz chroniczne zmęczenie, cynizm wobec pracy lub brak satysfakcji z sukcesów uczniów — to sygnał, by porozmawiać ze specjalistą. Nie ma w tym nic wstydliwego. To akt odwagi i troski o siebie i swoich uczniów.</p>
<p>Pamiętaj, że jesteś dla swoich uczniów wzorem. Pokazując im, jak dbasz o siebie, uczysz ich jednej z najważniejszych lekcji w życiu: szacunku do własnych potrzeb i zdrowia.</p>`,
        excerpt: "Praktyczne wskazówki dla nauczycieli, jak unikać wypalenia zawodowego i czerpać radość z nauczania każdego dnia. Odkryj moc balansu.",
        featuredImage: "/teacher_wellbeing_1770205785997.png",
        author: "Kamila Łobko-Koziej",
        category: "inspiracje",
        tags: ["dobrostan", "nauczyciel", "psychologia", "balans"],
        readingTime: 5,
        status: "published",
        seo: {
            metaTitle: "Dobrostan nauczyciela - jak o niego zadbać? | Nasz Blog",
            metaDescription: "Dowiedz się jak dbać o swoje zdrowie psychiczne i fizyczne będąc nauczycielem. Sprawdzone metody Kamili Łobko-Koziej.",
            ogImage: "/teacher_wellbeing_1770205785997.png",
        },
        createdAt: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_discipline",
        title: "Cierpliwość czy system? Skuteczne metody pracy z trudnymi grupami.",
        slug: "dyscyplina-w-klasie-skuteczne-metody",
        content: `<h2>Dyscyplina oparta na relacji</h2>
<p>Kluczem do spokoju w klasie nie jest surowość, lecz konsekwencja i zrozumienie potrzeb uczniów. Kiedy uczeń czuje się zauważony i szanowany, jego naturalna skłonność do współpracy wzrasta.</p>
<h2>Techniki zarządzania klasą</h2>
<p>Wprowadzenie jasnych zasad na początku roku to podstawa. Ważne jest jednak, aby te zasady były współtworzone z uczniami – daje im to poczucie sprawstwa i odpowiedzialności za atmosferę w grupie.</p>
<h3>Metoda pozytywnej dyscypliny</h3>
<p>Skoncentruj się na rozwiązaniach, a nie na karach. Pytaj uczniów: <em>„Co możemy zrobić, aby następnym razem ta sytuacja się nie powtórzyła?"</em>, zamiast szukać winnego. To buduje kompetencje społeczne i uczy rozwiązywania konfliktów w sposób konstruktywny.</p>
<h2>Sygnały ostrzegawcze i profilaktyka</h2>
<p>Zanim sytuacja wymknie się spod kontroli, warto reagować na wczesne sygnały: rosnące napięcie w grupie, konflikty między uczniami czy narastające rozproszenie uwagi. Regularne rozmowy jeden na jeden z uczniami, którzy sprawiają trudności, mogą zdziałać cuda.</p>
<h2>Kiedy nic nie działa</h2>
<p>Czasem mimo najlepszych starań potrzebna jest pomoc pedagoga szkolnego lub psychologa. Nie traktuj tego jako porażkę — to profesjonalizm i troska o dobro ucznia. Budowanie sieci wsparcia wokół trudnego ucznia to najskuteczniejsza strategia długoterminowa.</p>`,
        excerpt: "Jak radzić sobie z wyzwaniami wychowawczymi w klasie? Poznaj systemowe podejście do dyscypliny oparte na szacunku i relacjach.",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["dyscyplina", "zarządzanie klasą", "pedagogika", "relacje"],
        readingTime: 6,
        status: "published",
        seo: {
            metaTitle: "Dyscyplina i zarządzanie klasą - Skuteczne Metody | Nasz Blog",
            metaDescription: "Skuteczne metody na trudne grupy. Dowiedz się jak budować autorytet oparty na szacunku i konsekwencji.",
            ogImage: "/classroom_discipline_1770205801695.png",
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_kids",
        title: "Angielski dla przedszkolaka: Ruch, muzyka i zabawa.",
        slug: "angielski-dla-dzieci-przedszkole",
        content: `<h2>Nauka przez zabawę</h2>
<p>Dzieci w wieku przedszkolnym uczą się całym ciałem. Metoda TPR (Total Physical Response) jest tutaj niezastąpiona. Dzięki niej słówka i frazy są kodowane nie tylko w pamięci werbalnej, ale i motorycznej.</p>
<h2>Wykorzystanie piosenek i rymowanek</h2>
<p>Muzyka pomaga w zapamiętywaniu całych fraz i struktur językowych bez wysiłku. Rytm i melodia działają jak kotwice, które pozwalają dziecku wrócić do poznanego materiału nawet po długim czasie.</p>
<h3>Gry ruchowe w nauczaniu</h3>
<p>Nigdy nie lekceważ mocy zwykłej piłki czy gry w berka. Zamień nudne powtarzanie w ekscytującą zabawę. <em>Simon Says</em> czy <em>What's the time, Mr. Wolf?</em> to klasyki, które wciąż działają magicznie, angażując każde dziecko w grupie.</p>
<h2>Materiały wizualne i manipulacyjne</h2>
<p>Karty obrazkowe, kukiełki, kolorowe kostki — to wszystko sprawia, że język staje się namacalny. Dzieci w wieku 3–6 lat myślą konkretnie, więc im więcej zmysłów zaangażujesz, tym trwalsze będzie zapamiętanie.</p>
<h2>Jak planować 30-minutową lekcję dla maluchów?</h2>
<ul>
    <li><strong>0–5 min:</strong> Powitanie i piosenka na dobry start (np. Hello Song)</li>
    <li><strong>5–12 min:</strong> Wprowadzenie nowego słownictwa z kartami obrazkowymi</li>
    <li><strong>12–20 min:</strong> Gra ruchowa utrwalająca materiał</li>
    <li><strong>20–27 min:</strong> Mini-projekt plastyczny lub praca z kartą pracy</li>
    <li><strong>27–30 min:</strong> Piosenka na pożegnanie i podsumowanie</li>
</ul>`,
        excerpt: "Jak sprawić, by najmłodsi naturalnie przyswajali język angielski? Odkryj moc zabawy, muzyki i ruchu w nauczaniu przedszkolnym.",
        featuredImage: "/teaching_kids_english_1770205820508.png",
        author: "Kamila Łobko-Koziej",
        category: "materialy",
        tags: ["dzieci", "przedszkole", "zabawa", "TPR"],
        readingTime: 7,
        status: "published",
        seo: {
            metaTitle: "Nauczanie angielskiego w przedszkolu - Gry i Zabawy | Nasz Blog",
            metaDescription: "Inspiracje i pomysły na lekcje angielskiego dla najmłodszych. Gry, piosenki i zabawy ruchowe od Kamili Łobko-Koziej.",
            ogImage: "/teaching_kids_english_1770205820508.png",
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_teens",
        title: "Jak zaangażować nastolatki? Projekty i autentyczna komunikacja.",
        slug: "angielski-dla-nastolatkow-projekty",
        content: `<h2>Wyzwanie: Motywacja u nastolatków</h2>
<p>Nastolatki potrzebują widzieć sens w tym, czego się uczą. Autentyczne materiały (vlogi, piosenki, artykuły z prasy) są kluczem do ich zaangażowania. Nie ucz ich gramatyki dla samej gramatyki – pokaż im, jak mogą jej użyć, by wyrazić siebie.</p>
<h2>Metoda projektowa w akcji</h2>
<p>Pozwól uczniom tworzyć: podcasty, kampanie społeczne czy mini-projekty biznesowe. To buduje ich pewność siebie w używaniu języka i pozwala poczuć, że język angielski to narzędzie, a nie tylko przedmiot szkolny.</p>
<h3>Komunikacja ponad wszystko</h3>
<p>Stwarzaj sytuacje, w których komunikacja jest naturalna. Debaty na kontrowersyjne tematy (dostosowane do wieku), odgrywanie ról z życia codziennego czy wspólne rozwiązywanie problemów sprawiają, że bariera językowa znika.</p>
<h2>Przykładowe projekty dla grup 13–17 lat</h2>
<ul>
    <li><strong>Podcast klasowy:</strong> Uczniowie nagrywają odcinki o swoich pasjach po angielsku</li>
    <li><strong>Kampania społeczna:</strong> Plakaty, posty i przemówienie na temat ważny dla nich</li>
    <li><strong>Mock interview:</strong> Symulacja rozmowy kwalifikacyjnej po angielsku</li>
    <li><strong>Book club:</strong> Czytanie i dyskutowanie o anglojęzycznych komiksach lub YA fiction</li>
</ul>
<h2>Jak oceniać projekty?</h2>
<p>Oceniaj komunikatywność, nie perfekcję. Nastolatek, który mówi z błędami, ale pewnie i zrozumiale, robi większy postęp niż ten, który milczy ze strachu przed pomyłką. Twórz środowisko, w którym błąd jest częścią procesu, a nie powodem do wstydu.</p>`,
        excerpt: "Praktyczne sposoby na budowanie zaangażowania w grupach 13+. Dowiedz się, dlaczego projekty i autentyczność działają lepiej niż podręcznik.",
        featuredImage: "/teen_english_class_1770206330732.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["nastolatki", "projekty", "komunikacja", "motywacja"],
        readingTime: 8,
        status: "published",
        seo: {
            metaTitle: "Nauczanie nastolatków - Metody i Inspiracje | Nasz Blog",
            metaDescription: "Jak uczyć angielskiego młodzież? Sprawdź skuteczne techniki angażowania nastolatków poprzez projekty i komunikację.",
            ogImage: "/teen_english_class_1770206330732.png",
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_ai",
        title: "Jak wykorzystać AI w nauce języków obcych?",
        slug: "ai-w-nauce-jezykow",
        content: `<h2>Era sztucznej inteligencji w edukacji</h2>
<p>Sztuczna inteligencja rewolucjonizuje sposób, w jaki uczymy i uczymy się języków. To nie jest zagrożenie, lecz potężne narzędzie, które może odciążyć nauczyciela od żmudnych zadań i dać uczniom dostęp do spersonalizowanego wsparcia 24/7.</p>
<h2>ChatGPT jako asystent nauczyciela</h2>
<p>Możesz używać ChatGPT do generowania dialogów na dowolny temat, tworzenia spersonalizowanych ćwiczeń gramatycznych w kilka sekund czy pisania scenariuszy konwersacyjnych dostosowanych do poziomu Twojej grupy.</p>
<h3>Praktyczne zastosowania AI w klasie</h3>
<ul>
    <li><strong>Generowanie ćwiczeń:</strong> „Stwórz 10 zdań z lukami do uzupełnienia na poziomie B1 na temat podróży"</li>
    <li><strong>Korekta tekstów:</strong> Uczniowie wklejają swoje wypracowania, AI daje feedback</li>
    <li><strong>Scenariusze konwersacyjne:</strong> AI odgrywa rolę kelnera, lekarza czy pracodawcy</li>
    <li><strong>Tłumaczenie i wyjaśnienia:</strong> Natychmiastowe wyjaśnienie trudnych słów w kontekście</li>
</ul>
<h2>AI dla uczniów</h2>
<p>Zachęcaj uczniów do używania AI jako partnera do rozmowy lub narzędzia do korekty tekstów. Dzięki temu mogą ćwiczyć język również poza salą lekcyjną, otrzymując natychmiastową informację zwrotną.</p>
<h2>Granice i etyka</h2>
<p>Ważne jest, by uczniowie rozumieli, że AI to narzędzie wspomagające, a nie zastępujące myślenie. Ucz ich weryfikowania informacji i krytycznego podejścia do odpowiedzi generowanych przez AI. To cenna kompetencja na resztę życia.</p>`,
        excerpt: "Dowiedz się, jak wykorzystać sztuczną inteligencję w nauczaniu języków obcych. Praktyczny przewodnik z konkretnymi przykładami.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "technologia",
        tags: ["AI", "technologia", "innowacje", "ChatGPT"],
        readingTime: 7,
        status: "published",
        seo: {
            metaTitle: "AI w nauce języków obcych - Przewodnik | Nasz Blog",
            metaDescription: "Jak wykorzystać sztuczną inteligencję w nauczaniu angielskiego? Praktyczny przewodnik dla nauczycieli od Kamili English.",
            ogImage: "/ai_education_1770206350000.png",
        },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // --- NEW POSTS ---
    {
        id: "post_gamification",
        title: "Grywalizacja w klasie: Jak zamienić lekcję w przygodę?",
        slug: "grywalizacja-w-klasie-lekcja-jako-gra",
        content: `<h2>Czym jest grywalizacja?</h2>
<p>Grywalizacja (ang. <em>gamification</em>) to zastosowanie mechanizmów znanych z gier — punktów, poziomów, odznak, rankingów — w kontekście edukacyjnym. Nie chodzi o to, by lekcja była grą, ale by miała elementy, które sprawiają, że uczniowie chcą się angażować i rozwijać.</p>
<h2>Dlaczego to działa?</h2>
<p>Mózg ludzki uwielbia nagrody. Dopamina wydzielana przy zdobyciu punktu czy awansie na wyższy poziom jest tym samym neuroprzekaźnikiem, który odpowiada za motywację i zapamiętywanie. Grywalizacja po prostu <strong>wykorzystuje biologię</strong> na korzyść nauki.</p>
<h2>Proste sposoby na wdrożenie grywalizacji</h2>
<ul>
    <li><strong>System punktów:</strong> Za aktywność, poprawne odpowiedzi, pomoc koleżance — każdy gest ma wartość</li>
    <li><strong>Odznaki:</strong> „Mistrz gramatyki", „Śmiałek konwersacji", „Pomocna dłoń" — uczniowie zbierają je przez cały rok</li>
    <li><strong>Misje tygodniowe:</strong> „Użyj 5 nowych słówek w rozmowie" — krótkie, mierzalne wyzwania</li>
    <li><strong>Tablica wyników:</strong> Nie musi być rywalizacyjna — może pokazywać postęp każdego ucznia względem siebie samego</li>
    <li><strong>Poziomy trudności:</strong> Uczniowie sami wybierają poziom zadania — łatwy, średni, trudny — i zdobywają odpowiednio więcej punktów</li>
</ul>
<h2>Narzędzia cyfrowe</h2>
<p>Platformy takie jak Kahoot!, Quizlet Live, Gimkit czy Blooket pozwalają w kilka minut stworzyć angażujące quizy i gry językowe. Wiele z nich jest bezpłatnych w wersji podstawowej i działa świetnie zarówno w klasie, jak i zdalnie.</p>
<h2>Pułapki grywalizacji</h2>
<p>Uważaj na nadmierną rywalizację — może ona demotywować słabszych uczniów. Najlepsze systemy grywalizacyjne nagradzają <strong>postęp i wysiłek</strong>, a nie tylko wyniki. Zadbaj o to, by każdy uczeń miał szansę na sukces.</p>`,
        excerpt: "Odkryj, jak mechanizmy gier mogą transformować zaangażowanie uczniów. Praktyczny przewodnik po grywalizacji w nauczaniu języka angielskiego.",
        featuredImage: "/teacher_wellbeing_1770205785997.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["grywalizacja", "gamification", "motywacja", "narzędzia"],
        readingTime: 8,
        status: "published",
        seo: {
            metaTitle: "Grywalizacja w klasie - Jak wdrożyć? | Kamila English Blog",
            metaDescription: "Grywalizacja w nauczaniu angielskiego — praktyczne metody, narzędzia i przykłady. Zamień lekcję w ekscytującą przygodę.",
            ogImage: "/teacher_wellbeing_1770205785997.png",
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_reading",
        title: "Czytanie po angielsku: Od bajek do powieści — jak budować nawyk?",
        slug: "czytanie-po-angielsku-jak-budowac-nawyk",
        content: `<h2>Dlaczego czytanie jest kluczowe?</h2>
<p>Badania językoznawcze jednoznacznie potwierdzają: osoby, które dużo czytają w języku obcym, osiągają wyższy poziom biegłości szybciej niż te, które polegają wyłącznie na ćwiczeniach gramatycznych. Czytanie buduje słownictwo, wyczucie stylu i intuicję językową w sposób, którego żaden podręcznik nie zastąpi.</p>
<h2>Jak zacząć — dobór materiałów</h2>
<p>Kluczem jest zasada <strong>i+1</strong> (Stephen Krashen): materiał powinien być nieznacznie powyżej aktualnego poziomu ucznia. Zbyt łatwy nie rozwija, zbyt trudny zniechęca.</p>
<h3>Rekomendacje według poziomu</h3>
<ul>
    <li><strong>A1–A2:</strong> Graded readers (np. Oxford Bookworms Stage 1–2), komiksy Peppa Pig, proste bajki</li>
    <li><strong>B1–B2:</strong> Graded readers Stage 3–5, powieści YA (np. Diary of a Wimpy Kid, Percy Jackson), artykuły z Newsela</li>
    <li><strong>C1–C2:</strong> Oryginalne powieści (Harry Potter, The Hunger Games), artykuły z The Guardian, eseje</li>
</ul>
<h2>Techniki aktywnego czytania</h2>
<p>Samo czytanie to za mało — warto wdrożyć techniki, które pogłębiają rozumienie:</p>
<ul>
    <li><strong>Vocabulary journal:</strong> Zapisywanie nowych słów z kontekstem (nie tylko tłumaczenia)</li>
    <li><strong>Reading aloud:</strong> Głośne czytanie poprawia wymowę i rytm języka</li>
    <li><strong>Retelling:</strong> Opowiadanie przeczytanego fragmentu własnymi słowami</li>
    <li><strong>Book club:</strong> Dyskusja o przeczytanej książce w grupie</li>
</ul>
<h2>Budowanie nawyku — 15 minut dziennie</h2>
<p>Zachęcaj uczniów do czytania codziennie przez 15 minut — to wystarczy, by w ciągu roku przeczytać kilka książek. Połącz to z aplikacją do śledzenia postępów (np. Goodreads) i obserwuj, jak motywacja rośnie.</p>`,
        excerpt: "Jak zachęcić uczniów do regularnego czytania po angielsku? Dobór materiałów, techniki aktywnego czytania i budowanie trwałego nawyku.",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "materialy",
        tags: ["czytanie", "reading", "słownictwo", "nawyk"],
        readingTime: 9,
        status: "published",
        seo: {
            metaTitle: "Czytanie po angielsku - Jak budować nawyk? | Kamila English Blog",
            metaDescription: "Praktyczny przewodnik po budowaniu nawyku czytania w języku angielskim. Dobór materiałów, techniki i motywacja dla każdego poziomu.",
            ogImage: "/classroom_discipline_1770205801695.png",
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_speaking",
        title: "Mówienie bez strachu: Jak pokonać barierę komunikacyjną?",
        slug: "mowienie-po-angielsku-bariera-komunikacyjna",
        content: `<h2>Skąd bierze się bariera językowa?</h2>
<p>Strach przed mówieniem w języku obcym to jeden z najczęstszych problemów, z jakimi borykają się uczniowie na każdym poziomie. Jego źródłem jest zazwyczaj lęk przed oceną, perfekcjonizm i brak okazji do praktyki w bezpiecznym środowisku.</p>
<h2>Środowisko bezpieczne do mówienia</h2>
<p>Pierwszym krokiem jest stworzenie atmosfery, w której błąd jest naturalną częścią procesu uczenia się. Reaguj na błędy z ciekawością, a nie krytyką. Zamiast poprawiać natychmiast, notuj błędy i omawiaj je zbiorowo po zakończeniu aktywności.</p>
<h2>Techniki przełamywania bariery</h2>
<h3>1. Mówienie do siebie (self-talk)</h3>
<p>Zachęcaj uczniów do komentowania swoich codziennych czynności po angielsku — w myślach lub na głos. To buduje płynność bez presji publicznej oceny.</p>
<h3>2. Shadowing</h3>
<p>Naśladowanie native speakerów — powtarzanie za filmem, podcastem czy piosenką — to jedna z najskuteczniejszych metod poprawy wymowy i naturalności języka.</p>
<h3>3. Konwersacje z AI</h3>
<p>Chatboty takie jak ChatGPT czy Duolingo Max oferują bezpieczne środowisko do ćwiczenia rozmów bez strachu przed oceną. Idealne dla nieśmiałych uczniów.</p>
<h3>4. Fluency activities</h3>
<p>Ćwiczenia skupione wyłącznie na płynności (nie poprawności): 2-minutowe monologi na losowy temat, speed dating konwersacyjne, debaty z losowo przydzielonymi stronami.</p>
<h2>Rola nauczyciela</h2>
<p>Twój entuzjazm i cierpliwość są zaraźliwe. Uczniowie, którzy widzą, że nauczyciel sam nie boi się popełniać błędów i śmieje się z własnych wpadek językowych, szybciej otwierają się na mówienie. Bądź modelem odwagi językowej.</p>`,
        excerpt: "Praktyczne strategie pomagające uczniom przełamać strach przed mówieniem po angielsku. Techniki, ćwiczenia i rola środowiska klasowego.",
        featuredImage: "/teen_english_class_1770206330732.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["mówienie", "speaking", "bariera językowa", "komunikacja"],
        readingTime: 7,
        status: "published",
        seo: {
            metaTitle: "Bariera komunikacyjna - Jak ją pokonać? | Kamila English Blog",
            metaDescription: "Jak pomóc uczniom przełamać strach przed mówieniem po angielsku? Sprawdzone techniki i strategie dla nauczycieli.",
            ogImage: "/teen_english_class_1770206330732.png",
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_lesson_planning",
        title: "Planowanie lekcji w 20 minut: Szablon, który działa.",
        slug: "planowanie-lekcji-angielskiego-szablon",
        content: `<h2>Mit idealnego konspektu</h2>
<p>Wielu nauczycieli spędza godziny na pisaniu rozbudowanych konspektów, które i tak nie są realizowane punkt po punkcie. Tymczasem dobra lekcja potrzebuje struktury, a nie scenariusza filmowego. Oto mój sprawdzony szablon, który pozwala zaplanować efektywną lekcję w 20 minut.</p>
<h2>Struktura PPPPP</h2>
<p>Klasyczna struktura lekcji języka obcego opiera się na 5 fazach:</p>
<ul>
    <li><strong>Presentation (Prezentacja):</strong> Wprowadzenie nowego materiału w kontekście (5–10 min)</li>
    <li><strong>Practice (Ćwiczenie kontrolowane):</strong> Ćwiczenia z dużym wsparciem nauczyciela (10–15 min)</li>
    <li><strong>Production (Produkcja):</strong> Swobodne użycie języka przez uczniów (10–15 min)</li>
</ul>
<h2>Mój 20-minutowy szablon planowania</h2>
<ol>
    <li><strong>Cel lekcji (2 min):</strong> Co uczeń będzie umiał po lekcji? (1 zdanie: „Uczniowie będą umieli opisać swój dzień używając czasu Past Simple")</li>
    <li><strong>Warmer (2 min):</strong> Krótka aktywność rozgrzewkowa nawiązująca do tematu</li>
    <li><strong>Prezentacja (5 min):</strong> Jak wprowadzę nowy materiał? (kontekst, przykłady, CCQ)</li>
    <li><strong>Ćwiczenie (5 min):</strong> Jakie ćwiczenie utrwali materiał?</li>
    <li><strong>Produkcja (5 min):</strong> Jak uczniowie użyją języka samodzielnie?</li>
    <li><strong>Ocena i zadanie domowe (1 min):</strong> Jak sprawdzę, czy cel został osiągnięty?</li>
</ol>
<h2>Gotowe szablony do pobrania</h2>
<p>W naszym sklepie znajdziesz gotowe szablony konspektów dostosowane do różnych grup wiekowych i poziomów. Każdy szablon zawiera wskazówki metodyczne i przykładowe aktywności — wystarczy uzupełnić luki!</p>
<h2>Elastyczność jest kluczem</h2>
<p>Najlepszy plan to taki, który możesz zmodyfikować w locie. Zawsze miej przygotowaną jedną dodatkową aktywność na wypadek, gdy lekcja pójdzie szybciej niż planowałeś, i jedną aktywność, którą możesz skrócić lub pominąć bez straty dla całości.</p>`,
        excerpt: "Efektywne planowanie lekcji nie musi zajmować godzin. Poznaj sprawdzony 20-minutowy szablon, który zapewnia strukturę bez ograniczania kreatywności.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "materialy",
        tags: ["planowanie lekcji", "konspekt", "metodyka", "efektywność"],
        readingTime: 8,
        status: "published",
        seo: {
            metaTitle: "Planowanie lekcji angielskiego - Szablon 20 min | Kamila English Blog",
            metaDescription: "Jak zaplanować efektywną lekcję angielskiego w 20 minut? Sprawdzony szablon i struktura PPPPP dla nauczycieli.",
            ogImage: "/ai_education_1770206350000.png",
        },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_vocabulary",
        title: "Słownictwo bez zakuwania: Metody, które naprawdę działają.",
        slug: "nauka-slownictwa-angielskiego-metody",
        content: `<h2>Problem z tradycyjnym zakuwaniem</h2>
<p>Lista 20 słówek do nauczenia na jutro — znasz to? Uczniowie uczą się ich wieczorem, zdają sprawdzian rano, a tydzień później nie pamiętają połowy. To klasyczny przykład uczenia się krótkoterminowego, które nie przekłada się na rzeczywistą znajomość języka.</p>
<h2>Jak naprawdę działa pamięć?</h2>
<p>Badania nad pamięcią (Hermann Ebbinghaus, krzywa zapominania) pokazują, że bez powtórek zapominamy 70% nowego materiału w ciągu 24 godzin. Klucz to <strong>powtarzanie z odstępami</strong> (spaced repetition) — powtarzanie materiału w rosnących interwałach czasowych.</p>
<h2>Skuteczne metody nauki słownictwa</h2>
<h3>1. Spaced Repetition (SRS)</h3>
<p>Aplikacje takie jak Anki czy Quizlet automatycznie planują powtórki w optymalnych momentach. Zachęcaj uczniów do codziennych 10-minutowych sesji zamiast jednorazowego maratonu przed sprawdzianem.</p>
<h3>2. Słowa w kontekście</h3>
<p>Nigdy nie ucz słów w izolacji. Zawsze wprowadzaj je w zdaniu, historii lub dialogu. Mózg zapamiętuje znaczenie przez skojarzenia, nie przez definicje.</p>
<h3>3. Technika słów kluczowych (keyword method)</h3>
<p>Tworzenie wizualnych skojarzeń między nowym słowem a podobnie brzmiącym słowem w języku ojczystym. Np. <em>butterfly</em> → „masło leci" → motyl. Absurdalne skojarzenia zapamiętujemy najlepiej!</p>
<h3>4. Word mapping</h3>
<p>Tworzenie map myśli wokół jednego słowa: synonimy, antonimy, kolokacje, przykładowe zdania. To buduje sieć skojarzeń, która wzmacnia zapamiętywanie.</p>
<h3>5. Aktywne użycie</h3>
<p>Słowo jest naprawdę zapamiętane dopiero wtedy, gdy zostało użyte kilka razy w różnych kontekstach. Twórz ćwiczenia, które zmuszają uczniów do aktywnego użycia nowych słów, nie tylko ich rozpoznania.</p>
<h2>Ile słów dziennie?</h2>
<p>Badania sugerują, że optymalna liczba nowych słów do nauki dziennie to <strong>5–15</strong>. Mniej, ale regularnie i z powtórkami, daje znacznie lepsze efekty niż jednorazowe przyswajanie dużych list.</p>`,
        excerpt: "Koniec z zakuwaniem list słówek! Poznaj naukowo potwierdzone metody nauki słownictwa, które budują trwałą znajomość języka.",
        featuredImage: "/teaching_kids_english_1770205820508.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["słownictwo", "vocabulary", "pamięć", "spaced repetition"],
        readingTime: 9,
        status: "published",
        seo: {
            metaTitle: "Nauka słownictwa angielskiego - Skuteczne Metody | Kamila English Blog",
            metaDescription: "Jak uczyć słownictwa angielskiego skutecznie? Spaced repetition, kontekst i techniki pamięciowe — przewodnik dla nauczycieli.",
            ogImage: "/teaching_kids_english_1770205820508.png",
        },
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_christmas_lessons",
        title: "Boże Narodzenie po angielsku: 10 gotowych aktywności na grudzień.",
        slug: "bozenaroodzenie-angielski-aktywnosci-grudzien",
        content: `<h2>Magia świąt w klasie językowej</h2>
<p>Grudzień to wyjątkowy czas w roku szkolnym. Uczniowie są zmotywowani, atmosfera jest radosna, a temat świąt Bożego Narodzenia daje ogromne możliwości językowe — od słownictwa tematycznego, przez tradycje kulturowe, po autentyczne materiały (kolędy, filmy, reklamy).</p>
<h2>10 aktywności na lekcje świąteczne</h2>
<ol>
    <li><strong>Christmas Vocabulary Bingo:</strong> Karty bingo ze słownictwem świątecznym — idealne na rozgrzewkę</li>
    <li><strong>Secret Santa w języku angielskim:</strong> Uczniowie losują imię i piszą krótki opis prezentu, który by kupili</li>
    <li><strong>Kolęda jako dyktando:</strong> Słuchanie <em>Jingle Bells</em> i uzupełnianie luk w tekście</li>
    <li><strong>Christmas Around the World:</strong> Prezentacje o tradycjach świątecznych w różnych krajach</li>
    <li><strong>Letter to Santa:</strong> Pisanie listu do Świętego Mikołaja — ćwiczenie pisania formalnego i nieformalnego</li>
    <li><strong>Christmas Movie Trailer:</strong> Oglądanie trailera świątecznego filmu i dyskusja</li>
    <li><strong>Recipe Exchange:</strong> Uczniowie opisują po angielsku ulubiony świąteczny przepis</li>
    <li><strong>Christmas Debate:</strong> „Is Christmas too commercial?" — debata dla starszych grup</li>
    <li><strong>Advent Calendar:</strong> Codzienne mini-ćwiczenie językowe przez cały grudzień</li>
    <li><strong>Christmas Quiz:</strong> Wiedza o tradycjach anglojęzycznych krajów — Wielka Brytania, USA, Australia</li>
</ol>
<h2>Materiały gotowe do użycia</h2>
<p>W naszym sklepie znajdziesz gotowe zestawy materiałów świątecznych — karty pracy, gry, scenariusze lekcji i prezentacje multimedialne. Wszystko zaprojektowane tak, by zaoszczędzić Twój czas i zapewnić uczniom niezapomniane lekcje.</p>
<h2>Wskazówka końcowa</h2>
<p>Pamiętaj o uczniach niechrześcijańskich w swojej grupie. Warto poszerzyć perspektywę o inne zimowe święta: Hanukkah, Kwanzaa, Diwali (jeśli wypada w tym czasie) — to świetna okazja do rozmowy o różnorodności kulturowej.</p>`,
        excerpt: "10 gotowych aktywności na świąteczne lekcje angielskiego w grudniu. Bingo, kolędy, debaty i więcej — dla wszystkich grup wiekowych.",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "materialy",
        tags: ["Boże Narodzenie", "Christmas", "aktywności", "grudzień"],
        readingTime: 6,
        status: "published",
        seo: {
            metaTitle: "Lekcje angielskiego na Boże Narodzenie - 10 Aktywności | Kamila English Blog",
            metaDescription: "Gotowe aktywności i pomysły na świąteczne lekcje angielskiego. Bingo, kolędy, debaty i projekty dla każdego poziomu.",
            ogImage: "/classroom_discipline_1770205801695.png",
        },
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_assessment",
        title: "Ocenianie kształtujące: Jak dawać feedback, który naprawdę pomaga?",
        slug: "ocenianie-ksztaltujace-feedback-angielski",
        content: `<h2>Ocenianie sumujące vs. kształtujące</h2>
<p>Tradycyjne ocenianie (stopień na koniec semestru) mówi uczniowi, <em>gdzie jest</em>. Ocenianie kształtujące (formative assessment) mówi mu, <em>jak tam dotrzeć</em>. To fundamentalna różnica, która zmienia podejście do nauki.</p>
<h2>Zasady skutecznego feedbacku</h2>
<p>Dobry feedback językowy powinien być:</p>
<ul>
    <li><strong>Konkretny:</strong> Nie „dobra robota", ale „świetnie użyłeś czasu Present Perfect w tym zdaniu"</li>
    <li><strong>Ukierunkowany na działanie:</strong> Wskazuje, co konkretnie poprawić i jak</li>
    <li><strong>Terminowy:</strong> Jak najszybciej po wykonaniu zadania</li>
    <li><strong>Proporcjonalny:</strong> Nie poprawiaj wszystkiego naraz — wybierz 2–3 kluczowe obszary</li>
</ul>
<h2>Techniki oceniania kształtującego</h2>
<h3>Exit tickets</h3>
<p>Na koniec lekcji uczniowie odpowiadają na 1–2 pytania sprawdzające zrozumienie. Daje Ci natychmiastową informację, czy cel lekcji został osiągnięty.</p>
<h3>Peer assessment</h3>
<p>Uczniowie oceniają prace kolegów według jasnych kryteriów. Uczy ich myślenia krytycznego i daje im nową perspektywę na własne błędy.</p>
<h3>Self-assessment</h3>
<p>Regularne samooceny (np. „Co umiem po tej lekcji? Co chcę poprawić?") budują metakognycję i odpowiedzialność za własną naukę.</p>
<h3>Traffic light system</h3>
<p>Uczniowie sygnalizują poziom rozumienia kolorami: zielony (rozumiem), żółty (nie jestem pewien), czerwony (potrzebuję pomocy). Prosty, ale niezwykle skuteczny sposób na monitorowanie klasy.</p>
<h2>Feedback pisemny — jak pisać, by uczniowie czytali?</h2>
<p>Badania pokazują, że uczniowie często ignorują pisemny feedback, jeśli obok widnieje stopień. Rozważ oddzielenie feedbacku od oceny — najpierw komentarz, potem (lub wcale) stopień. Zaskakujące, jak bardzo to zmienia zaangażowanie uczniów w czytanie uwag.</p>`,
        excerpt: "Jak dawać feedback językowy, który motywuje i prowadzi do realnej poprawy? Praktyczny przewodnik po ocenianiu kształtującym dla nauczycieli angielskiego.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["ocenianie", "feedback", "assessment", "metodyka"],
        readingTime: 8,
        status: "published",
        seo: {
            metaTitle: "Ocenianie kształtujące w nauczaniu angielskiego | Kamila English Blog",
            metaDescription: "Jak dawać skuteczny feedback językowy? Ocenianie kształtujące, exit tickets, peer assessment — praktyczny przewodnik.",
            ogImage: "/ai_education_1770206350000.png",
        },
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Additional blog posts (articles 14-21)
export const ADDITIONAL_BLOG_POSTS: BlogPost[] = [
    {
        id: "post_differentiation",
        title: "Nauczanie zróżnicowane: Jak dotrzeć do każdego ucznia w klasie?",
        slug: "nauczanie-zroznicowane-kazdy-uczen",
        content: `<h2>Czym jest nauczanie zróżnicowane?</h2>
<p>Nauczanie zróżnicowane (differentiated instruction) to podejście pedagogiczne, które zakłada dostosowanie treści, procesu i produktu do indywidualnych potrzeb każdego ucznia. W klasie językowej oznacza to, że ten sam cel lekcji może być osiągany różnymi ścieżkami — zależnie od poziomu, stylu uczenia się i zainteresowań ucznia.</p>
<h2>Trzy filary różnicowania</h2>
<h3>1. Różnicowanie treści</h3>
<p>Nie wszyscy uczniowie muszą pracować z identycznym materiałem. Możesz przygotować teksty na różnych poziomach trudności, zadania z różną ilością wsparcia (scaffolding) lub materiały nawiązujące do różnych zainteresowań uczniów.</p>
<h3>2. Różnicowanie procesu</h3>
<p>Uczniowie mogą dochodzić do tego samego celu różnymi drogami — jedni przez słuchanie, inni przez czytanie, jeszcze inni przez działanie. Stacje rotacyjne, praca w parach, samodzielna praca z kartami pracy — każda metoda trafia do innych uczniów.</p>
<h3>3. Różnicowanie produktu</h3>
<p>Zamiast jednego testu dla wszystkich, pozwól uczniom wykazać się wiedzą w różny sposób: prezentacja ustna, plakat, nagranie wideo, esej, komiks. Każdy uczeń może pokazać to, co potrafi, w formie, która mu odpowiada.</p>
<h2>Praktyczne strategie dla klasy językowej</h2>
<ul>
    <li><strong>Stacje rotacyjne:</strong> 4 stacje z różnymi aktywnościami (czytanie, słuchanie, pisanie, mówienie) — uczniowie rotują co 10 minut</li>
    <li><strong>Choice boards:</strong> Tablica z 9 zadaniami w układzie 3x3 — uczeń wybiera 3 zadania tworzące linię</li>
    <li><strong>Tiered assignments:</strong> To samo zadanie w 3 wersjach trudności (podstawowa, standardowa, rozszerzona)</li>
    <li><strong>Flexible grouping:</strong> Grupy zmieniają się w zależności od zadania — czasem według poziomu, czasem mieszane</li>
</ul>
<h2>Jak zacząć bez przytłaczania się?</h2>
<p>Nie musisz różnicować wszystkiego od razu. Zacznij od jednego elementu — np. przygotuj dwie wersje karty pracy: podstawową i rozszerzoną. Z każdą lekcją dodawaj jeden nowy element różnicowania. Po miesiącu będziesz mieć bogaty repertuar strategii.</p>`,
        excerpt: "Jak skutecznie dostosować nauczanie do potrzeb każdego ucznia? Praktyczny przewodnik po nauczaniu zróżnicowanym — stacje, choice boards i tiered assignments.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["różnicowanie", "differentiation", "metodyka", "indywidualizacja"],
        readingTime: 9,
        status: "published",
        seo: {
            metaTitle: "Nauczanie zróżnicowane w klasie językowej | Kamila English Blog",
            metaDescription: "Jak dostosować nauczanie do każdego ucznia? Stacje rotacyjne, choice boards, tiered assignments — praktyczny przewodnik.",
            ogImage: "/ai_education_1770206350000.png",
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_vocabulary_games",
        title: "15 gier słownikowych, które uczniowie uwielbiają",
        slug: "gry-slownikowe-uczniowie-uwielbiaja",
        content: `<h2>Dlaczego gry słownikowe działają?</h2>
<p>Nauka słownictwa przez gry angażuje emocje, obniża stres i tworzy skojarzenia, które pomagają zapamiętać nowe słowa. Badania pokazują, że słowa poznane w kontekście zabawy są zapamiętywane nawet 3 razy skuteczniej niż te z listy do wykucia.</p>
<h2>Gry na rozgrzewkę (5 minut)</h2>
<ol>
    <li><strong>Word Association:</strong> Nauczyciel mówi słowo, uczniowie po kolei podają skojarzenia. Kto się zatnie — odpada.</li>
    <li><strong>Alphabet Race:</strong> Uczniowie mają 2 minuty, by napisać słowo na każdą literę alfabetu z danej kategorii.</li>
    <li><strong>Hot Seat:</strong> Jeden uczeń siedzi tyłem do tablicy, reszta opisuje słowo bez jego wymówienia.</li>
</ol>
<h2>Gry na utrwalenie (10-15 minut)</h2>
<ol start="4">
    <li><strong>Kahoot/Quizlet Live:</strong> Klasyczne, ale zawsze działają. Rywalizacja motywuje nawet najsłabszych uczniów.</li>
    <li><strong>Taboo:</strong> Opisz słowo bez użycia 5 zakazanych wyrazów. Doskonałe ćwiczenie parafrazowania.</li>
    <li><strong>Pictionary:</strong> Rysowanie słów — świetne dla uczniów wizualnych i kinetycznych.</li>
    <li><strong>Bingo słownikowe:</strong> Uczniowie wypełniają kartę słowami z lekcji, nauczyciel czyta definicje.</li>
    <li><strong>Word Auction:</strong> Uczniowie "kupują" słowa za wirtualne pieniądze, tworząc zdania. Wygrywa najdłuższe poprawne zdanie.</li>
</ol>
<h2>Gry na głębsze przetwarzanie (20+ minut)</h2>
<ol start="9">
    <li><strong>Word Map:</strong> Uczniowie tworzą mapy myśli dla kluczowych słów — synonimy, antonimy, przykłady, definicja.</li>
    <li><strong>Story Chain:</strong> Każdy uczeń dodaje zdanie do historii, używając wylosowanego słowa.</li>
    <li><strong>Vocabulary Debate:</strong> Uczniowie losują słowa i muszą ich użyć podczas debaty na zadany temat.</li>
    <li><strong>Crossword Creator:</strong> Uczniowie sami tworzą krzyżówki dla kolegów — wymaga głębokiego zrozumienia słów.</li>
    <li><strong>Vocabulary Relay:</strong> Drużyny przekazują "pałeczkę" — każdy musi użyć słowa w zdaniu, zanim przekaże następnemu.</li>
    <li><strong>Word Detectives:</strong> Uczniowie szukają słów z lekcji w autentycznych tekstach, filmach, piosenkach.</li>
    <li><strong>Vocabulary Jenga:</strong> Na klockach Jenga napisz słowa — wyciągając klocek, musisz użyć słowa w zdaniu.</li>
</ol>`,
        excerpt: "15 sprawdzonych gier słownikowych na każdą lekcję angielskiego. Od 5-minutowych rozgrzewek po 20-minutowe aktywności — dla każdego poziomu i grupy wiekowej.",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "inspiracje",
        tags: ["gry", "słownictwo", "aktywności", "zabawy językowe"],
        readingTime: 7,
        status: "published",
        seo: {
            metaTitle: "15 Gier Słownikowych na Lekcje Angielskiego | Kamila English Blog",
            metaDescription: "Najlepsze gry słownikowe dla uczniów angielskiego. Hot Seat, Taboo, Word Auction i 12 innych sprawdzonych aktywności.",
            ogImage: "/classroom_discipline_1770205801695.png",
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_digital_tools",
        title: "Najlepsze cyfrowe narzędzia dla nauczycieli angielskiego w 2025",
        slug: "cyfrowe-narzedzia-nauczyciel-angielskiego-2025",
        content: `<h2>Przegląd najlepszych narzędzi</h2>
<p>Rok 2025 przyniósł lawinę nowych narzędzi edukacyjnych. Które z nich naprawdę warto znać? Przygotowałam subiektywny przegląd narzędzi, które regularnie używam w swojej pracy i które polecam nauczycielom angielskiego.</p>
<h2>Tworzenie materiałów</h2>
<h3>Canva for Education</h3>
<p>Darmowe dla nauczycieli. Tysiące szablonów kart pracy, plakatów, prezentacji. Funkcja "Magic Write" pomaga generować teksty na zadany temat i poziom. Niezbędnik każdego nauczyciela.</p>
<h3>BookWidgets</h3>
<p>Ponad 40 typów interaktywnych ćwiczeń: krzyżówki, memory, gry słownikowe, quizy. Integruje się z Google Classroom i Microsoft Teams. Płatne, ale warte każdej złotówki.</p>
<h3>Wordwall</h3>
<p>Szybkie tworzenie interaktywnych gier z własnego słownictwa. Uczniowie mogą grać na telefonach. Darmowa wersja pozwala na 5 aktywności — wystarczy na start.</p>
<h2>Komunikacja i organizacja</h2>
<h3>ClassDojo</h3>
<p>Platforma do komunikacji z rodzicami, zarządzania zachowaniem i budowania portfolio ucznia. Szczególnie polecana dla klas 1-6.</p>
<h3>Notion</h3>
<p>Mój osobisty "command center" — plany lekcji, baza materiałów, notatki ze szkoleń, listy uczniów. Darmowy dla nauczycieli, nieograniczone możliwości.</p>
<h2>Ocenianie i feedback</h2>
<h3>Flipgrid (teraz Flip)</h3>
<p>Uczniowie nagrywają krótkie wideo jako odpowiedź na zadanie. Idealne do ćwiczenia mówienia — uczniowie czują mniejszy stres niż przy mówieniu "na żywo".</p>
<h3>Formative</h3>
<p>Quizy w czasie rzeczywistym z natychmiastowym feedbackiem. Widzisz odpowiedzi uczniów na bieżąco i możesz reagować w trakcie lekcji.</p>
<h2>AI w klasie</h2>
<h3>ChatGPT / Claude</h3>
<p>Do generowania tekstów na zadany poziom, tworzenia pytań do tekstu, pisania scenariuszy lekcji. Pamiętaj — AI to asystent, nie zastępstwo Twojej wiedzy pedagogicznej.</p>
<h3>Diffit</h3>
<p>Wklejasz dowolny tekst, AI dostosowuje go do wybranego poziomu. Idealne do tworzenia zróżnicowanych materiałów w kilka sekund.</p>`,
        excerpt: "Przegląd najlepszych cyfrowych narzędzi dla nauczycieli angielskiego w 2025 roku. Canva, Wordwall, Flipgrid, AI — co warto znać i jak to stosować.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "technologia",
        tags: ["narzędzia cyfrowe", "technologia", "EdTech", "2025"],
        readingTime: 10,
        status: "published",
        seo: {
            metaTitle: "Najlepsze Narzędzia Cyfrowe dla Nauczycieli Angielskiego 2025 | Blog",
            metaDescription: "Canva, Wordwall, Flipgrid, AI — przegląd najlepszych narzędzi cyfrowych dla nauczycieli angielskiego. Co naprawdę warto używać?",
            ogImage: "/ai_education_1770206350000.png",
        },
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_parents_communication",
        title: "Jak rozmawiać z rodzicami o postępach dziecka? Praktyczny przewodnik",
        slug: "rozmowy-z-rodzicami-postepy-dziecka",
        content: `<h2>Dlaczego komunikacja z rodzicami jest kluczowa?</h2>
<p>Rodzice są naturalnymi sojusznikami nauczyciela w procesie nauki. Gdy są dobrze poinformowani i zaangażowani, uczniowie osiągają lepsze wyniki. Jednak rozmowy z rodzicami bywają trudne — szczególnie gdy mamy do przekazania negatywne informacje.</p>
<h2>Zasada "kanapki feedbackowej"</h2>
<p>Klasyczna, ale skuteczna technika: zacznij od pozytywu, w środku umieść obszar do poprawy, zakończ kolejnym pozytywem lub planem działania. Przykład: "Marta świetnie radzi sobie z rozumieniem ze słuchu — to jej mocna strona. Widzę, że gramatyka sprawia jej trudność, szczególnie czasy przeszłe. Mam kilka pomysłów, jak możemy to wspólnie poprawić — czy możemy porozmawiać o dodatkowych ćwiczeniach w domu?"</p>
<h2>Trudne rozmowy — jak się przygotować?</h2>
<ul>
    <li><strong>Zbierz konkretne przykłady:</strong> Nie "Kacper jest niestaranny", ale "W ostatnich 3 pracach domowych Kacper zostawił połowę zadań nieukończonych"</li>
    <li><strong>Skup się na zachowaniu, nie osobowości:</strong> "Widzę, że Zosia ma trudność z koncentracją przez 45 minut" zamiast "Zosia jest roztargniona"</li>
    <li><strong>Proponuj rozwiązania:</strong> Każda trudność powinna mieć propozycję działania — co rodzic może zrobić w domu, co Ty zrobisz w szkole</li>
    <li><strong>Słuchaj aktywnie:</strong> Rodzice często widzą dziecko z innej perspektywy. Ich informacje mogą być bezcenne</li>
</ul>
<h2>Komunikacja cyfrowa</h2>
<p>E-maile i wiadomości przez platformy szkolne stały się normą. Kilka zasad dobrej komunikacji cyfrowej:</p>
<ul>
    <li>Odpowiadaj w ciągu 24-48 godzin (ustal i zakomunikuj swoje godziny dostępności)</li>
    <li>Pisz krótko i konkretnie — rodzice są zajęci</li>
    <li>Unikaj skrótów i żargonu pedagogicznego</li>
    <li>Trudne sprawy rozwiązuj telefonicznie lub osobiście — nie przez e-mail</li>
</ul>`,
        excerpt: "Jak skutecznie komunikować się z rodzicami o postępach dziecka? Technika kanapki feedbackowej, trudne rozmowy i zasady komunikacji cyfrowej.",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["rodzice", "komunikacja", "feedback", "współpraca"],
        readingTime: 8,
        status: "published",
        seo: {
            metaTitle: "Rozmowy z Rodzicami o Postępach Dziecka | Kamila English Blog",
            metaDescription: "Jak rozmawiać z rodzicami o trudnościach ucznia? Technika kanapki feedbackowej i praktyczne wskazówki dla nauczycieli.",
            ogImage: "/classroom_discipline_1770205801695.png",
        },
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_writing_skills",
        title: "Pisanie po angielsku: Od zdania do eseju — etapy i ćwiczenia",
        slug: "pisanie-po-angielsku-od-zdania-do-eseju",
        content: `<h2>Dlaczego pisanie sprawia tyle trudności?</h2>
<p>Pisanie jest najtrudniejszą sprawnością językową — wymaga jednoczesnej aktywacji gramatyki, słownictwa, logicznego myślenia i znajomości konwencji gatunkowych. Nie dziwi więc, że uczniowie często go unikają. Kluczem jest stopniowe budowanie kompetencji — od zdania do akapitu, od akapitu do tekstu.</p>
<h2>Etap 1: Zdanie (poziom A1-A2)</h2>
<p>Zanim uczeń napisze tekst, musi opanować zdanie. Ćwiczenia na tym etapie:</p>
<ul>
    <li>Sentence starters: "I like... because...", "In my opinion..."</li>
    <li>Scrambled sentences: układanie wyrazów w poprawnej kolejności</li>
    <li>Sentence combining: łączenie dwóch prostych zdań spójnikami</li>
</ul>
<h2>Etap 2: Akapit (poziom B1)</h2>
<p>Akapit to jednostka myśli. Uczniowie muszą zrozumieć strukturę: topic sentence → supporting sentences → concluding sentence. Ćwiczenia:</p>
<ul>
    <li>Paragraph frames: gotowe szablony z lukami do uzupełnienia</li>
    <li>Paragraph analysis: uczniowie identyfikują strukturę w gotowych akapitach</li>
    <li>Peer editing: uczniowie oceniają akapity kolegów według kryteriów</li>
</ul>
<h2>Etap 3: Tekst (poziom B2+)</h2>
<p>Na tym etapie uczniowie uczą się planowania, spójności i stylu. Techniki:</p>
<ul>
    <li>Mind mapping przed pisaniem: wizualizacja struktury tekstu</li>
    <li>Outline writing: tworzenie konspektu przed właściwym tekstem</li>
    <li>Model texts: analiza przykładowych tekstów przed samodzielnym pisaniem</li>
</ul>
<h2>Jak poprawiać prace pisemne efektywnie?</h2>
<p>Nie poprawiaj wszystkiego — to demotywuje i zajmuje zbyt dużo czasu. Wybierz 2-3 obszary, na których skupiasz się w danej pracy. Używaj symboli korektorskich zamiast przepisywania — uczeń sam musi znaleźć i poprawić błąd. To znacznie skuteczniejsze niż gotowa poprawka od nauczyciela.</p>`,
        excerpt: "Jak uczyć pisania po angielsku krok po kroku? Od prostego zdania do rozbudowanego eseju — etapy, ćwiczenia i techniki efektywnego poprawiania prac.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["pisanie", "writing", "esej", "sprawności językowe"],
        readingTime: 9,
        status: "published",
        seo: {
            metaTitle: "Nauczanie Pisania po Angielsku — Od Zdania do Eseju | Blog",
            metaDescription: "Jak uczyć pisania po angielsku etapami? Sentence starters, paragraph frames, outline writing — praktyczny przewodnik.",
            ogImage: "/ai_education_1770206350000.png",
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_exam_preparation",
        title: "Przygotowanie do egzaminów: Strategie, które naprawdę działają",
        slug: "przygotowanie-do-egzaminow-strategie",
        content: `<h2>Psychologia egzaminów</h2>
<p>Stres egzaminacyjny to realne zjawisko, które może zablokować nawet dobrze przygotowanego ucznia. Pierwszym krokiem w przygotowaniu do egzaminu jest nauczenie uczniów, jak zarządzać stresem — techniki oddychania, pozytywna wizualizacja, realistyczne oczekiwania.</p>
<h2>Strategia 1: Spaced repetition (powtarzanie rozłożone w czasie)</h2>
<p>Zamiast uczyć się wszystkiego dzień przed egzaminem, rozłóż materiał na tygodnie. Krzywa zapominania Ebbinghausa pokazuje, że powtarzanie w odpowiednich odstępach czasu (1 dzień, 3 dni, 7 dni, 21 dni) dramatycznie zwiększa retencję. Aplikacje jak Anki automatyzują ten proces.</p>
<h2>Strategia 2: Active recall (aktywne przypominanie)</h2>
<p>Samo czytanie notatek to pasywna nauka. Aktywne przypominanie — zakrywanie odpowiedzi i próba samodzielnego odtworzenia — jest wielokrotnie skuteczniejsze. Fiszki, quizy, tłumaczenie z polskiego na angielski bez podglądania.</p>
<h2>Strategia 3: Timed practice (ćwiczenie pod presją czasu)</h2>
<p>Egzamin ma limit czasu — ćwiczenia też powinny. Uczniowie muszą nauczyć się zarządzania czasem: ile minut na każde zadanie, kiedy pominąć trudne pytanie i wrócić do niego, jak sprawdzić pracę w pozostałym czasie.</p>
<h2>Strategia 4: Past papers (arkusze z poprzednich lat)</h2>
<p>Nie ma lepszego przygotowania niż praca z autentycznymi arkuszami egzaminacyjnymi. Uczniowie poznają format, typowe pytania i poziom trudności. Analizuj błędy razem z uczniami — to najcenniejszy element tej strategii.</p>
<h2>Tydzień przed egzaminem</h2>
<p>Ostatni tydzień to czas na powtórzenie, nie naukę nowego materiału. Skup się na słabych stronach uczniów, rób krótkie sesje (45 minut max), zadbaj o sen i odpoczynek. Zmęczony mózg nie zapamiętuje.</p>`,
        excerpt: "Skuteczne strategie przygotowania do egzaminów z angielskiego: spaced repetition, active recall, timed practice i analiza arkuszy. Jak pomóc uczniom osiągnąć najlepszy wynik?",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["egzaminy", "matura", "FCE", "przygotowanie", "strategie"],
        readingTime: 10,
        status: "published",
        seo: {
            metaTitle: "Przygotowanie do Egzaminów z Angielskiego — Strategie | Blog",
            metaDescription: "Spaced repetition, active recall, timed practice — skuteczne strategie przygotowania do egzaminów z angielskiego dla nauczycieli.",
            ogImage: "/classroom_discipline_1770205801695.png",
        },
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_project_based",
        title: "Project-Based Learning: Jak realizować projekty językowe w klasie?",
        slug: "project-based-learning-projekty-jezykowe",
        content: `<h2>Czym jest Project-Based Learning?</h2>
<p>Project-Based Learning (PBL) to metoda nauczania, w której uczniowie uczą się poprzez realizację długoterminowego projektu odpowiadającego na realne pytanie lub problem. W kontekście nauki języka angielskiego PBL łączy wszystkie cztery sprawności (czytanie, pisanie, słuchanie, mówienie) w autentycznym kontekście.</p>
<h2>Elementy dobrego projektu językowego</h2>
<ul>
    <li><strong>Driving question:</strong> Centralne pytanie, które napędza projekt ("How can we create a guide to our city for English-speaking tourists?")</li>
    <li><strong>Autentyczny produkt końcowy:</strong> Coś, co ma wartość poza klasą — prezentacja, broszura, podcast, strona internetowa</li>
    <li><strong>Collaboration:</strong> Praca w grupach uczy negocjowania, delegowania, rozwiązywania konfliktów</li>
    <li><strong>Reflection:</strong> Regularne momenty refleksji — co działa, co trzeba zmienić</li>
</ul>
<h2>Przykładowe projekty dla różnych grup</h2>
<h3>Klasy 4-6 (A1-A2)</h3>
<p><strong>"My Dream School"</strong> — uczniowie projektują wymarzoną szkołę, opisują ją po angielsku i prezentują klasie. Produkt: plakat lub prezentacja PowerPoint.</p>
<h3>Klasy 7-8 (A2-B1)</h3>
<p><strong>"Our Town's Hidden Gems"</strong> — uczniowie tworzą anglojęzyczny przewodnik po swoim mieście dla turystów. Produkt: broszura lub krótki film.</p>
<h3>Liceum (B1-B2)</h3>
<p><strong>"Social Issues Podcast"</strong> — uczniowie nagrywają podcast po angielsku na temat wybranego problemu społecznego. Produkt: nagranie audio z transkryptem.</p>
<h2>Jak oceniać projekty?</h2>
<p>Ocenianie projektu powinno obejmować zarówno produkt końcowy, jak i proces. Użyj rubryk oceniania, które uczniowie znają od początku projektu. Oceniaj zarówno kompetencje językowe (gramatyka, słownictwo, wymowa), jak i kompetencje kluczowe (praca w grupie, kreatywność, zarządzanie czasem).</p>`,
        excerpt: "Jak realizować projekty językowe metodą PBL? Driving questions, autentyczne produkty, przykładowe projekty dla klas 4-8 i liceum. Kompletny przewodnik.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["PBL", "projekty", "project-based learning", "metodyka"],
        readingTime: 9,
        status: "published",
        seo: {
            metaTitle: "Project-Based Learning w Nauczaniu Angielskiego | Blog",
            metaDescription: "Jak realizować projekty językowe metodą PBL? Driving questions, przykładowe projekty i ocenianie — kompletny przewodnik.",
            ogImage: "/ai_education_1770206350000.png",
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "post_listening_skills",
        title: "Rozumienie ze słuchu: Jak ćwiczyć tę najtrudniejszą sprawność?",
        slug: "rozumienie-ze-sluchu-cwiczenia-strategie",
        content: `<h2>Dlaczego słuchanie jest takie trudne?</h2>
<p>Rozumienie ze słuchu jest dla wielu uczniów najtrudniejszą sprawnością — i to z kilku powodów. Po pierwsze, mówcy natywni mówią szybko i stosują kontrakcje, redukcje i linking sounds. Po drugie, uczniowie nie mogą "cofnąć" rozmówcy jak tekstu. Po trzecie, stres egzaminacyjny blokuje przetwarzanie informacji.</p>
<h2>Trzy etapy ćwiczenia słuchania</h2>
<h3>Pre-listening (przed słuchaniem)</h3>
<p>Aktywacja wiedzy wstępnej jest kluczowa. Zanim uczniowie usłyszą nagranie, porozmawiaj o temacie, przejrzyj słownictwo kluczowe, omów pytania. Mózg, który wie, czego szukać, słyszy więcej.</p>
<h3>While-listening (podczas słuchania)</h3>
<p>Pierwsze słuchanie: ogólne zrozumienie (gist listening). Drugie słuchanie: szczegóły (detail listening). Nie dawaj zbyt wielu zadań naraz — to przytłacza.</p>
<h3>Post-listening (po słuchaniu)</h3>
<p>Dyskusja, analiza trudnych fragmentów, praca z transkryptem. Transkrypt to cenne narzędzie — uczniowie mogą zobaczyć, co słyszeli i dlaczego czegoś nie rozumieli.</p>
<h2>Autentyczne materiały vs. nagrania egzaminacyjne</h2>
<p>Nagrania egzaminacyjne są ważne, ale autentyczne materiały (podcasty, filmy, piosenki) budują prawdziwą kompetencję słuchania. Zacznij od materiałów z napisami, stopniowo je usuwaj. Polecam: BBC Learning English, TED-Ed, Easy English.</p>
<h2>Strategie dla uczniów</h2>
<ul>
    <li><strong>Don't panic:</strong> Nie rozumiem wszystkiego — to normalne. Skup się na słowach kluczowych.</li>
    <li><strong>Use context:</strong> Kontekst, ton głosu, słowa kluczowe pomagają domyślić się znaczenia.</li>
    <li><strong>Predict:</strong> Przed słuchaniem przewiduj, co usłyszysz na podstawie tematu i pytań.</li>
    <li><strong>Note-taking:</strong> Krótkie notatki podczas słuchania — słowa kluczowe, liczby, nazwy własne.</li>
</ul>`,
        excerpt: "Jak skutecznie ćwiczyć rozumienie ze słuchu? Trzy etapy pracy z nagraniem, strategie dla uczniów i najlepsze autentyczne materiały do słuchania.",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["słuchanie", "listening", "sprawności językowe", "strategie"],
        readingTime: 8,
        status: "published",
        seo: {
            metaTitle: "Rozumienie ze Słuchu — Jak Ćwiczyć Listening? | Blog",
            metaDescription: "Jak ćwiczyć rozumienie ze słuchu w angielskim? Pre-listening, while-listening, post-listening — strategie i autentyczne materiały.",
            ogImage: "/classroom_discipline_1770205801695.png",
        },
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Combined export of all blog posts
export const ALL_BLOG_POSTS: BlogPost[] = [...SAMPLE_BLOG_POSTS, ...ADDITIONAL_BLOG_POSTS];
