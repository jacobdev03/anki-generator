"use client";

import { useEffect, useState, use, useCallback } from "react";
import { getDeck, updateFlashcard, deleteFlashcard, exportSavedDeck, deleteDeck, type DeckDetail, type SavedFlashcard } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, Trash2, Edit2, Check, X } from "lucide-react";

export default function DeckPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const deckId = parseInt(unwrappedParams.id, 10);

  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const router = useRouter();

  const loadDeck = useCallback(async () => {
    try {
      const data = await getDeck(deckId);
      setDeck(data);
    } catch (err) {
      console.error(err);
      router.push("/library");
    } finally {
      setIsLoading(false);
    }
  }, [deckId, router]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  const handleExport = async () => {
    if (!deck) return;
    setIsExporting(true);
    try {
      const blob = await exportSavedDeck(deck.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${deck.title}.apkg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export deck");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!deck) return;
    if (!confirm("Are you sure you want to delete this entire deck?")) return;
    try {
      await deleteDeck(deck.id);
      router.push("/library");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete deck");
    }
  };

  const handleStartEdit = (card: SavedFlashcard) => {
    setEditingCardId(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditFront("");
    setEditBack("");
  };

  const handleSaveEdit = async (cardId: number) => {
    try {
      const updatedCard = await updateFlashcard(cardId, editFront, editBack);
      setDeck(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          flashcards: prev.flashcards.map(c => c.id === cardId ? updatedCard : c)
        };
      });
      setEditingCardId(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update flashcard");
    }
  };

  const handleDeleteFlashcard = async (cardId: number) => {
    if (!confirm("Delete this flashcard?")) return;
    try {
      await deleteFlashcard(cardId);
      setDeck(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          flashcards: prev.flashcards.filter(c => c.id !== cardId)
        };
      });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete flashcard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!deck) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/library")} className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-base font-semibold tracking-tight truncate max-w-[200px] sm:max-w-[400px]">
              {deck.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleDeleteDeck} className="hidden sm:flex">
              <Trash2 className="size-4 mr-1.5" />
              Delete Deck
            </Button>
            <Button onClick={handleExport} disabled={isExporting} size="sm">
              {isExporting ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Download className="size-4 mr-1.5" />}
              {isExporting ? "Exporting..." : "Export .apkg"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">{deck.flashcards.length} Cards</h2>
        </div>

        <div className="space-y-4">
          {deck.flashcards.map((card, index) => {
            const isEditing = editingCardId === card.id;

            return (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {isEditing ? (
                    <div className="p-4 space-y-4 bg-muted/30">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Front</label>
                        <Textarea
                          value={editFront}
                          onChange={e => setEditFront(e.target.value)}
                          className="min-h-[80px] resize-y"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Back</label>
                        <Textarea
                          value={editBack}
                          onChange={e => setEditBack(e.target.value)}
                          className="min-h-[80px] resize-y"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <X className="size-4 mr-1.5" /> Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSaveEdit(card.id)}>
                          <Check className="size-4 mr-1.5" /> Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-border/50">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Front</div>
                        <p className="text-sm whitespace-pre-wrap">{card.front}</p>
                      </div>
                      <div className="flex-1 p-4 bg-primary/5">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Back</div>
                        <p className="text-sm whitespace-pre-wrap">{card.back}</p>
                      </div>
                      <div className="flex sm:flex-col items-center justify-center p-2 gap-2 border-t sm:border-t-0 sm:border-l border-border/50 bg-muted/10">
                        <Button variant="ghost" size="icon" onClick={() => handleStartEdit(card)} className="size-8" title="Edit Card">
                          <Edit2 className="size-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFlashcard(card.id)} className="size-8 hover:bg-destructive/10 hover:text-destructive" title="Delete Card">
                          <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
