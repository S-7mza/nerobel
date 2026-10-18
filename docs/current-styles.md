# Inventaire des styles actuels (`docs/current-styles.md`)

Ce document recense les couleurs, polices, espacements, rayons de bordure, ombres et points de rupture observés dans `css/theme.css`, `css/main.css` et `css/sav.css` avant la création de `assets/css/tokens.css` (**S2-01**).

---

## 1. Palette de couleurs

### 1.1 Échelle neutre (Thème sombre par défaut `data-theme="dark"`)
| Jeton existant | Valeur hex / rgba | Usage observé | Jeton cible (`tokens.css`) |
|---|---|---|---|
| `--black` | `#050505` | Fond principal de page | `--color-bg: #050505` |
| `--s1` | `#0C0C0E` | Surface de carte principale, sections alternées | `--color-surface: #0C0C0E` |
| `--s2` | `#141417` | Surface secondaire (champs, mini-cartes, barres de filtres) | `--color-surface-2: #141417` |
| `--s3` | `#1C1C21` | Surface survolée / élevée | `--color-surface-3: #1C1C21` |
| `--tx` | `#FFFFFF` | Texte principal et titres | `--color-text: #FFFFFF` |
| `--tx2` | `#B4B8C0` | Texte secondaire / paragraphes | `--color-muted: #B4B8C0` |
| `--tx3` | `#8A8F99` | Texte tertiaire / légendes | `--color-subtle: #8A8F99` |
| `--bd` | `#2A2A31` | Bordures 1 px | `--color-border: #2A2A31` |
| `--bdh` | `#3A3A44` | Bordure au survol | `--color-border-hover: #3A3A44` |

### 1.2 Échelle neutre (Thème clair `data-theme="light"`)
| Jeton existant | Valeur hex | Jeton cible (`tokens.css`) |
|---|---|---|
| `--black` | `#F8FAFC` | `--color-bg` |
| `--s1` | `#FFFFFF` | `--color-surface` |
| `--s2` | `#F1F5F9` | `--color-surface-2` |
| `--s3` | `#E2E8F0` | `--color-surface-3` |
| `--tx` | `#0F172A` | `--color-text` |
| `--tx2` | `#475569` | `--color-muted` |
| `--tx3` | `#64748B` | `--color-subtle` |
| `--bd` | `#E2E8F0` | `--color-border` |
| `--bdh` | `#CBD5E1` | `--color-border-hover` |

### 1.3 Accents de marque (en attente de confirmation `O-11`)
- Les 4 fichiers SVG dans `assets/icons/` (`theros-logo.svg`, `pacific-logo.svg`, `eurogas-logo.svg`, `nerobel-logo.svg`) sont monochromes (`fill="#FFFFFF"`).
- Dans `css/main.css` (lignes 2858–2880, `.brand-chip--*`), chaque marque est associée à une couleur d'accent distincte :
  - **Theros** (`--accent-theros`) : `#2563EB` (bleu saphir impérial `--az`)
  - **Pacific** (`--accent-pacific`) : `#C9A96A` (or `--gold`)
  - **Eurogas** (`--accent-eurogas`) : `#F2B84B` (ambre flamme `--warn`)
  - **Nerobel** (`--accent-nerobel`) : `#FFFFFF` (titane / blanc pur `--tx`, `#0F172A` en thème clair)

### 1.4 Couleurs sémantiques
| Jeton existant | Valeur hex | Jeton cible (`tokens.css`) |
|---|---|---|
| `--ok` | `#34C77B` | `--color-success: #34C77B` |
| `--warn` | `#F2B84B` | `--color-warning: #F2B84B` |
| `--err` | `#FF5C6C` | `--color-error: #FF5C6C` |
| `--az` | `#2563EB` | `--color-info: #2563EB` |
| `--wa` | `#25D366` | `--color-whatsapp: #25D366` |

---

## 2. Typographie

- **Familles observées (`css/theme.css`) :**
  - Display / Titres (`--fd` / `--font-display`) : `'Montserrat', system-ui, -apple-system, sans-serif`
  - Corps de texte (`--fb` / `--font-sans`) : `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif`
  - Monospace / Eyebrows (`--fm` / `--font-mono`) : `'JetBrains Mono', Consolas, ui-monospace, monospace`
- **Tailles observées :**
  - `html` : `16px`
  - `body` : `0.96rem` (cible `1rem` dans l'échelle fluide)
  - `.hero-title` : `clamp(1.85rem, 3.2vw, 2.6rem)`
  - `.page-title` : `clamp(1.85rem, 3.2vw, 2.4rem)`
  - `.section-title` : `clamp(1.6rem, 3.2vw, 2.2rem)`
  - `.brand-detail-title` : `clamp(1.4rem, 2.2vw, 1.85rem)`
  - `.card-title` : `1.15rem` – `1.45rem`

---

## 3. Espacements (`--space-1` … `--space-9`)

Valeurs récurrentes dans `css/main.css` et `css/sav.css` :
- `4px` (`--space-1`)
- `8px` (`--space-2`)
- `12px` (`--space-3`)
- `16px` (`--space-4`)
- `24px` (`--space-5`)
- `32px` (`--space-6`)
- `48px` (`--space-7`) — ex. `.section--tight { padding: 48px 0; }`
- `64px` (`--space-8`) — ex. `gap: 64px`
- `96px` (`--space-9`) — espacement de section large

---

## 4. Rayons de bordure et ombres

- **Rayons observés (`css/theme.css`) :**
  - `--radius-sm: 8px` → `--radius-s: 8px`
  - `--radius-md: 14px`, `--radius-lg: 20px` → `--radius-m: 16px`
  - `--radius-pill: 9999px`
- **Ombres observées (`css/theme.css`) :**
  - Niveau 1 (`--shadow-sm` / `--shadow-1`) : `0 4px 12px rgba(0, 0, 0, 0.5)`
  - Niveau 2 (`--shadow-md` / `--shadow-2`) : `0 12px 32px rgba(0, 0, 0, 0.7)`

---

## 5. Points de rupture (Breakpoints)

Points de rupture utilisés ou ciblés à documenter dans `assets/css/tokens.css` :
- `360px` (petit mobile)
- `768px` (tablette portrait)
- `1024px` (tablette paysage / petit desktop)
- `1280px` (desktop standard)
