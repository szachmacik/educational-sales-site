import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { BlogView } from "@/components/blog/blog-view";
import fs from 'fs/promises';
import path from 'path';
import { deepMerge } from '@/lib/utils';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getDictionary(lang: string, namespace: string) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return {};
    }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    const blog = await getDictionary(lang, 'blog');
    return {
        title: `${common?.nav?.blog || 'Blog'} - ${common?.seo?.title || 'Kamila English'}`,
        description: blog?.subtitle || 'Artykuły, porady i inspiracje dla nauczycieli języka angielskiego.',
    };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    const blog = await getDictionary(lang, 'blog');
    const dictionary = deepMerge(common, blog);

    return (
        <LanguageProvider lang={lang} dictionary={dictionary}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <BlogView />
                <Footer />
            </div>
        </LanguageProvider>
    );
}
