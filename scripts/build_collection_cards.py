"""Build the 5 bespoke 5:4 (1250x1000) collection & brand card visuals for index.html.

Why 5:4 (1250x1000) with top-only studio headroom:
  * .collection-visual-pane on desktop is ~300x240 (exact 5:4 aspect ratio).
  * Each card renders a floating glass badge (.collection-badge-tag / .brand-card-badge)
    at top-left (top: 14px, left: 14px).
  * By healing the top-left baked-in logo on Theros and adding all vertical padding
    to the pure dark studio sky at the top (pad_bot = 0), the bottom edge (wrist,
    fittings, console) stays 100% untouched while the top-left badge gets a clean
    dark studio zone and 100% of the horizontal width stays visible.

Outputs (WebP + Progressive JPEG):
  * assets/img/collection-theros.{webp,jpg}
  * assets/img/collection-pacific.{webp,jpg}
  * assets/img/collection-eurogas.{webp,jpg}
  * assets/img/collection-refrigerator.{webp,jpg}
  * assets/img/collection-smart-tv.{webp,jpg}
"""
import os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAIN = r"C:\Users\7mza\.gemini\antigravity\brain\2ec6ba29-a90c-451c-885b-fcdae000d81b"

OUT_W, OUT_H = 1250, 1000  # exact 5:4 matching 300x240 collection-visual-pane


def remove_theros_topleft_logo(img: Image.Image) -> Image.Image:
    """Cleanly heal the baked-in top-left THEROS logo on the 1800x1200 crop."""
    arr = np.array(img).astype(np.float32)
    x0, x1 = 30, 680
    y0, y1 = 25, 245
    h_box = y1 - y0
    w_box = x1 - x0

    top_strip = arr[y0 - 1 : y0, x0:x1]
    bot_strip = arr[y1 : y1 + 1, x0:x1]
    left_strip = arr[y0:y1, x0 - 1 : x0]
    right_strip = arr[y0:y1, x1 : x1 + 1]

    vy = np.linspace(0, 1, h_box)[:, None, None]
    vx = np.linspace(0, 1, w_box)[None, :, None]

    interp_v = top_strip * (1 - vy) + bot_strip * vy
    interp_h = left_strip * (1 - vx) + right_strip * vx
    arr[y0:y1, x0:x1] = 0.55 * interp_v + 0.45 * interp_h

    healed = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    sub = healed.crop((x0 - 10, y0 - 10, x1 + 10, y1 + 10)).filter(ImageFilter.GaussianBlur(8))
    healed.paste(sub, (x0 - 10, y0 - 10))
    return healed


def frame_to_5x4_top_sky(src_img: Image.Image) -> Image.Image:
    """Fit full width of src_img into 1250x1000 (5:4) anchored to the bottom edge
    (pad_bot = 0) and seamlessly extend the dark studio backdrop upward."""
    src_img = src_img.convert("RGB")
    target_w = OUT_W
    scaled_h = round(src_img.height * (target_w / src_img.width))
    resized = src_img.resize((target_w, scaled_h), Image.LANCZOS)

    if scaled_h >= OUT_H:
        top_crop = (scaled_h - OUT_H) // 2
        return resized.crop((0, top_crop, OUT_W, top_crop + OUT_H))

    pad_top = OUT_H - scaled_h
    arr = np.array(resized).astype(np.float32)
    canvas = np.zeros((OUT_H, OUT_W, 3), dtype=np.float32)
    canvas[pad_top:] = arr

    # Smooth horizontal profile from the top 8 rows of the image
    top_profile = np.mean(arr[:8, :, :], axis=0, keepdims=True)  # (1, W, 3)
    # Smooth it horizontally so any tiny highlight doesn't streak upward
    top_pil = Image.fromarray(np.clip(np.repeat(top_profile, 20, axis=0), 0, 255).astype(np.uint8))
    top_smooth = np.array(top_pil.filter(ImageFilter.GaussianBlur(18))).astype(np.float32)[10:11]

    for y in range(pad_top):
        t = y / max(pad_top, 1)  # 0 at top -> 1 at seam
        decay = 0.78 + 0.22 * (t ** 1.2)
        canvas[y] = top_smooth[0] * decay

    # Cross-fade the 14 rows below the seam so there is zero visible join
    blend_rows = 14
    for dy in range(blend_rows):
        alpha = dy / blend_rows
        y = pad_top + dy
        canvas[y] = top_smooth[0] * (1 - alpha) + arr[dy] * alpha

    return Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))


def save_pair(img: Image.Image, stem: str):
    webp_path = os.path.join(ROOT, f"assets/img/{stem}.webp")
    jpg_path = os.path.join(ROOT, f"assets/img/{stem}.jpg")
    img.save(webp_path, "WEBP", quality=88, method=6)
    img.save(jpg_path, "JPEG", quality=86, optimize=True, progressive=True)
    print(
        f"{stem}: WebP {os.path.getsize(webp_path)/1024:.1f} KB | "
        f"JPG {os.path.getsize(jpg_path)/1024:.1f} KB"
    )


def main():
    theros_src = Image.open(os.path.join(ROOT, "assets/img/theros_brand_page_withlogo_crop.jpg"))
    theros_clean = remove_theros_topleft_logo(theros_src)
    save_pair(frame_to_5x4_top_sky(theros_clean), "collection-theros")

    pacific_src = Image.open(os.path.join(ROOT, "assets/img/pacific_brand_scene_raw.jpg"))
    save_pair(frame_to_5x4_top_sky(pacific_src), "collection-pacific")

    eurogas_src = Image.open(os.path.join(ROOT, "assets/img/eurogas_brand_scene_raw.jpg"))
    save_pair(frame_to_5x4_top_sky(eurogas_src), "collection-eurogas")

    fridge_src = Image.open(os.path.join(BRAIN, "collection_refrigerator_raw_1792283726810.jpg"))
    save_pair(frame_to_5x4_top_sky(fridge_src), "collection-refrigerator")

    tv_src = Image.open(os.path.join(BRAIN, "collection_smart_tv_raw_1792283736937.jpg"))
    save_pair(frame_to_5x4_top_sky(tv_src), "collection-smart-tv")


if __name__ == "__main__":
    main()
