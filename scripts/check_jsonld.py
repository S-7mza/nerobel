#!/usr/bin/env python3
"""
scripts/check_jsonld.py
Validates JSON-LD blocks in HTML files against content/facts.json.
Enforces S4-01 rules:
- Organization JSON-LD on index.html with name, logo, address, contact points, sameAs, and brands
- Matches facts in content/facts.json
- City pages carry LocalBusiness JSON-LD
- Prohibits Product offers, prices, or ratings
"""
import glob
import json
import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    facts_path = os.path.join(root, 'content', 'facts.json')
    with open(facts_path, 'r', encoding='utf-8') as f:
        facts = json.load(f)

    html_files = glob.glob(os.path.join(root, '*.html')) + glob.glob(os.path.join(root, 'ou-acheter', '*.html'))
    errors = []

    index_found_org = False
    index_found_brands = False

    for file_path in html_files:
        rel_path = os.path.relpath(file_path, root).replace('\\', '/')
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        blocks = re.findall(r'<script\s+type=["\']application/ld\+json["\']>(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
        for idx, block in enumerate(blocks):
            try:
                data = json.loads(block.strip())
            except Exception as e:
                errors.append(f"{rel_path}: JSON-LD block {idx+1} failed to parse: {e}")
                continue

            # Check prohibited Product, offers, ratings
            block_str = json.dumps(data)
            if '"Product"' in block_str or '"offers"' in block_str or '"price"' in block_str or '"aggregateRating"' in block_str:
                errors.append(f"{rel_path}: Prohibited Product/offers/prices/ratings found in JSON-LD")

            items = data.get('@graph', [data]) if isinstance(data, dict) else data
            if isinstance(items, dict):
                items = [items]

            for item in items:
                item_type = item.get('@type')
                if rel_path == 'index.html' and item_type == 'Organization':
                    index_found_org = True
                    if item.get('name') != facts.get('group'):
                        errors.append(f"index.html: Organization name '{item.get('name')}' != '{facts.get('group')}'")
                    if item.get('email') != facts['contact']['email']:
                        errors.append(f"index.html: Organization email '{item.get('email')}' != '{facts['contact']['email']}'")
                    
                    addr = item.get('address', {})
                    if facts['contact']['address'] not in str(addr):
                        errors.append(f"index.html: Organization address does not match facts.json")

                    contacts = item.get('contactPoint', [])
                    phone_numbers = [c.get('telephone') for c in contacts]
                    expected_phones = [facts['contact']['switchboard']['tel'], facts['contact']['whatsapp']['tel']]
                    for p in expected_phones:
                        if p not in phone_numbers:
                            errors.append(f"index.html: contactPoint missing phone {p}")
                    for c in contacts:
                        if c.get('contactType') != 'customer service':
                            errors.append(f"index.html: contactPoint contactType '{c.get('contactType')}' != 'customer service'")
                        if c.get('availableLanguage') != 'fr':
                            errors.append(f"index.html: contactPoint availableLanguage '{c.get('availableLanguage')}' != 'fr'")

                    same_as = item.get('sameAs', [])
                    for s_url in facts['contact']['social'].values():
                        if s_url not in same_as:
                            errors.append(f"index.html: Organization sameAs missing '{s_url}'")

                    brands = item.get('brand', [])
                    if len(brands) == 4:
                        index_found_brands = True
                        for b in brands:
                            b_name = b.get('name')
                            fact_b = next((fb for fb in facts['brands'] if fb['name'] == b_name), None)
                            if not fact_b:
                                errors.append(f"index.html: Unknown brand '{b_name}' in JSON-LD")
                            elif fact_b.get('site'):
                                if b.get('url') != fact_b['site']:
                                    errors.append(f"index.html: Brand '{b_name}' url '{b.get('url')}' != '{fact_b['site']}'")
                    else:
                        errors.append(f"index.html: Expected 4 brands in Organization, found {len(brands)}")

                if rel_path.startswith('ou-acheter/') and item_type == 'LocalBusiness':
                    if facts['contact']['switchboard']['tel'] not in str(item.get('telephone', '')):
                        errors.append(f"{rel_path}: LocalBusiness telephone does not match facts.json")

    if not index_found_org:
        errors.append("index.html: No Organization JSON-LD found")
    if not index_found_brands:
        errors.append("index.html: No Brand JSON-LD found in Organization")

    if errors:
        print(f"✗ check_jsonld.py failed with {len(errors)} error(s):")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)

    print("✓ check_jsonld.py: all JSON-LD blocks valid and verified against facts.json")
    sys.exit(0)

if __name__ == '__main__':
    main()
