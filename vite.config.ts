// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages serves the app under the repository sub-path; Netlify serves it at the domain root.
const basePath = process.env.NETLIFY ? "" : "/exact-pixel-perfection-051";

export default defineConfig({
  vite: {
    base: `${basePath}/`,
  },
  tanstackStart: {
    router: { basepath: basePath || "/" },
    spa: {
      enabled: true,
      maskPath: `${basePath}/`,
      prerender: { outputPath: `${basePath}/index` },
    },
    sitemap: { enabled: false },
  },
  nitro: false,
});
