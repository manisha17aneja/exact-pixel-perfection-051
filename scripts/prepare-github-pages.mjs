import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("dist/client");
const index = resolve(output, "index.html");
const fallback = resolve(output, "404.html");

await mkdir(output, { recursive: true });
await copyFile(index, fallback);
await writeFile(resolve(output, ".nojekyll"), "");

console.log("Prepared dist/client for GitHub Pages.");
if (process.env.NETLIFY) {
  // Serve the SPA shell for every client route on Netlify.
  await writeFile(resolve(output, "_redirects"), "/*  /index.html  200\n");
  console.log("Added Netlify SPA fallback.");
}
