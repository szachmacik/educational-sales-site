import { Language } from './translations';

export interface CurrencyConfig {
    code: string;
    symbol: string;
    rate: number; // Rate relative to PLN (1 PLN = X Currency)
    format: string; // e.g., "{symbol}{value}" or "{value} {symbol}"
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
    pl: { code: 'PLN', symbol: 'zł', rate: 1, format: '{value} {symbol}' },
    en: { code: 'USD', symbol: '$', rate: 0.25, format: '{symbol}{value}' },
    uk: { code: 'UAH', symbol: '₴', rate: 10, format: '{value} {symbol}' },
    de: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    fr: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    es: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    it: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    sk: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    lt: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    lv: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    et: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    sl: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    el: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    hr: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    cs: { code: 'CZK', symbol: 'Kč', rate: 5.8, format: '{value} {symbol}' },
    ro: { code: 'RON', symbol: 'lei', rate: 1.15, format: '{value} {symbol}' },
    hu: { code: 'HUF', symbol: 'Ft', rate: 90, format: '{value} {symbol}' },
    bg: { code: 'BGN', symbol: 'лв', rate: 0.45, format: '{value} {symbol}' },
    sr: { code: 'RSD', symbol: 'din', rate: 27, format: '{value} {symbol}' },
    pt: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    nl: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    fi: { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' },
    sv: { code: 'SEK', symbol: 'kr', rate: 2.7, format: '{value} {symbol}' },
    no: { code: 'NOK', symbol: 'kr', rate: 2.7, format: '{value} {symbol}' },
    da: { code: 'DKK', symbol: 'kr', rate: 1.7, format: '{value} {symbol}' },
};

export const getCurrencyConfig = (lang: Language): CurrencyConfig => {
    return CURRENCIES[lang] || CURRENCIES.en;
};

/**
 * Formats a price value based on the selected language.
 * @param value Price in PLN (base currency)
 * @param lang Target language for currency selection
 * @returns Formatted price string
 */
export const formatPrice = (value: number | string, lang: Language): string => {
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(amount)) return '0.00';

    const config = getCurrencyConfig(lang);
    const converted = (amount * config.rate).toFixed(config.code === 'HUF' ? 0 : 2);

    // Add thousands separator for large values
    const parts = converted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const formattedValue = parts.join('.');

    return config.format.replace('{symbol}', config.symbol).replace('{value}', formattedValue);
};
