import React from "react";

export type LegalClause = {
    id: string;
    title: string;
    content: string | React.ReactNode;
    defaultEnabled: boolean;
    required?: boolean; // If true, cannot be disabled
};

export type LegalDocument = {
    id: string;
    title: string;
    lastUpdated: string;
    clauses: LegalClause[];
};

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
    regulamin: {
        id: "regulamin",
        title: "Regulamin Świadczenia Usług",
        lastUpdated: "25 lutego 2026 r.",
        clauses: [
            {
                id: "reg_definitions",
                title: "Definicje i Postanowienia Ogólne",
                content: "Regulamin określa zasady świadczenia usług drogą elektroniczną oraz sprzedaży Treści Cyfrowych i Towarów Fizycznych. Na potrzeby dokumentu przyjmuje się, że Sprzedawcą jest podmiot zarządzający Platformą, a Kupującym każda osoba fizyczna (Konsument), osoba prawna lub jednostka organizacyjna (Przedsiębiorca) skutecznie składająca zamówienie.",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "reg_account_security",
                title: "Konto Użytkownika i Bezpieczeństwo",
                content: "Użytkownik ponosi pełną odpowiedzialność za zachowanie w tajemnicy danych logowania. Zabrania się udostępniania konta osobom trzecim. Platforma zastrzega sobie prawo do czasowego zawieszenia konta w przypadku wykrycia nieautoryzowanego dostępu z wielu adresów IP w sposób naruszający licencję.",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "reg_ip_license",
                title: "Własność Intelektualna i Licencja",
                content: "Wszelkie materiały udostępniane na Platformie są chronione prawem autorskim. Sprzedawca udziela niewyłącznej, niezbywalnej licencji na korzystanie z materiałów wyłącznie do użytku własnego lub w ramach prowadzonych zajęć dydaktycznych (bez prawa do dalszej odsprzedaży lub sublicencjonowania subskrypcji).",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "reg_prices_omnibus",
                title: "Ceny, Promocje i Dyrektywa Omnibus",
                content: "Wszystkie ceny uwidocznione na Platformie podane są w walucie krajowej i zawierają podatek VAT. Zgodnie z unijną dyrektywą Omnibus, w przypadku informowania o obniżce ceny towaru lub usługi cyfrowej, Sprzedawca obok informacji o obniżonej cenie udostępnia informację o najniższej cenie, która obowiązywała w okresie 30 dni przed wprowadzeniem obniżki.",
                defaultEnabled: true,
            },
            {
                id: "reg_payments_pl",
                title: "Zasady Płatności (Przelewy, BLIK, mBank/Paynow)",
                content: "Podmiotami świadczącymi obsługę płatności online są PayU S.A. oraz mBank S.A. (bramka Paynow). Formy płatności obejmują m.in. płatności BLIK oraz szybkie przelewy elektroniczne (w tym mTransfer - mBank). Rozliczenia transakcji e-przelewem i kartą płatniczą przeprowadzane są zgodnie z regulaminami usługodawców. Sprzedawca nie przechowuje danych autoryzacyjnych do kont bankowych Kupującego.",
                defaultEnabled: true,
            },
            {
                id: "reg_payments_global",
                title: "Zasady Płatności Kartami Płatniczymi",
                content: "Operatorem kart płatniczych jest Stripe Payments Europe, Ltd. z siedzibą w Dublinie. Akceptujemy karty Visa, Visa Electron, Mastercard, MasterCard Electronic oraz Maestro. W przypadku konieczności zwrotu środków (np. po uznaniu reklamacji), zwrot następuje bezpośrednio na rachunek bankowy przypisany do karty płatniczej Zamawiającego.",
                defaultEnabled: true,
            },
            {
                id: "reg_delivery_physical",
                title: "Dostawa i Realizacja Zamówień Fizycznych",
                content: "Operacje logistyczne realizowane są przy użyciu zintegrowanych platform zarządzania zamówieniami oraz renomowanych partnerów kurierskich. Przeniesienie ryzyka przypadkowego uszkodzenia lub utraty towaru na Konsumenta następuje w momencie jego wydania.",
                defaultEnabled: true,
            },
            {
                id: "reg_returns_consumer",
                title: "Odstąpienie od Umowy (Konsumenci do 14 dni)",
                content: "Konsument, który zawarł umowę na odległość, może w terminie 14 dni kalendarzowych odstąpić od niej bez podawania przyczyny. UWAGA: Prawo odstąpienia od umowy NIE PRZYSŁUGUJE Konsumentowi w odniesieniu do umów o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, jeżeli spełnianie świadczenia (np. możliwość pobrania pliku PDF, dostęp do generatora online) rozpoczęło się za wyraźną zgoda przed upływem terminu do odstąpienia.",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "reg_returns_b2b",
                title: "Postanowienia dla Przedsiębiorców (B2B)",
                content: "W przypadku sprzedaży hurtowej lub usług świadczonych na rzecz podmiotów gospodarczych (z wyłączeniem tzw. przedsiębiorców na prawach konsumenta), strony całkowicie wyłączają odpowiedzialność Sprzedawcy z tytułu rękojmi za wady, a prawo do 14-dniowego odstąpienia od umowy opisane wyżej nie znajduje zastosowania.",
                defaultEnabled: true,
            },
            {
                id: "reg_sla_saas",
                title: "Utrzymanie Serwisu i Dostępność",
                content: "Sprzedawca dołoży wszelkich starań, aby zapewnić bezawaryjne funkcjonowanie Platformy (zakładane SLA na poziomie 99%). W przypadku nieplanowanych przerw technicznych, odpowiedzialność odszkodowawcza względem przedsiębiorców ograniczona jest wyłącznie do rzeczywistych strat (damnum emergens) i nie przekracza kwoty zapłaconej przez Kupującego za usługę w danym miesiącu.",
                defaultEnabled: true,
            },
            {
                id: "reg_affiliate_marketing",
                title: "Optymalizacja Reklamowa",
                content: "Sklep nieodpłatnie prezentuje zoptymalizowane pod użytkownika treści przy użyciu zanonimizowanych wskaźników telemetrycznych. Niektóre polecane narzędzia zewnętrzne mogą pochodzić z systemów partnerskich, jednak nie wpływa to na końcową cenę usługi dla Kupującego.",
                defaultEnabled: true,
            },
            {
                id: "reg_complaints",
                title: "Reklamacje i Rozwiązywanie Sporów",
                content: "Reklamacje można zgłaszać na adres e-mail obowiązujący dla domeny. Sprzedawca ustosunkuje się do reklamacji Konsumenta niezwłocznie, nie później niż w terminie 14 dni od dnia jej prawidłowego złożenia. Brak odpowiedzi w tym terminie oznacza uznanie roszczenia Konsumenta za uzasadnione.",
                defaultEnabled: true,
                required: true,
            }
        ]
    },
    cookies: {
        id: "cookies",
        title: "Polityka Prywatności i Plików Cookies",
        lastUpdated: "25 lutego 2026 r.",
        clauses: [
            {
                id: "privacy_controller",
                title: "Administrator Danych (RODO)",
                content: "Administratorem Twoich danych osobowych jest Operator Platformy (szczegółowe dane teleadresowe znajdują się w zakładce Kontakt/Stopka). Przetwarzamy Twoje dane zgodnie z Rozporządzeniem (UE) 2016/679 (RODO).",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "privacy_basis",
                title: "Podstawy Prawne Przetwarzania i Powierzenie Danych",
                content: "Przetwarzamy dane w celu realizacji umowy sprzedaży (Art. 6 ust. 1 lit. b RODO). Twoje dane powierzane są zaufanym partnerom wspierającym realizację zamówień, w tym instytucjom płatniczym: mBank S.A. (bramka Paynow), PayU S.A. oraz Stripe Inc. w celu bezpiecznego procesowania płatności (m.in. przelewy mBank, BLIK, karty płatnicze).",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "privacy_rights",
                title: "Twoje Prawa",
                content: "Przysługuje Ci prawo do: żądania dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, a także prawo do wniesienia sprzeciwu wobec ich przetwarzania. Posiadasz także prawo wniesienia skargi do organu nadzorczego (PUODO).",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "cookie_def",
                title: "Zarządzanie Ciasteczkami (Cookies)",
                content: "Nasza strona wykorzystuje pliki cookies (małe pliki tekstowe) instalowane na Twoim urządzeniu. Służą one do analizy i zapewnienia pełnej funkcjonalności serwisu logowania, obsługi sesji oraz profilowania.",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "cookie_essential",
                title: "Cookies Niezbędne",
                content: "Są to pliki kluczowe do działania Platformy – m.in. umożliwiają autoryzację tokenami JWT, utrzymywanie bezpiecznej sesji oraz prawidłowe zapamiętywanie zawartości koszyka zakupowego. Wyłączenie ich z poziomu przeglądarki trwale uniemożliwi poprawne korzystanie z serwisu.",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "cookie_analytics",
                title: "Cookies Analityczne i Statystyczne",
                content: "Stosujemy wiodące rynkowe narzędzia zanonimizowanej analityki strumieni powiązań celem ciągłego ulepszania i odnajdywania błędów na elementach widoku (np. 'heatmaps' czy analizy serwerowe chmury brzegowej). Narzędzia te zbierają wyłącznie ciągi znaków niepozwalających na identyfikację jednostkową (hash-telemetry).",
                defaultEnabled: true,
                required: true,
            },
            {
                id: "cookie_marketing",
                title: "Narzędzia Marketingowe",
                content: "Współpracujemy z zaufanymi dostawcami usług reklamowych i analitycznych korporacji Big Tech. Poprzez integrację tzw. Pixeli, tworzymy zagregowane audytoria, które umożliwiają optymalizację inwestycji reklamowych w obrębie sieci społecznościowych i wyszukiwarek. Nie sprzedajemy informacji profilowych brokerom baz danych.",
                defaultEnabled: true,
            },
            {
                id: "privacy_dpa",
                title: "Umowy Powierzenia Przetwarzania Danych (DPA)",
                content: "W przypadku korzystania z Oprogramowania Platformy w trybie zewnętrznego wdrożenia jako usługi SaaS, gdzie Użytkownik Biznesowy ładuje dane osób trzecich (np. uczniów), Platforma funkcjonuje jako Podmiot Przetwarzający (Processor). Integralną częścią Umowy są ustalenia dotyczące zachowania standardów powierzenia opartych na unijnych Klauzulach Umownych Ochrony Danych.",
                defaultEnabled: true,
            }
        ]
    }
};
