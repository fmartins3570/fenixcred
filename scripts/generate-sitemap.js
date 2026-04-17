#!/usr/bin/env node

/**
 * Script para gerar sitemap.xml dinâmico com lastmod real
 * 
 * Gera sitemap.xml baseado nas seções do site com:
 * - URLs absolutas
 * - lastmod real (data de modificação dos arquivos)
 * - changefreq apropriado
 * - priority baseado na importância
 * 
 * Uso: node scripts/generate-sitemap.js
 * Executar após: npm run build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://fenixcredbr.com.br';
const publicPath = path.join(__dirname, '..', 'public');
const distPath = path.join(__dirname, '..', 'dist');
const srcPath = path.join(__dirname, '..', 'src');

/**
 * Obtém data de modificação de um arquivo
 */
function getFileModificationDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const date = new Date(stats.mtime);
    return date.toISOString();
  } catch {
    // Se arquivo não existir, usar data atual
    return new Date().toISOString();
  }
}

/**
 * Obtém data de modificação de um componente React
 */
function getComponentModDate(sectionId) {
  const componentMap = {
    'inicio': 'Hero.jsx',
    'sobre': 'About.jsx',
    'servicos': 'Services.jsx',
    'depoimentos': 'ReviewsSection.jsx',
    'parceiros': 'Parceiros.jsx',
    'faq': 'FAQ.jsx',
    'trabalhe-conosco': 'TrabalheConosco.jsx',
    'politica-privacidade': 'PrivacyPolicy.jsx',
    'antecipacao-fgts': 'ConsignadoLP/index.jsx',
  };

  const componentFile = componentMap[sectionId];
  if (!componentFile) {
    return new Date().toISOString();
  }

  const componentPath = path.join(srcPath, 'components', componentFile);
  return getFileModificationDate(componentPath);
}

/**
 * Gera sitemap.xml
 */
function generateSitemap() {
  // Definir todas as URLs do site
  const urls = [
    {
      loc: `${baseUrl}/`,
      sectionId: 'inicio',
      changefreq: 'weekly',
      priority: '1.0',
      description: 'Página Principal'
    },
    {
      loc: `${baseUrl}/#inicio`,
      sectionId: 'inicio',
      changefreq: 'weekly',
      priority: '0.95',
      description: 'Seção Home/Início'
    },
    {
      loc: `${baseUrl}/#sobre`,
      sectionId: 'sobre',
      changefreq: 'monthly',
      priority: '0.85',
      description: 'Seção Sobre Nós'
    },
    {
      loc: `${baseUrl}/#servicos`,
      sectionId: 'servicos',
      changefreq: 'weekly',
      priority: '0.90',
      description: 'Seção Serviços'
    },
    {
      loc: `${baseUrl}/#depoimentos`,
      sectionId: 'depoimentos',
      changefreq: 'monthly',
      priority: '0.80',
      description: 'Seção Avaliações/Depoimentos'
    },
    {
      loc: `${baseUrl}/#parceiros`,
      sectionId: 'parceiros',
      changefreq: 'monthly',
      priority: '0.75',
      description: 'Seção Parceiros'
    },
    {
      loc: `${baseUrl}/#faq`,
      sectionId: 'faq',
      changefreq: 'weekly',
      priority: '0.85',
      description: 'Seção FAQ'
    },
    {
      loc: `${baseUrl}/#trabalhe-conosco`,
      sectionId: 'trabalhe-conosco',
      changefreq: 'monthly',
      priority: '0.70',
      description: 'Seção Trabalhe Conosco'
    },
    {
      loc: `${baseUrl}/#politica-privacidade`,
      sectionId: 'politica-privacidade',
      changefreq: 'yearly',
      priority: '0.50',
      description: 'Política de Privacidade'
    },
    {
      loc: `${baseUrl}/antecipacao-fgts`,
      sectionId: 'antecipacao-fgts',
      changefreq: 'weekly',
      priority: '0.90',
      description: 'Landing Page - Antecipação FGTS'
    }
  ];

  // Gerar XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

`;

  urls.forEach((url, index) => {
    // Obter data de modificação real
    const lastmod = getComponentModDate(url.sectionId);
    
    xml += `  <!-- ${url.description} -->\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    
    // Adicionar imagem para página principal
    if (url.loc === `${baseUrl}/`) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}/assets/logo-fenix-cred.webp</image:loc>\n`;
      xml += `      <image:title>Fênix Cred - Soluções Financeiras</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    
    xml += `  </url>\n`;
    
    if (index < urls.length - 1) {
      xml += `\n`;
    }
  });

  xml += `\n</urlset>\n`;

  // Escrever sitemap.xml
  const sitemapPath = path.join(publicPath, 'sitemap.xml');
  const distSitemapPath = path.join(distPath, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`✅ Sitemap gerado: ${sitemapPath}`);
  
  // Copiar para dist se existir
  if (fs.existsSync(distPath)) {
    fs.writeFileSync(distSitemapPath, xml, 'utf-8');
    console.log(`✅ Sitemap copiado para: ${distSitemapPath}`);
  }

  // Estatísticas
  console.log(`\n📊 Estatísticas do Sitemap:`);
  console.log(`   - Total de URLs: ${urls.length}`);
  console.log(`   - URLs com lastmod dinâmico: ${urls.length}`);
  console.log(`   - Base URL: ${baseUrl}`);
  
  // Mostrar datas de modificação
  console.log(`\n📅 Últimas modificações:`);
  urls.slice(0, 5).forEach(url => {
    const lastmod = getComponentModDate(url.sectionId);
    const date = new Date(lastmod);
    console.log(`   - ${url.description}: ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`);
  });
}

// Executar
try {
  generateSitemap();
  console.log(`\n✅ Sitemap gerado com sucesso!`);
} catch (error) {
  console.error('❌ Erro ao gerar sitemap:', error.message);
  process.exit(1);
}
