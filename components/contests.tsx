"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Calendar, Star } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function Contests() {
  const { t, language } = useLanguage();

  const contestsList = [
    {
      id: "lingus",
      name: t.contests.items.lingus.name,
      fullName: t.contests.items.lingus.fullName,
      description: t.contests.items.lingus.description,
      color: "bg-primary",
      image: "/contest-lingus.jpg",
      href: `/${language}/lingus`,
    },
    {
      id: "matmis",
      name: t.contests.items.matmis.name,
      fullName: t.contests.items.matmis.fullName,
      description: t.contests.items.matmis.description,
      color: "bg-accent",
      image: "/contest-matmis.jpg",
      href: `/${language}/matmis`,
    },
  ];

  const statsList = [
    { icon: Trophy, value: "5", label: t.contests.stats.contests },
    { icon: Users, value: "50,000+", label: t.contests.stats.participants },
    { icon: Calendar, value: "15", label: t.contests.stats.tradition },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.contests.header}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.contests.subheader}
            </p>

            {/* Stats */}
            <div className="mt-8 flex gap-8">
              {statsList.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/${language}/dashboard`}>
                  {t.contests.platform}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Contest Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {contestsList.map((contest) => (
              <Link
                key={contest.id}
                href={contest.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={contest.image || "/placeholder.svg"}
                    alt={contest.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div
                    className={`mb-3 inline-flex items-center rounded-full ${contest.color} px-3 py-1 text-sm font-semibold text-primary-foreground`}
                  >
                    {contest.name}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {contest.fullName}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {contest.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                    {t.contests.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
