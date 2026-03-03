// Certificate schema and types

export interface Certificate {
    id: string;
    courseSlug: string;
    courseTitle: string;
    userId: string;
    userName: string;
    completedAt: string;
    issuedAt: string;
    verificationCode: string;
    templateId?: string;
}

export interface CertificateTemplate {
    id: string;
    name: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    accentColor: string;
    logoUrl?: string;
    signatureUrl?: string;
}

// Generate unique verification code
export function generateVerificationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export function generateCertificateId(): string {
    return `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Sample templates
export const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
    {
        id: "classic",
        name: "Klasyczny",
        backgroundColor: "#FFFEF7",
        borderColor: "#8B7355",
        textColor: "#2C2C2C",
        accentColor: "#B8860B",
    },
    {
        id: "modern",
        name: "Nowoczesny",
        backgroundColor: "#1A1A2E",
        borderColor: "#4A4A6A",
        textColor: "#FFFFFF",
        accentColor: "#00D9FF",
    },
    {
        id: "elegant",
        name: "Elegancki",
        backgroundColor: "#F5F5F5",
        borderColor: "#C9B037",
        textColor: "#333333",
        accentColor: "#C9B037",
    },
];

// Sample certificates for demo
export const SAMPLE_CERTIFICATES: Certificate[] = [
    {
        id: "cert_1",
        courseSlug: "teaching-english-basics",
        courseTitle: "Podstawy nauczania języka angielskiego",
        userId: "user_1",
        userName: "Jan Kowalski",
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        verificationCode: "ABCD-1234-EFGH",
    },
];
