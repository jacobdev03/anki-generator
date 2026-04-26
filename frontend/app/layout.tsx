import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "AnkiGen | Transform Lectures into Anki Flashcards Instantly",
  description: "Upload PDFs, slides, or notes. Our AI instantly extracts core concepts into high-quality, exam-ready Anki flashcards tailored for your academic success.",
  openGraph: {
    title: "AnkiGen | Transform Lectures into Anki Flashcards Instantly",
    description: "Stop wasting hours typing study materials. Upload your notes and let AI build your perfect Anki deck instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnkiGen | AI Flashcard Generator",
    description: "Transform your lectures into exam-ready Anki flashcards in seconds.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${newsreader.variable}`}>
      <body className={`min-h-full flex flex-col antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
