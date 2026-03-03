import { MOCK_COURSES, Course } from './mock-data';
import { KAMILA_ENGLISH_PRODUCTS } from './product-catalog';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const API_KEY = process.env.WP_IDEA_API_KEY;

// Hybrid Mode Detection
const IS_PROD_MODE = API_KEY && API_KEY.length > 5 && API_URL?.includes('http');
const USE_MOCK = !IS_PROD_MODE;

if (typeof window === 'undefined') {
    console.log(`📡 [API System] Mode: ${IS_PROD_MODE ? 'PRODUCTION (Real API)' : 'TEST (Mock/Scraped Data)'}`);
}

export async function getCourses(): Promise<Course[]> {
    // Return scraped products as "Courses"
    const realProducts = KAMILA_ENGLISH_PRODUCTS.map((prod, index) => {
        const match = prod.url.match(/\/product\/([^\/]+)\/?$/);
        const slug = match ? match[1] : `product-${index}`;

        return {
            id: index + 1000,
            title: prod.title,
            excerpt: prod.description.substring(0, 150) + "...",
            price: parseFloat(prod.price) || 0,
            sale_price: undefined,
            slug: slug,
            image_url: prod.image || "/placeholder.svg",
            category: (prod.categories?.[0]?.toLowerCase().includes('gra') ? 'game' : 'pdf') as any,
            teachingMode: 'online',
            source: (prod as any).source // Include source if available in static data
        } as Course;
    });

    // 1. Load Admin Products from LocalStorage (Simulate Database)
    let adminProducts: any[] = [];
    if (typeof window !== 'undefined') {
        try {
            adminProducts = JSON.parse(localStorage.getItem("admin_products") || "[]");
        } catch (e) {
            console.error("Failed to load admin products", e);
        }
    }

    // 2. Map Admin Products to Courses with Auto-Generation
    const convertedAdminCourses = adminProducts.map((prod: any) => {
        const course: Course = {
            id: prod.id,
            title: prod.title,
            excerpt: prod.description.substring(0, 150) + "...",
            price: prod.price,
            sale_price: prod.salePrice,
            slug: prod.slug,
            image_url: prod.images[0],
            category: prod.category === 'games' ? 'game' : 'pdf',
            teachingMode: prod.teachingMode || 'online',
            modules: [],
            source: prod.source // Preserve source for internal preview
        };

        // Automatic Lesson Generation
        if (prod.autoGenerateLesson) {
            if (prod.category === 'games' && prod.externalUrl) {
                course.modules = [
                    {
                        id: Date.now(),
                        title: "Interactive Materials",
                        lessons: [
                            {
                                id: Date.now() + 1,
                                title: `Game: ${prod.title}`,
                                type: 'game',
                                teachingMode: prod.teachingMode,
                                content: `Launch the game using the following link: ${prod.externalUrl}`,
                                materials: [
                                    { name: "Game link", url: prod.externalUrl, size: "Online", type: "game" }
                                ]
                            }
                        ]
                    }
                ];
            } else {
                // Default generic lesson
                course.modules = [{
                    id: Date.now(),
                    title: "Start Learning",
                    lessons: [{
                        id: Date.now() + 1,
                        title: "Introduction",
                        type: 'text',
                        teachingMode: prod.teachingMode,
                        content: prod.description
                    }]
                }];
            }
        }
        return course;
    });

    const combinedProducts = [...convertedAdminCourses, ...realProducts];

    if (USE_MOCK) {
        return combinedProducts;
    }

    try {
        console.log(`🌐 [Server] Fetching from: ${API_URL}/wp-json/wp-idea/v2/products`);
        const res = await fetch(`${API_URL}/wp-json/wp-idea/v2/products`, {
            method: 'GET',
            headers: {
                'X-WP-Idea-Token': API_KEY || '',
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 } // Cache for 1h
        });

        if (!res.ok) {
            console.warn(`⚠️ [Server] API Error ${res.status}: ${res.statusText}. Falling back to scraped data.`);
            return combinedProducts;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("❌ [Server] API response is not an array:", data);
            return combinedProducts;
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.name || item.title?.rendered || "Untitled",
            excerpt: item.short_description || item.excerpt?.rendered || "",
            price: Number(item.price) || 0,
            sale_price: item.sales_price ? Number(item.sales_price) : undefined,
            slug: item.slug || `product-${item.id}`,
            image_url: item.image || item.images?.[0]?.src || "https://placehold.co/600x400/png?text=No+Image",
            category: 'pdf', // default
            teachingMode: 'stationary'
        }));

    } catch (error) {
        console.error("❌ [Server] Failed to fetch courses:", error);
        return combinedProducts;
    }
}

export async function getCourse(slug: string): Promise<Course | null> {
    // 1. Get all courses to search from
    const allCourses = await getCourses();
    const course = allCourses.find(c => c.slug === slug);

    if (course) {
        // If it's a scraped product without modules, add a default one or use MOCK_COURSES for details
        if (!course.modules || course.modules.length === 0) {
            const mockFull = MOCK_COURSES.find(m => m.slug === slug);
            if (mockFull) return mockFull;

            // Generate a default module for scraped products
            course.modules = [{
                id: Date.now(),
                title: "Materiały",
                lessons: [
                    {
                        id: Date.now() + 1,
                        title: "Pobierz pliki",
                        type: 'text',
                        content: course.excerpt,
                        materials: [
                            { name: course.title + " (PDF)", url: "#", size: "Brak danych", type: "pdf" }
                        ]
                    }
                ]
            }];
        }
        return course;
    }

    if (USE_MOCK) {
        return MOCK_COURSES.find(c => c.slug === slug) || null;
    }

    try {
        const res = await fetch(`${API_URL}/wp-json/wp-idea/v2/products?slug=${slug}`, {
            headers: { 'X-WP-Idea-Token': API_KEY || '' },
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return MOCK_COURSES.find(c => c.slug === slug) || null;
        }

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
            return MOCK_COURSES.find(c => c.slug === slug) || null;
        }

        const item = data[0];
        return {
            id: item.id,
            title: item.name,
            excerpt: item.short_description || "",
            price: Number(item.price),
            slug: item.slug,
            image_url: item.image || "https://placehold.co/600x400",
            category: 'course',
            teachingMode: 'online',
            modules: []
        };

    } catch (error) {
        return MOCK_COURSES.find(c => c.slug === slug) || null;
    }
}
