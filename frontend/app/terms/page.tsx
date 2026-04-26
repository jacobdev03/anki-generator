import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <BrainCircuit className="h-6 w-6" />
            <span>AnkiGen</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using AnkiGen, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily use the materials and services on AnkiGen for personal, non-commercial viewing and educational purposes only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. User Content</h2>
            <p>You retain all rights to the documents and text you upload. By uploading content, you grant AnkiGen a license to process and use the content solely for the purpose of generating flashcards for you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment and Credits</h2>
            <p>Credits purchased for generating flashcards are non-refundable unless required by law. Pricing is subject to change with reasonable notice provided to active users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Disclaimer</h2>
            <p>The materials on AnkiGen are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
