import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { env } from "@/lib/env";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { BackToTop } from "@/components/ui/BackToTop";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/* Bricolage carries every statement on the site; Plex Sans carries the reading;
   Plex Mono carries the labels that key the before/after sides. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["600", "800"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [
    "full-stack developer",
    "freelance developer",
    "business website",
    "custom web application",
    "ticketing system",
    "business dashboard",
    "Pune",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.brand,
    title: site.title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: site.brand,
      jobTitle: site.role,
      url: site.url,
      email: site.email,
      sameAs: [site.github],
      homeLocation: { "@type": "Place", name: site.location },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#service`,
      name: site.brand,
      description: site.description,
      url: site.url,
      founder: { "@id": `${site.url}/#person` },
      areaServed: "Worldwide",
      serviceType: [
        "Business website development",
        "Custom web application development",
        "Business dashboard and internal tool development",
        "Software maintenance and support",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`}
      /* The script below stamps data-theme on this element before React runs,
         so the server HTML and the hydrated tree disagree about it by design. */
      suppressHydrationWarning
    >
      <body>
        {/*
          Applies a stored theme choice before the first paint. Inline and
          synchronous on purpose: anything deferred repaints, and the visitor
          sees a flash of the other theme. Absent a stored choice nothing is
          stamped and the OS preference wins, which is what the CSS expects.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("aaknav-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}',
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <BackToTop />
        {/* Answers the only question that matters about this page: do people
            open the case studies, or stop at the hero. Rendered only on a
            deployment — its script lives at /_vercel/insights and 404s
            anywhere else, which fills the console and fails the smoke suite. */}
        {env.VERCEL ? <Analytics /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
