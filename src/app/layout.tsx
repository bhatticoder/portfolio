import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalPalette } from "@/components/GlobalPalette";
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
  const allSkillNames = skills.flatMap((s) => s.items);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.name,
    jobTitle: content.role,
    url: config.siteUrl,
    knowsAbout: allSkillNames,
    ...(process.env.NEXT_PUBLIC_GITHUB
      ? { sameAs: [process.env.NEXT_PUBLIC_GITHUB] }
      : {}),
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
          {children}
          <GlobalPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
