/**
 * Converts a string to a URL-friendly slug.
 *
 * Handles Polish and other Central/Eastern European diacritics,
 * replaces whitespace with hyphens, and removes non-word characters.
 *
 * @param text - The input string to slugify
 * @returns A lowercase, hyphen-separated URL slug
 *
 * @example
 * slugify("Mega Pack 2w1") // "mega-pack-2w1"
 * slugify("Ćwiczenia językowe") // "cwiczenia-jezykowe"
 * slugify("  Hello   World  ") // "hello-world"
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[àáâäãåą]/g, "a")
        .replace(/[ę]/g, "e")
        .replace(/[ìíîï]/g, "i")
        .replace(/[òóôöõ]/g, "o")
        .replace(/[ùúûü]/g, "u")
        .replace(/[ýÿ]/g, "y")
        .replace(/[ñń]/g, "n")
        .replace(/[çć]/g, "c")
        .replace(/[ł]/g, "l")
        .replace(/[ś]/g, "s")
        .replace(/[źż]/g, "z")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
}
