import { NextRequest, NextResponse } from "next/server";
import productsData from "@/lib/data/products.json";

/**
 * Extracts platform and ID from various URL formats
 */
function parseInteractiveUrl(url: string) {
    // Wordwall
    const wwMatch = url.match(/wordwall\.net\/(?:embed\/)?(?:resource|play)\/(\d+)/);
    if (wwMatch) return { platform: 'wordwall', id: wwMatch[1] };

    // Genially
    const genMatch = url.match(/genial\.ly\/(?:[a-z]{2}\/)?([a-f0-9]{24})/i) || url.match(/view\.genial\.ly\/([a-f0-9]{24})/i);
    if (genMatch) return { platform: 'genially', id: genMatch[1] };

    // LearningApps
    const laMatch = url.match(/learningapps\.org\/(?:watch\?v=)?(p[a-z0-9]+)/i);
    if (laMatch) return { platform: 'learningapps', id: laMatch[1] };

    // Google Slides
    const slidesMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-z0-9_-]+)/i);
    if (slidesMatch) return { platform: 'googleslides', id: slidesMatch[1] };

    // Canva
    const canvaMatch = url.match(/canva\.com\/design\/([a-z0-9_-]+)/i);
    if (canvaMatch) return { platform: 'canva', id: canvaMatch[1] };

    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-z0-9_-]{11})/i);
    if (ytMatch) return { platform: 'youtube', id: ytMatch[1] };

    // Quizizz
    const quizizzMatch = url.match(/quizizz\.com\/admin\/quiz\/([a-z0-9]+)/i) || url.match(/quizizz\.com\/join\/quiz\/([a-z0-9]+)/i);
    if (quizizzMatch) return { platform: 'quizizz', id: quizizzMatch[1] };

    // Kahoot
    const kahootMatch = url.match(/create\.kahoot\.it\/details\/([a-z0-9-]+)/i) || url.match(/kahoot\.it\/challenge\/([a-z0-9-]+)/i);
    if (kahootMatch) return { platform: 'kahoot', id: kahootMatch[1] };

    // Padlet
    const padletMatch = url.match(/padlet\.com\/([a-z0-9_-]+\/[a-z0-9_-]+)/i);
    if (padletMatch) return { platform: 'padlet', id: padletMatch[1] };

    // Loom
    const loomMatch = url.match(/loom\.com\/share\/([a-z0-9]+)/i);
    if (loomMatch) return { platform: 'loom', id: loomMatch[1] };

    // NotebookLM
    const notebookMatch = url.match(/notebooklm\.google\.com\/(?:u\/\d+\/)?notebook\/([a-z0-9_-]+)/i);
    if (notebookMatch) return { platform: 'notebooklm', id: notebookMatch[1] };

    // Vocaroo
    const vocarooMatch = url.match(/vocaroo\.com\/([a-z0-9]+)/i);
    if (vocarooMatch) return { platform: 'vocaroo', id: vocarooMatch[1] };

    return null;
}

