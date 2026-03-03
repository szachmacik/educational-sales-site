"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Download, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Certificate, SAMPLE_CERTIFICATES } from "@/lib/certificate-schema";
import { toast } from "sonner";

const STORAGE_KEY = "user_certificates";

interface CertificatesSectionProps {
    user: { name: string; role: 'student' | 'teacher' | 'admin' | 'school' };
}

export function CertificatesSection({ user }: CertificatesSectionProps) {
    const { t, language } = useLanguage();
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setCertificates(JSON.parse(stored));
        } else {
            // For demo/student account, show samples
            setCertificates(SAMPLE_CERTIFICATES);
        }
    }, []);

    if (certificates.length === 0) {
        return (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center min-h-[300px] bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-10 w-10 text-slate-300 group-hover:text-indigo-500" />
                </div>
                <div className="text-center p-6 space-y-2">
                    <h3 className="font-bold text-slate-700 text-lg">{t.dashboard?.certificates?.none || "No certificates"}</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        {user.role === 'teacher'
                            ? (t.dashboard?.certificates?.teacher_desc || "Certificates are awarded after Masterclass courses.")
                            : (t.dashboard?.certificates?.student_desc || "Complete course in 100% to get diploma!")}
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                    <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                        <div className="p-1 bg-gradient-to-r from-amber-400 to-amber-200" />
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{t.certificates?.completionDate || "Date"}</p>
                                    <p className="text-xs font-bold text-slate-700">
                                        {new Date(cert.completedAt).toLocaleDateString(language)}
                                    </p>
                                </div>
                            </div>

                            <h3 className="font-black text-slate-900 text-lg mb-1 leading-tight">
                                {cert.courseTitle}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium mb-6">
                                {t.certificates?.title || "Certificate of Completion"}
                            </p>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full" />
                                </div>
                                <span className="text-[10px] font-black text-green-600 uppercase">100%</span>
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 rounded-lg font-bold" asChild>
                                    <Link href={`/${language}/dashboard/certificate/${cert.id}`}>
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                        {t.verify?.success?.view || "View"}
                                    </Link>
                                </Button>
                                 <Button 
                                    size="sm" 
                                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-all active:scale-95"
                                    onClick={() => {
                                        const tid = toast.loading(`${t.certificates?.generating || "Generowanie PDF"}...`);
                                        setTimeout(() => {
                                            toast.success(`${t.certificates?.downloaded || "Certyfikat pobrany pomyślnie!"}`, { id: tid });
                                        }, 1500);
                                    }}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">{t.dashboard?.certificates?.verifyTitle || "Verify existing code?"}</h4>
                        <p className="text-xs text-slate-500">{t.dashboard?.certificates?.verifyDesc || "If you have a physical code, you can verify its authenticity here."}</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-xl font-bold bg-white" asChild>
                    <Link href={`/${language}/verify`}>
                        {t.nav?.verify || "Verify Code"}
                    </Link>
                </Button>
            </div>
        </div>
    );
}
