#!/usr/bin/env node

/**
 * Script de Otimização de Imagens - Fênix Cred
 * 
 * Cria versões responsivas das imagens principais:
 * - modelo_fenix_cred.webp (Hero image)
 * - logo-fenix-cred.webp (Logo)
 * 
 * Requer: npm install --save-dev sharp
 * Uso: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../src/assets');
const outputDir = assetsDir;

// Configurações de otimização
const config = {
  modelo: {
    input: path.join(assetsDir, 'modelo_fenix_cred.webp'),
    outputs: [
      { width: 400, height: 600, suffix: '400w', quality: 85 }, // Mobile
      { width: 525, height: 783, suffix: '525w', quality: 85 }, // Tablet/Desktop
      { width: 1050, height: 1566, suffix: '1050w', quality: 85 }, // Retina
    ],
  },
  logo: {
    input: path.join(assetsDir, 'logo-fenix-cred.webp'),
    outputs: [
      { width: 180, height: 53, suffix: '180w', quality: 90 }, // Mobile
      { width: 240, height: 70, suffix: '240w', quality: 90 }, // Tablet
      { width: 299, height: 88, suffix: '299w', quality: 90 }, // Desktop
      { width: 598, height: 176, suffix: '598w', quality: 90 }, // Retina
    ],
  },
};

async function optimizeImage(inputPath, outputPath, width, height, quality) {
  try {
    const stats = await sharp(inputPath)
      .resize(width, height, {
        fit: 'contain',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const newSize = stats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(outputPath)}`);
    console.log(`   Dimensões: ${width}x${height}`);
    console.log(`   Tamanho: ${(newSize / 1024).toFixed(1)} KB (${savings}% menor)`);
    console.log('');
  } catch (error) {
    console.error(`❌ Erro ao processar ${outputPath}:`, error.message);
  }
}

async function optimizeAll() {
  console.log('🚀 Iniciando otimização de imagens...\n');

  // Verificar se sharp está instalado
  try {
    require('sharp');
  } catch {
    console.error('❌ Sharp não está instalado!');
    console.log('📦 Instale com: npm install --save-dev sharp\n');
    process.exit(1);
  }

  // Otimizar modelo_fenix_cred
  if (fs.existsSync(config.modelo.input)) {
    console.log('📸 Otimizando modelo_fenix_cred.webp...\n');
    for (const output of config.modelo.outputs) {
      const outputPath = path.join(
        outputDir,
        `modelo_fenix_cred-${output.suffix}.webp`
      );
      await optimizeImage(
        config.modelo.input,
        outputPath,
        output.width,
        output.height,
        output.quality
      );
    }
  } else {
    console.warn(`⚠️  Arquivo não encontrado: ${config.modelo.input}\n`);
  }

  // Otimizar logo-fenix-cred
  if (fs.existsSync(config.logo.input)) {
    console.log('🎨 Otimizando logo-fenix-cred.webp...\n');
    for (const output of config.logo.outputs) {
      const outputPath = path.join(
        outputDir,
        `logo-fenix-cred-${output.suffix}.webp`
      );
      await optimizeImage(
        config.logo.input,
        outputPath,
        output.width,
        output.height,
        output.quality
      );
    }
  } else {
    console.warn(`⚠️  Arquivo não encontrado: ${config.logo.input}\n`);
  }

  console.log('✨ Otimização concluída!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Verifique os arquivos gerados em src/assets/');
  console.log('   2. Execute: npm run build');
  console.log('   3. Teste o site e verifique o PageSpeed Insights\n');
}

// Executar
optimizeAll().catch(console.error);
