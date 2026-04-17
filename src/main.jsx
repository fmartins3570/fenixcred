import { createRoot } from "react-dom/client";
// CSS não-crítico será carregado pelo Vite, mas o script no index.html
// o tornará não-bloqueante usando técnica de print media
// O CSS crítico (Header + Hero) já está inline no index.html
import App from "./App.jsx";
import { initSpotlight } from "./utils/spotlight.js";
import { hasConsented, loadTrackingScripts } from "./utils/cookieConsent.js";
import { sendServerEvent } from "./utils/metaCAPI.js";
import "./utils/lazyImages.js";

// Importar CSS - será tornado não-bloqueante pelo script no index.html
import "./index.css";
import "./styles/spotlight.css";

// Inicializar efeito spotlight nos cards
initSpotlight();

// Carregar tracking scripts (mensuração de campanha é essencial)
// O consent banner controla a experiência mas não bloqueia mensuração
loadTrackingScripts();

// Mirror the index.html browser PageView into CAPI using the same event_id so
// Meta deduplicates the pair. Recovers the ~20-40% of browser PageViews lost
// to ad blockers / ITP / iOS tracking prevention.
const pageViewEventId = window.__fenixPageViewEventId;
if (pageViewEventId) {
  sendServerEvent('PageView', pageViewEventId);
}

// StrictMode removido em produção para reduzir bundle (~2-3 KiB)
// Mantém apenas o necessário para produção
createRoot(document.getElementById("root")).render(<App />);
