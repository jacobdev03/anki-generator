import { cpSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Exercise the same standalone server used by the Docker image.
cpSync("public", ".next/standalone/public", { recursive: true });
cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
process.env.PORT = "3102";
process.env.HOSTNAME = "127.0.0.1";
await import(pathToFileURL(path.resolve(".next/standalone/server.js")).href);
