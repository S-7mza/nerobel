# Nerobel Group · Go-Live Sign-Off

Ce document consigne les validations humaines obligatoires préalables à la publication en production (Sprint 4 — Tâche S4-06).

## Table de validation humaine (Sign-off Table)

| Domaine | Responsable | Statut | Date | Observations & Réserves |
|---|---|---|---|---|
| **Copy & Positionnement** | Direction Générale / Propriétaire | Validé | 2026-10-18 | Positionnement groupe unifié : « Nerobel Group détient et gère quatre marques pour la maison : Theros, Pacific, Eurogas et Nerobel. » |
| **Mentions Légales & Données Personnelles** | Conseil Juridique | Validé | 2026-10-18 | Conformité loi marocaine n° 09-08 et cadre CNDP. Consentement obligatoire validé sur formulaires SAV, B2B et Contact. |
| **Allégations Produits (Claims Register)** | Responsables Marques & Technique | Validé | 2026-10-18 | Registre des allégations vérifié (`content/claims-register.md`). Suppression des chiffres d'énergie et de sécurité non documentés. |
| **Réseau de Vente & Showrooms** | Direction Commerciale & Ventes | Validé | 2026-10-18 | Seuls les points de vente formellement confirmés sont publiés (`content/outlets.json`). |
| **Photographies & Visuels de Marque** | Direction Marketing | Validé | 2026-10-18 | Visuels et logos conformes à la charte et budgets de poids respectés (< 150 Ko). |

## Critères techniques de validation (Definition of Done Gate)

- [x] Remplacement des URLs staging par `https://nerobel.com/` (canonicals, Open Graph, Twitter cards, sitemap.xml, robots.txt, JSON-LD).
- [x] Suppression des balises de staging `noindex, nofollow` et commentaires associés.
- [x] Fichier `robots.txt` en mode production (`Allow: /` et référence `sitemap.xml`).
- [x] Absence de liens morts `href="#"`.
- [x] Absence de balises d'attente `TODO` ou `À COMPLÉTER` dans le code source de production (`scripts/audit-check.sh --gate`).
- [x] Vérification JSON-LD conforme (`scripts/check_jsonld.py`).
- [x] Budgets de performance et attributs `defer` validés (`scripts/check_perf.js`).
- [x] Structure HTML et balisage SEO validés (`scripts/audit_meta.py`).
- [x] Audit d'accessibilité axe sans violation sérieuse ou critique sur 10 pages.
- [x] Suite de tests automatisés Playwright au vert (96 tests passés).
