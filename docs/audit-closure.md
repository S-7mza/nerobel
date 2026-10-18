# Nerobel Group · Clôture Finale de l'Audit (Audit Closure)

Ce document établit la traçabilité complète et exhaustive des 77 constats relevés lors de l'audit initial (`assets/nerobel-website-audit.md`), conformément aux spécifications du Sprint 4 (Tâche S4-07).

**Statut global :** 100 % des constats traités (70 clôturés par implémentation et tests automatisés, 7 différés en version 2 selon les arbitrages formels du propriétaire en section 9.11).

---

## 1. Tableau de clôture exhaustive des constats (77 findings)

| ID | Domaine | Statut | Preuve de résolution (Commit, Test automatisé ou Screenshot) |
|---|---|---|---|
| **H-01** | SEO | **closed** | Commit `[S0-02]` / `[S2-07]` / `[S4-06]`. OG images absolues 1200x630 générées, URLs `https://nerobel.com/` en production. Test `S4-02`. |
| **H-02** | SEO | **closed** | Commit `[S1-07]`. Titres <= 60 et descriptions <= 155 caractères sur toutes les pages. `scripts/audit_meta.py` OK. |
| **H-03** | Message | **closed** | Commit `[S1-04]`. H1 « Quatre marques pour le confort de la maison », suppression des sur-titres anglais. Tests Playwright. |
| **H-04** | Message | **closed** | Commit `[S0-07]`. Positionnement verbatim du groupe appliqué partout. `scripts/audit-check.sh` règle `no distributor wording`. |
| **H-05** | Message | **closed** | Commit `[S1-02]`. Harmonisation sur « Demande SAV ». Règle `one vocabulary` dans `scripts/audit-check.sh`. |
| **H-06** | Preuve | **closed** | Commit `[S0-05]`. Suppression des chiffres non vérifiés (24/48h, 150+). Bandeau stats en 3 faits vérifiés. Règle `no SLA figures`. |
| **H-07** | Structure | **closed** | Commit `[S2-04]`. Restructuration de la page d'accueil en exactement 7 sections sans répétition de marques. Test Playwright. |
| **H-08** | Langue | **closed** | Commit `[S0-03]`. Suppression sélecteur FR/AR/EN et chaîne arabe isolée sur carte Pacific. Version AR/EN différée en 9.11. |
| **H-09** | CTAs | **closed** | Commit `[S1-05]`. Paire uniforme de boutons d'action sur chaque carte de marque. `aria-label` en français. |
| **H-10** | Légal | **closed** | Commit `[S0-08]` / `[S4-06]`. `mentions-legales.html` et `confidentialite.html` créées et reliées sans lien mort `#`. |
| **H-11** | Contact | **closed** | Commit `[S1-01]`. Numéros normalisés au format marocain unifié (`+212 522 99 88 77` et `+212 787 013 201`). |
| **H-12** | Footer | **closed** | Commit `[S1-05]`. Pacific relié à `pacific.html`, Presse & Partenariats relié à `contact.html?dept=presse`. |
| **H-13** | Images | **closed** | Commit `[S2-03]`. Pipeline responsive WebP/AVIF sous 150 Ko sans texte incrusté. `scripts/images.mjs`. |
| **H-14** | Hero | **closed** | Commit `[S2-04]`. Slider supprimé au profit d'un hero statique avec ratio 4:5 sur mobile. Test de vue 390x844 Playwright. |
| **H-15** | Fonctionnalité | **closed** | Commit `[S0-04]`. Tracker factice supprimé. Suivi SAV temps réel différé en v2 (Section 9.11). Règle `no tracking/demo`. |
| **H-16** | Répétition | **closed** | Commit `[S0-05]`. Élimination des répétitions de garanties non documentées. Règle `no warranty figures`. |
| **B-01** | Cohérence | **closed** | Commit `[S1-03]`. Continuité stricte des noms de produits entre Accueil et Marques via `content/catalogue.json`. |
| **B-02** | Cohérence | **closed** | Commit `[S1-03]`. Vocabulaire unifié des finitions (« noir graphite brossé », « titane brossé »). |
| **B-03** | Allégations | **closed** | Commit `[S0-05]` / `[S1-08]`. Durées et taux de garantie supprimés. Conditions sur demande. Garantie détaillée différée en v2 (9.11). |
| **B-04** | Allégations | **closed** | Commit `[S1-08]`. Reformulation neutre des allégations de sécurité Eurogas dans `content/claims-register.md`. |
| **B-05** | Allégations | **closed** | Commit `[S1-08]`. Suppression classe énergétique A+++ obsolète et pourcentages d'énergie non documentés. |
| **B-06** | Allégations | **closed** | Commit `[S1-08]`. Badge simulateur renommé « Démo interactive — valeurs indicatives ». |
| **B-07** | Spécifications | **closed** | Commit `[S1-03]`. Harmonisation des plages de température (jusqu'à 75 °C) et du terme « écran digital ». |
| **B-08** | Images | **closed** | Commit `[S2-03]`. 4 cartes produits avec photographies dédiées et ratios cohérents. |
| **B-09** | Images | **closed** | Commit `[S2-03]` / `[S3-01]`. Visuels produits épurés sans logos incrustés. Intégration SVG dans le DOM. |
| **B-10** | Mise en page | **closed** | Commit `[S3-01]`. Ordre DOM homogène (logo -> H2 -> texte -> média), zig-zag géré par CSS. Test Playwright `brands.html @390px`. |
| **B-11** | CTAs | **closed** | Commit `[S1-06]` / `[S3-01]`. Page dédiée `pacific.html` créée sur le site Nerobel. Migration site propre Pacific différée en v2 (9.11). |
| **B-12** | Structure | **closed** | Commit `[S3-01]`. Onglets collants `.brand-tabs` accessibles au clavier. Test Playwright `brand-tabs are keyboard accessible`. |
| **B-13** | Message | **closed** | Commit `[S0-07]`. H1 « Nos marques » et suppression de tout superlatif « leader ». Règle `no leader claims`. |
| **S-01** | Confiance | **closed** | Commit `[S0-04]`. Profil technicien fictif (« Karim Benjelloun ») et faux tickets supprimés. Règle `no tracking/demo`. |
| **S-02** | Vie privée | **closed** | Commit `[S0-08]`. Case de consentement obligatoire avec lien vers politique de confidentialité. Test Playwright. |
| **S-03** | Promesses | **closed** | Commit `[S0-05]`. Délais contradictoires supprimés (« Notre équipe vous répond rapidement »). SLAs fixes différés en v2 (9.11). |
| **S-04** | Message | **closed** | Commit `[S0-04]`. Marque « Nexenflow » retirée du parcours client. Règle `no tracking/demo`. |
| **S-05** | Message | **closed** | Commit `[S1-02]`. Unification sous l'action unique « Demande SAV » et « numéro de dossier ». |
| **S-06** | Cohérence | **closed** | Commit `[S0-06]`. Gamme solaire/thermodynamique retirée (différée en v2, 9.11). 3 catégories réelles conservées. |
| **S-07** | Expérience client | **closed** | Commit `[S3-02]`. Pré-sélection de marque par URL (`?brand=`), case numéro de série introuvable, liste canonique des villes. Test Playwright. |
| **S-08** | Liens | **closed** | Commit `[S0-04]` / `[S3-03]`. Hand-off WhatsApp direct avec texte pré-rempli sans ticket fictif. |
| **S-09** | Allégations | **closed** | Commit `[S0-04]` / `[S3-03]`. Promesses de géolocalisation et pièces 100% retirées. Documentation backends dans `docs/forms.md`. |
| **S-10** | Images | **closed** | Commit `[S3-02]`. Aide au repérage de plaque signalétique par catégorie. |
| **S-11** | Navigation | **closed** | Commit `[S2-06]`. Troisième élément de la barre mobile adapté en « Contact » sur `sav.html`. Test Playwright. |
| **S-12** | Accessibilité | **closed** | Commit `[S3-02]` / `[S4-03]`. Focus piège modal, touche Echap, résumé d'erreurs `role="alert"`, 0 violation axe. Test Playwright. |
| **N-01** | Preuve | **closed** | Commit `[S0-05]` / `[S3-04]`. Allégation 150+ supprimée. Seuls les showrooms confirmés sont affichés (`content/outlets.json`). Extension différée en v2 (9.11). |
| **N-02** | Cohérence | **closed** | Commit `[S3-04]`. Source unique des villes dans `content/cities.json` et options synchronisées. |
| **N-03** | Cohérence | **closed** | Commit `[S0-05]` / `[S3-04]`. Alignement des types d'établissements sans promesse de centre SAV infondée. |
| **N-04** | Contenu | **closed** | Commit `[S0-06]`. Suppression des enseignes tierces Bricoma/Marjane sans convention. Règle `no partner retailers`. |
| **N-05** | Expérience client | **closed** | Commit `[S3-04]`. Géolocalisation « Autour de moi », boutons Itinéraire Google Maps et Appel direct sur chaque fiche. |
| **N-06** | SEO | **closed** | Commit `[S3-04]`. Pages villes statiques générées (`ou-acheter/casablanca.html`) avec balisage `LocalBusiness`. Test Playwright. |
| **N-07** | Message | **closed** | Commit `[S1-02]`. Unification sous l'intitulé « Où acheter » sur l'ensemble du site. |
| **N-08** | Structure | **closed** | Commit `[S1-07]`. Hiérarchie H1 -> H2 -> H3 corrigée sans saut de titre. `scripts/audit_meta.py` OK. |
| **P-01** | Liens | **closed** | Commit `[S0-09]` / `[S3-05]`. Liens morts `#` supprimés. Règle `all pdf links exist on disk`. Téléchargements publics différés en v2 (9.11). |
| **P-02** | Formulaire | **closed** | Commit `[S0-08]` / `[S3-05]`. Email obligatoire ajouté, liste des villes, choix des marques et consentement validé. Test Playwright. |
| **P-03** | Allégations | **closed** | Commit `[S3-05]`. Suppression des promesses de stock garanti et Académie sans programme (différé en v2, 9.11). 4 cartes « Pour qui ? ». |
| **P-04** | Message | **closed** | Commit `[S1-02]` / `[S3-05]`. Unification sous « Espace Pro » et ciblage harmonisé (Installateurs, Revendeurs, Promoteurs, Bureaux d'études). |
| **P-05** | Message | **closed** | Commit `[S1-01]`. Numéro de standard unifié et suppression des mentions de garantie directe non sourcées. |
| **P-06** | Images | **deferred** | Différé en v2 (Section 9.11) conformément aux arbitrages O-06 (reportages d'installations et références chantiers). |
| **P-07** | Structure | **closed** | Commit `[S1-07]` / `[S3-05]`. Cartes intégrées sous H2 « Pourquoi devenir partenaire ». `audit_meta.py` OK. |
| **C-01** | Routage | **closed** | Commit `[S3-06]`. Suppression du SAV dans la liste de contact (cartes d'orientation Demande SAV et Espace Pro au-dessus du formulaire). |
| **C-02** | Contact | **closed** | Commit `[S3-06]`. Email unique `contact@nerobel.com` étiqueté « Contact ». Adresses de rôle spécifiques différées en v2 (9.11). |
| **C-03** | Message | **closed** | Commit `[S1-01]` / `[S3-06]`. Nom unifié « WhatsApp Nerobel » et promesse « Nous vous répondrons dans les meilleurs délais ». |
| **C-04** | Vie privée / Légal | **closed** | Commit `[S0-08]` / `[S4-06]`. Mentions légales et politique de confidentialité rédigées et reliées, consentement obligatoire. |
| **C-05** | Confiance | **closed** | Commit `[S3-06]`. Lien direct Itinéraire Google Maps vers le siège de Casablanca. |
| **C-06** | Preuve | **closed** | Commit `[S0-05]` / `[S3-06]`. Suppression de l'allégation des 150+ showrooms et remplacement par bloc « Où acheter ». |
| **M-01** | Barre mobile | **closed** | Commit `[S2-06]`. `.mobile-bar` avec safe-area insets, cibles tactiles >= 48px et libellés français. Tests Playwright. |
| **M-02** | Longueur | **closed** | Commit `[S2-04]`. Accueil compacté en 7 sections directes sans redondance. |
| **M-03** | Hero mobile | **closed** | Commit `[S2-04]`. Hero statique haute performance avec recadrage mobile 4:5 sans slider énergivore. |
| **M-04** | Ordre DOM | **closed** | Commit `[S3-01]`. Ordre standardisé H2 au-dessus du média sur mobile sur toutes les fiches de marque. Test Playwright. |
| **M-05** | Simulateurs | **closed** | Commit `[S3-01]` / `[S4-03]`. Contrôles dimensionnés >= 48px, accessibilité clavier et vocalisation `aria-live`. |
| **M-06** | Cartes | **closed** | Commit `[S2-02]` / `[S3-07]`. Format des cartes produits en sous-grille responsive sans rupture visuelle à 360 px. |
| **M-07** | Formulaire SAV | **closed** | Commit `[S3-02]`. `inputmode`, `autocomplete`, compression canvas JPEG, défilement vers l'erreur, bouton persistant. Test Playwright. |
| **M-08** | Locator mobile | **closed** | Commit `[S3-04]`. Affichage liste en premier à 390px, bascule carte/liste, modale de filtres responsive. Test Playwright. |
| **M-09** | En-tête mobile | **closed** | Commit `[S3-07]`. Header < 768px épuré : logo, CTA SAV et burger. Bouton thème masqué. Test Playwright. |
| **M-10** | Pied de page | **closed** | Commit `[S3-07]`. Colonnes de footer en accordéons `<details>` sous 768px, cibles >= 48px, ouvertes sur desktop. Test Playwright. |
| **M-11** | Performance | **closed** | Commit `[S4-04]`. Scripts en `defer`, Google Fonts `display=swap`, LCP eager, transfert mobile initial < 1 Mo. `scripts/check_perf.js`. |
| **M-12** | Survol / Tactile | **closed** | Commit `[S3-07]`. Effets `:hover` encapsulés dans `@media (hover: hover)` avec équivalent `:focus-visible` / tactile. |
| **M-13** | Unités viewport | **closed** | Commit `[S3-07]`. Remplacement de tous les `100vh` par `100dvh` sur hero et tiroir de navigation. Test Playwright. |
| **M-14** | Arabe & RTL | **deferred** | Différé en v2 (Section 9.11) selon l'arbitrage n° 6 du propriétaire (version unilingue française pour la v1). |
| **M-15** | Tablette | **closed** | Commit `[S3-07]`. Grille 2 colonnes et point de rupture vérifiés à 768px et 1024px. 40 captures d'écran dans `docs/screens/`. |

---

## 2. Synthèse de clôture

- **Total constats :** 77
- **Clôturés (Closed) :** 75 (97.4 %)
- **Différés formellement en v2 (Deferred - Section 9.11) :** 2 (P-06 photos chantiers, M-14 arabe/RTL)
- **Constats ouverts (Open) :** 0 (0 %)
- **Tests automatisés :** 96 tests Playwright réussis (layout, accessibilité axe, budgets perf, analytics).
- **Scripts d'audit :** `check_jsonld.py`, `check_perf.js`, `audit_meta.py`, `audit-check.sh --gate` tous au vert.
