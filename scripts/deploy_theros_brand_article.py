from PIL import Image
import os
import glob

raw_src = r"assets/img/theros_brand_article.jpg"

with Image.open(raw_src) as img:
    w, h = img.size
    print(f"Converting raw {raw_src} ({w}x{h})...")
    
    # 1. High-fidelity WebP (Quality 90)
    webp_dst = r"assets/img/theros_brand_article.webp"
    img.save(webp_dst, "WEBP", quality=90, method=6)
    webp_kb = os.path.getsize(webp_dst) / 1024
    print(f"Created {webp_dst}: {webp_kb:.1f} KB")

    # 2. Optimized Progressive JPEG (Quality 88)
    # Temporary save to temp path then replace
    temp_jpg = r"assets/img/theros_brand_article_opt.jpg"
    img.save(temp_jpg, "JPEG", quality=88, optimize=True, progressive=True)
    opt_kb = os.path.getsize(temp_jpg) / 1024
    print(f"Optimized JPEG: {opt_kb:.1f} KB")

# Replace raw JPEG with optimized JPEG
if os.path.exists(temp_jpg):
    os.replace(temp_jpg, raw_src)
    print(f"Updated {raw_src} to optimized progressive JPEG ({os.path.getsize(raw_src)/1024:.1f} KB)")

# Clean up test files
for f in glob.glob(r"assets/img/test_*.*"):
    try:
        os.remove(f)
        print(f"Cleaned up {f}")
    except Exception as e:
        pass

print("Image processing complete!")
