#!/usr/bin/env node

/**
 * Gera capas WebP (1200x630) para os artigos que ainda não têm imagem.
 *
 * Uso:
 *   node scripts/generate-article-covers.js           # só os que faltam
 *   node scripts/generate-article-covers.js --force   # regera tudo
 *   node scripts/generate-article-covers.js <slug>    # regera um slug
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { ARTIGOS } from "../src/data/artigos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, "..", "public", "images", "artigos");
const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  bgDark: "#050528",
  bgDarker: "#030318",
  yellow: "#FDB147",
  yellowLight: "#FDC567",
  white: "#ffffff",
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Quebra o título em linhas de largura aproximada (fonte proporcional). */
function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function buildSvg(artigo) {
  // Título curto quando existir: capa não é lugar para frase longa.
  const raw = artigo.titulo.split(":")[0].trim();
  const title = raw.length < 18 ? artigo.titulo : raw;

  const fontSize = title.length > 60 ? 52 : title.length > 40 ? 60 : 68;
  const maxChars = Math.round(1900 / fontSize);
  const lines = wrap(title, maxChars).slice(0, 4);
  const lineHeight = Math.round(fontSize * 1.22);
  const blockTop = 250 - ((lines.length - 1) * lineHeight) / 2;

  const tag = (artigo.tags && artigo.tags[0]) || "Fênix Cred";
  const tagWidth = 34 + tag.length * 12;

  const titleTspans = lines
    .map(
      (line, i) =>
        `<tspan x="80" y="${blockTop + i * lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.bgDarker}"/>
      <stop offset="55%" stop-color="${COLORS.bgDark}"/>
      <stop offset="100%" stop-color="#0a0a3a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="${COLORS.yellow}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${COLORS.yellow}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <circle cx="1055" cy="120" r="210" fill="${COLORS.yellow}" opacity="0.06"/>
  <circle cx="1130" cy="560" r="150" fill="${COLORS.yellow}" opacity="0.05"/>
  <rect x="0" y="0" width="10" height="${HEIGHT}" fill="${COLORS.yellow}"/>

  <rect x="80" y="86" width="${tagWidth}" height="44" rx="22" fill="${COLORS.yellow}" opacity="0.16"/>
  <text x="${80 + tagWidth / 2}" y="115" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif"
        font-size="20" font-weight="600" fill="${COLORS.yellowLight}" letter-spacing="1.4">${escapeXml(tag.toUpperCase())}</text>

  <text font-family="Inter, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700"
        fill="${COLORS.white}" letter-spacing="-1.2">${titleTspans}</text>

  <rect x="80" y="486" width="76" height="5" rx="3" fill="${COLORS.yellow}"/>
  <text x="80" y="546" font-family="Inter, Helvetica, Arial, sans-serif" font-size="27" font-weight="700"
        fill="${COLORS.white}">Fênix Cred</text>
  <text x="80" y="580" font-family="Inter, Helvetica, Arial, sans-serif" font-size="20" font-weight="500"
        fill="${COLORS.yellowLight}" opacity="0.85">Crédito CLT e antecipação de FGTS · fenixcredbr.com.br</text>
</svg>`;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const only = args.filter((a) => !a.startsWith("--"));

  fs.mkdirSync(outDir, { recursive: true });

  let created = 0;
  let skipped = 0;

  for (const artigo of ARTIGOS) {
    if (only.length && !only.includes(artigo.slug)) continue;

    const file = path.join(outDir, `${artigo.slug}.webp`);
    if (fs.existsSync(file) && !force && !only.length) {
      skipped += 1;
      continue;
    }

    await sharp(Buffer.from(buildSvg(artigo)))
      .webp({ quality: 82 })
      .toFile(file);

    created += 1;
    console.log(`   ✓ ${artigo.slug}.webp`);
  }

  console.log(`✅ Capas geradas: ${created} (mantidas: ${skipped})`);
}

main().catch((error) => {
  console.error("❌ Erro ao gerar capas:", error.message);
  process.exit(1);
});
