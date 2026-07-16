import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

const BASE_URL = BRAND.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/account/", "/checkout/", "/cart/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
