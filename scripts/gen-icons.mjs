// Gera os ícones do PWA a partir do logo SVG (rode: node scripts/gen-icons.mjs)
import sharp from 'sharp';
import { mkdirSync } from 'fs';

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#123C2F"/>
  <!-- prancheta -->
  <rect x="150" y="122" width="212" height="284" rx="28" fill="none" stroke="#F7F3E8" stroke-width="22"/>
  <!-- presilha dourada -->
  <rect x="212" y="96" width="88" height="52" rx="16" fill="#C69C45"/>
  <!-- linhas do checklist -->
  <line x1="198" y1="212" x2="314" y2="212" stroke="#F7F3E8" stroke-width="18" stroke-linecap="round"/>
  <line x1="198" y1="262" x2="314" y2="262" stroke="#F7F3E8" stroke-width="18" stroke-linecap="round"/>
  <!-- check dourado -->
  <path d="M204 332 l34 34 l72 -76" stroke="#C69C45" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

mkdirSync('public/icons', { recursive: true });

const buf = Buffer.from(svg);
await sharp(buf).resize(512, 512).png().toFile('public/icons/icon-512.png');
await sharp(buf).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(buf).resize(180, 180).png().toFile('public/apple-touch-icon.png');
// Favicon (convenção do App Router: src/app/icon.png)
await sharp(buf).resize(64, 64).png().toFile('src/app/icon.png');
console.log('icons ok');
