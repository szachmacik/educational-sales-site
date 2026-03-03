"use client";

import React from "react";
import dynamic from "next/dynamic";
import { translations } from "@/lib/translations";

const SettingsContent = dynamic(() => import("./SettingsContent"), {
    ssr: false,
    loading: () => <div className="min-h-screen animate-pulse bg-background"></div>
});

export default function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);

    // Load dictionary for guard
    // @ts-ignore
    const dictionary = translations[lang] || {};

    return <SettingsContent dictionary={dictionary} />;
}
