# Auditoria de logos NordVPN - vpncostguide
Date: 2026-04-27

## 1. Inventario de assets disponibles

Nota importante: la ruta solicitada en el prompt, `assets/logos/affiliate/nordvpn/`, no existe en este repo. La carpeta real detectada es `assets/affiliate/nordvpn/logos/` y actualmente esta sin trackear en git.

| Archivo | Dimensiones reales | Tamano |
|---|---:|---:|
| `assets/affiliate/nordvpn/logos/nordvpn-icon-teal.png` | 1025 x 1025 | 32 KB |
| `assets/affiliate/nordvpn/logos/nordvpn-icon-white.png` | 1025 x 1025 | 32 KB |
| `assets/affiliate/nordvpn/logos/nordvpn-logo-black.png` | 1540 x 1060 | 44 KB |
| `assets/affiliate/nordvpn/logos/nordvpn-logo-dark.png` | 1540 x 401 | 28 KB |
| `assets/affiliate/nordvpn/logos/nordvpn-logo-light.png` | 1540 x 400 | 24 KB |
| `assets/affiliate/nordvpn/logos/nordvpn-logo-square-dark.png` | 1540 x 1061 | 36 KB |
| `assets/affiliate/nordvpn/logos/nordvpn-logo-square-light.png` | 1540 x 1061 | 36 KB |
| `assets/affiliate/nordvpn/logos/nordvpn-logo-white.png` | 1540 x 401 | 24 KB |

## 2. Contenido de tracking-links.md

Archivo detectado: `assets/affiliate/nordvpn/tracking-links.md`

```md
# NordVPN Affiliate Tracking Links — vpncostguide

Aff_id: 146283
Account Manager: Tomas (info@nordvpnmedia.com)
Last updated: 2026-04-24

## Commission structure
- 1 month New: 100% CPS
- 6/12 month New: 40% CPS
- Renewals: 30% CPS
- Cookie: 30 days
- Min payout: $100

## Base tracking links

### NordVPN (#15) — main
Base: https://go.nordvpn.net/aff_c?offer_id=15&aff_id=146283

### NordProtect (#973) — US only, 40% CPS
Base: https://go.nordprotect.net/aff_c?offer_id=973&aff_id=146283

### NordPass (#488) — 10-75% CPS
Base: https://go.nordpass.io/aff_c?offer_id=488&aff_id=146283

## Sub-ID per page (for performance tracking)

### High-intent NordVPN pages
- nordvpn-review:           ?offer_id=15&aff_id=146283&aff_sub=nordvpn-review
- nordvpn-price:            ?offer_id=15&aff_id=146283&aff_sub=nordvpn-price
- nordvpn-vs-expressvpn:    ?offer_id=15&aff_id=146283&aff_sub=nv-vs-express
- surfshark-vs-nordvpn:     ?offer_id=15&aff_id=146283&aff_sub=ss-vs-nv
- nordvpn-vs-expressvpn-cost:?offer_id=15&aff_id=146283&aff_sub=nv-express-cost
- nordvpn-vs-surfshark-cost: ?offer_id=15&aff_id=146283&aff_sub=nv-ss-cost
- vpn-costs-index:          ?offer_id=15&aff_id=146283&aff_sub=vpn-costs-idx
- vpn-pricing-guide:        ?offer_id=15&aff_id=146283&aff_sub=vpn-pricing-gd
- vpn-price-comparison:     ?offer_id=15&aff_id=146283&aff_sub=vpn-price-comp
- vpn-cost-per-year:        ?offer_id=15&aff_id=146283&aff_sub=vpn-cost-year

## Rules reminder
- Always use rel="nofollow sponsored"
- Always target="_blank" for external links
- Disclosure banner required on pages with affiliate links
- NEVER use coupon codes not provided by Nord
- NEVER bid on NordVPN keywords in ads
- NEVER use NordVPN in domain names
- Affiliate link MUST NOT be used to subscribe yourself
```

## 3. Paginas con afiliacion NordVPN actual

Todas las paginas actuales enlazan solo a NordVPN. No se detectaron enlaces activos a `go.nordpass.io` ni `go.nordprotect.net`.

