"use client";

import { useState } from "react";
import { ArrowDown, FileText, RotateCcw } from "lucide-react";
import styles from "@/app/landing.module.css";

export function LandingExample() {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <figure className={styles.example} aria-label="Example of a study note turned into a flashcard">
      <div className={styles.source}>
        <div className={styles.sourceHeader}><FileText size={15} aria-hidden="true" /><span>Biologia komórki.pdf</span><span>Excerpt</span></div>
        <div className={styles.sourceBody} lang="pl">
          <p className={styles.sourceTitle}>Błona komórkowa</p>
          <p>Błona komórkowa oddziela wnętrze komórki od otoczenia. <mark>Jest zbudowana z dwuwarstwy fosfolipidowej</mark> i reguluje transport substancji do komórki oraz z komórki.</p>
        </div>
      </div>
      <div className={styles.exampleConnector}><ArrowDown size={18} aria-hidden="true" /><span>One idea, one question</span></div>
      <div className={styles.sampleCard}>
        <div className={styles.cardHeading}><span>Biologia komórki</span><span>Sample card</span></div>
        <div className={styles.cardText} lang="pl" aria-live="polite">
          <span className={styles.cardSide}>{showAnswer ? "Odpowiedź" : "Pytanie"}</span>
          <p>{showAnswer ? "Z dwuwarstwy fosfolipidowej." : "Z czego zbudowana jest błona komórkowa?"}</p>
        </div>
        <button type="button" onClick={() => setShowAnswer(!showAnswer)} aria-pressed={showAnswer} className={styles.flipButton}>
          <RotateCcw size={14} aria-hidden="true" />{showAnswer ? "Show question" : "Show answer"}
        </button>
      </div>
      <figcaption>Illustrative sample · Click to see the other side.</figcaption>
    </figure>
  );
}
