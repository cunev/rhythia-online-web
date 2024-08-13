import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    generouted({
      source: { routes: "./src/pages/**/[\\w[-]*.{jsx,tsx}", modals: "" },
    }),
  ],
});
