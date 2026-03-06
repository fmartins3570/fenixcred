/**
 * Vite Plugin - Resource Hints Injection
 * 
 * Injeta automaticamente resource hints (preload, preconnect, dns-prefetch)
 * no index.html após o build, usando os nomes reais dos arquivos gerados.
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export function resourceHintsPlugin() {
  return {
    name: 'resource-hints',
    apply: 'build',
    transformIndexHtml(html) {
      // Este hook é chamado após o build, mas antes de escrever o HTML
      // Vamos adicionar resource hints estáticos que funcionam com padrões de nomes
      
      const resourceHints = `
    <!-- Resource Hints - Otimização de Carregamento -->
    <!-- Preconnect para domínios externos (reduz latência de DNS/TLS) -->
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />
    <link rel="preconnect" href="https://maps.googleapis.com" crossorigin />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://maps.googleapis.com" />
    <!-- Preload será adicionado dinamicamente via script inline -->
`;

      // Injetar após charset
      return html.replace(
        /(<meta charset="UTF-8" \/>)/,
        `$1${resourceHints}`
      );
    },
    writeBundle(options) {
      // Após escrever os arquivos, atualizar o HTML com os nomes reais
      const distPath = options.dir || 'dist';
      const htmlPath = join(distPath, 'index.html');
      
      try {
        let html = readFileSync(htmlPath, 'utf-8');
        const assetsPath = join(distPath, 'assets');
        
        // Ler arquivos na pasta assets
        const assets = readdirSync(assetsPath);
        
        // Identificar arquivos críticos
        const criticalCSS = assets.find(f => f.match(/^index-.*\.css$/));
        const criticalJS = assets.find(f => f.match(/^index-.*\.js$/));
        const reactVendor = assets.find(f => f.match(/^react-vendor-.*\.js$/));
        const heroImage400 = assets.find(f => f.match(/^modelo_fenix_cred-400w.*\.webp$/));
        const heroImage525 = assets.find(f => f.match(/^modelo_fenix_cred-525w.*\.webp$/));
        const logo = assets.find(f => f.match(/^logo-fenix-cred-299w.*\.webp$/));
        
        // Gerar preloads dinâmicos
        let preloads = '';
        
        if (criticalCSS) {
          preloads += `    <link rel="preload" as="style" href="/assets/${criticalCSS}" />\n`;
        }
        if (criticalJS) {
          preloads += `    <link rel="preload" as="script" href="/assets/${criticalJS}" />\n`;
        }
        if (reactVendor) {
          preloads += `    <link rel="preload" as="script" href="/assets/${reactVendor}" />\n`;
        }
        if (heroImage400) {
          preloads += `    <link rel="preload" as="image" href="/assets/${heroImage400}" type="image/webp" />\n`;
        }
        if (heroImage525) {
          preloads += `    <link rel="preload" as="image" href="/assets/${heroImage525}" type="image/webp" />\n`;
        }
        if (logo) {
          preloads += `    <link rel="preload" as="image" href="/assets/${logo}" type="image/webp" />\n`;
        }
        
        // Injetar preloads após os resource hints estáticos
        if (preloads) {
          html = html.replace(
            /(<!-- Preload será adicionado dinamicamente via script inline -->)/,
            `<!-- Preload de recursos críticos -->\n${preloads}`
          );
          
          // Escrever HTML atualizado
          writeFileSync(htmlPath, html, 'utf-8');
        }
      } catch (error) {
        console.warn('Resource hints plugin: Não foi possível atualizar HTML:', error.message);
      }
    }
  };
}
