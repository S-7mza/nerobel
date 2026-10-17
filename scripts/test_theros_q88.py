from PIL import Image
import os

src_path = r"assets/img/theros_brand_article.jpg"

with Image.open(src_path) as img:
    # Full res WebP Q88
    p_q88 = r"assets/img/test_full_q88.webp"
    img.save(p_q88, "WEBP", quality=88, method=6)
    print(f"Full res WebP Q88: {os.path.getsize(p_q88)/1024:.1f} KB")

    # Full res WebP Q90
    p_q90 = r"assets/img/test_full_q90.webp"
    img.save(p_q90, "WEBP", quality=90, method=6)
    print(f"Full res WebP Q90: {os.path.getsize(p_q90)/1024:.1f} KB")

    # Full res Progressive JPEG Q88
    p_jpg = r"assets/img/test_full_q88.jpg"
    img.save(p_jpg, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"Full res Progressive JPG Q88: {os.path.getsize(p_jpg)/1024:.1f} KB")
