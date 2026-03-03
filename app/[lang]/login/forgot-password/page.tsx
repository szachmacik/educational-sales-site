"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { requestPasswordReset } from "@/lib/auth";
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const { t, language } = useLanguage();
    const l = t.login;
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await requestPasswordReset(email);
            if (result) {
                setSuccess(true);
            } else {
                setError(l.errorSystem);
            }
        } catch (err) {
            setError(l.errorSystem);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted/40">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm shadow-xl border-primary/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            {success ? l.checkEmail : l.forgotPassword}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {success
                                ? l.emailCheckDesc
                                : "Enter your email address to receive password reset instructions."}
                        </CardDescription>
                    </CardHeader>

                    {!success ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="grid gap-4">
                                {error && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        {l.email}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                                <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t.common?.loading || "Processing..."}
                                        </>
                                    ) : (
                                        l.resetPassword
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-muted-foreground"
                                    onClick={() => router.push(`/${language}/login`)}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {l.backToLogin}
                                </Button>
                            </CardFooter>
                        </form>
                    ) : (
                        <CardContent className="space-y-6 pt-4 text-center">
                            <div className="flex justify-center">
                                <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                {l.magicLinkSent}
                            </p>
                            <Button
                                onClick={() => router.push(`/${language}/login`)}
                                className="w-full h-12 rounded-xl font-bold"
                            >
                                {l.backToLogin}
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>
            <Footer />
        </div>
    );
}
