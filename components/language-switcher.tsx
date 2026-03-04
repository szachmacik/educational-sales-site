"use client";

import { useLanguage } from "@/components/language-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { Language } from "@/lib/translations";
import { useRouter, usePathname } from "next/navigation";

const flagMap: Record<Language, string> = {
    pl: "https://flagcdn.com/pl.svg",
    en: "https://flagcdn.com/gb.svg",
    uk: "https://flagcdn.com/ua.svg",
    de: "https://flagcdn.com/de.svg",
    es: "https://flagcdn.com/es.svg",
    fr: "https://flagcdn.com/fr.svg",
    it: "https://flagcdn.com/it.svg",
    cs: "https://flagcdn.com/cz.svg",
    sk: "https://flagcdn.com/sk.svg",
    ro: "https://flagcdn.com/ro.svg",
    hu: "https://flagcdn.com/hu.svg",
    pt: "https://flagcdn.com/pt.svg",
    lt: "https://flagcdn.com/lt.svg",
    lv: "https://flagcdn.com/lv.svg",
    et: "https://flagcdn.com/ee.svg",
    hr: "https://flagcdn.com/hr.svg",
    sr: "https://flagcdn.com/rs.svg",
    sl: "https://flagcdn.com/si.svg",
    bg: "https://flagcdn.com/bg.svg",
    el: "https://flagcdn.com/gr.svg",
    nl: "https://flagcdn.com/nl.svg",
    sv: "https://flagcdn.com/se.svg",
    fi: "https://flagcdn.com/fi.svg",
    no: "https://flagcdn.com/no.svg",
    da: "https://flagcdn.com/dk.svg",
};

const labelMap: Record<Language, string> = {
    pl: "Polski",
    en: "English",
    uk: "Українська",
    de: "Deutsch",
    es: "Español",
    fr: "Français",
    it: "Italiano",
    cs: "Čeština",
    sk: "Slovenčina",
    ro: "Română",
    hu: "Magyar",
    pt: "Português",
    lt: "Lietuvių",
    lv: "Latviešu",
    et: "Eesti",
    hr: "Hrvatski",
    sr: "Српски",
    sl: "Slovenščina",
    bg: "Български",
    el: "Ελληνικά",
    nl: "Nederlands",
    sv: "Svenska",
    fi: "Suomi",
    no: "Norsk",
    da: "Dansk",
};

export function LanguageSwitcher() {
    const { language } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLang: Language) => {
        // 1. Set cookie for middleware
        document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;

        // 2. Calculate new path
        // current path looks like /pl/products or /en/about
        const segments = (pathname ?? "/pl").split('/');
        // segments[0] is empty, segments[1] is the current locale
        segments[1] = newLang;
        const newPath = segments.join('/');

        // 3. Navigate
        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-1 hover:bg-slate-100 transition-colors">
                    <img
                        src={flagMap[language]}
                        alt={labelMap[language]}
                        className="h-4 w-7 object-cover rounded shadow-sm border border-slate-200"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {(Object.keys(flagMap) as Language[]).map((lang) => (
                    <DropdownMenuItem
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className="cursor-pointer gap-3 min-w-[140px]"
                    >
                        <img
                            src={flagMap[lang]}
                            alt={labelMap[lang]}
                            className="h-4 w-6 object-cover rounded shadow-sm"
                        />
                        <span>{labelMap[lang]}</span>
                        {language === lang && (
                            <span className="ml-auto text-primary text-xs font-bold">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

