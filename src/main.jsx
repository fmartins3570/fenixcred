import { createRoot } from "react-dom/client";
// CSS não-crítico será carregado pelo Vite, mas o script no index.html
// o tornará não-bloqueante usando técnica de print media
// O CSS crítico (Header + Hero) já está inline no index.html
import App from "./App.jsx";
import { initGA } from "./utils/analytics.js";
import { initSpotlight } from "./utils/spotlight.js";
import "./utils/lazyImages.js";

// Importar CSS - será tornado não-bloqueante pelo script no index.html
import "./index.css";
import "./styles/spotlight.css";

// Inicializar efeito spotlight nos cards
initSpotlight();

// Inicializar Google Analytics após renderização inicial (não bloqueante)
// O script já está no index.html, esta função apenas verifica se está OK
if (typeof window !== "undefined") {
  // Adiar inicialização para não bloquear renderização
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initGA();
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      initGA();
    }, 100);
  }
}

// StrictMode removido em produção para reduzir bundle (~2-3 KiB)
// Mantém apenas o necessário para produção
createRoot(document.getElementById("root")).render(<App />);
