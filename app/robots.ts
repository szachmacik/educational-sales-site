import { MetadataRoute } from "next";

const BASE_URL = "https://kamila.ofshore.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/dashboard", "/checkout", "/cart"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
