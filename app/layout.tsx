import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { brandAssets, copy, icon, site } from "@/config/site";
import { event } from "@/event.config";
import { jsonLd, seo } from "@/config/seo";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import WhatsAppFab from "@/components/WhatsAppFab";
import Loader from "@/components/Loader";

/**
 * Every value below is derived from the active event config (event.config.ts).
 * Do not hardcode a business name, town or phone number in this file.
 */
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-fraunces" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  applicationName: site.fullName,
  keywords: seo.keywords,
  authors: [{ name: site.fullName }],
  creator: site.fullName,
  publisher: site.fullName,
  category: seo.category,
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: false },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: site.url,
    siteName: site.fullName,
    title: seo.title,
    description: seo.ogDescription,
    images: [{ url: brandAssets.ogImage, width: 1200, height: 630, alt: seo.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.ogDescription,
    images: [brandAssets.ogImage],
  },
  icons: {
    icon: [
      { url: icon("favicon.ico"), sizes: "any" },
      { url: icon("favicon-16x16.png"), type: "image/png", sizes: "16x16" },
      { url: icon("favicon-32x32.png"), type: "image/png", sizes: "32x32" },
      { url: icon("icon.svg"), type: "image/svg+xml" },
      { url: icon("android-chrome-192x192.png"), type: "image/png", sizes: "192x192" },
      { url: icon("android-chrome-512x512.png"), type: "image/png", sizes: "512x512" },
    ],
    shortcut: [icon("favicon.ico")],
    apple: [{ url: icon("apple-touch-icon.png"), sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: `${site.name} ${site.kicker}`,
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
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: copy.theme.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Optional per-event brand colours (config/event-schema.ts `theme`). Falls back to the
  // template's default gold palette (declared in app/globals.css :root) when unset.
  const themeStyle = event.theme
    ? ({ "--saffron": event.theme.primary, "--saffron-2": event.theme.accent } as React.CSSProperties)
    : undefined;

  return (
    <html lang={seo.lang} className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body style={themeStyle}>
        <Loader />
        <SmoothScroll>
          <Header />
          {children}
          <WhatsAppFab />
        </SmoothScroll>
      </body>
    </html>
  );
}
