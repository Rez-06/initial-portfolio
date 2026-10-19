import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getResumeLink } from "@/lib/assets";
import { navigation, profile } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const display = localFont({
  src: "./fonts/BricolageGrotesque-Variable.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});
const sans = localFont({
  src: "./fonts/InstrumentSans-Variable.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
});

const title = `${profile.name} | ${profile.designation}`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.siteDescription,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    siteName: profile.name,
    title,
    description: profile.siteDescription,
    images: [{ url: "/images/rezwan-ahmed-og.png", width: 1200, height: 630, alt: `${profile.name}, ${profile.designation}` }],
  },
};
export const viewport: Viewport = { themeColor: "#f5f3ee", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const resume = getResumeLink();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body>
        <div id="top">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
            Skip to content
          </a>
          <Navbar brand={profile.name} monogram={profile.monogram} items={navigation} resume={resume} />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
