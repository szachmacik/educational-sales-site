import { LanguageProvider } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import { deepMerge } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";
import { ComparePageClient } from "./compare-client";

export default async function ComparePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const baseDict = (translations as any)[lang] || (translations as any)['pl'] || {};
    let commonDict = {};
    try {
        const commonPath = path.join(process.cwd(), "public", "locales", lang, "common.json");
        commonDict = JSON.parse(await fs.readFile(commonPath, "utf-8"));
    } catch {}
    const combinedDictionary = deepMerge(baseDict, { common: commonDict });
    return (
        <LanguageProvider lang={lang} dictionary={combinedDictionary}>
            <ComparePageClient lang={lang} />
        </LanguageProvider>
    );
}