| Pagina publica | Fuente generadora | Producto | Sub-ID | Links | Tipo | Posiciones actuales | Logo visual actual |
|---|---|---|---|---:|---|---|---|
| `/vpn-reviews/nordvpn-review/` | `scripts/generate-site.mjs` (`nordAffiliateConfig`, `applyNordAffiliateEnhancements`) | NordVPN | `nordvpn-review` | 3 | review | above-fold CTA card, mid-content inline, pre-FAQ closing CTA | No logo oficial; solo texto/CTAs y site logo |
| `/vpn-costs/nordvpn-price/` | `scripts/generate-site.mjs` | NordVPN | `nordvpn-price` | 3 | pricing article | above-fold CTA card, pricing table, pre-FAQ closing CTA | No logo oficial; solo texto/CTAs y site logo |
| `/vpn-deals/` | `scripts/generate-site.mjs` | NordVPN | `vpn-deals` | 3 | deals page | above-fold best-price card, comparison table, provider section | No logo oficial; solo texto/CTAs y site logo |
| `/best-vpn-2026-pricing-edition/` | `scripts/generate-site.mjs` | NordVPN | `best-vpn-2026` | 2 | ranking page | above-fold editor-pick card, NordVPN ranking section | No logo oficial; solo texto/CTAs y site logo |
| `/comparisons/nordvpn-vs-expressvpn/` | `scripts/generate-site.mjs` | NordVPN | `nv-vs-express` | 2 | comparison | above-fold quick-take card, comparison table | No logo oficial; table header is text |
| `/comparisons/surfshark-vs-nordvpn/` | `scripts/generate-site.mjs` | NordVPN | `ss-vs-nv` | 2 | comparison | above-fold quick-take card, comparison table | No logo oficial; table header is text |
| `/pages/nordvpn-vs-expressvpn-cost/` | `scripts/generate-site.mjs` | NordVPN | `nv-express-cost` | 2 | comparison | above-fold quick-take card, comparison table | No logo oficial; table header is text |
| `/pages/nordvpn-vs-surfshark-cost/` | `scripts/generate-site.mjs` | NordVPN | `nv-ss-cost` | 2 | comparison | above-fold quick-take card, comparison table | No logo oficial; table header is text |
| `/vpn-costs/` | `scripts/generate-site.mjs` | NordVPN | `vpn-costs-idx` | 2 | hub/pricing guide | mid-content inline, closing CTA | No logo oficial; only textual mention |
| `/pages/vpn-pricing-guide/` | `scripts/generate-site.mjs` | NordVPN | `vpn-pricing-gd` | 2 | pricing guide | mid-content inline, closing CTA | No logo oficial; only textual mention |
| `/pages/vpn-price-comparison/` | `scripts/generate-site.mjs` | NordVPN | `vpn-price-comp` | 2 | pricing comparison | mid-content inline, closing CTA | No logo oficial; only textual mention |
| `/vpn-costs/vpn-cost-per-year/` | `scripts/generate-site.mjs` | NordVPN | `vpn-cost-year` | 2 | annual pricing guide | mid-content inline, closing CTA | No logo oficial; only textual mention |

## 4. Mapa de oportunidades de colocacion

### `/vpn-reviews/nordvpn-review/`
- Hero/titulo: si. Usar `assets/affiliate/nordvpn/logos/nordvpn-logo-square-light.png`, display aprox. 220 x 152, `loading="eager"`, ubicacion despues de disclosure/author note dentro del hero.
- CTA principal: si. Usar `assets/affiliate/nordvpn/logos/nordvpn-logo-light.png`, display aprox. 180 x 47, dentro de `.affiliate-cta-card` antes del H3 o encima del boton.
- Tabla comparativa: no aplica.
- Card de producto: si, misma CTA principal.
- Inline en parrafo: no recomendado; ya existe enlace textual inline y un logo ahi seria demasiado pesado.

### `/vpn-costs/nordvpn-price/`
- Hero/titulo: si. Usar `nordvpn-logo-square-light.png`, display aprox. 220 x 152, above-fold.
- CTA principal: si. Usar `nordvpn-logo-light.png`, display aprox. 180 x 47, dentro de `.affiliate-cta-card`.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en la celda `Basic` o junto al nombre del plan.
- Card de producto: si, en CTA superior.
- Inline en parrafo: no recomendado.

### `/vpn-deals/`
- Hero/titulo: no; es una pagina multiproveedor.
- CTA principal: si. Usar `nordvpn-logo-light.png`, display aprox. 180 x 47, dentro de `.best-price-card`.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en la fila NordVPN.
- Card de producto: si, en la seccion `NordVPN Pricing`.
- Inline en parrafo: no.

### `/best-vpn-2026-pricing-edition/`
- Hero/titulo: no; ranking editorial multiproveedor.
- CTA principal: si. Usar `nordvpn-logo-light.png`, display aprox. 180 x 47, dentro de `.editor-pick-card`.
- Tabla comparativa: no aplica si no hay tabla principal de proveedores.
- Card de producto: si. Usar `nordvpn-icon-teal.png`, display aprox. 48 x 48, en la seccion `#2 NordVPN`.
- Inline en parrafo: no.

### `/comparisons/nordvpn-vs-expressvpn/`
- Hero/titulo: no; evitar poner solo NordVPN en hero de una comparativa 1v1.
- CTA principal: si. Usar `nordvpn-logo-light.png`, display aprox. 170 x 44, dentro de `.quick-take-card`.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en cabecera de columna NordVPN.
- Card de producto: no.
- Inline en parrafo: no.

### `/comparisons/surfshark-vs-nordvpn/`
- Hero/titulo: no.
- CTA principal: si. Usar `nordvpn-logo-light.png`, display aprox. 170 x 44, dentro de `.quick-take-card`.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en cabecera de columna NordVPN.
- Card de producto: no.
- Inline en parrafo: no.

