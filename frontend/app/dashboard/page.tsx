"use client";

import { useState, useCallback, useEffect } from "react";
import { FileDropzone } from "@/components/file-dropzone";
import { FlashcardGrid } from "@/components/flashcard-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  uploadPDF,
  generateCards,
  saveDeck,
  getMe,
  logout,
  createCheckoutSession,
  createPortalSession,
  type Flashcard,
  type User,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Zap,
  LogOut,
  CreditCard,
  User as UserIcon,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

type Stage = "idle" | "uploading" | "generating" | "done" | "error";

export default function Dashboard() {
  const [stage, setStage] = useState<Stage>("idle");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [progress, setProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [completedChunks, setCompletedChunks] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [deckName, setDeckName] = useState("My Anki Deck");
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        router.push("/auth");
      } finally {
        setIsInitializing(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") {
      toast.success("Payment successful! Credits added to your account.");
      const fetchUserData = async () => {
        const userData = await getMe();
        setUser(userData);
      };
      fetchUserData();
      window.history.replaceState({}, "", window.location.pathname);
    } else if (payment === "cancel") {
      toast.error("Payment was cancelled.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleFileSelected = useCallback(async (file: File) => {
    setFlashcards([]);
    setErrorMessage("");
    setFileName(file.name);
    setStage("uploading");
    setProgress(0);

    try {
      // Step 1: Upload and chunk the PDF
      const uploadRes = await uploadPDF(file);
      const chunks = uploadRes.chunks;
      setTotalChunks(chunks.length);
      setCompletedChunks(0);
      setStage("generating");

      // Step 2: Process each chunk through AI
      const allCards: Flashcard[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const res = await generateCards(chunks[i]);
        allCards.push(...res.flashcards);
        setFlashcards([...allCards]);
        setCompletedChunks(i + 1);
        setProgress(Math.round(((i + 1) / chunks.length) * 100));
      }

      setStage("done");
    } catch (err) {
      setStage("error");
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      const updatedUser = await getMe();
      setUser(updatedUser);
    }
  }, []);

  const handleSaveDeck = useCallback(async () => {
    if (flashcards.length === 0) return;
    setIsSaving(true);

    try {
      await saveDeck(deckName, flashcards);
      toast.success("Deck saved to your library!");
      router.push("/library");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save deck";
      setErrorMessage(msg);
      toast.error(msg);
      setStage("error");
    } finally {
      setIsSaving(false);
    }
  }, [flashcards, deckName, router]);

  const handleReset = useCallback(() => {
    setStage("idle");
    setFlashcards([]);
    setProgress(0);
    setTotalChunks(0);
    setCompletedChunks(0);
    setErrorMessage("");
    setFileName("");
  }, []);

  const handleBuyCredits = useCallback(async () => {
    setIsPurchasing(true);
    try {
      const { url } = await createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to initiate purchase";
      setErrorMessage(msg);
      toast.error(msg);
      setStage("error");
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  const handleManageBilling = useCallback(async () => {
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to open billing portal. Ensure you have made at least one purchase.";
      toast.error(msg);
    }
  }, []);

  if (isInitializing) {
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
            <Button variant="ghost" onClick={() => router.push("/library")} className="text-muted-foreground hover:text-foreground">
              Library
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="font-mono text-xs hidden sm:inline-flex items-center gap-1.5">
              <CreditCard className="size-3" />
              {user?.credits ?? 0} credits
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBuyCredits} 
              disabled={isPurchasing}
              className="h-7 text-xs gap-1.5"
            >
              {isPurchasing ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
              Buy Credits
            </Button>
            {flashcards.length > 0 && (
              <Badge variant="secondary" className="font-mono text-xs hidden sm:inline-flex">
                {flashcards.length} cards
              </Badge>
            )}
            {user && (
              <div className="flex items-center gap-3 border-l pl-4 border-border">
                <ThemeToggle />
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="flex items-center justify-center size-7 rounded-full bg-secondary text-secondary-foreground">
                    <UserIcon className="size-3.5" />
                  </div>
                  <span className="hidden sm:inline-block">{user.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleManageBilling} className="size-8 rounded-full" title="Billing">
                  <Settings className="size-4 text-muted-foreground" />
                </Button>
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
          {/* Hero Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Generate Flashcards
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              Upload a PDF document and let AI extract key concepts into
              ready-to-use Anki flashcards. Click any card to preview the
              answer.
            </p>
          </div>

          {/* Upload Section */}
          <FileDropzone
            onFileSelected={handleFileSelected}
            disabled={stage === "uploading" || stage === "generating"}
          />

          {/* Progress Section */}
          {(stage === "uploading" || stage === "generating") && (
            <Card className="border-primary/20 bg-primary/[0.02]">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="size-4 text-primary animate-spin" />
                    <span className="text-sm font-medium">
                      {stage === "uploading"
                        ? "Uploading & extracting text..."
                        : `Processing chunk ${completedChunks} of ${totalChunks}...`}
                    </span>
                  </div>
                  {stage === "generating" && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {progress}%
                    </span>
                  )}
                </div>
                {stage === "generating" && (
                  <Progress value={progress} className="h-1.5" />
                )}
              </CardContent>
            </Card>
          )}

          {/* Done Banner */}
          {stage === "done" && (
            <Card className="border-green-500/20 bg-green-500/[0.03]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Generated {flashcards.length} flashcards from{" "}
                      <span className="font-mono">{fileName}</span>
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Upload another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Banner */}
          {stage === "error" && (
            <Card className="border-destructive/20 bg-destructive/[0.03]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="size-4 text-destructive" />
                    <span className="text-sm font-medium">
                      {errorMessage}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Try again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save to Library Section */}
          {flashcards.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                      <Layers className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Save Deck</p>
                      <p className="text-xs text-muted-foreground">
                        Save to your library to preview, edit, or export later
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                      id="deck-name-input"
                      aria-label="Deck name"
                      type="text"
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                      placeholder="Deck name"
                      className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all flex-1 sm:w-48"
                    />
                    <Button
                      onClick={handleSaveDeck}
                      disabled={isSaving}
                      size="default"
                      className="gap-1.5"
                    >
                      {isSaving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      {isSaving ? "Saving..." : "Save to Library"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flashcard Grid */}
          {flashcards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">
                  Generated Flashcards
                </h3>
              </div>
              <FlashcardGrid flashcards={flashcards} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
