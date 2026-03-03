
import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { TranslationMerger } from "@/components/language-provider";

async function getDashboardDictionary(lang: string, namespace: string = 'dashboard') {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
        const fileContents = await fs.readFile(filePath, 'utf8');
        try {
            return JSON.parse(fileContents);
        } catch (parseError: any) {
            const context = fileContents.substring(Math.max(0, 3043 - 100), Math.min(fileContents.length, 3043 + 100));
            const logMsg = `FAIL: ${filePath}\nError: ${parseError.message}\nContext: ${context}\n`;
            await fs.appendFile(path.join(process.cwd(), 'public', 'json_error_log.txt'), logMsg);
            console.error(logMsg);
            throw parseError;
        }
    } catch (error) {
        return null;
    }
}

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const common = await getDashboardDictionary(lang, 'common');
    return {
        title: `${common?.nav?.dashboard || 'Panel'} - ${common?.seo?.title || 'Kamila English'}`,
        description: common?.seo?.description || 'Zarządzaj swoimi materiałami edukacyjnymi i kursami.',
        robots: { index: false, follow: false }, // Dashboard should not be indexed
    };
}

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const dict = await getDashboardDictionary(lang);

    return (
        <>
            <TranslationMerger dictionary={dict} />
            {children}
        </>
    );
}
