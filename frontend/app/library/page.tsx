"use client";

import { useEffect, useState } from "react";
import { getDecks, type SavedDeck, logout, getMe } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Loader2, Zap, User as UserIcon, LogOut, BookOpen, Clock, Trash2, Edit3 } from "lucide-react";

export default function LibraryPage() {
  const [decks, setDecks] = useState<SavedDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getMe();
        setUser(userData);
        const decksData = await getDecks();
        setDecks(decksData);
      } catch (err) {
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
              <Zap className="size-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-semibold tracking-tight">
              Anki Generator
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => router.push("/library")} className="text-primary hover:text-primary">
              Library
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="flex items-center justify-center size-7 rounded-full bg-secondary text-secondary-foreground">
                    <UserIcon className="size-3.5" />
                  </div>
                  <span className="hidden sm:inline-block">{user.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} className="size-8 rounded-full" title="Logout">
                  <LogOut className="size-4 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Your Library</h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              Manage your saved decks, review flashcards, and export them to Anki.
            </p>
          </div>

          {decks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-muted/20 border-dashed">
              <div className="flex items-center justify-center size-12 rounded-full bg-muted mb-4">
                <BookOpen className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No decks found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                You haven't saved any flashcard decks yet.
              </p>
              <Button onClick={() => router.push("/dashboard")}>
                Generate Flashcards
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.map((deck) => (
                <Card key={deck.id} className="group flex flex-col hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{deck.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="size-3.5" />
                        {deck.flashcard_count} cards
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {format(new Date(deck.created_at), "MMM d, yyyy")}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-4 flex gap-2">
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => router.push(`/library/${deck.id}`)}
                    >
                      <Edit3 className="size-4" />
                      Manage Deck
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
