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
<p>Pamiętaj, że jesteś dla swoich uczniów wzorem. Pokazując im, jak dbasz o siebie, uczysz ich jednej z najważniejszych lekcji w życiu: szacunku do własnych potrzeb i zdrowia.</p>`,
        excerpt: "Praktyczne wskazówki dla nauczycieli, jak unikać wypalenia zawodowego i czerpać radość z nauczania każdego dnia. Odkryj moc balansu.",
        featuredImage: "/teacher_wellbeing_1770205785997.png",
        author: "Kamila Łobko-Koziej",
        category: "inspiracje",
        tags: ["dobrostan", "nauczyciel", "psychologia", "balans"],
        status: "published",
        seo: {
            metaTitle: "Dobrostan nauczyciela - jak o niego zadbać? | Nasz Blog",
            metaDescription: "Dowiedz się jak dbać o swoje zdrowie psychiczne i fizyczne będąc nauczycielem. Sprawdzone metody Kamili Łobko-Koziej.",
            ogImage: "/teacher_wellbeing_1770205785997.png",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
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
<p>Skoncentruj się na rozwiązaniach, a nie na karach. Pytaj uczniów: 'Co możemy zrobić, aby następnym razem ta sytuacja się nie powtórzyła?', zamiast szukać winnego. To buduje kompetencje społeczne i uczy rozwiązywania konfliktów w sposób konstruktywny.</p>`,
        excerpt: "Jak radzić sobie z wyzwaniami wychowawczymi w klasie? Poznaj systemowe podejście do dyscypliny oparte na szacunku i relacjach.",
        featuredImage: "/classroom_discipline_1770205801695.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["dyscyplina", "zarządzanie klasą", "pedagogika", "relacje"],
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
<p>Nigdy nie lekceważ mocy zwykłej piłki czy gry w berka. Zamień nudne powtarzanie w ekscytującą zabawę. 'Simon Says' czy 'What's the time, Mr. Wolf?' to klasyki, które wciąż działają magicznie, angażując każde dziecko w grupie.</p>`,
        excerpt: "Jak sprawić, by najmłodsi naturalnie przyswajali język angielski? Odkryj moc zabawy, muzyki i ruchu w nauczaniu przedszkolnym.",
        featuredImage: "/teaching_kids_english_1770205820508.png",
        author: "Kamila Łobko-Koziej",
        category: "materialy",
        tags: ["dzieci", "przedszkole", "zabawa", "TPR"],
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
<p>Stwarzaj sytuacje, w których komunikacja jest naturalna. Debaty na kontrowersyjne tematy (dostosowane do wieku), odgrywanie ról z życia codziennego czy wspólne rozwiązywanie problemów sprawiają, że bariera językowa znika.</p>`,
        excerpt: "Praktyczne sposoby na budowanie zaangażowania w grupach 13+. Dowiedz się, dlaczego projekty i autentyczność działają lepiej niż podręcznik.",
        featuredImage: "/teen_english_class_1770206330732.png",
        author: "Kamila Łobko-Koziej",
        category: "metodyka",
        tags: ["nastolatki", "projekty", "komunikacja", "motywacja"],
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
<p>Sztuczna inteligencja rewolucjonizuje sposób, w jaki uczymy i uczymy się języków. To nie jest zagrożenie, lecz potężne narzędzie, które może odciążyć nauczyciela od żmudnych zadań.</p>
<h2>ChatGPT jako asystent nauczyciela</h2>
<p>Możesz używać ChatGPT do generowania dialogów na dowolny temat, tworzenia spersonalizowanych ćwiczeń gramatycznych w kilka sekund czy pisania scenariuszy konwersacyjnych dostosowanych do poziomu Twojej grupy.</p>
<h3>AI dla uczniów</h3>
<p>Zachęcaj uczniów do używania AI jako partnera do rozmowy lub narzędzia do korekty tekstów. Dzięki temu mogą ćwiczyć język również poza salą lekcyjną, otrzymując natychmiastową informację zwrotną.</p>`,
        excerpt: "Dowiedz się, jak wykorzystać sztuczną inteligencję w nauczaniu języków obcych. Praktyczny przewodnik z konkretnymi przykładami.",
        featuredImage: "/ai_education_1770206350000.png",
        author: "Kamila Łobko-Koziej",
        category: "technologia",
        tags: ["AI", "technologia", "innowacje", "ChatGPT"],
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
];
