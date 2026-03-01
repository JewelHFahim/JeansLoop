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
    default: "Fire Cutter | Premium Men's Collections",
    template: "%s | Fire Cutter"
  },
  description: "Shop the finest collection of premium men's clothing at Fire Cutter. Quality meets style.",
  keywords: ["men's clothing", "premium clothing", "export collections", "fashion"],
  authors: [{ name: "Fire Cutter Team" }],
  creator: "Fire Cutter",
  publisher: "Fire Cutter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thefirecutter.store",
    siteName: "Fire Cutter",
    title: "Fire Cutter | Premium Men's Collections",
    description: "Shop the finest collection of premium men's clothing at Fire Cutter.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fire Cutter Premium Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fire Cutter | Premium Men's Collections",
    description: "Shop the finest collection of premium men's clothing at Fire Cutter.",
    images: ["/og-image.jpg"],
    creator: "@firecutter",
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
