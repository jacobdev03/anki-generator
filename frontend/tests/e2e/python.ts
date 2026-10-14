import { existsSync } from "node:fs";
import path from "node:path";

const candidates = process.platform === "win32"
  ? ["../backend/venv/Scripts/python.exe", "../backend/.venv/Scripts/python.exe"]
  : ["../backend/.venv/bin/python", "../backend/venv/bin/python"];

export const python = process.env.E2E_PYTHON
  || candidates.map((candidate) => path.resolve(candidate)).find(existsSync)
  || "python";
