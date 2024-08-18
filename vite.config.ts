import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
export default defineConfig({
  define: {
    __dirname: {},
    process: {
      env: {
        ADMIN_KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBma2FqbmdibGxjYmR6b3lscnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1NzYwNzAsImV4cCI6MjAzNDE1MjA3MH0.iosTZ6AEiolRQhEIEvlyyHWlHKlpzNCN4aK-MyrxjXo`,
        API_STAGE: `development`,
      },
    },
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
