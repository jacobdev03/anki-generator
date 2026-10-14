import Link from "next/link";
import { ArrowDown, ArrowRight, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingExample } from "@/components/landing-example";
import styles from "./landing.module.css";

const steps = [
  { title: "Start with a PDF.", text: "Upload your lecture notes or reading material, up to 10 MB. Text is extracted from the document, with OCR as a fallback for scans." },
  { title: "Make the cards yours.", text: "AI drafts question-and-answer cards in Polish. Save a deck to your library, then edit the wording or remove cards you don’t need." },
  { title: "Take them to Anki.", text: "Export your saved deck as an .apkg file. Your deck stays in the library, so you can return to it and make changes later." },
];
const questions = [
  { question: "What can I upload?", answer: "PDF files up to 10 MB. Export Word documents or presentation slides to PDF before uploading. Scanned documents can be processed with OCR, though the quality depends on the scan." },
  { question: "What language are the cards in?", answer: "Cards are currently generated in Polish. You can edit the questions and answers after saving a deck." },
  { question: "How do credits work?", answer: "New accounts start with 50 credits. One successfully processed text chunk uses one credit. A longer PDF may contain several chunks, so a credit is not the same as a document upload." },
  { question: "Should I review the generated cards?", answer: "Yes. AI can miss context or make mistakes. Check the cards against your source material and edit them before studying. The export uses basic front-and-back cards." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <a href="#main" className={styles.skipLink}>Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Anki Generator home"><Layers size={21} aria-hidden="true" /><span>Anki Generator</span></Link>
        <nav aria-label="Main navigation" className={styles.nav}>
          <a href="#how-it-works" className={styles.navGuide}>How it works</a>
          <ThemeToggle />
          <Link href="/auth" className={styles.login}>Log in <ArrowRight size={15} aria-hidden="true" /></Link>
        </nav>
      </header>
      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>PDF → flashcards → Anki</p>
            <h1 id="hero-title">Make an Anki deck<br /><span>from your PDF.</span></h1>
            <p className={styles.description}>Turn a lecture PDF into a draft Anki deck. Review the questions, edit the answers, and keep the cards worth studying.</p>
            <Link href="/dashboard" className={styles.primaryLink}>Create a deck <ArrowRight size={18} aria-hidden="true" /></Link>
            <p className={styles.signupNote}>50 starting credits · Account required</p>
            <a href="#how-it-works" className={styles.exploreLink}>See the workflow <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <LandingExample />
        </section>
        <div className={styles.formatLine} aria-label="Supported formats">
          <span>PDF <small>up to 10 MB</small></span><ArrowRight size={16} aria-hidden="true" />
          <span>Editable cards <small>generated in Polish</small></span><ArrowRight size={16} aria-hidden="true" />
          <span>.apkg <small>for Anki</small></span>
        </div>
        <section id="how-it-works" className={styles.workflow} aria-labelledby="workflow-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>From source to study deck</p>
            <h2 id="workflow-title">Review the cards.<br />Then start studying.</h2>
            <p>Generation gives you a draft. The review is still yours.</p>
          </div>
          <ol className={styles.steps}>
            {steps.map((step, index) => <li key={step.title}><span className={styles.stepNumber}>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
          </ol>
        </section>
        <section className={styles.questions} aria-labelledby="questions-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Before you upload</p>
            <h2 id="questions-title">A few useful details.</h2>
            <p>Document text is sent to OpenAI to generate cards. Start with a sample PDF and avoid uploading sensitive information.</p>
          </div>
          <div className={styles.answers}>
            {questions.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
          </div>
        </section>
        <section className={styles.closing} aria-label="Get started">
          <div><p className={styles.eyebrow}>Have a PDF in mind?</p><h2>Start with one lecture.</h2></div>
          <Link href="/dashboard" className={styles.primaryLink}>Create a deck <ArrowRight size={18} aria-hidden="true" /></Link>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>Anki Generator</span><p>From lecture notes to a deck you can edit.</p>
        <Link href="/auth">Log in <ArrowRight size={14} aria-hidden="true" /></Link>
      </footer>
    </div>
  );
}
