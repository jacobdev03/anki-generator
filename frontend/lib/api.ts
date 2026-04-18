const API_BASE = "http://127.0.0.1:8000/api";

export interface Flashcard {
  front: string;
  back: string;
}

export interface UploadResponse {
  message: string;
  file_name: string;
  total_chunks: number;
  chunks: string[];
}

export interface GenerateResponse {
  flashcards: Flashcard[];
}

export async function uploadPDF(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Upload failed");
  }

  return res.json();
}

export async function generateCards(text: string): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Generation failed");
  }

  return res.json();
}

export async function exportDeck(
  deckName: string,
  flashcards: Flashcard[]
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deck_name: deckName, flashcards }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Export failed");
  }

  return res.blob();
}
