"use client";
import { useParams } from "next/navigation";

import React from "react";
import dynamic from "next/dynamic";

import AbandonedContent from "./AbandonedContent";

export default function AbandonedPage() {
    const params = useParams();
    const lang = (params?.lang as string) || 'pl';

    return <AbandonedContent lang={lang} />;
}