### `/pages/nordvpn-vs-expressvpn-cost/`
- Hero/titulo: no.
- CTA principal: si. Usar `nordvpn-logo-light.png`, display aprox. 170 x 44, dentro de `.quick-take-card`.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en cabecera de columna NordVPN.
- Card de producto: no.
- Inline en parrafo: no.

### `/pages/nordvpn-vs-surfshark-cost/`
- Hero/titulo: no.
- CTA principal: si. Usar `nordvpn-logo-light.png`, display aprox. 170 x 44, dentro de `.quick-take-card`.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en cabecera de columna NordVPN.
- Card de producto: no.
- Inline en parrafo: no.

### `/vpn-costs/`
- Hero/titulo: no; es hub general.
- CTA principal: no.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en fila NordVPN de tabla de coste promedio.
- Card de producto: no.
- Inline en parrafo: no; mantener texto enlazado y logo solo en closing CTA. Closing CTA podria usar `nordvpn-logo-light.png`, display aprox. 160 x 42.

### `/pages/vpn-pricing-guide/`
- Hero/titulo: no.
- CTA principal: no.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en fila NordVPN.
- Card de producto: no.
- Inline en parrafo: no; usar logo solo en closing CTA si se aprueba.

### `/pages/vpn-price-comparison/`
- Hero/titulo: no.
- CTA principal: no.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en fila NordVPN.
- Card de producto: no.
- Inline en parrafo: no; usar logo solo en closing CTA si se aprueba.

### `/vpn-costs/vpn-cost-per-year/`
- Hero/titulo: no.
- CTA principal: no.
- Tabla comparativa: si. Usar `nordvpn-icon-teal.png`, display aprox. 32 x 32, en fila NordVPN de anual pricing.
- Card de producto: no.
- Inline en parrafo: no; usar logo solo en closing CTA si se aprueba.

## 5. Placeholders/textos a reemplazar

- No se detectaron placeholders tipo `[LOGO]`, `[BRAND]` o `<!-- TODO logo -->`.
- No se detectaron clases tipo `.product-name-stylized`.
- No se detectaron imagenes genericas tipo `vpn-logo.svg` o `provider1.png`.
- No hay SVGs custom de NordVPN/NordPass/NordProtect. Las imagenes actuales relacionadas con "logo" son el logo del sitio (`assets/icons/logo.svg`) y hero illustrations genericas, no logos de producto.
- Representaciones actuales a sustituir donde tenga sentido: texto enlazado `NordVPN`, botones `Visit NordVPN`, `View NordVPN`, `View NordVPN plans`, y filas de tabla donde `NordVPN` aparece como texto plano.

## 6. Compliance previa

| Check | Resultado |
|---|---|
| Disclosure FTC visible above-the-fold en paginas con afiliacion | OK en las 12 paginas |
| `target="_blank"` en links afiliados | OK en todos los links actuales |
| `rel="nofollow sponsored"` en links afiliados | OK en todos los links actuales |
| `rel` incluye `noopener` | Incumplimiento: falta en todos los links afiliados actuales |
| Sub-IDs unicos por pagina | OK, 12 sub-IDs unicos |
| Links NordPass/NordProtect activos | Ninguno |

Incumplimiento concreto: los 28 enlaces afiliados NordVPN actuales deben pasar de `rel="nofollow sponsored"` a `rel="nofollow sponsored noopener"` durante Bloque 2.

Sub-IDs detectados:
- `nordvpn-review`
- `nordvpn-price`
- `vpn-deals`
- `best-vpn-2026`
- `nv-vs-express`
- `ss-vs-nv`
- `nv-express-cost`
- `nv-ss-cost`
- `vpn-costs-idx`
- `vpn-pricing-gd`
- `vpn-price-comp`
- `vpn-cost-year`

## 7. Dudas antes del Bloque 2

1. La ruta del prompt no existe. Los logos reales estan en `assets/affiliate/nordvpn/logos/`. ¿Quieres que los use ahi o que los mueva a `assets/logos/affiliate/nordvpn/logos/` antes de implementar?
2. Los tamanos reales son el doble o casi el doble de los esperados en el prompt: logos horizontales 1540 x 400/401, square 1540 x 1060/1061, iconos 1025 x 1025. ¿Confirmas que use esos archivos sin modificar y controle solo el display via CSS?
3. Las comparativas 1v1 idealmente tendrian logos en ambas columnas, pero solo hay logos oficiales de NordVPN. ¿Quieres poner icono solo en la columna NordVPN o evitar logos de cabecera en comparativas para no desequilibrar visualmente?
4. No hay logos NordPass ni NordProtect en assets y tampoco hay enlaces activos a esos productos. ¿Confirmas que Bloque 2 se limite a NordVPN?
5. Para paginas hub/pricing genericas, propongo icono en fila de tabla + logo en closing CTA, sin logo hero. ¿Te parece bien esa intensidad visual?

