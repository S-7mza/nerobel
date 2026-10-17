import cv2
import numpy as np
import potrace
from PIL import Image
import os

def trace_to_svg_subpaths(binary_mask, turdsize=3, opttolerance=0.2):
    pad = 12
    padded = np.pad(binary_mask, pad, mode='constant', constant_values=False)
    ch, cw = padded.shape
    bmp = potrace.Bitmap(padded)
    path = bmp.trace(turdsize=turdsize, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=opttolerance)
    
    subpaths = []
    for curve_idx, curve in enumerate(path):
        # Skip outer canvas boundary if potrace generated one
        if curve_idx == 0 and len(curve.segments) == 4 and curve.start_point.x < 1:
            continue
        start = curve.start_point
        d = [f'M {start.x:.2f} {start.y:.2f}']
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f'L {seg.c.x:.2f} {seg.c.y:.2f}')
                d.append(f'L {seg.end_point.x:.2f} {seg.end_point.y:.2f}')
            else:
                d.append(f'C {seg.c1.x:.2f} {seg.c1.y:.2f} {seg.c2.x:.2f} {seg.c2.y:.2f} {seg.end_point.x:.2f} {seg.end_point.y:.2f}')
        d.append('Z')
        subpaths.append(' '.join(d))
    return ' '.join(subpaths), cw, ch

# ==============================================================================
# 1. THEROS (Spartan Helmet Crest + THEROS Bold Modern Sans)
# ==============================================================================
# In theros_logo_tight.png, the Spartan helmet is at x: 0 to 45, and THEROS is at 45 to 143.
# The subtitle 'Comfort Provider' at the bottom can make the logo look tiny in 24px badges.
# So we trace the main Spartan Helmet + THEROS wordmark for ultra crisp visibility!
th_pil = Image.open('theros_logo_tight.png')
# Crop helmet + THEROS, omitting tiny bottom subtitle for the primary badge logo
# y is from 0 to 46 (omitting 'Comfort Provider' at y 48-60)
th_main_crop = th_pil.crop((0, 0, 143, 40))
th_main_crop.save('theros_main_crop.png')

th_img = cv2.imread('theros_main_crop.png', cv2.IMREAD_GRAYSCALE)
th_up = cv2.resize(th_img, (th_img.shape[1]*4, th_img.shape[0]*4), interpolation=cv2.INTER_CUBIC)
th_blur = cv2.GaussianBlur(th_up, (5, 5), 0)
th_thresh = (th_blur > 130)

# Crop tight to bounding box
y_idx, x_idx = np.where(th_thresh)
th_thresh_tight = th_thresh[min(y_idx):max(y_idx)+1, min(x_idx):max(x_idx)+1]

th_path, th_w, th_h = trace_to_svg_subpaths(th_thresh_tight, turdsize=3)

# Base Theros SVG with adaptive styling
theros_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {th_w} {th_h}" fill="none">
  <path fill-rule="evenodd" d="{th_path}" fill="#FFFFFF" class="brand-logo-theros" />
</svg>'''

with open('assets/icons/theros-logo.svg', 'w', encoding='utf-8') as f:
    f.write(theros_svg)

with open('assets/icons/theros-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(theros_svg)

with open('assets/icons/theros-logo-dark.svg', 'w', encoding='utf-8') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {th_w} {th_h}" fill="none">
  <path fill-rule="evenodd" d="{th_path}" fill="#007367" />
</svg>''')

# Also Spartan Helmet Mark standalone
helmet_pil = th_pil.crop((0, 0, 46, 56))
h_img = cv2.imread('theros_helmet.png', cv2.IMREAD_GRAYSCALE)
h_up = cv2.resize(h_img, (h_img.shape[1]*4, h_img.shape[0]*4), interpolation=cv2.INTER_CUBIC)
h_blur = cv2.GaussianBlur(h_up, (5, 5), 0)
h_thresh = (h_blur > 130)
y_idx, x_idx = np.where(h_thresh)
h_tight = h_thresh[min(y_idx):max(y_idx)+1, min(x_idx):max(x_idx)+1]
h_path, hw, hh = trace_to_svg_subpaths(h_tight, turdsize=3)

