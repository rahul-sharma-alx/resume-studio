import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/features/settings/ThemeToggle";
import { ResumeSwitcher } from "@/features/resume/components/ResumeSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-studio-orcin.vercel.app"),
  title: {
    default: "Resume Studio AI — Best Free AI Resume Builder",
    template: "%s | Resume Studio AI",
  },
  description:
    "Create a free, ATS-friendly resume with AI. Build professional resumes in minutes with templates, live preview, an ATS score analyzer, and one-click AI improvements. No account required.",
  applicationName: "Resume Studio AI",
  keywords: [
    "best free resume maker ai",
    "free resume builder",
    "create free resume with AI",
    "AI resume builder",
    "free CV maker",
    "ATS-friendly resume builder",
    "resume templates",
    "online resume creator",
    "build resume free",
    "professional resume maker",
  ],
  authors: [{ name: "Resume Studio AI" }],
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Resume Studio AI — Best Free AI Resume Builder",
    description:
      "Create a free, ATS-friendly resume with AI. Templates, live preview, ATS scoring, and one-click AI improvements.",
    url: "https://resume-studio-orcin.vercel.app",
    siteName: "Resume Studio AI",
    type: "website",
    images: [{ url: "/android-chrome-512x512.png", width: 512, height: 512, alt: "Resume Studio AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Studio AI — Best Free AI Resume Builder",
    description: "Create a free, ATS-friendly resume with AI. No account required.",
    images: ["/android-chrome-512x512.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Resume Studio AI",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: "https://resume-studio-orcin.vercel.app",
              description:
                "Best free AI resume builder. Create ATS-friendly resumes with templates, live preview, an ATS score analyzer, and one-click AI improvements.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
        <div className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
          <header className="no-print border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
              <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Resume Studio AI
              </span>
              <ResumeSwitcher />
              <ThemeToggle />
            </div>
          </header>
          <main className="mx-auto w-full max-w-8xl flex-1 px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
