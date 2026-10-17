import cv2
import numpy as np
import re

with open('assets/icons/nerobel-logo.svg', 'r') as f:
    svg = f.read()

# Extract the path d
m = re.search(r'd="([^"]+)"', svg)
d = m.group(1)

subpaths = [p.strip() for p in d.split('Z') if p.strip()]

canvas = np.zeros((160, 1000, 3), dtype=np.uint8)

polys = []
for sp in subpaths:
    tokens = sp.replace('M', '').replace('L', '').split()
    pts = []
    for i in range(0, len(tokens), 2):
        pts.append([int(tokens[i]), int(tokens[i+1])])
    polys.append(np.array(pts, dtype=np.int32))

for i in [8, 7, 5, 9, 2, 1, 0]:
    cv2.fillPoly(canvas, [polys[i]], (255, 255, 255))
for i in [6, 10, 3, 4]:
    cv2.fillPoly(canvas, [polys[i]], (0, 0, 0))

cv2.imwrite('test_svg_drawn.png', canvas)
print("Rendered test_svg_drawn.png successfully")
