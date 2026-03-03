"use client";

import React from "react";
import dynamic from "next/dynamic";

import AbandonedContent from "./AbandonedContent";

export default function AbandonedPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);

    return <AbandonedContent lang={lang} />;
}
