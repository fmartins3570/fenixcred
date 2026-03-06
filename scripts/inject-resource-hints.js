#!/usr/bin/env node

/**
 * Script pós-build para injetar resource hints no index.html
 *
 * Uso: node scripts/inject-resource-hints.js
 * Executar após: npm run build
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "..", "dist");
const htmlPath = path.join(distPath, "index.html");
const assetsPath = path.join(distPath, "assets");

try {
  // Ler HTML
  let html = fs.readFileSync(htmlPath, "utf-8");

  // Ler arquivos na pasta assets
  const assets = fs.readdirSync(assetsPath);

  // Identificar arquivos críticos
  const criticalCSS = assets.find((f) => f.match(/^index-.*\.css$/));
  const criticalJS = assets.find((f) => f.match(/^index-.*\.js$/));
  const reactVendor = assets.find((f) => f.match(/^react-vendor-.*\.js$/));
  const heroImage400 = assets.find((f) =>
    f.match(/^modelo_fenix_cred-400w.*\.webp$/)
  );
  const heroImage525 = assets.find((f) =>
    f.match(/^modelo_fenix_cred-525w.*\.webp$/)
  );
  const logo = assets.find((f) => f.match(/^logo-fenix-cred-299w.*\.webp$/));

  // Gerar preloads
  let preloads =
    "\n    <!-- Preload de recursos críticos (adicionado automaticamente) -->\n";

  if (criticalCSS) {
    preloads += `    <link rel="preload" as="style" href="/assets/${criticalCSS}" />\n`;
  }
  if (criticalJS) {
    preloads += `    <link rel="preload" as="script" href="/assets/${criticalJS}" />\n`;
  }
  if (reactVendor) {
    preloads += `    <link rel="preload" as="script" href="/assets/${reactVendor}" />\n`;
  }
  // Preload da imagem LCP (hero) - CRÍTICO para LCP
  // Priorizar imagem 525w (desktop) e 400w (mobile) com fetchpriority
  if (heroImage525) {
    preloads += `    <link rel="preload" as="image" href="/assets/${heroImage525}" type="image/webp" fetchpriority="high" />\n`;
  }
  if (heroImage400) {
    preloads += `    <link rel="preload" as="image" href="/assets/${heroImage400}" type="image/webp" fetchpriority="high" />\n`;
  }
  if (logo) {
    preloads += `    <link rel="preload" as="image" href="/assets/${logo}" type="image/webp" />\n`;
  }

  // Remover preloads antigos (se existirem) para substituir com versões atualizadas
  // Remove todos os preloads existentes e comentários relacionados
  html = html.replace(/<link rel="preload"[^>]*>\s*/g, "");
  html = html.replace(/<!-- Preload de recursos críticos[^>]*>\s*/g, "");
  html = html.replace(/<!-- O script inject-resource-hints.js[^>]*>\s*/g, "");

  // Adicionar resource hints após charset (se não existirem)
  if (!html.includes("Resource Hints")) {
    // Adicionar preconnect e dns-prefetch primeiro
    const staticHints = `
    <!-- Resource Hints - Otimização de Carregamento (FCP) -->
    <!-- Preconnect para domínios externos (reduz latência de DNS/TLS) -->
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />
    <link rel="preconnect" href="https://maps.googleapis.com" crossorigin />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://maps.googleapis.com" />`;

    // Injetar após charset
    html = html.replace(
      /(<meta charset="UTF-8" \/>)/,
      `$1${staticHints}${preloads}`
    );
  } else {
    // Se já existir Resource Hints, encontrar onde adicionar preloads
    // Procurar pelo último dns-prefetch dos resource hints estáticos
    const dnsPrefetchMatches = [
      ...html.matchAll(/<link rel="dns-prefetch"[^>]*>/g),
    ];

    if (dnsPrefetchMatches.length > 0) {
      // Adicionar preloads após o último dns-prefetch
      const lastMatch = dnsPrefetchMatches[dnsPrefetchMatches.length - 1];
      const insertIndex = lastMatch.index + lastMatch[0].length;
      html =
        html.substring(0, insertIndex) + preloads + html.substring(insertIndex);
    } else {
      // Fallback: adicionar após preconnect
      const preconnectMatch = html.match(/<link rel="preconnect"[^>]*>/);
      if (preconnectMatch && preconnectMatch.index !== undefined) {
        const insertIndex = preconnectMatch.index + preconnectMatch[0].length;
        html =
          html.substring(0, insertIndex) +
          preloads +
          html.substring(insertIndex);
      } else {
        // Último fallback: adicionar antes de </head>
        html = html.replace(/(<\/head>)/, `${preloads}$1`);
      }
    }
  }

  // Escrever HTML atualizado
  fs.writeFileSync(htmlPath, html, "utf-8");

  console.log("✅ Resource hints injetados com sucesso!");
  console.log(`   - CSS: ${criticalCSS || "não encontrado"}`);
  console.log(`   - JS: ${criticalJS || "não encontrado"}`);
  console.log(`   - React Vendor: ${reactVendor || "não encontrado"}`);
  console.log(
    `   - Imagens: ${
      [heroImage400, heroImage525, logo].filter(Boolean).length
    } arquivos`
  );
} catch (error) {
  console.error("❌ Erro ao injetar resource hints:", error.message);
  process.exit(1);
}
