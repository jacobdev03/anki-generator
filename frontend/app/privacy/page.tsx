import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, upload documents, or communicate with us. This may include your name, email address, and the content of the files you upload for flashcard generation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to operate, maintain, and improve our services, including processing your documents to generate flashcards, managing your account, and processing payments securely via Stripe.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Third-Party Services</h2>
            <p>We use third-party services such as Stripe for payment processing. These services have their own privacy policies addressing how they use your information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us on our Discord server.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
