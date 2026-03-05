"use client";

import {
  Download,
  Headphones,
  FileText,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

const ICONS = [Download, Headphones, FileText, BookOpen, CheckCircle2, RefreshCw, Shield, Clock];

export function Features() {
  const { t } = useLanguage();

  const featuresList = (t.features?.items || []).map((item: any, index: number) => ({
    ...item,
    icon: ICONS[index % ICONS.length],
  }));

  return (
    <section className="bg-primary py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            {t.features?.header}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            {t.features?.sub}
          </p>
        </div>

        {/* Features Grid — 2 cols on mobile, 4 cols on desktop */}
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {featuresList.map((feature: any, index: number) => (
            <div
              key={feature.title}
              className={cn(
                "group flex flex-col items-start rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur-sm",
                "transition-all duration-300 hover:bg-primary-foreground/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20",
                "border border-primary-foreground/10 hover:border-primary-foreground/30"
              )}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20 group-hover:bg-primary-foreground/30 transition-colors">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-base font-bold text-primary-foreground leading-tight mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-primary-foreground/75 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 text-center">
          <p className="text-primary-foreground/70 text-sm">
            ✓ Brak subskrypcji &nbsp;·&nbsp; ✓ Jednorazowa płatność &nbsp;·&nbsp; ✓ Dostęp na zawsze
          </p>
        </div>
      </div>
    </section>
  );
}
