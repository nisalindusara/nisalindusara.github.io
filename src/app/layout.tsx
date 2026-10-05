import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import localFont from "next/font/local";
import { LenisProvider } from "@/components/LenisProvider";
import { Nav } from "@/components/Nav/Nav";
import { CursorDot } from "@/components/CursorDot/CursorDot";
import { Footer } from "@/components/sections/Footer/Footer";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Urbanist (geometric, single-storey "a", round "o"). Used for the home hero wordmark only.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

// Nimbus Sans (URW, AGPL with font exception, see src/fonts/NimbusSans-LICENSE.txt), self-hosted. Used for the About statement.
const nimbus = localFont({
  src: "../fonts/NimbusSans-Regular.otf",
  variable: "--font-nimbus",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: profile.siteTitle,
  description: profile.siteDescription,
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.siteTitle,
    title: profile.siteTitle,
    description: profile.siteDescription,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: profile.name }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: profile.siteTitle,
    description: profile.siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

// Runs before the first paint: marks <html data-intro="pending"> when the intro should play
// (first visit in this browser session, no reduced motion). The panel CSS shows the intro from that.
const introScript = `try{if(!sessionStorage.getItem("intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="pending"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script adds data-intro before React hydrates.
    <html
      lang="en"
      className={`${inter.variable} ${urbanist.variable} ${nimbus.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        {/* Without JavaScript, show content that would otherwise wait for its reveal animation. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-reveal-clip]{clip-path:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <LenisProvider>
          {/* Intro and page transitions; renders the full-screen panel once, after the page. */}
          <TransitionProvider>
            <Nav />
            <div className="page">
              {children}
              {/* Marks the bottom of the page; the footer watches it to start its text slide. */}
              <span data-footer-sentinel aria-hidden="true" />
            </div>
            <Footer />
            <CursorDot />
          </TransitionProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
