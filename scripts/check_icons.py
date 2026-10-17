import urllib.request
import re

txt = urllib.request.urlopen("https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css").read().decode("utf-8")
icons = re.findall(r'\.ti-([a-zA-Z0-9-]+):before', txt)

search_terms = ['smart-home', 'home', 'building', 'cpu', 'shield', 'flame', 'award', 'sparkle', 'magic', 'star', 'crown', 'device', 'bolt', 'settings']
for term in search_terms:
    matches = [i for i in icons if term in i]
    print(f"Term '{term}': {matches[:10]}")
