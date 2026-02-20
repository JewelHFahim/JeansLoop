import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "JeansLoop | Premium Men's Denim & Clothing",
    template: "%s | JeansLoop"
  },
  description: "Shop the finest collection of premium men's denim, twill trousers, and essential clothing at JeansLoop. Quality meets style.",
  keywords: ["men's clothing", "denim jeans", "twill trousers", "men's fashion", "premium clothing"],
  authors: [{ name: "JeansLoop Team" }],
  creator: "JeansLoop",
  publisher: "JeansLoop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jeansloop.com",
    siteName: "JeansLoop",
    title: "JeansLoop | Premium Men's Denim & Clothing",
    description: "Shop the finest collection of premium men's denim and essential clothing.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JeansLoop Premium Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JeansLoop | Premium Men's Denim & Clothing",
    description: "Shop the finest collection of premium men's denim and essential clothing.",
    images: ["/og-image.jpg"],
    creator: "@jeansloop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-white">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
