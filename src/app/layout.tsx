import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const GA_ID = "G-HDW0PFQ25D";

export const metadata: Metadata = {
  metadataBase: new URL("https://elected.vercel.app"),
  title: {
    default: "ElectED | Election Process Education Assistant",
    template: "%s | ElectED",
  },
  description: "Learn about the Indian election process with AI-powered insights, interactive guides, quizzes, and region-specific information for 960M+ voters.",
  keywords: [
    "election", "India", "voter education", "democracy", "ECI",
    "voting guide", "first time voter", "election commission India",
    "lok sabha", "election process", "voter registration",
  ],
  authors: [{ name: "ElectED Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "ElectED | Election Process Education Assistant",
    description: "AI-powered election education for India's 960M+ voters.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectED | Election Education",
    description: "Your guide to India's democratic process.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport = {
  themeColor: "#4f46e5",
  colorScheme: "dark",
};

/** JSON-LD structured data for search engines */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ElectEd",
  description: "AI-powered Indian election education platform",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "ElectEd" },
  featureList: [
    "AI-powered election Q&A via Google Gemini",
    "Interactive election timeline",
    "State-wise voter registration portals",
    "Gamified civic knowledge quiz",
    "Voter deadline reminders with calendar export",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Performance: preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Accessibility: skip-to-content */}
        <style>{`
          .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #f97316;
            color: white;
            padding: 8px 16px;
            z-index: 9999;
            font-weight: bold;
            font-family: sans-serif;
            transition: top 0.2s;
          }
          .skip-link:focus { top: 0; }
        `}</style>
      </head>

      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="main-container" tabIndex={-1}>
          {children}
        </main>

        <Footer />
        <ChatBot />

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
