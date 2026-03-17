import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: {
    host: '::',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar React e React-DOM em chunk próprio
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "react-vendor";
          }
          // Separar componentes lazy em chunks individuais menores
          if (id.includes("components/ReviewsSection")) {
            return "reviews";
          }
          if (id.includes("components/Parceiros")) {
            return "parceiros";
          }
          if (id.includes("components/FAQ")) {
            return "faq";
          }
          if (id.includes("components/TrabalheConosco")) {
            return "trabalhe";
          }
          if (id.includes("components/PrivacyPolicy")) {
            return "privacy";
          }
          if (id.includes("components/ConsignadoLP")) {
            return "consignado-lp";
          }
          // Outros node_modules em chunk separado
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
      // Tree-shaking agressivo para remover código não usado
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    // Remover console.logs e debuggers em produção
    esbuild: {
      pure: ["console.log", "console.info", "console.debug"],
      drop: ["debugger"],
    },
    // Otimizações adicionais
    target: "es2015",
    cssCodeSplit: true,
    // Otimizar para reduzir cadeia crítica
    assetsInlineLimit: 4096, // Inline assets < 4KB
    // CSS não deve bloquear renderização
    cssMinify: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    // Excluir dependências não utilizadas
    exclude: [],
  },
});
