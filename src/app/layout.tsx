import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { LenisProvider } from "@/components/LenisProvider";
import { Nav } from "@/components/Nav/Nav";
import { CursorDot } from "@/components/CursorDot/CursorDot";
import { Footer } from "@/components/sections/Footer/Footer";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Nimbus Sans (URW, AGPL with font exception, see src/fonts/NimbusSans-LICENSE.txt), self-hosted. Used for the About statement.
const nimbus = localFont({
  src: "../fonts/NimbusSans-Regular.otf",
  variable: "--font-nimbus",
  weight: "400",
  display: "swap",
});

// Zodiak (Fontshare, Indian Type Foundry), self-hosted. Used for the hero name.
const zodiak = localFont({
  src: "../fonts/Zodiak-Regular.woff2",
  variable: "--font-zodiak",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: profile.name,
  description: profile.siteDescription,
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: profile.name,
    description: profile.siteDescription,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: profile.name }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: profile.name,
    description: profile.siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${nimbus.variable} ${zodiak.variable}`}>
      <body>
        {/* Without JavaScript, show content that would otherwise wait for its reveal animation. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-reveal-clip]{clip-path:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <LenisProvider>
          <Nav />
          <div className="page">
            {children}
            {/* Marks the bottom of the page; the footer watches it to start its text slide. */}
            <span data-footer-sentinel aria-hidden="true" />
          </div>
          <Footer />
          <CursorDot />
        </LenisProvider>
      </body>
    </html>
  );
}
