"use client";

import Image from "next/image";
import { Award, BookOpen, GraduationCap, Heart, Users } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function AboutAuthor() {
  const { t } = useLanguage();

  const achievements = [
    {
      icon: GraduationCap,
      value: "15+",
      label: t.aboutAuthor.stats.experience,
    },
    {
      icon: BookOpen,
      value: "200+",
      label: t.aboutAuthor.stats.materials,
    },
    {
      icon: Users,
      value: "5000+",
      label: t.aboutAuthor.stats.teachers,
    },
    {
      icon: Award,
      value: "50+",
      label: t.aboutAuthor.stats.trainings,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-card py-20 lg:py-28">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/5" />

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Column */}
          <div className="relative mx-auto max-w-md lg:mx-0">
            {/* Main image container */}
            <div className="relative">
              {/* Background decorative shape */}
              <div className="absolute -bottom-6 -right-6 h-full w-full rounded-3xl bg-primary/10" />
              <div className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl bg-accent/20" />

              {/* Image frame */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-card bg-card shadow-2xl">
                <Image
                  src="/kamila-lobko-koziej.jpg"
                  alt={t.aboutAuthor.title}
                  width={500}
                  height={500}
                  className="aspect-square object-cover object-top"
                  priority
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg glass-premium animate-float">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <Heart className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.aboutAuthor.floating.line1}</p>
                  <p className="text-xs text-muted-foreground">{t.aboutAuthor.floating.line2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Award className="h-4 w-4" />
              {t.aboutAuthor.badge}
            </div>

            <h2 className="mb-6 font-serif text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-4xl lg:text-5xl pb-1">
              {t.aboutAuthor.title}
            </h2>

            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {t.aboutAuthor.description1}
            </p>

            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {t.aboutAuthor.description2}
            </p>

            {/* Achievement stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {achievements.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-background p-4 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-md hover-lift"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
