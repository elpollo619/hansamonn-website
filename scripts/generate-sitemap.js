#!/usr/bin/env node
/**
 * Generates public/sitemap.xml with all known static routes + default property pages.
 * Run: node scripts/generate-sitemap.js
 *
 * Add this to package.json scripts:
 *   "sitemap": "node scripts/generate-sitemap.js"
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL  = 'https://www.hansamonn.ch';
const TODAY     = new Date().toISOString().split('T')[0];

// Default property slugs — add new properties here when created
const PROPERTY_SLUGS = [
  { slug: 'ns-hotel',              priority: '0.9', path: '/ns-hotel' },
  { slug: 'casa-reto',             priority: '0.9' },
  { slug: 'kerzers-ls',            priority: '0.8' },
  { slug: 'munchenbuchsee-ls',     priority: '0.8' },
  { slug: 'muri-ls',               priority: '0.8' },
];

const STATIC_ROUTES = [
  { path: '/',                          priority: '1.0', changefreq: 'weekly'  },
  { path: '/uber-uns',                  priority: '0.8', changefreq: 'monthly' },
  { path: '/team',                      priority: '0.7', changefreq: 'monthly' },
  { path: '/kontakt',                   priority: '0.8', changefreq: 'monthly' },
  { path: '/termin',                    priority: '0.7', changefreq: 'monthly' },
  { path: '/faq',                       priority: '0.6', changefreq: 'monthly' },
  { path: '/immobilien',                priority: '0.9', changefreq: 'weekly'  },
  { path: '/immobilien/vermietung',     priority: '0.9', changefreq: 'weekly'  },
  { path: '/immobilien/long-stay',      priority: '0.8', changefreq: 'weekly'  },
  { path: '/immobilien/short-stay',     priority: '0.8', changefreq: 'weekly'  },
  { path: '/immobilien/apartments',     priority: '0.7', changefreq: 'weekly'  },
  { path: '/immobilien/verkauf',        priority: '0.7', changefreq: 'weekly'  },
  { path: '/immobilien/anfrage',        priority: '0.7', changefreq: 'monthly' },
  { path: '/projekte',                  priority: '0.7', changefreq: 'monthly' },
  { path: '/leistungen',               priority: '0.7', changefreq: 'monthly' },
  { path: '/architektur',               priority: '0.6', changefreq: 'monthly' },
  { path: '/preisrechner',              priority: '0.6', changefreq: 'monthly' },
  { path: '/hyporechner',              priority: '0.6', changefreq: 'monthly' },
  { path: '/vergleich',                 priority: '0.5', changefreq: 'monthly' },
  { path: '/karte',                     priority: '0.6', changefreq: 'monthly' },
  { path: '/favoriten',                 priority: '0.4', changefreq: 'monthly' },
  { path: '/neuigkeiten',               priority: '0.7', changefreq: 'weekly'  },
  { path: '/impressum',                 priority: '0.3', changefreq: 'yearly'  },
  { path: '/datenschutz',               priority: '0.3', changefreq: 'yearly'  },
];

function url(path, priority = '0.7', changefreq = 'weekly') {
  return `  <url><loc>${BASE_URL}${path}</loc><lastmod>${TODAY}</lastmod><priority>${priority}</priority><changefreq>${changefreq}</changefreq></url>`;
}

const staticLines = STATIC_ROUTES.map(r => url(r.path, r.priority, r.changefreq));

const propertyLines = PROPERTY_SLUGS.map(p => {
  const path = p.path ?? `/immobilien/${p.slug}`;
  return url(path, p.priority ?? '0.8', 'weekly');
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- ── Static routes ── -->
${staticLines.join('\n')}

  <!-- ── Property pages ── -->
${propertyLines.join('\n')}

</urlset>
`;

const outPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`✓ sitemap.xml generated (${staticLines.length + propertyLines.length} URLs) → ${outPath}`);
