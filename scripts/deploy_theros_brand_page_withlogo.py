"""Crop + optimise the Theros "brand page with logo" visual for brands.html.

Source  : assets/img/theros_brand_page_withlogo.jpg (2752x1536, wide 16:9 render)
Output  : assets/img/theros_brand_page_withlogo_crop.{jpg,webp} (1800x1200, 3:2)

The raw render carries ~600px of empty navy backdrop on the right of the
heater. We trim it so the composition (logo -> phone -> heater) fills the
frame edge-to-edge and the image sits flush on top of the Wi-Fi simulator
panel with balanced side margins. The full height is preserved because the
hand and the heater fittings touch the top/bottom edges.
"""
from PIL import Image
import os

SRC = r"assets/img/theros_brand_page_withlogo.jpg"
DST_JPG = r"assets/img/theros_brand_page_withlogo_crop.jpg"
DST_WEBP = r"assets/img/theros_brand_page_withlogo_crop.webp"

CROP_BOX = (0, 0, 2304, 1536)  # exact 3:2, heater right edge ends at x~2155
OUT_SIZE = (1800, 1200)        # 2x retina for a ~600px wide showcase column

with Image.open(SRC) as img:
    img = img.convert("RGB")
    print(f"Source {SRC}: {img.size}")
    out = img.crop(CROP_BOX).resize(OUT_SIZE, Image.LANCZOS)

    out.save(DST_WEBP, "WEBP", quality=88, method=6)
    out.save(DST_JPG, "JPEG", quality=86, optimize=True, progressive=True)

for f in (DST_WEBP, DST_JPG):
    print(f"Created {f}: {os.path.getsize(f) / 1024:.1f} KB")
