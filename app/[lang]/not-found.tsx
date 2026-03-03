"use client";

import Link from 'next/link';
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { t, language } = useLanguage();
  const e = t.errors["404"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-2">{e.title}</h1>
      <p className="text-lg text-muted-foreground mb-6">{e.message}</p>
      <Link
        href={`/${language}`}
        className="text-primary underline underline-offset-4 hover:no-underline"
      >
        {e.back}
      </Link>
    </div>
  );
}
