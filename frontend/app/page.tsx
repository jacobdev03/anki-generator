import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BrainCircuit, Zap, Target, UploadCloud, Cpu, Download, CheckCircle2, XCircle, ArrowRight, Clock, Brain } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Navbar (Minimal) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
            <BrainCircuit className="h-6 w-6" />
            <span>AnkiGen</span>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Log in
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full px-6 transition-all hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
          <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-30 dark:opacity-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800/50">
              <Zap className="h-4 w-4" />
              <span>Powered by advanced AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6">
              Transform Any Lecture into <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Exam-Ready Flashcards
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed">
              Stop wasting hours manually typing study materials. Upload your PDFs, slides, or notes, and our AI instantly extracts core concepts into high-quality, atomic Anki flashcards tailored for your academic success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg group transition-all hover:shadow-xl hover:-translate-y-0.5">
                  Start Generating for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION */}
        <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">The Old Way vs. The New Way</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Why struggle with manual data entry when AI can build your perfect study deck instantly?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Old Way */}
              <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-8 lg:p-10 transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-red-900 dark:text-red-300">The Old Way</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Wasted Time: Spending hours mindlessly copying and pasting text instead of actually studying.",
                    "Poor Quality: Creating messy, overly complex flashcards that hurt your memory retention.",
                    "Distracting Clutter: Accidentally studying useless administrative noise like slide numbers and course codes."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Way */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-8 lg:p-10 relative shadow-xl shadow-emerald-500/5 transition-transform hover:-translate-y-1 duration-300">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-bl-xl rounded-tr-3xl">AnkiGen</div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-300">The New Way</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Instant Decks: Upload a file and get a complete, ready-to-study Anki deck in seconds.",
                    "Optimized Learning: Automatically generated 'atomic' cards that test exactly one specific fact.",
                    "Pure Focus: AI filters out the noise, focusing only on core academic concepts, definitions, and formulas."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Why Use Anki Generator?</h2>
              <p className="text-slate-600 dark:text-slate-400">Designed purely for academic excellence and rapid information retention.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Clock,
                  title: "Cut Prep Time by 90%",
                  desc: "Reclaim your evenings and weekends. Spend your time actually memorizing the material rather than doing the tedious data entry of creating the cards yourself.",
                  color: "blue"
                },
                {
                  icon: Target,
                  title: "Achieve Higher Exam Scores",
                  desc: "Study with scientifically proven active recall. Your generated cards are perfectly formatted to lock difficult concepts into your long-term memory.",
                  color: "indigo"
                },
                {
                  icon: Brain,
                  title: "Never Miss a Key Concept",
                  desc: "Our AI comprehensively scans your documents, ensuring no critical definitions, cause-effect relationships, or complex processes fall through the cracks.",
                  color: "purple"
                }
              ].map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-sans font-bold mb-3 text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">How It Works</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">From messy lecture notes to a pristine study deck in three simple steps.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-500/50 to-indigo-100 dark:from-slate-800 dark:via-indigo-500/30 dark:to-slate-800" />

              {[
                {
                  step: "01",
                  icon: UploadCloud,
                  title: "Upload Your Material",
                  desc: "Drag and drop your lecture slides, PDFs, or raw text notes directly into the generator."
                },
                {
                  step: "02",
                  icon: Cpu,
                  title: "Let AI Do the Heavy Lifting",
                  desc: "Our engine strictly analyzes the text, ignores irrelevant metadata, and crafts granular, high-quality flashcards."
                },
                {
                  step: "03",
                  icon: Download,
                  title: "Export to Anki & Study",
                  desc: "Download your customized .apkg file with one click, import it into your Anki app, and start mastering."
                }
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-950 shadow-xl flex items-center justify-center mb-8 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-primary/10" />
                      <Icon className="relative z-10 h-10 w-10 text-primary" />
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm border-2 border-background">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-2xl font-sans font-bold mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed px-4">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Simple, Transparent Pricing</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Invest in your academic success. Choose the plan that fits your study load.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
              {/* Basic */}
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">Basic</CardTitle>
                  <CardDescription className="min-h-[40px]">Perfect for casual students with light study loads.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$9</span>
                    <span className="text-slate-500 dark:text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "50 document uploads per month",
                      "Standard AI processing speed",
                      "Core text and definition flashcards",
                      "Standard Anki (.apkg) exports"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full rounded-full">Get Basic</Button>
                </CardFooter>
              </Card>

              {/* Pro */}
              <Card className="border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 shadow-xl relative scale-100 md:scale-105 z-10">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md shadow-indigo-500/20">Most Popular</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-900 dark:text-indigo-100">Pro</CardTitle>
                  <CardDescription className="min-h-[40px]">Ideal for dedicated students in rigorous programs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$19</span>
                    <span className="text-slate-500 dark:text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Unlimited document uploads",
                      "Priority AI processing speed",
                      "Advanced card formatting (Cloze, LaTeX)",
                      "Theory-to-practice scenario generation"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md shadow-indigo-500/20">Get Pro</Button>
                </CardFooter>
              </Card>

              {/* Enterprise */}
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription className="min-h-[40px]">For educational institutions and large study cohorts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$99</span>
                    <span className="text-slate-500 dark:text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Everything in the Pro Tier",
                      "Custom API access for LMS integration",
                      "Shared team workspaces",
                      "Dedicated account manager"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full rounded-full">Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "What types of files can I upload?",
                  a: "You can upload PDFs, PowerPoint slides, Word documents, or simply paste raw text directly into the generator."
                },
                {
                  q: "Will the AI include useless information like my professor's name?",
                  a: "No. Our engine is strictly trained to ignore 'administrative noise' like syllabus details, slide numbers, and teacher names. It only extracts testable academic concepts."
                },
                {
                  q: "Does it handle complex subjects like Math, Engineering, or Medicine?",
                  a: "Yes. The generator accurately formats complex scientific definitions, automatically applies Cloze deletions for intricate processes, and natively supports LaTeX for all mathematical formulas."
                },
                {
                  q: "Can I edit the flashcards before exporting them?",
                  a: "Absolutely. You have full control. You can easily review, tweak, add, or delete any generated flashcard in your dashboard before downloading your final deck."
                }
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white flex items-start gap-3">
                    <span className="text-indigo-500 shrink-0">Q.</span> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 relative overflow-hidden bg-indigo-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-950 z-0" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent z-0 pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Stop preparing to study. <br className="hidden md:block" />
              Start actually learning.
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Your best grades are just a file upload away. Join thousands of top-performing students today.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="rounded-full px-10 py-7 text-lg font-bold shadow-2xl transition-all hover:-translate-y-1">
                Generate Your First Deck Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <BrainCircuit className="h-6 w-6 text-indigo-500" />
            <span>AnkiGen</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Anki Generator. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
