
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { Categories } from "@/components/categories";
import { Products } from "@/components/products";
import { AboutAuthor } from "@/components/about-author";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";
import { SocialProofGallery } from "@/components/social-proof-gallery";
import { LanguageProvider } from "@/components/language-provider";
import fs from 'fs/promises';
import path from 'path';
import { deepMerge } from '@/lib/utils';

// Page uses many client components with useLanguage — cannot be statically prerendered
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const common = await getDictionary(lang, 'common');
  return {
    title: common?.seo?.title || 'Kamila English - Materiały Edukacyjne',
    description: common?.seo?.description || 'Kreatywne materiały dydaktyczne dla nauczycieli języka angielskiego.',
  };
}

async function getDictionary(lang: string, namespace: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return {};
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  // Fetch ALL required namespaces for this page + Common
  const common = await getDictionary(lang, 'common');
  const landing = await getDictionary(lang, 'landing');
  const shop = await getDictionary(lang, 'shop');

  // Merge
  let combinedDictionary = common;
  combinedDictionary = deepMerge(combinedDictionary, landing);
  combinedDictionary = deepMerge(combinedDictionary, shop);

  return (
    <main className="min-h-screen bg-background">
      {/* 
        Nested LanguageProvider allows SSR to work correctly by providing 
        the full required dictionary immediately to children.
        This overrides the context from Layout but includes 'common' so Header/Footer still work.
      */}
      <LanguageProvider lang={lang} dictionary={combinedDictionary}>
        <Header />
        <Hero />
        <TrustBar />
        <Categories />
        <Products />
        <SocialProofGallery />
        <Features />
        <Testimonials />
        <AboutAuthor />
        <Newsletter />
        <Footer />
      </LanguageProvider>
    </main>
  );
}
