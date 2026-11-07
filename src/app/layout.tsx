import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { content } from "@/data/content";
import { config } from "@/lib/config";
import { skills } from "@/data/skills";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

function truncateDescription(text: string, max: number = 155): string {
  if (text.length <= max) return text;
  const sub = text.slice(0, max);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > -1 ? sub.slice(0, lastSpace) : sub) + "…";
}

const description = truncateDescription(content.hero.sub, 155);

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: `${content.name} — ${content.role}`,
  description,
  alternates: {
    canonical: config.siteUrl,
  },
  openGraph: {
    title: `${content.name} — ${content.role}`,
    description,
    url: config.siteUrl,
    siteName: content.handle,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.name} — ${content.role}`,
    description,
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
