"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, ChevronDown, LayoutDashboard, LogOut, Settings, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/brand-logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { getUserPoints } from "@/lib/points-service";
import { Coins } from "lucide-react";

import { InAppNotifications } from "@/components/in-app-notifications";
import { SearchModal } from "@/components/search-modal";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const { t, language } = useLanguage();
  const { itemCount } = useCart();

  const navLinks = [
    { name: t.nav.products, href: `/${language}/products` },
    { name: t.nav.blog, href: `/${language}/blog` },
    { name: t.nav.faq || "FAQ", href: `/${language}/faq` },
    { name: t.nav.contact, href: `/${language}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [points, setPoints] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const role = localStorage.getItem("user_role");
    const subRole = localStorage.getItem("user_sub_role");
    const userEmail = localStorage.getItem("user_email") || "";

    setIsLoggedIn(!!token);
    setIsAdmin(role === "admin");
    setUserRole(role || "");

    if (token) {
      // Resolve a precise, human-readable name from subRole first
      const subRoleLabel: Record<string, string> = {
        child: "Dziecko",
        learner: "Uczeń Szkolny",
        parent_independent: "Rodzic",
        parent_school_plan: "Rodzic (Plan Szkolny)",
        teacher_private: "Nauczyciel Prywatny",
        teacher_school: "Nauczyciel Szkolny",
        institution_public: "Szkoła / Placówka",
        institution_language: "Szkoła Językowa",
      };

      if (role === "admin") {
        setUserName("SuperAdmin");
      } else if (subRole && subRoleLabel[subRole]) {
        setUserName(subRoleLabel[subRole]);
      } else if (role === "teacher") {
        setUserName(t.auth.roleTeacher || "Nauczyciel");
      } else if (role === "student") {
        setUserName(t.auth.roleStudent || "Uczeń");
      } else {
        setUserName(role || "Konto");
      }

      const userPoints = getUserPoints(userEmail);
      setPoints(userPoints.balance);
    }
  }, [t]);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      router.push(`/${language}/dashboard`);
    } else {
      router.push(`/${language}/login`);
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_sub_role");
    document.cookie = "user_token=; path=/; max-age=0";
    setIsLoggedIn(false);
    router.push(`/${language}`);
  };

  return (
    <header className="glass-header">
      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <BrandLogo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href={`/${language}/admin`}
              className="rounded-lg px-4 py-2 text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-1.5"
            >
              <Settings className="h-4 w-4" />
              {t.nav.adminPanel}
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <SearchModal />
          <LanguageSwitcher />

          {isLoggedIn && <InAppNotifications />}

          <Link href={`/${language}/cart`}>
            <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* SuperAdmin Quick Access Button */}
          {isLoggedIn && isAdmin && (
            <Link href={`/${language}/admin`}>
              <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 rounded-lg">
                <Settings className="h-3.5 w-3.5" />
                SuperAdmin
              </Button>
            </Link>
          )}

          {/* Points Widget */}
          {isLoggedIn && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-sm transition-transform hover:scale-105">
              <Coins className="h-4 w-4 fill-amber-500" />
              <div className="flex flex-col -space-y-1">
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-70 leading-none">
                  {t.points?.name || "Kamila Points"}
                </span>
                <span className="text-sm font-black tabular-nums leading-tight">
                  {points.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} variant="ghost" className="gap-2 pl-2 pr-3 ml-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {userName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{userName}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {localStorage.getItem("user_email") || ""}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${language}/admin`}
                        className="flex items-center gap-2 cursor-pointer font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        <Settings className="h-4 w-4" />
                        {t.nav.adminPanel}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/${language}/dashboard`} className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    {userRole === 'teacher' ? 'Panel Nauczyciela' :
                      userRole === 'parent' ? 'Panel Rodzica' :
                        userRole === 'institution' ? 'Panel Placówki' :
                          userRole === 'admin' ? 'Admin Panel' :
                            t.auth.studentPanel || 'Mój Panel'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${language}/products`} className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    {t.auth.myCourses}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.auth.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="gap-2 bg-transparent ml-2" onClick={handleLoginClick}>
              <User className="h-4 w-4" />
              {t.nav.login}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-1 lg:hidden">
          <SearchModal />
          {isLoggedIn && <InAppNotifications />}
          <LanguageSwitcher />
          <Link href={`/${language}/cart`}>
            <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 pt-8">
                {/* User info for mobile */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 px-4 pb-4 border-b border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {userName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{userName}</p>
                      <p className="text-sm text-muted-foreground">demo@example.com</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                      <Coins className="h-4 w-4 fill-amber-500" />
                      <span className="text-sm font-black tabular-nums">{points.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link
                      href={`/${language}/admin`}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-4 py-3 text-base font-bold text-indigo-600 transition-colors hover:bg-indigo-50 flex items-center gap-2"
                    >
                      <Settings className="h-5 w-5" />
                      {t.nav.adminPanel}
                    </Link>
                  )}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  {isLoggedIn ? (
                    <>
                      <Button
                        className="w-full gap-2"
                        onClick={() => { setIsOpen(false); router.push(`/${language}/dashboard`); }}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t.auth.studentPanel}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-destructive hover:text-destructive"
                        onClick={() => { setIsOpen(false); handleLogout(); }}
                      >
                        <LogOut className="h-4 w-4" />
                        {t.auth.logout}
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full gap-2" onClick={() => { setIsOpen(false); window.location.href = `/${language}/login`; }}>
                      <User className="h-4 w-4" />
                      {t.nav.login}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}