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

