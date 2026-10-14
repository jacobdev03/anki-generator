import { expect, test, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { python } from "./python";

const pdf = path.join(__dirname, "fixtures", "biology.pdf");
const password = "e2e-password";

async function signIn(page: Page, username: string) {
  await page.goto("/auth");
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Generate Flashcards" })).toBeVisible();
}

async function register(page: Page) {
  const username = `e2e-${randomUUID()}`;
  await page.goto("/");
  await page.getByRole("link", { name: "Log in", exact: true }).first().click();
  await expect(page).toHaveURL(/\/auth$/);
  await page.getByRole("tab", { name: "Register", exact: true }).click();
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Email", { exact: true }).fill(`${username}@example.invalid`);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Generate Flashcards" })).toBeVisible();
  return username;
}

test("register, generate, edit, reopen and export an Anki deck", async ({ page }, testInfo) => {
  const username = await register(page);
  await expect(page.getByText("50 credits", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await signIn(page, username);

  await page.locator('input[type="file"]').setInputFiles(pdf);
  await expect(page.getByText(/Generated 2 flashcards from/)).toBeVisible();
  await expect(page.getByText("49 credits", { exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Deck name", exact: true }).fill("Biology review");
  await page.getByRole("button", { name: "Save to Library", exact: true }).click();
  await expect(page).toHaveURL(/\/library$/);
  await page.reload();
  await expect(page.getByText("Biology review", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Manage Deck", exact: true }).click();
  await expect(page.getByRole("heading", { name: "2 Cards", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Edit Card", exact: true }).first().click();
  const front = "Jaka jest budowa błony komórkowej?";
  const back = "Dwuwarstwa fosfolipidowa.";
  await page.getByLabel("Front", { exact: true }).fill(front);
  await page.getByLabel("Back", { exact: true }).fill(back);
  await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  await expect(page.getByText(front, { exact: true })).toBeVisible();
  const savedDeckUrl = page.url();
  // Exercise a fresh login and server read, rather than only React's local state.
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await signIn(page, username);
  await expect(page.getByText("49 credits", { exact: true })).toBeVisible();
  await page.goto(savedDeckUrl);
  await expect(page.getByText(front, { exact: true })).toBeVisible();
  await expect(page.getByText(back, { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export .apkg", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Biology review.apkg");
  const packagePath = testInfo.outputPath("biology.apkg");
  await download.saveAs(packagePath);
  execFileSync(python, [path.resolve("../backend/tests/inspect_apkg.py"), packagePath, front, back, "2"]);
});

test("rejects oversized and non-PDF files without using credits", async ({ page }) => {
  await register(page);
  const uploads: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/api/upload")) uploads.push(request.url());
  });
  await page.locator('input[type="file"]').setInputFiles({ name: "oversized.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
  await expect(page.getByText("File size exceeds the 10MB limit.", { exact: true })).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("not a PDF") });
  await expect(page.getByText("Only PDF files are supported.", { exact: true })).toBeVisible();
  expect(uploads).toHaveLength(0);
  await expect(page.getByText("50 credits", { exact: true })).toBeVisible();
});

test("shows the insufficient-credit error for a PDF", async ({ page }) => {
  await signIn(page, "no-credits");
  await expect(page.getByText("0 credits", { exact: true })).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles(pdf);
  await expect(page.getByText("You don't have enough credits to process this file", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save to Library", exact: true })).toHaveCount(0);
  await expect(page.getByText("0 credits", { exact: true })).toBeVisible();
});
