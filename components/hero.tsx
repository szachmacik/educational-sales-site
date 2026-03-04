"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookMarked, Users, Star, Play, Volume2, GraduationCap } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-intersection";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

export function Hero() {
  const heroReveal = useScrollReveal({ threshold: 0.1 });
  const imageReveal = useScrollReveal({ threshold: 0.2 });
  const statsReveal = useScrollReveal({ threshold: 0.3 });
  const { t, language } = useLanguage();

  // Slideshow logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const slides = [
    "/speakbook-action.png",
    "/theater-play-action.png",
    "/megapack-action.png",
    "/kids-flashcards.png",
    "/teacher-worksheets.png",
    "/kids-board-game.png",
    "/kamila-lobko-koziej.jpg",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 2500); // Change slide every 2.5s
    } else {
      // Optional: Reset to cover slide when not hovering?
      // setCurrentSlide(0); 
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const stats = [
    { icon: BookMarked, value: "1000+", label: t.hero.stats_lessons },
    { icon: Users, value: "2500+", label: t.hero.stats_teachers },
    { icon: Star, value: "4.9/5", label: t.hero.stats_rating },
  ];


  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative background - kept behind content with -z-10 */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Made blobs lighter and moved them to avoid overlap issues */}
        <div className="absolute left-[10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-slate-100/30 blur-3xl animate-float" />
        <div className="absolute bottom-[-10%] right-[10%] h-[400px] w-[400px] rounded-full bg-slate-100/30 blur-3xl animate-float-delayed" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div ref={heroReveal.ref} className={cn("flex flex-col items-start z-10", heroReveal.className)}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary animate-fade-in-down backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              {t.hero.badge}
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              {t.hero.title_part1}{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent block mt-2 animate-gradient pb-1">{t.hero.title_part2}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground animate-fade-in-up delay-200">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-in-up delay-300">
              <Link href={`/${language}/products`}>
                <Button size="lg" className="gap-2 text-base hover-lift group w-full sm:w-auto">
                  {t.hero.cta_catalog}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent text-base hover-lift w-full sm:w-auto"
                >
                  {t.hero.cta_secondary}
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 items-center animate-fade-in-up delay-500 text-sm font-medium">
              <span className="text-muted-foreground">{t.hero.demoText}</span>
              <Link href={`/${language}/login?role=teacher`} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline transition-all">
                <span className="bg-indigo-100 p-1.5 rounded-lg"><Users className="h-4 w-4" /></span>
                {t.hero.teacherProfile}
              </Link>
              <Link href={`/${language}/login?role=student`} className="flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:underline transition-all">
                <span className="bg-purple-100 p-1.5 rounded-lg"><GraduationCap className="h-4 w-4" /></span>
                {t.hero.studentProfile}
              </Link>
            </div>

            {/* Stats */}
            <div ref={statsReveal.ref} className={cn("mt-12 grid grid-cols-3 gap-8", statsReveal.className)}>
              {stats.map((stat, index) => (
                <div
                  key={index} // Changed key to index as label changes with language
                  className="flex flex-col items-start"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 hover-glow transition-all duration-300">
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
          </div>

          {/* Image */}
          {/* Interactive Slideshow / Presentation */}
          <div ref={imageReveal.ref} className={cn("relative z-10", imageReveal.className)}>
            <div
              className="group relative aspect-square overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20 cursor-pointer"
              onMouseEnter={() => setIsPlaying(true)}
              onMouseLeave={() => {
                setIsPlaying(false);
                setCurrentSlide(0); // Reset to cover on leave for clean start
              }}
            >
              {/* Slideshow Images */}
              {slides.map((src, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                    index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                >
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-[10000ms] ease-linear",
                      isPlaying && index === currentSlide ? "scale-110" : "scale-100"
                    )}
                    priority={index === 0}
                  />
                  {/* Subtle overlay gradient for text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ))}

              {/* Play Button Overlay (Visible only when NOT playing/hovering first slide) */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-500 z-20",
                isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              )}>
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/30 opacity-75"></div>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl">
                      <Play className="h-6 w-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="overflow-hidden rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-md border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 relative">
                      <Image src="/kamila-lobko-koziej.jpg" fill alt="Avatar" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight truncate text-foreground">Kamila Łobko-Koziej</p>
                      <p className="text-xs text-muted-foreground truncate">{t.hero.viewSample}</p>
                    </div>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10">
                      <Volume2 className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-6 hover-lift glass animate-float-delayed z-30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-foreground">
                    {t.hero.verifiedBadge}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.hero.testedInClass}
                  </p>
                </div>
              </div>
            </div>
            {/* Second floating element */}
            <div className="absolute -top-4 -right-4 rounded-xl bg-primary text-white p-3 shadow-lg animate-float hidden lg:block z-30 gradient-ai shadow-premium">
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-xs uppercase tracking-wide opacity-90">{t.hero.materialsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