function getPlatformConfig(platform: string, id: string) {
    const configs: Record<string, any> = {
        wordwall: {
            canonicalUrl: `https://wordwall.net/resource/${id}`,
            embedHtml: `<iframe src="https://wordwall.net/embed/resource/${id}" width="500" height="380" frameborder="0" allowfullscreen=""></iframe>`,
            category: 'wordwall'
        },
        genially: {
            canonicalUrl: `https://view.genial.ly/${id}`,
            embedHtml: `<iframe src="https://view.genial.ly/${id}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`,
            category: 'genially'
        },
        learningapps: {
            canonicalUrl: `https://learningapps.org/watch?v=${id}`,
            embedHtml: `<iframe src="https://learningapps.org/watch?v=${id}" style="border:0px;width:100%;height:500px" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>`,
            category: 'learningapps'
        },
        googleslides: {
            canonicalUrl: `https://docs.google.com/presentation/d/${id}/edit`,
            embedHtml: `<iframe src="https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="100%" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`,
            category: 'presentations'
        },
        canva: {
            canonicalUrl: `https://www.canva.com/design/${id}/view`,
            embedHtml: `<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;"><iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;${id}&#x2F;view?embed" allowfullscreen="allowfullscreen" allow="fullscreen"></iframe></div>`,
            category: 'presentations'
        },
        youtube: {
            canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
            embedHtml: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
            category: 'video'
        },
        quizizz: {
            canonicalUrl: `https://quizizz.com/admin/quiz/${id}`,
            embedHtml: `<iframe src="https://quizizz.com/join/quiz/${id}/start" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`,
            category: 'quiz'
        },
        kahoot: {
            canonicalUrl: `https://create.kahoot.it/details/${id}`,
            embedHtml: `<iframe src="https://embed.kahoot.it/${id}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`,
            category: 'quiz'
        },
        padlet: {
            canonicalUrl: `https://padlet.com/${id}`,
            embedHtml: `<iframe src="https://padlet.com/embed/${id}" frameborder="0" allow="camera;microphone;geolocation" style="width:100%;height:600px;display:block;padding:0;margin:0"></iframe>`,
            category: 'interactive-game'
        },
        loom: {
            canonicalUrl: `https://www.loom.com/share/${id}`,
            embedHtml: `<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/${id}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`,
            category: 'video'
        },
        vocaroo: {
            canonicalUrl: `https://vocaroo.com/${id}`,
            embedHtml: `<iframe width="300" height="60" src="https://vocaroo.com/embed/${id}?autoplay=0" frameborder="0"></iframe>`,
            category: 'audio'
        },
        notebooklm: {
            canonicalUrl: `https://notebooklm.google.com/notebook/${id}`,
            embedHtml: `<div class="bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-100 text-center"><h3 class="text-xl font-bold text-indigo-900 mb-4">NotebookLM AI Overview</h3><p class="text-indigo-600 mb-6 font-medium">Click below to open the interactive AI notebook with lesson materials.</p><a href="https://notebooklm.google.com/notebook/${id}" target="_blank" class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-colors">Open NotebookLM</a></div>`,
            category: 'ai-tools'
        }
    };
    return configs[platform];
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export async function POST(request: NextRequest) {
    try {
        const { urls } = await request.json();

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json({ error: "URLs array is required" }, { status: 400 });
        }

        const existingUrls = new Set(productsData.map((p: any) => p.source?.url).filter(Boolean));

        const newProducts = [];
        let skippedCount = 0;

        for (const url of urls) {
            const info = parseInteractiveUrl(url);
            if (!info) continue;

            const config = getPlatformConfig(info.platform, info.id);
            if (config && existingUrls.has(config.canonicalUrl)) {
                skippedCount++;
                continue;
            }

            if (!config) continue;

            // Try to guess title from URL
            const urlParts = url.split('/').filter(Boolean);
            let title = urlParts[urlParts.length - 1];
            if (title === 'edit' || title === 'view' || title === 'embed' || title === 'share' || title === 'details' || title === 'watch') {
                title = urlParts[urlParts.length - 2];
            }
            title = title || `${info.platform} Resource ${info.id}`;
            title = title.split('?')[0].replace(/[_-]/g, ' ');
            title = title.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            const desc = `Educational ${info.platform} resource: ${title}. Ready to use in your lessons.`;

            newProducts.push({
                title: title,
                description: desc,
                price: 15,
                url: `https://www.sklep.kamilaenglish.com/index.php/product/${slugify(title)}/`,
                categories: ["digital-resource", config.category],
                image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop",
                source: {
                    url: config.canonicalUrl,
                    importedAt: new Date().toISOString(),
                    aiEnhanced: true,
                    embedHtml: config.embedHtml
                }
            });
        }

        return NextResponse.json({
            success: true,
            products: newProducts,
            skippedCount
        });
    } catch (error) {
        console.error("Interactive sync error:", error);
        return NextResponse.json({ error: "Failed to sync interactive activities" }, { status: 500 });
    }
}
