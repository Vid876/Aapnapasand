import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Providers } from "@/components/providers/Providers";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  alternates: {
    canonical: BRAND.url,
  },
  title: {
    default: "BOHOBLOCKPRINTED | Hand Block Printed Textiles from Jaipur",
    template: "%s | BOHOBLOCKPRINTED",
  },
  description:
    "Shop hand block printed home decor, table linen, fashion, accessories, fabric by yard, custom orders, and wholesale textiles from Jaipur, India.",
  keywords: [
    "hand block printed textiles",
    "Jaipur block print",
    "home linen",
    "table linen",
    "block print fabric",
    "wholesale textiles",
  ],
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "192x192" }],
    shortcut: [{ url: "/favicon.png", type: "image/png", sizes: "192x192" }],
    apple: [{ url: "/Logo.png", type: "image/png", sizes: "500x500" }],
  },
  openGraph: {
    type: "website",
    url: BRAND.url,
    siteName: BRAND.name,
    title: "BOHOBLOCKPRINTED | Hand Block Printed Textiles from Jaipur",
    description: BRAND.description,
    images: [{ url: "/image.png", width: 1254, height: 1254, alt: `${BRAND.name} premium hand block printed textiles` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BOHOBLOCKPRINTED | Hand Block Printed Textiles from Jaipur",
    description: BRAND.description,
    images: ["/image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: BRAND.url,
    logo: `${BRAND.url}/Logo.png`,
    image: `${BRAND.url}/image.png`,
    email: BRAND.email,
    sameAs: [BRAND.instagram, BRAND.pinterest, BRAND.etsy],
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }}
        />
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}

