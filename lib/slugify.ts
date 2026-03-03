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
        .replace(/\-\-+/g, "-");
}
