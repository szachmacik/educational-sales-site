import { Language } from "./translations"


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

/**
 * Returns the currency configuration for a given language.
 *
 * Falls back to USD (`en`) if the language has no dedicated currency mapping.
 *
 * @param lang - BCP-47 language code
 * @returns Currency configuration including code, symbol, rate and format template
 *
 * @example
 * getCurrencyConfig('pl') // { code: 'PLN', symbol: 'zł', rate: 1, format: '{value} {symbol}' }
 * getCurrencyConfig('de') // { code: 'EUR', symbol: '€', rate: 0.23, format: '{value} {symbol}' }
 */
export const getCurrencyConfig = (lang: Language): CurrencyConfig => {
    return CURRENCIES[lang] || CURRENCIES.en
}

/**
 * Formats a price in PLN to the target language's currency.
 *
 * Converts from PLN using the exchange rate defined in `CURRENCIES`,
 * applies locale-appropriate thousands separators, and formats
 * the symbol according to the currency's `format` template.
 *
 * @param value - Price in PLN (base currency). Accepts number or numeric string.
 * @param lang - BCP-47 language code determining the target currency
 * @returns Formatted price string (e.g., `"49.99 zł"`, `"$12.50"`, `"4 500 Ft"`)
 *
 * @example
 * formatPrice(49.99, 'pl')  // "49.99 zł"
 * formatPrice(49.99, 'en')  // "$12.50"
 * formatPrice(49.99, 'hu')  // "4 499 Ft"
 * formatPrice('invalid', 'pl') // "0.00"
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
