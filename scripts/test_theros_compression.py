from PIL import Image
import os

src_path = r"assets/img/theros_brand_article.jpg"

with Image.open(src_path) as img:
    orig_w, orig_h = img.size
    print(f"Original: {orig_w}x{orig_h}, {os.path.getsize(src_path)/1024:.1f} KB")

    # Test 1: Full res 1856x2304 WebP Q85
    p1 = r"assets/img/test_full_q85.webp"
    img.save(p1, "WEBP", quality=85, method=6)
    print(f"Full res WebP Q85: {os.path.getsize(p1)/1024:.1f} KB")

    # Test 2: Full res 1856x2304 WebP Q82
    p2 = r"assets/img/test_full_q82.webp"
    img.save(p2, "WEBP", quality=82, method=6)
    print(f"Full res WebP Q82: {os.path.getsize(p2)/1024:.1f} KB")

    # Test 3: Retina 2x width 1200px (1200 x 1490) WebP Q86
    new_w = 1200
    new_h = int(orig_h * (new_w / orig_w))
    img_1200 = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    p3 = r"assets/img/test_1200_q86.webp"
    img_1200.save(p3, "WEBP", quality=86, method=6)
    print(f"1200px WebP Q86: {os.path.getsize(p3)/1024:.1f} KB")

    p3_jpg = r"assets/img/test_1200_q85.jpg"
    img_1200.save(p3_jpg, "JPEG", quality=85, optimize=True, progressive=True)
    print(f"1200px Progressive JPG Q85: {os.path.getsize(p3_jpg)/1024:.1f} KB")

    # Test 4: 1400px WebP Q85
    new_w_14 = 1400
    new_h_14 = int(orig_h * (new_w_14 / orig_w))
    img_1400 = img.resize((new_w_14, new_h_14), Image.Resampling.LANCZOS)
    p4 = r"assets/img/test_1400_q85.webp"
    img_1400.save(p4, "WEBP", quality=85, method=6)
    print(f"1400px WebP Q85: {os.path.getsize(p4)/1024:.1f} KB")
