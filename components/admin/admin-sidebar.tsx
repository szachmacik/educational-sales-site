"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FileText,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    Sparkles,
    Layout,
    Ticket,
    Zap,
    Mail
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/language-provider";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";

export function AdminSidebar() {
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const router = useRouter();
    const { toggleSidebar, state } = useSidebar();

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_role");
        router.push(`/${language}`);
    };

    // Safe translation access with English fallbacks
    const sidebar = t?.adminPanel?.sidebar || {
        title: "AdminPanel",
        subtitle: "Creative Studio",
        expand: "Expand",
        collapse: "Collapse",
        logout: "Logout Session",
        logoutTooltip: "Logout",
        menu: {}
    };
    const menu = sidebar.menu || {};

    const menuItems = [
        { title: menu.dashboard || "Dashboard", icon: LayoutDashboard, href: `/${language}/admin` },
        { title: menu.workshop || "AI Creative Studio", icon: Sparkles, href: `/${language}/admin/workshop`, premium: true },
        { title: menu.products || "Products", icon: Package, href: `/${language}/admin/products` },
        { title: menu.orders || "Orders", icon: ShoppingCart, href: `/${language}/admin/orders` },
        { title: menu.abandoned || "Abandoned Carts", icon: Package, href: `/${language}/admin/abandoned` },
        { title: menu.coupons || "Coupons", icon: Ticket, href: `/${language}/admin/coupons` },
        { title: menu.materials || "Materials", icon: BookOpen, href: `/${language}/admin/materials` },
        { title: menu.landing_builder || "Landing Builder", icon: Layout, href: `/${language}/admin/landing-builder` },
        { title: menu.offers || "Offer Generator", icon: Zap, href: `/${language}/admin/offers` },
        { title: menu.import || "Import AI", icon: Package, href: `/${language}/admin/import` },
        { title: menu.blog || "Blog", icon: FileText, href: `/${language}/admin/blog` },
        { title: menu.newsletter || "Newsletter", icon: Mail, href: `/${language}/admin/newsletter` },
        { title: menu.settings || "Settings", icon: Settings, href: `/${language}/admin/settings` },
    ];

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
            <SidebarHeader className="h-20 flex flex-col justify-center px-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-3">
                    <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", state === "collapsed" ? "opacity-0 invisible w-0" : "opacity-100 visible")}>
                        <BrandLogo size="sm" showText={false} />
                        <div className="flex flex-col">
                            <span className="font-extrabold text-lg text-slate-900 leading-tight truncate tracking-tighter">{sidebar.title}</span>
                            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest pl-0.5 flex items-center gap-1">
                                <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                                {sidebar.subtitle}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        title={state === "collapsed" ? sidebar.expand : sidebar.collapse}
                        className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border",
                            state === "collapsed"
                                ? "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700"
                                : "bg-white text-indigo-600 border-indigo-100 hover:bg-slate-50"
                        )}
                    >
                        <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", state === "collapsed" && "rotate-180")} />
                    </button>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-6">
                <SidebarMenu className="gap-2">
                    {menuItems.map((item) => {
                        const isActive = item.href === "/admin"
                            ? (pathname?.endsWith("/admin") ?? false)
                            : (pathname?.includes(item.href) ?? false);

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.title}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 font-semibold"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600",
                                        (item as any).premium && !isActive && "bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
                                    )}
                                >
                                    <Link href={item.href}>
                                        <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                                        <span className={cn("text-sm transition-opacity duration-300 flex-1 flex items-center justify-between", state === "collapsed" ? "opacity-0 invisible w-0" : "opacity-100 visible")}>
                                            {item.title}
                                            {(item as any).premium && (
                                                <Badge className="ml-2 bg-indigo-600 text-white border-none font-black text-[8px] uppercase tracking-tighter shadow-sm animate-pulse">AI</Badge>
                                            )}
                                        </span>
                                        {(item as any).premium && (
                                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-slate-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}
                            tooltip={sidebar.logoutTooltip}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className={cn("text-xs font-medium transition-opacity duration-300", state === "collapsed" ? "opacity-0 invisible w-0" : "opacity-100 visible")}>
                                {sidebar.logout}
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
