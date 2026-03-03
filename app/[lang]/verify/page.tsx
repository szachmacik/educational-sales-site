"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Certificate, SAMPLE_CERTIFICATES } from "@/lib/certificate-schema";
import { Search, CheckCircle2, XCircle, Award, ArrowRight } from "lucide-react";

const STORAGE_KEY = "user_certificates";

export default function VerifyCertificatePage() {
    const { t, language } = useLanguage();
    const v = t.verify;
    const [code, setCode] = useState("");
    const [result, setResult] = useState<{
        found: boolean;
        certificate?: Certificate;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!code.trim()) return;

        setLoading(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1000));

        const stored = localStorage.getItem(STORAGE_KEY);
        const certificates: Certificate[] = stored ? JSON.parse(stored) : SAMPLE_CERTIFICATES;

        const normalizedCode = code.toUpperCase().replace(/\s/g, "");
        const found = certificates.find(
            (c) => c.verificationCode.replace(/-/g, "") === normalizedCode.replace(/-/g, "")
        );

        setResult({
            found: !!found,
            certificate: found,
        });
        setLoading(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language, {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-16">
                <div className="mx-auto max-w-xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6">
                            <Award className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">{v.title}</h1>
                        <p className="text-muted-foreground">
                            {v.subtitle}
                        </p>
                    </div>

                    {/* Search Form */}
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        placeholder={v.placeholder}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        className="font-mono text-center text-lg tracking-wider"
                                        onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                                    />
                                </div>
                                <Button onClick={handleVerify} disabled={loading || !code.trim()}>
                                    {loading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Result */}
                    {result && (
                        <Card>
                            <CardContent className="pt-6">
                                {result.found && result.certificate ? (
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-green-700 mb-2">
                                            {v.success.title}
                                        </h2>
                                        <p className="text-muted-foreground mb-6">
                                            {v.success.desc}
                                        </p>

                                        <div className="text-left bg-muted/50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">{v.success.user}</span>
                                                <span className="font-medium">{result.certificate.userName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">{v.success.course}</span>
                                                <span className="font-medium">{result.certificate.courseTitle}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">{v.success.date}</span>
                                                <span className="font-medium">
                                                    {formatDate(result.certificate.completedAt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">{v.success.code}</span>
                                                <Badge variant="outline" className="font-mono">
                                                    {result.certificate.verificationCode}
                                                </Badge>
                                            </div>
                                        </div>

                                        <Button className="mt-6" asChild>
                                            <Link href={`/${language}/dashboard/certificate/${result.certificate.id}`}>
                                                {v.success.view}
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
                                            <XCircle className="h-8 w-8 text-red-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-red-700 mb-2">
                                            {v.error.title}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {v.error.desc}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
