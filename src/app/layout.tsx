import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Resume Studio AI — ATS-Friendly Resume Builder",
  description:
    "Build professional, ATS-friendly resumes that get shortlisted. Templates, live preview, AI improvements, and an ATS score analyzer.",
  applicationName: "Resume Studio AI",
  keywords: ["resume builder", "ATS resume", "CV maker", "resume templates", "AI resume"],
  openGraph: {
    title: "Resume Studio AI",
    description: "Build professional, ATS-friendly resumes that get shortlisted.",
    type: "website",
  },
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
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
