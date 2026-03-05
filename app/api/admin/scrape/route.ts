
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;

        try {
        const { url, cookie } = await request.json();
        if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });
        // SECURITY: Allowlist to prevent SSRF attacks
        const ALLOWED_DOMAINS = ['wordwall.net', 'genial.ly', 'genially.com', 'learningapps.org', 'quizlet.com'];
        try {
            const parsedUrl = new URL(url);
            const isAllowed = ALLOWED_DOMAINS.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith('.' + d));
            if (!isAllowed) {
                return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
            }
        } catch {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }


        // Add a timeout to prevent long-hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const isWordwall = url.includes("wordwall.net/resource") || url.includes("wordwall.net/play");
            const isWordwallCollection = url.includes("wordwall.net") && (url.includes("/teacher/") || url.includes("/myactivities") || url.includes("/folders"));

            if (isWordwall && !isWordwallCollection) {
                const oembedUrl = `https://wordwall.net/api/oembed?url=${encodeURIComponent(url)}&format=json`;
                const oembedResponse = await fetch(oembedUrl, {
                    signal: controller.signal,
                    headers: {
                        "Cookie": url.includes("wordwall.net") ? (cookie || "") : ""
                    }
                });

                if (oembedResponse.ok) {
                    const data = await oembedResponse.json();
                    return NextResponse.json({
                        title: data.title,
                        image: data.thumbnail_url,
                        description: `Wordwall interactive resource by ${data.author_name || 'Teacher'}.`,
                        url: url,
                        platform: "wordwall",
                        embedHtml: data.html
                    });
                }
            }

            // Google Drive / Slides Support
            if (url.includes("docs.google.com") || url.includes("drive.google.com")) {
                const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
                const fileId = fileIdMatch?.[1];
                const isSlides = url.includes("presentation");

                if (fileId) {
                    return NextResponse.json({
                        title: isSlides ? "Google Slides Presentation" : "Google Drive Resource",
                        image: isSlides
                            ? `https://docs.google.com/presentation/d/${fileId}/export/png`
                            : "https://ssl.gstatic.com/docs/doclist/images/icon_10_generic_list.png",
                        description: "Cloud-based educational resource.",
                        url: url,
                        platform: isSlides ? "google_slides" : "google_drive"
                    });
                }
            }

            // Universal oEmbed Discovery / Meta Tag Scraper
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9,pl;q=0.8",
                    "Cookie": url.includes("wordwall.net") ? (cookie || "") : ""
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                return NextResponse.json({
                    error: `Platform returned status ${response.status}`,
                    status: response.status,
                    url: url
                }, { status: 200 });
            }

            const html = await response.text();

            // Wordwall Collection Support
            if (isWordwallCollection) {
                const activityLinks = Array.from(html.matchAll(/href="(\/(?:resource|play)\/\d+\/[^"]+)"/g))
                    .map(match => `https://wordwall.net${match[1]}`);

                // Remove duplicates
                const uniqueLinks = Array.from(new Set(activityLinks));

                if (uniqueLinks.length > 0) {
                    return NextResponse.json({
                        isCollection: true,
                        platform: "wordwall",
                        title: "Wordwall Collection",
                        items: uniqueLinks.map(link => ({
                            url: link,
                            platform: "wordwall",
                            title: link.split('/').pop()?.replace(/-/g, ' ') || "Wordwall Activity",
                        }))
                    });
                }
            }

            // Genially Profile Support
            if (url.includes("genial.ly/profile/")) {
                const geniallyLinks = Array.from(html.matchAll(/href="(https:\/\/view\.genial\.ly\/[a-zA-Z0-9-_]+)"/g))
                    .map(match => match[1]);

                const uniqueGeniallyLinks = Array.from(new Set(geniallyLinks));

                if (uniqueGeniallyLinks.length > 0) {
                    return NextResponse.json({
                        isCollection: true,
                        platform: "genially",
                        title: "Genially Profile",
                        items: uniqueGeniallyLinks.map(link => ({
                            url: link,
                            platform: "genially",
                            title: "Genially Asset",
                        }))
                    });
                }
            }

            // 1. Try oEmbed Discovery (Standard)
            const oembedDiscoveryMatch = html.match(/<link[^>]+type="application\/json\+oembed"[^>]+href="([^"]+)"/i) ||
                html.match(/<link[^>]+href="([^"]+)"[^>]+type="application\/json\+oembed"/i);

            if (oembedDiscoveryMatch) {
                try {
                    const oembedUrl = oembedDiscoveryMatch[1].replace(/&amp;/g, '&');
                    const oembedResponse = await fetch(oembedUrl);
                    if (oembedResponse.ok) {
                        const data = await oembedResponse.json();
                        return NextResponse.json({
                            title: data.title,
                            image: data.thumbnail_url || data.url,
                            description: data.author_name ? `Resource by ${data.author_name}` : "Interactive educational resource.",
                            url: url,
                            platform: url.includes("canva") ? "canva" : url.includes("genially") ? "genially" : "other",
                            embedHtml: data.html
                        });
                    }
                } catch (e) {
                    console.info("oEmbed discovery failed, falling back to meta tags");
                }
            }

            // 2. Fallback to Meta Tags
            const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/i) ||
                html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch?.[1] || "Interactive Resource";

            const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/i) ||
                html.match(/<meta name="twitter:image" content="(.*?)"/i);
            const image = imageMatch?.[1] || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(url)}`;

            const descMatch = html.match(/<meta property="og:description" content="(.*?)"/i) ||
                html.match(/<meta name="description" content="(.*?)"/i);
            const description = descMatch?.[1] || "Educational resource ready for import.";

            return NextResponse.json({
                title: decodeHtmlEntities(title.trim()),
                image: image.trim(),
                description: decodeHtmlEntities(description.trim()),
                url: url,
                platform: url.includes("wordwall") ? "wordwall" :
                    url.includes("genial.ly") ? "genially" :
                        url.includes("canva.com") ? "canva" : "other"
            });

        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            return NextResponse.json({
                error: fetchError.name === 'AbortError' ? "Request timed out" : "Failed to connect to the platform",
                url: url
            }, { status: 200 });
        }
    } catch (error) {
        console.error("Scrape API error:", error);
        return NextResponse.json({ error: "Internal scraper error" }, { status: 500 });
    }
}

function decodeHtmlEntities(str: string) {
    return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .replace(/&nbsp;/g, ' ');
}
