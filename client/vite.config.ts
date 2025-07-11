// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwind(),    // ← this is all you need for Tailwind v4 + Vite
  ],
});
