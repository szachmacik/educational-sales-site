export type Language = 'pl' | 'en' | 'uk' | 'de' | 'es' | 'fr' | 'it' | 'cs' | 'sk' | 'ro' | 'hu' | 'pt' | 'lt' | 'lv' | 'et' | 'hr' | 'sr' | 'sl' | 'bg' | 'el' | 'nl' | 'sv' | 'fi' | 'no' | 'da';

export interface Translations {
    [key: string]: any;
}

// Optimized skeleton - actual translations are now loaded from JSON files in public/locales
export const translations: Record<Language, Translations> = {
    pl: {},
    en: {},
    uk: {},
    de: {},
    es: {},
    fr: {},
    it: {},
    cs: {},
    sk: {},
    ro: {},
    hu: {},
    pt: {},
    lt: {},
    lv: {},
    et: {},
    hr: {},
    sr: {},
    sl: {},
    bg: {},
    el: {},
    nl: {},
    sv: {},
    fi: {},
    no: {},
    da: {}
};
