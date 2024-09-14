import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
export default defineConfig({
  define: {
    __dirname: {},
    process: process,
  },

  plugins: [
    react(),
    generouted({
      source: { routes: "./src/pages/**/[\\w[-]*.{jsx,tsx}", modals: "" },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
