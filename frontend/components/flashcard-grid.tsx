"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";
import type { Flashcard } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FlashcardGridProps {
  flashcards: Flashcard[];
}

function FlashcardItem({
  card,
  index,
}: {
  card: Flashcard;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group perspective-[1000px] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={cn(
          "relative w-full min-h-[180px] transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 [backface-visibility:hidden] border-border/50 hover:border-primary/30 transition-colors">
          <CardContent className="flex flex-col justify-between h-full p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {card.front}
              </p>
              <Badge
                variant="secondary"
                className="shrink-0 text-[10px] font-mono"
              >
                #{index + 1}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
              <RotateCcw className="size-3" />
              <span>Click to flip</span>
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary/5 border-primary/20">
          <CardContent className="flex flex-col justify-between h-full p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed text-foreground">
                {card.back}
              </p>
              <Badge
                variant="outline"
                className="shrink-0 text-[10px] font-mono"
              >
                #{index + 1}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
              <RotateCcw className="size-3" />
              <span>Click to flip back</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function FlashcardGrid({ flashcards }: FlashcardGridProps) {
  if (flashcards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map((card, i) => (
        <FlashcardItem key={i} card={card} index={i} />
      ))}
    </div>
  );
}