with open('assets/icons/theros-mark.svg', 'w', encoding='utf-8') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {hw} {hh}" fill="none">
  <path fill-rule="evenodd" d="{h_path}" fill="#FFFFFF" />
</svg>''')

print("Theros SVG generated!")

# ==============================================================================
# 2. PACIFIC (Wave Shield Emblem + Signature Cursive Script)
# ==============================================================================
pc_img = cv2.imread('pacific_logo_tight.png', cv2.IMREAD_GRAYSCALE)
pc_up = cv2.resize(pc_img, (pc_img.shape[1]*4, pc_img.shape[0]*4), interpolation=cv2.INTER_CUBIC)
pc_blur = cv2.GaussianBlur(pc_up, (5, 5), 0)
pc_thresh = (pc_blur > 135)
y_idx, x_idx = np.where(pc_thresh)
pc_tight = pc_thresh[min(y_idx):max(y_idx)+1, min(x_idx):max(x_idx)+1]

pc_path, pc_w, pc_h = trace_to_svg_subpaths(pc_tight, turdsize=3)

pacific_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {pc_w} {pc_h}" fill="none">
  <path fill-rule="evenodd" d="{pc_path}" fill="#FFFFFF" class="brand-logo-pacific" />
</svg>'''

with open('assets/icons/pacific-logo.svg', 'w', encoding='utf-8') as f:
    f.write(pacific_svg)

with open('assets/icons/pacific-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(pacific_svg)

with open('assets/icons/pacific-logo-dark.svg', 'w', encoding='utf-8') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {pc_w} {pc_h}" fill="none">
  <path fill-rule="evenodd" d="{pc_path}" fill="#0F172A" />
</svg>''')

print("Pacific SVG generated!")

# ==============================================================================
# 3. EUROGAS (Official Bold Geometric Typographic Mark)
# ==============================================================================
eg_pil = Image.open('eurogas_mask_255.png').convert('L')
eg_arr = (np.array(eg_pil) == 255)
y_idx, x_idx = np.where(eg_arr)
eg_tight = eg_arr[min(y_idx):max(y_idx)+1, min(x_idx):max(x_idx)+1]

eg_path, eg_w, eg_h = trace_to_svg_subpaths(eg_tight, turdsize=2)

eurogas_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {eg_w} {eg_h}" fill="none">
  <path fill-rule="evenodd" d="{eg_path}" fill="#FFFFFF" class="brand-logo-eurogas" />
</svg>'''

with open('assets/icons/eurogas-logo.svg', 'w', encoding='utf-8') as f:
    f.write(eurogas_svg)

with open('assets/icons/eurogas-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(eurogas_svg)

with open('assets/icons/eurogas-logo-dark.svg', 'w', encoding='utf-8') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {eg_w} {eg_h}" fill="none">
  <path fill-rule="evenodd" d="{eg_path}" fill="#0033A0" />
</svg>''')

print("Eurogas SVG generated!")

# ==============================================================================
# 4. NEROBEL (Official Potrace Vector Logo)
# ==============================================================================
with open('assets/icons/nerobel-logo-dark.svg', 'r', encoding='utf-8') as f:
    nero_content = f.read()

import re
match = re.search(r'd="([^"]+)"', nero_content)
nero_path = match.group(1) if match else ""

nerobel_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1001 169" fill="none">
  <path fill-rule="evenodd" d="{nero_path}" fill="#FFFFFF" class="brand-logo-nerobel" />
</svg>'''

with open('assets/icons/nerobel-logo.svg', 'w', encoding='utf-8') as f:
    f.write(nerobel_svg)

with open('assets/icons/nerobel-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(nerobel_svg)

print("Nerobel SVG verified!")
