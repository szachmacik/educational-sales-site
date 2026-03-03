"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useLanguage } from "@/components/language-provider";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/materialy.edukacyjne.dla.nauczycieli.angielskiego",
    icon: Facebook,
  },
  { name: "Instagram", href: "https://www.instagram.com/kamilaenglish", icon: Instagram },
  { name: "YouTube", href: "https://www.youtube.com/@kamilaenglish", icon: Youtube },
  { name: "Email", href: "mailto:kontakt@kamilaenglish.com", icon: Mail },
];

export function Footer() {
  const { t, language } = useLanguage();

  const footerLinks = {
    sklep: {
      title: t.footer.groups.shop,
      links: [
        { name: t.footer.links.catalog, href: `/${language}/products` },
        { name: t.footer.links.materials, href: `/${language}/products` },
        { name: t.footer.links.projects, href: `/${language}/products` },
        { name: t.footer.links.scenarios, href: `/${language}/products` },
        { name: t.footer.links.packs, href: `/${language}/products` },
      ],
    },
    informacje: {
      title: t.footer.groups.info,
      links: [
        { name: t.footer.links.about, href: `/${language}/#about` },
        { name: t.footer.links.contact, href: `/${language}/contact` },
        { name: t.footer.links.privacy, href: `/${language}/polityka-prywatnosci` },
        { name: t.footer.links.terms, href: `/${language}/regulamin` },
        { name: "Polityka Cookies", href: `/${language}/polityka-cookies` },
      ],
    },
    pomoc: {
      title: t.footer.groups.help,
      links: [
        { name: t.footer.links.howToBuy, href: `/${language}/jak-kupic` },
        { name: t.footer.links.faq, href: `/${language}/faq` },
        { name: t.footer.links.returns, href: `/${language}/zwroty` },
        { name: t.footer.links.account, href: `/${language}/dashboard` },
      ],
    },
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <BrandLogo />
            <p className="mt-4 max-w-xs text-muted-foreground">
              {t.footer.description}
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Kamila Łobko-Koziej. {t.footer.rights}
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href={`/${language}/polityka-prywatnosci`}
                className="text-muted-foreground hover:text-primary"
              >
                {t.footer.links.privacy}
              </Link>
              <Link
                href={`/${language}/polityka-cookies`}
                className="text-muted-foreground hover:text-primary"
              >
                Polityka Cookies
              </Link>
              <Link
                href={`/${language}/regulamin`}
                className="text-muted-foreground hover:text-primary"
              >
                {t.footer.links.terms}
              </Link>
              <Link
                href={`/${language}/admin`}
                className="text-muted-foreground hover:text-primary font-semibold"
              >
                {t.footer.links.admin}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
