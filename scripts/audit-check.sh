#!/usr/bin/env bash
# Usage: scripts/audit-check.sh [--gate]   (--gate also bans TODO / À COMPLÉTER)
export LC_ALL=C.UTF-8
cd "$(dirname "$0")/.." || exit 2
FILES=$(ls ./*.html ou-acheter/*.html js/*.js assets/js/*.js 2>/dev/null | grep -v 'test_')
fail=0
ban() {  # ban "<rule name>" "<PCRE pattern>"
  out=$(grep -nPi -- "$2" $FILES 2>/dev/null)
  if [ -n "$out" ]; then echo "✗ $1"; echo "$out" | head -20; fail=1; else echo "✓ $1"; fi
}
ban "no 150+ claim"          '150\+'
ban "no SLA figures"         '24/48|24 à 48|sous 24 ?h|réactif 48|\b48 ?h\b|2 minutes'
ban "no warranty figures"    '100 ?%|12 mois|10 ans|0 DH|extension de garantie|garantie constructeur|qualité constructeur|conditions générales de garantie'
ban "no tracking/demo"       'nexenflow|karim|benjelloun|NERO-2026-[0-9]|suivi en direct|télématique|live app'
ban "no partner retailers"   'bricoma|marjane'
ban "no solar range"         'solaire|thermodynamique'
ban "no distributor wording" 'distribués par|distributeur et fabricant|conçoit et distribue|marque constructeur'
ban "no leader claims"       'leader'
ban "no Arabic / lang switch" '[\x{0600}-\x{06FF}]|lang-switch|lang-dropdown'
ban "no dead # links"        'href="#"'
ban "one vocabulary"         'réclamation|SAV Express|Support SAV|Portail|Showrooms & Distributeurs|Showrooms &amp; Distributeurs|Trouver un|Concierge|Hotline'

# Check PDF links: every uncommented href ending in .pdf must exist on disk
pdf_links=$(grep -vhE '<!--' $FILES 2>/dev/null | grep -oPi 'href="[^"]+\.pdf"' | sed -E 's/.*href="([^"]+)".*/\1/' | sort -u)
pdf_err=0
for pdf in $pdf_links; do
  if [[ "$pdf" =~ ^https?:// ]] || [[ "$pdf" =~ ^mailto: ]]; then
    continue
  fi
  clean_pdf="${pdf%%\?*}"
  clean_pdf="${clean_pdf#\/}"
  clean_pdf="${clean_pdf#\.\.\/}"
  clean_pdf="${clean_pdf#\.\/}"
  if [ ! -f "$clean_pdf" ]; then
    echo "✗ missing pdf on disk: $pdf"
    pdf_err=1
    fail=1
  fi
done
if [ $pdf_err -eq 0 ]; then
  echo "✓ all pdf links exist on disk"
fi

[ "${1:-}" = "--gate" ] && ban "no placeholders" 'TODO|À COMPLÉTER'
exit $fail
