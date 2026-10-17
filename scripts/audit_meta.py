#!/usr/bin/env python3
"""Structural checks: lang, title/description length, og:image, img attributes,
heading order, single H1, links without an accessible name."""
import glob, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None; self.title = ""; self._in_title = False
        self.meta = {}; self.imgs = []; self.headings = []; self.links = []; self._a = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html": self.lang = a.get("lang")
        elif tag == "title": self._in_title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key: self.meta[key] = a.get("content", "")
        elif tag == "img":
            self.imgs.append(a)
            if self._a is not None and a.get("alt"):
                self._a["img_alt"] = a.get("alt")
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"): self.headings.append(int(tag[1]))
        elif tag == "a": self._a = {"attrs": a, "text": "", "img_alt": ""}
    def handle_endtag(self, tag):
        if tag == "title": self._in_title = False
        elif tag == "a" and self._a is not None: self.links.append(self._a); self._a = None
    def handle_data(self, data):
        if self._in_title: self.title += data
        if self._a is not None: self._a["text"] += data

fails = 0
def bad(page, msg):
    global fails
    fails += 1
    print(f"✗ {page}: {msg}")

html_files = [f for f in sorted(glob.glob("*.html")) if not f.startswith("test_")]
for f in html_files:
    p = Page(); p.feed(open(f, encoding="utf-8").read())
    if p.lang != "fr": bad(f, f"html lang={p.lang!r}, expected 'fr'")
    t = p.title.strip()
    if not t or len(t) > 60: bad(f, f"title length {len(t)} (1-60)")
    d = p.meta.get("description", "")
    if not d or len(d) > 155: bad(f, f"description length {len(d)} (1-155)")
    if not p.meta.get("og:image", "").startswith("http"): bad(f, "og:image must be an absolute URL")
    for i in p.imgs:
        src = i.get("src", "?")
        if "alt" not in i: bad(f, f"img without alt: {src}")
        if not (i.get("width") and i.get("height")): bad(f, f"img without width/height: {src}")
    if p.headings.count(1) != 1: bad(f, f"{p.headings.count(1)} h1 (expected 1)")
    prev = 0
    for h in p.headings:
        if prev and h > prev + 1: bad(f, f"heading jump h{prev} -> h{h}")
        prev = h
    for l in p.links:
        if not l["text"].strip() and not l["attrs"].get("aria-label") and not l.get("img_alt", "").strip():
            bad(f, f"link without text or aria-label: {l['attrs'].get('href')} (check if an img alt covers it)")

print("OK" if not fails else f"{fails} problem(s)")
raise SystemExit(1 if fails else 0)
