from PIL import Image
import os

img1_path = r"assets/img/theros-proslim-poster.jpg"
img2_path = r"assets/img/theros_brand_article.jpg"

for p in [img1_path, img2_path]:
    if os.path.exists(p):
        with Image.open(p) as img:
            size_kb = os.path.getsize(p) / 1024
            print(f"{p}: format={img.format}, size={img.size}, mode={img.mode}, filesize={size_kb:.1f} KB")
