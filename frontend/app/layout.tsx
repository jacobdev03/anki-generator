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
  title: "Anki Generator | From PDF to an editable study deck",
  description: "Generate Polish flashcards from a PDF, review and edit your saved deck, then export it to Anki as an .apkg file.",
  openGraph: {
    title: "Anki Generator | From PDF to an editable study deck",
    description: "Turn a lecture PDF into draft flashcards. Review, edit and export your deck to Anki.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anki Generator | PDF flashcards",
    description: "Polish flashcards from your PDF, with editing and Anki export.",
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
