const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// --- Token Management ---
export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("anki_token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("anki_token");
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("anki_token");
    window.location.href = "/auth";
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Auth Endpoints ---

export interface User {
  id: number;
  username: string;
  email: string | null;
  full_name: string | null;
  disabled: boolean | null;
  credits: number;
}

export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function register(username: string, email: string, password: string, fullName: string = "") {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      full_name: fullName,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_BASE}/users/me/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
}

// --- App Endpoints ---

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
    headers: {
      ...getAuthHeaders(),
    },
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
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
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
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ deck_name: deckName, flashcards }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Export failed");
  }

  return res.blob();
}

export interface SavedDeck {
  id: number;
  title: string;
  created_at: string;
  flashcard_count: number;
}

export interface DeckDetail {
  id: number;
  title: string;
  created_at: string;
  flashcards: SavedFlashcard[];
}

export interface SavedFlashcard extends Flashcard {
  id: number;
  deck_id: number;
  created_at: string;
}

export async function saveDeck(title: string, flashcards: Flashcard[]): Promise<DeckDetail> {
  const res = await fetch(`${API_BASE}/decks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title, flashcards }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to save deck");
  }
  return res.json();
}

export async function getDecks(): Promise<SavedDeck[]> {
  const res = await fetch(`${API_BASE}/decks`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch decks");
  }
  return res.json();
}

export async function getDeck(id: number): Promise<DeckDetail> {
  const res = await fetch(`${API_BASE}/decks/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch deck");
  }
  return res.json();
}

export async function deleteDeck(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/decks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to delete deck");
  }
}

export async function updateFlashcard(id: number, front: string, back: string): Promise<SavedFlashcard> {
  const res = await fetch(`${API_BASE}/flashcards/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ front, back }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to update flashcard");
  }
  return res.json();
}

export async function deleteFlashcard(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/flashcards/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to delete flashcard");
  }
}

export async function exportSavedDeck(id: number): Promise<Blob> {
  const res = await fetch(`${API_BASE}/decks/${id}/export`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to export saved deck");
  }
  return res.blob();
}

export async function createCheckoutSession(): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/create-checkout-session`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create checkout session");
  }

  return res.json();
}

export async function createPortalSession(): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/create-portal-session`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create portal session");
  }

  return res.json();
}
