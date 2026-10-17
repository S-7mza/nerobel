import cv2
import numpy as np

# Load cropped image
img = cv2.imread('assets/img/nerobel-logo-cropped.png', cv2.IMREAD_GRAYSCALE)
h, w = img.shape

# Threshold to binary (letters are white, background is black)
_, thresh = cv2.threshold(img, 128, 255, cv2.THRESH_BINARY)

# Find contours with full hierarchy (to get outer shapes and inner holes like O, R, B)
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)

paths = []
# hierarchy: [Next, Previous, First_Child, Parent]
# Parent == -1 means outer contour
# Parent != -1 means hole inside a contour
if hierarchy is not None:
    hierarchy = hierarchy[0]
    for idx, (contour, h_info) in enumerate(zip(contours, hierarchy)):
        parent = h_info[3]
        # Approximate contour with high fidelity
        epsilon = 0.5
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        if len(approx) < 3:
            continue
            
        pts = approx.reshape(-1, 2)
        d_str = f"M {pts[0][0]} {pts[0][1]} " + " ".join([f"L {p[0]} {p[1]}" for p in pts[1:]]) + " Z"
        paths.append(d_str)

combined_d = " ".join(paths)

svg_pure_vector = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none">
  <path fill-rule="evenodd" d="{combined_d}" fill="currentColor" />
</svg>'''

with open('assets/icons/nerobel-logo-vector.svg', 'w', encoding='utf-8') as f:
    f.write(svg_pure_vector)

print(f"SUCCESS: Generated pure vector path SVG at assets/icons/nerobel-logo-vector.svg ({len(paths)} contour elements, w={w}, h={h})")
