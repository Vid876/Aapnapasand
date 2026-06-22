import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Providers } from "@/components/providers/Providers";
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
  title: {
    default: "Aapnapasand | Premium Indian Fashion",
    template: "%s | Aapnapasand",
  },
  description:
    "Shop premium men's and women's clothing at Aapnapasand. Discover shirts, jeans, kurtas, sarees, and more with fast delivery across India.",
  keywords: ["fashion", "clothing", "india", "mens wear", "womens wear", "online shopping"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
