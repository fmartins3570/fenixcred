import { createRoot } from "react-dom/client";
// CSS não-crítico será carregado pelo Vite, mas o script no index.html
// o tornará não-bloqueante usando técnica de print media
// O CSS crítico (Header + Hero) já está inline no index.html
import App from "./App.jsx";
import { initSpotlight } from "./utils/spotlight.js";
import { hasConsented, loadTrackingScripts } from "./utils/cookieConsent.js";
import "./utils/lazyImages.js";

// Importar CSS - será tornado não-bloqueante pelo script no index.html
import "./index.css";
import "./styles/spotlight.css";

// Inicializar efeito spotlight nos cards
initSpotlight();

// Se o usuário já aceitou cookies em visita anterior, carregar tracking
if (hasConsented()) {
  loadTrackingScripts();
}

// StrictMode removido em produção para reduzir bundle (~2-3 KiB)
// Mantém apenas o necessário para produção
createRoot(document.getElementById("root")).render(<App />);
