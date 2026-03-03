"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle2, Download, FileText, Headphones, Layers, Printer, Sparkles, Clock } from "lucide-react";
import { Product } from "@/lib/product-catalog";
import { useLanguage } from "@/components/language-provider";

interface ProductFeaturesProps {
    product: Product;
}

export function ProductFeatures({ product }: ProductFeaturesProps) {
    const { t } = useLanguage();
    const features = getFeaturesByCategory(product, t);

    // Safe feature translation refs
    const ft = t?.products?.features;

    return (
        <div className="space-y-8">
            {/* Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-muted/50 border-none shadow-none hover:bg-muted transition-colors">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                            <div className="p-2 bg-background rounded-full shadow-sm text-primary">
                                {feature.icon}
                            </div>
                            <span className="text-sm font-medium">{feature.label}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Description */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    {ft?.header || "O produkcie"}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                    {product.description}
                </p>
            </div>

            {/* Accordion Details */}
            <Accordion type="single" collapsible className="w-full" defaultValue="content">
                <AccordionItem value="content">
                    <AccordionTrigger className="text-lg font-semibold">{ft?.whatsIncluded || "Co zawiera produkt?"}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            <p className="text-muted-foreground">{ft?.immediateAccess || "Natychmiastowy dostęp po zakupie."}</p>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>{ft?.highQualityPdf || "Wysokiej jakości pliki PDF"}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>{ft?.printReady || "Gotowe do druku"}</span>
                                </li>
                                {product.categories?.includes('stories') && (product.title.toLowerCase().includes('audio') || product.description.toLowerCase().includes('audio')) && (
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                        <span>{ft?.nativeAudio || "Nagrania lektora native speakera"}</span>
                                    </li>
                                )}
                                {product.categories?.includes('scenariusze') && (
                                    <>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                            <span>{ft?.detailedPlan || "Szczegółowy scenariusz zajęć"}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                            <span>{ft?.materialsList || "Lista materiałów"}</span>
                                        </li>
                                    </>
                                )}
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>{ft?.educationLicense || "Licencja edukacyjna"}</span>
                                </li>
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery">
                    <AccordionTrigger className="text-lg font-semibold">{ft?.deliveryPayment || "Dostawa i płatność"}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2 text-muted-foreground">
                            <p>
                                {ft?.deliveryInfo || "Produkt cyfrowy — dostępny natychmiast po opłaceniu zamówienia."}
                            </p>
                            <div className="flex items-center gap-2 text-foreground font-medium">
                                <Download className="h-4 w-4" />
                                <span>{ft?.autoShipping || "Automatyczna wysyłka na e-mail"}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="guarantee">
                    <AccordionTrigger className="text-lg font-semibold">{ft?.qualityGuarantee || "Gwarancja jakości"}</AccordionTrigger>
                    <AccordionContent>
                        <div className="prose prose-sm text-muted-foreground pt-2">
                            <p>
                                {ft?.qualityInfo || "Nasze materiały są tworzone przez doświadczonych nauczycieli i testowane w praktyce."}
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

function getFeaturesByCategory(product: Product, t: any) {
    const ft = t?.products?.features;
    const baseFeatures = [
        { icon: <FileText className="h-5 w-5" />, label: ft?.pdf || "PDF" },
        { icon: <Printer className="h-5 w-5" />, label: ft?.print || "Druk" },
    ];

    if (product.categories?.includes('mega-pack') || product.categories?.includes('zlobek')) {
        return [
            ...baseFeatures,
            { icon: <Layers className="h-5 w-5" />, label: ft?.bigPack || "Duży pakiet" },
            { icon: <Clock className="h-5 w-5" />, label: ft?.didactic || "Dydaktyczny" },
        ];
    }

    if (product.categories?.includes('stories') && (product.title.toLowerCase().includes('audio') || product.description.toLowerCase().includes('audio'))) {
        return [
            ...baseFeatures,
            { icon: <Headphones className="h-5 w-5" />, label: ft?.audio || "Audio" },
            { icon: <Sparkles className="h-5 w-5" />, label: ft?.engaging || "Angażujący" },
        ];
    }

    return [
        ...baseFeatures,
        { icon: <Download className="h-5 w-5" />, label: ft?.instant || "Natychmiastowy" },
        { icon: <CheckCircle2 className="h-5 w-5" />, label: ft?.checked || "Sprawdzony" },
    ];
}
