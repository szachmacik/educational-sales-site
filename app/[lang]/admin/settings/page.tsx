"use client";
import { useParams } from "next/navigation";


import React from "react";
import dynamic from "next/dynamic";
import { translations } from "@/lib/translations";

const SettingsContent = dynamic(() => import("./SettingsContent"), {
    ssr: false,
    loading: () => <div className="min-h-screen animate-pulse bg-background"></div>
});

export default function SettingsPage() {
    const params = useParams();
    const lang = (params?.lang as string) || 'pl';

    // Load dictionary for guard
    const dictionary = (translations as Record<string, Record<string, unknown>>)[lang] || {}

    return <SettingsContent dictionary={dictionary} />;
}
