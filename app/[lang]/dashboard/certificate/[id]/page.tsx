"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Certificate,
    CertificateTemplate,
    CERTIFICATE_TEMPLATES,
    SAMPLE_CERTIFICATES,
} from "@/lib/certificate-schema";
import { Download, Share2, CheckCircle2, ArrowLeft, Award } from "lucide-react";

const STORAGE_KEY = "user_certificates";

export default function CertificatePage() {
    const { t, language } = useLanguage();
    const params = useParams();
    const certificateId = params?.id as string;
    const certificateRef = useRef<HTMLDivElement>(null);

    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [template, setTemplate] = useState<CertificateTemplate>(CERTIFICATE_TEMPLATES[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const certificates: Certificate[] = stored ? JSON.parse(stored) : SAMPLE_CERTIFICATES;
        const found = certificates.find((c) => c.id === certificateId);
        setCertificate(found || null);
        setLoading(false);
    }, [certificateId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language, {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        // For MVP, we'll create a simple downloadable version
        // In production, use html2canvas or server-side PDF generation
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t.certificates.title} - ${certificate?.courseTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
            body { margin: 0; padding: 40px; font-family: 'Inter', sans-serif; }
            .certificate { 
              width: 800px; 
              min-height: 600px; 
              margin: 0 auto; 
              padding: 60px;
              background: ${template.backgroundColor};
              border: 8px double ${template.borderColor};
              text-align: center;
              color: ${template.textColor};
            }
            .title { 
              font-family: 'Playfair Display', serif; 
              font-size: 48px; 
              margin-bottom: 20px;
              color: ${template.accentColor};
            }
            .subtitle { font-size: 18px; margin-bottom: 40px; opacity: 0.8; }
            .recipient { font-size: 36px; font-weight: 600; margin: 30px 0; }
            .course { font-size: 24px; margin: 20px 0; }
            .date { font-size: 14px; margin-top: 40px; opacity: 0.7; }
            .code { font-family: monospace; font-size: 12px; margin-top: 20px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="title">${t.certificates.title}</div>
            <div class="subtitle">${t.certificates.subtitle}</div>
            <div class="recipient">${certificate?.userName}</div>
            <div class="subtitle">${t.certificates.completedCourse}</div>
            <div class="course">${certificate?.courseTitle}</div>
            <div class="date">${t.certificates.completionDate} ${formatDate(certificate?.completedAt || '')}</div>
            <div class="code">${t.certificates.verificationCode} ${certificate?.verificationCode}</div>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const handleShare = async () => {
        if (typeof window === 'undefined') return;
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({
                title: `${t.certificates.title} - ${certificate?.courseTitle}`,
                text: `${certificate?.userName} ${t.certificates.completedCourse}: ${certificate?.courseTitle}`,
                url,
            });
        } else {
            await navigator.clipboard.writeText(url);
            toast.success(t.certificates.copySuccess);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-8 text-center">
                        <h1 className="text-xl font-bold mb-4">{t.certificates.notFound}</h1>
                        <Button asChild>
                            <Link href={`/${language}/dashboard`}>{t.certificates.backToDashboard}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Actions */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" asChild>
                        <Link href={`/${language}/dashboard`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t.certificates.backToDashboard}
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            {t.certificates.share}
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            {t.certificates.downloadPdf}
                        </Button>
                    </div>
                </div>

                {/* Certificate */}
                <div
                    ref={certificateRef}
                    className="relative rounded-lg shadow-2xl overflow-hidden"
                    style={{ backgroundColor: template.backgroundColor }}
                >
                    <div
                        className="absolute inset-4 border-4 border-double rounded-lg pointer-events-none"
                        style={{ borderColor: template.borderColor }}
                    />

                    <div className="relative p-16 text-center" style={{ color: template.textColor }}>
                        {/* Award Icon */}
                        <div
                            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: template.accentColor + '20' }}
                        >
                            <Award className="h-10 w-10" style={{ color: template.accentColor }} />
                        </div>

                        {/* Title */}
                        <h1
                            className="font-serif text-5xl font-bold mb-4"
                            style={{ color: template.accentColor }}
                        >
                            {t.certificates.title}
                        </h1>

                        <p className="text-lg opacity-80 mb-8">{t.certificates.subtitle}</p>

                        {/* Recipient */}
                        <p className="text-4xl font-bold mb-4">{certificate.userName}</p>

                        <p className="text-lg opacity-80 mb-6">{t.certificates.completedCourse}</p>

                        {/* Course */}
                        <p className="text-2xl font-semibold mb-12">{certificate.courseTitle}</p>

                        {/* Date */}
                        <p className="text-sm opacity-70 mb-2">
                            {t.certificates.completionDate} {formatDate(certificate.completedAt)}
                        </p>

                        {/* Verification */}
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Badge
                                variant="outline"
                                className="font-mono text-xs px-4 py-1"
                                style={{ borderColor: template.accentColor, color: template.accentColor }}
                            >
                                {certificate.verificationCode}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Verification Info */}
                <Card className="mt-8">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-green-100">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{t.certificates.verifiedTitle}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t.certificates.verifiedDesc}
                                    {t.certificates.verificationCode} <code className="font-mono">{certificate.verificationCode}</code>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Template Selector (optional) */}
                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">{t.certificates.styleTitle}</h3>
                        <div className="flex gap-4">
                            {CERTIFICATE_TEMPLATES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTemplate(t)}
                                    className={`w-16 h-16 rounded-lg border-2 transition-all ${template.id === t.id ? "ring-2 ring-primary ring-offset-2" : ""
                                        }`}
                                    style={{
                                        backgroundColor: t.backgroundColor,
                                        borderColor: t.borderColor,
                                    }}
                                    title={t.name}
                                >
                                    <Award className="h-6 w-6 mx-auto" style={{ color: t.accentColor }} />
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
