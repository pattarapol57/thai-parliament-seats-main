import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'thai-parliament-seats-main.onrender.com',
      '.onrender.com',  // wildcard สำหรับทุก subdomain
      '.render.com'
    ]
  },
  
  preview: {
    host: '0.0.0.0',
    port: 8080 || 4173,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'thai-parliament-seats-main.onrender.com',
      '.onrender.com',
      '.render.com'
    ]
  },
  
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false
  }
}));