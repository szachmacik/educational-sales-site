"use client";

import {
  Download,
  Headphones,
  Lightbulb,
  FileText,
  Clock,
  Shield,
} from "lucide-react";

import { useLanguage } from "@/components/language-provider";

const ICONS = [Download, Headphones, Lightbulb, FileText, Clock, Shield];

export function Features() {
  const { t } = useLanguage();

  const featuresList = (t.features.items || []).map((item: any, index: number) => ({
    ...item,
    icon: ICONS[index] || Download
  }));

  return (
    <section className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            {t.features.header}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            {t.features.sub}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuresList.map((feature: any) => (
            <div
              key={feature.title}
              className="group flex flex-col items-start rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-colors hover:bg-primary-foreground/15"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-primary-foreground/80">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
