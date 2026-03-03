"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

import { useLanguage } from "@/components/language-provider";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success("Adres dodany do bazy mailingowej (wersja demonstracyjna)");
      console.log(`[Admin Notification] New newsletter signup: ${email}`);
    }
  };

  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-card p-8 shadow-lg sm:p-12 lg:p-16 premium-card-ring shadow-premium">
          {/* Decorative elements */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>

            <h2 className="font-serif text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-4xl pb-1">
              {t.newsletter.header}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.newsletter.sub}
            </p>

            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                <Input
                  type="email"
                  placeholder={t.newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 bg-background px-4 text-base"
                  required
                />
                <Button type="submit" size="lg" className="h-12 gap-2 px-8">
                  <Sparkles className="h-4 w-4" />
                  {t.newsletter.button}
                </Button>
              </form>
            ) : (
              <div className="mt-8 flex items-center justify-center gap-3 rounded-xl bg-primary/10 p-4 text-primary">
                <Check className="h-5 w-5" />
                <span className="font-medium">
                  {t.newsletter.success}
                </span>
              </div>
            )}

            <p className="mt-4 text-sm text-muted-foreground">
              {t.newsletter.privacy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
