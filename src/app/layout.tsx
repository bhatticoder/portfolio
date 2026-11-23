import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalPalette } from "@/components/GlobalPalette";
import { SiteSettingsProvider } from "@/lib/useSiteSettings";
import { getSiteSettings } from "@/lib/settingsDb";
import { content } from "@/data/content";
import { config } from "@/lib/config";
import { skills } from "@/data/skills";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: "Muhammad Mudassar Bhatti — AI Systems & Automation Developer",
  description:
    "I build AI systems that do real work for your business: document workflows, computer vision, and reliable full-stack developer tools.",
  alternates: {
    canonical: config.siteUrl,
  },
  openGraph: {
    title: "Muhammad Mudassar Bhatti — AI Systems & Automation Developer",
    description:
      "I build AI systems that do real work for your business: document workflows, computer vision, and reliable full-stack developer tools.",
    url: config.siteUrl,
    siteName: "bhatti.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Mudassar Bhatti — AI Systems & Automation Developer",
    description:
      "I build AI systems that do real work for your business: document workflows, computer vision, and reliable full-stack developer tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = getSiteSettings();
  const allSkillNames = skills.flatMap((s) => s.items);

  const socialProfiles = [
    config.github,
    config.linkedin,
    config.twitter,
    config.medium,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${config.siteUrl}/#person`,
        name: content.name,
        jobTitle: content.role,
        url: config.siteUrl,
        image: `${config.siteUrl}/profile.png`,
        sameAs: socialProfiles,
        knowsAbout: allSkillNames,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${config.siteUrl}/#service`,
        name: `${content.name} — AI Systems & Automation`,
        alternateName: ["bhatti.dev", "Mudassar Bhatti AI"],
        url: config.siteUrl,
        logo: `${config.siteUrl}/profile.png`,
        image: `${config.siteUrl}/profile.png`,
        founder: { "@id": `${config.siteUrl}/#person` },
        description:
          "Bespoke AI systems, autonomous document pipelines, computer vision, and workflow automation for businesses and engineering teams.",
        priceRange: "$$ - $$$",
        areaServed: ["Worldwide", "US", "GB", "EU"],
        sameAs: socialProfiles,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "AI Engineering & Automation Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Document AI & Autonomous Agent Workflows",
                description:
                  "Multi-model consensus pipelines, document extraction, and self-healing developer agents with human-in-the-loop fallback.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Real-Time Computer Vision & Edge Systems",
                description:
                  "YOLOv8 object detection, ANPR / license plate recognition, and video analytics running at low latency on edge/CPU hardware.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Full-Stack AI Application Development",
                description:
                  "FastAPI microservices, Next.js interfaces, and n8n backend integrations built for 24/7 reliability.",
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-paper text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteSettingsProvider initialSettings={siteSettings}>
            {children}
            <GlobalPalette />
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
