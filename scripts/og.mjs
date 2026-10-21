import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUT_DIR = path.resolve('assets/img/og');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Read logo SVG path
const logoSvg = fs.readFileSync('assets/icons/nerobel-logo.svg', 'utf-8');
const pathMatch = logoSvg.match(/<path[^>]*\/>/s);
const logoPath = pathMatch ? pathMatch[0] : '';

const pages = [
  {
    id: 'index',
    title: 'Nerobel Group',
    subtitle: 'Distributeur Exclusif Theros & Eurogas au Maroc',
    badge: 'DISTRIBUTION EXCLUSIVE'
  },
  {
    id: 'brands',
    title: 'Nos marques',
    subtitle: 'Theros · Eurogas · Distribution Exclusive au Maroc',
    badge: 'CATALOGUE & MARQUES'
  },
  {
    id: 'sav',
    title: 'Demande SAV',
    subtitle: 'Assistance technique et service après-vente officiel Nerobel Group',
    badge: 'SUPPORT CLIENT'
  },
  {
    id: 'network',
    title: 'Où acheter',
    subtitle: 'Réseau national de showrooms et points de vente au Maroc',
    badge: 'POINTS DE VENTE'
  },
  {
    id: 'b2b',
    title: 'Espace Pro',
    subtitle: 'Programme partenaires installateurs, distributeurs et architectes',
    badge: 'ESPACE PROFESSIONNEL'
  },
  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Siège Nerobel Group · Angle Bd d\'Anfa & Rue Mozart, Casablanca',
    badge: 'CONTACT & SIÈGE'
  },
  {
    id: 'mentions-legales',
    title: 'Mentions Légales',
    subtitle: 'Informations juridiques et éditeur du site Nerobel Group',
    badge: 'INFORMATIONS LÉGALES'
  },
  {
    id: 'confidentialite',
    title: 'Politique de Confidentialité',
    subtitle: 'Protection des données personnelles et droits des utilisateurs',
    badge: 'CONFIDENTIALITÉ'
  }
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generate() {
  for (const p of pages) {
    const badgeLen = p.badge.length * 10 + 32;
    const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="20%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#141417"/>
      <stop offset="100%" stop-color="#050505"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C9A96A"/>
      <stop offset="100%" stop-color="#E5C88A"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGlow)"/>
  
  <!-- Subtle border frame -->
  <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="#2A2A31" stroke-width="2"/>
  
  <!-- Accent top line on frame -->
  <line x1="80" y1="24" x2="320" y2="24" stroke="url(#goldGrad)" stroke-width="4"/>

  <!-- Logo -->
  <g transform="translate(80, 80) scale(0.24)">
    ${logoPath}
  </g>

  <!-- Badge Pill -->
  <g transform="translate(80, 185)">
    <rect width="${badgeLen}" height="34" rx="6" fill="#1C1C21" stroke="#3A3A44" stroke-width="1"/>
    <text x="16" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#C9A96A" letter-spacing="1.5">${escapeXml(p.badge)}</text>
  </g>

  <!-- Page Title -->
  <text x="80" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">${escapeXml(p.title)}</text>

  <!-- Subtitle -->
  <text x="80" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#B4B8C0">${escapeXml(p.subtitle)}</text>

  <!-- Bottom Divider Line -->
  <line x1="80" y1="480" x2="1120" y2="480" stroke="#2A2A31" stroke-width="1"/>

  <!-- Footer Metadata -->
  <text x="80" y="535" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" fill="#8A8F99" letter-spacing="1.5">NEROBEL GROUP · CASABLANCA, MAROC</text>
  <text x="1120" y="535" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="500" fill="#C9A96A">theros.ma · eurogas.ma</text>
</svg>
`;

    const outPath = path.join(OUT_DIR, `${p.id}.jpg`);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    console.log(`Generated ${p.id}.jpg: ${(stats.size / 1024).toFixed(1)} KB`);
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
