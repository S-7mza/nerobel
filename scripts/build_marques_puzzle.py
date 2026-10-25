"""
Build the 2-part synchronized puzzle panorama for the 'Nos marques' (#marques)
2-column section on index.html:
  1. brand-puzzle-theros.{webp,jpg}   (Panel 01/02: Theros Pro-Slim in luxury dark marble spa)
  2. brand-puzzle-eurogas.{webp,jpg}  (Panel 02/02: Eurogas Master Flame in high-standing Moroccan utility balcony)

Both panels are assembled on a single 2500x1000 master canvas (2 x 1250x1000) with:
  - Moroccan residential high-standing balcony setting with natural ventilation
  - Proportionate vertical plumbing connections (~20cm) with brass shutoff valves
  - Stainless steel exhaust chimney flue venting into ceiling soffit
  - Seamless wood-to-wood architectural transition across seam x=1250
  - Sub-pixel anti-aliased continuous glowing cyan & champagne-gold Smart Habitat energy wave
  - Smooth glassmorphic interlocking jigsaw puzzle tab & split connector rings at seam x=1250
  - Clean outer boundaries with no orphan/phantom seam artifacts
  - Clean top-left zones for the HTML .brand-card-badge overlay
  - Updated 01/02 and 02/02 sequence markers
"""
import math
from pathlib import Path
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(r"c:\Users\7mza\nerobel")
OUT_DIR = ROOT / "assets" / "img"

PANEL_W = 1250
PANEL_H = 1000
MASTER_W = PANEL_W * 2
MASTER_H = PANEL_H

SCENES = [
    OUT_DIR / "theros-scene-spa-suite.jpg",
    OUT_DIR / "eurogas-scene-morocco-balcony.jpg",
]


def crop_to_panel(img: Image.Image, y_bias: float = 0.5) -> Image.Image:
    """Crop/resize image to exactly 1250x1000 (5:4 aspect ratio)."""
    target_ratio = PANEL_W / PANEL_H
    w, h = img.size
    cur_ratio = w / h
    if cur_ratio > target_ratio:
        new_w = int(round(h * target_ratio))
        x0 = (w - new_w) // 2
        cropped = img.crop((x0, 0, x0 + new_w, h))
    else:
        new_h = int(round(w / target_ratio))
        y0 = int(round((h - new_h) * y_bias))
        cropped = img.crop((0, y0, w, y0 + new_h))
    return cropped.resize((PANEL_W, PANEL_H), Image.Resampling.LANCZOS)


def refine_eurogas_badge(panel_eurogas: Image.Image) -> Image.Image:
    """Seamlessly composite the authentic factory Eurogas embossed metallic plate onto the heater."""
    ref_path = ROOT / "assets" / "img" / "collection-eurogas.jpg"
    if not ref_path.exists():
        return panel_eurogas

    c_img = Image.open(ref_path).convert("RGB")
    plate_ref = c_img.crop((855, 338, 950, 378))
    straight_plate = plate_ref.rotate(-4.5, resample=Image.Resampling.BICUBIC, expand=True)

    arr = np.array(straight_plate)
    lum = arr[..., :3].mean(axis=2)
    mask = lum > 75
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    cropped_plate = straight_plate.crop((cols[0], rows[0], cols[-1] + 1, rows[-1] + 1))

    target_w, target_h = 42, 16
    scaled = cropped_plate.resize((target_w, target_h), Image.Resampling.LANCZOS)
    scaled_arr = np.array(scaled).astype(np.float32)

    # Ambient tone & warmth calibration to match the balcony slate lighting
    scaled_arr[..., 0] = np.clip(scaled_arr[..., 0] * 0.98 + 2, 0, 255)
    scaled_arr[..., 1] = np.clip(scaled_arr[..., 1] * 0.96 + 1, 0, 255)
    scaled_arr[..., 2] = np.clip(scaled_arr[..., 2] * 0.91 - 1, 0, 255)
    scaled_warm = Image.fromarray(scaled_arr.astype(np.uint8))

    alpha = Image.new("L", (target_w, target_h), 0)
    d = ImageDraw.Draw(alpha)
    d.rounded_rectangle([1, 1, target_w - 2, target_h - 2], radius=3, fill=255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=0.7))

    px0 = int(round(526.5 - target_w / 2))
    py0 = int(round(279.0 - target_h / 2))

    out = panel_eurogas.copy()
    out.paste(scaled_warm, (px0, py0), mask=alpha)
    return out


def harmonize_seam(master_arr: np.ndarray, seam_x: int = 1250, band_w: int = 95) -> None:
    """Subtly harmonize luminance & color warmth across the vertical boundary between Theros and Eurogas."""
    left_strip = master_arr[:, seam_x - 24:seam_x, :]
    right_strip = master_arr[:, seam_x:seam_x + 24, :]
    left_mean = left_strip.mean(axis=1, keepdims=True)
    right_mean = right_strip.mean(axis=1, keepdims=True)
    target_mean = 0.5 * (left_mean + right_mean)

    kernel_size = 41
    pad = kernel_size // 2
    for side, x_start, x_end, src_mean in [
        ("left", seam_x - band_w, seam_x, left_mean),
        ("right", seam_x, seam_x + band_w, right_mean),
    ]:
        delta = target_mean - src_mean
        padded = np.pad(delta, ((pad, pad), (0, 0), (0, 0)), mode="edge")
        smoothed_delta = np.zeros_like(delta)
        for k in range(kernel_size):
            smoothed_delta += padded[k:k + PANEL_H]
        smoothed_delta /= kernel_size

        xs = np.arange(x_start, x_end, dtype=np.float32)
        t = (xs - x_start) / float(band_w) if side == "left" else 1.0 - (xs - x_start) / float(band_w)
        weight = (0.5 - 0.5 * np.cos(np.pi * t))[None, :, None] * 0.55
        master_arr[:, x_start:x_end, :] = np.clip(
            master_arr[:, x_start:x_end, :] + smoothed_delta * weight, 0, 255
        )


def get_wave_y(x: np.ndarray | float):
    """Continuous Smart Habitat Energy Wave path across the 2500px master canvas."""
    wy1 = (
        835.0
        + 24.0 * np.sin(2.0 * np.pi * x / 1800.0 - 0.4)
        + 8.0 * np.cos(2.0 * np.pi * x / 900.0 + 0.6)
    )
    wy2 = (
        844.0
        + 18.0 * np.sin(2.0 * np.pi * x / 1800.0 + 0.35)
        - 7.0 * np.sin(2.0 * np.pi * x / 900.0)
    )
    return wy1, wy2


def draw_continuous_puzzle_overlay(master: Image.Image) -> Image.Image:
    """
    Render a sub-pixel anti-aliased continuous Smart Habitat Energy Wave across both cards,
    a single synchronized interlocking jigsaw tab and split medallions at seam x=1250,
    and updated sequence ruler.
    """
    arr = np.array(master).astype(np.float32)
    yy_p, xx_p = np.mgrid[0:PANEL_H, 0:PANEL_W]
    tl_dist = np.sqrt((xx_p / 340.0) ** 2 + (yy_p / 160.0) ** 2)
    tl_mask = np.clip(1.0 - tl_dist, 0.0, 1.0) ** 1.6
    bot_mask = np.clip((yy_p - 860.0) / 140.0, 0.0, 1.0) ** 1.4

    for i in range(2):
        x0 = i * PANEL_W
        panel_slice = arr[:, x0:x0 + PANEL_W, :]
        panel_slice *= (1.0 - 0.42 * tl_mask[..., None])
        panel_slice *= (1.0 - 0.55 * bot_mask[..., None])
        arr[:, x0:x0 + PANEL_W, :] = panel_slice

    # 1. Sub-pixel continuous Smart Habitat Energy Waves (y around 770..900)
    y_band0, y_band1 = 770, 900
    yy, xx = np.mgrid[y_band0:y_band1, 0:MASTER_W].astype(np.float32)
    wy1, wy2 = get_wave_y(xx)

    d1 = np.abs(yy - wy1)
    d2 = np.abs(yy - wy2)

    # Smooth ambient glow + razor-sharp anti-aliased core for both waves
    cyan_glow = np.exp(-(d1 / 9.5) ** 2) * 0.55
    cyan_core = np.clip(1.6 - d1, 0.0, 1.0) * 0.92

    gold_glow = np.exp(-(d2 / 8.0) ** 2) * 0.48
    gold_core = np.clip(1.5 - d2, 0.0, 1.0) * 0.85

    band = arr[y_band0:y_band1, :, :]
    cyan_rgb_glow = np.array([0.0, 195.0, 255.0], dtype=np.float32)
    cyan_rgb_core = np.array([185.0, 246.0, 255.0], dtype=np.float32)
    gold_rgb_glow = np.array([212.0, 168.0, 52.0], dtype=np.float32)
    gold_rgb_core = np.array([252.0, 232.0, 162.0], dtype=np.float32)

    band = band * (1.0 - cyan_glow[..., None] * 0.6) + cyan_rgb_glow * cyan_glow[..., None]
    band = band * (1.0 - gold_glow[..., None] * 0.55) + gold_rgb_glow * gold_glow[..., None]
    band = band * (1.0 - cyan_core[..., None]) + cyan_rgb_core * cyan_core[..., None]
    band = band * (1.0 - gold_core[..., None]) + gold_rgb_core * gold_core[..., None]
    arr[y_band0:y_band1, :, :] = np.clip(band, 0, 255)

    # 2. Supersampled (3x) Interlocking Jigsaw Puzzle Tab & Split Seam Medallion at seam_x = 1250 ONLY
    master_rgba = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")

    seam_x = 1250
    cy = 480
    strip_half_w = 110
    sx0 = seam_x - strip_half_w
    sw = strip_half_w * 2
    sh = PANEL_H
    scale = 3

    hi_glow = Image.new("RGBA", (sw * scale, sh * scale), (0, 0, 0, 0))
    hi_sharp = Image.new("RGBA", (sw * scale, sh * scale), (0, 0, 0, 0))
    dg = ImageDraw.Draw(hi_glow)
    ds = ImageDraw.Draw(hi_sharp)
    cx_local = strip_half_w * scale

    def make_jigsaw_curve(base_x_px: float, protrude_px: float, tab_cy_px: float) -> list[tuple[float, float]]:
        pts = []
        neck_half = 42.0
        pts.append((base_x_px * scale, 70.0 * scale))
        pts.append((base_x_px * scale, (tab_cy_px - 68.0) * scale))
        for step in range(161):
            u = (step / 160.0) * 2.0 - 1.0
            reach = math.exp(-((u * 1.4) ** 2)) * protrude_px
            pinch = math.sin(u * math.pi) * 10.0
            px = (base_x_px + reach) * scale
            py = (tab_cy_px + u * neck_half + pinch * 0.55) * scale
            pts.append((px, py))
        pts.append((base_x_px * scale, (tab_cy_px + 68.0) * scale))
        pts.append((base_x_px * scale, 910.0 * scale))
        return pts

    # Left card (Theros): outgoing puzzle tab near right edge
    pts_left = make_jigsaw_curve(strip_half_w - 50.0, +40.0, cy)
    # Right card (Eurogas): matching incoming puzzle socket near left edge
    pts_right = make_jigsaw_curve(strip_half_w + 10.0, +40.0, cy)

    for pts in (pts_left, pts_right):
        dg.line(pts, fill=(0, 212, 255, 115), width=6 * scale)
        ds.line(pts, fill=(235, 200, 95, 210), width=2 * scale)

    # Horizontal alignment bridges linking the puzzle tab to the matching socket across seam
    for by in (cy - 46, cy, cy + 46):
        dg.line(
            [((strip_half_w - 50) * scale, by * scale), ((strip_half_w + 50) * scale, by * scale)],
            fill=(0, 212, 255, 110),
            width=4 * scale,
        )
        ds.line(
            [((strip_half_w - 50) * scale, by * scale), ((strip_half_w + 50) * scale, by * scale)],
            fill=(185, 242, 255, 195),
            width=scale,
        )

    # Split puzzle-lock medallion centered on seam x=1250 at cy=480
    r_lock = 20 * scale
    cy_s = cy * scale
    dg.ellipse([cx_local - r_lock, cy_s - r_lock, cx_local + r_lock, cy_s + r_lock], outline=(0, 212, 255, 160), width=5 * scale)
    ds.ellipse([cx_local - r_lock, cy_s - r_lock, cx_local + r_lock, cy_s + r_lock], outline=(248, 224, 142, 235), width=2 * scale)
    ds.ellipse([cx_local - 5 * scale, cy_s - 5 * scale, cx_local + 5 * scale, cy_s + 5 * scale], fill=(0, 212, 255, 250))

    # Split wave nexus medallion centered right where the continuous energy wave crosses seam x=1250
    wy_seam, _ = get_wave_y(seam_x)
    wy_s = wy_seam * scale
    for r_u, col_g, col_s in [
        (30 * scale, (0, 212, 255, 110), (0, 212, 255, 175)),
        (17 * scale, (212, 175, 55, 140), (248, 224, 142, 225)),
    ]:
        dg.ellipse([cx_local - r_u, wy_s - r_u, cx_local + r_u, wy_s + r_u], outline=col_g, width=4 * scale)
        ds.ellipse([cx_local - r_u, wy_s - r_u, cx_local + r_u, wy_s + r_u], outline=col_s, width=2 * scale)
    ds.ellipse([cx_local - 5 * scale, wy_s - 5 * scale, cx_local + 5 * scale, wy_s + 5 * scale], fill=(255, 255, 255, 245))

    hi_glow_blur = hi_glow.filter(ImageFilter.GaussianBlur(radius=6 * scale))
    hi_comp = Image.alpha_composite(hi_glow_blur, hi_sharp)
    lo_comp = hi_comp.resize((sw, sh), Image.Resampling.LANCZOS)
    master_rgba.alpha_composite(lo_comp, (sx0, 0))

    # 3. Continuous bottom architectural sequence ruler & 2 panel badges
    ui_layer = Image.new("RGBA", (MASTER_W, MASTER_H), (0, 0, 0, 0))
    du = ImageDraw.Draw(ui_layer)
    ruler_y = 952
    du.line([(40, ruler_y), (MASTER_W - 40, ruler_y)], fill=(212, 175, 55, 165), width=1)
    for tx in range(50, MASTER_W - 40, 125):
        th = 7 if (tx % 250 == 0) else 4
        du.line([(tx, ruler_y - th), (tx, ruler_y + th)], fill=(212, 175, 55, 175), width=1)

    try:
        font_seq = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 21)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 17)
    except Exception:
        font_seq = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    labels = [
        ("01 / 02", "THEROS · CONFORT THERMIQUE & UNIVERS BAIN"),
        ("02 / 02", "EUROGAS™ · SYSTÈMES GAZ & CHAUDIÈRES"),
    ]
    for idx, (num_txt, brand_txt) in enumerate(labels):
        px0 = idx * PANEL_W
        pill_x0 = px0 + 64
        pill_y0 = 906
        pill_x1 = px0 + PANEL_W - 64
        pill_y1 = 943
        du.rounded_rectangle(
            [pill_x0, pill_y0, pill_x1, pill_y1],
            radius=6,
            fill=(8, 11, 16, 185),
            outline=(212, 175, 55, 120),
            width=1,
        )
        du.text((pill_x0 + 16, pill_y0 + 7), num_txt, font=font_seq, fill=(0, 212, 255, 245))
        du.text((pill_x0 + 108, pill_y0 + 9), brand_txt, font=font_sub, fill=(240, 244, 248, 235))

    out = Image.alpha_composite(master_rgba, ui_layer)
    return out.convert("RGB")


def main() -> None:
    panels = []
    for idx, path in enumerate(SCENES):
        img = Image.open(path).convert("RGB")
        panel = crop_to_panel(img, y_bias=0.5)
        if idx == 1:
            panel = refine_eurogas_badge(panel)
        panel = ImageEnhance.Contrast(panel).enhance(1.05)
        panel = ImageEnhance.Sharpness(panel).enhance(1.08)
        panels.append(panel)

    master = Image.new("RGB", (MASTER_W, MASTER_H))
    master.paste(panels[0], (0, 0))
    master.paste(panels[1], (PANEL_W, 0))

    master_arr = np.array(master).astype(np.float32)
    harmonize_seam(master_arr, seam_x=1250, band_w=95)
    master = Image.fromarray(np.clip(master_arr, 0, 255).astype(np.uint8))

    master = draw_continuous_puzzle_overlay(master)

    slugs = [
        "brand-puzzle-theros",
        "brand-puzzle-eurogas",
    ]
    for idx, slug in enumerate(slugs):
        x0 = idx * PANEL_W
        card_img = master.crop((x0, 0, x0 + PANEL_W, PANEL_H))
        webp_path = OUT_DIR / f"{slug}.webp"
        jpg_path = OUT_DIR / f"{slug}.jpg"
        card_img.save(webp_path, "WEBP", quality=92, method=6)
        card_img.save(jpg_path, "JPEG", quality=93, optimize=True)
        print(f"Saved {webp_path.name} ({webp_path.stat().st_size // 1024} KB) & {jpg_path.name}")

        # Mirror to dist and nerobel_prod_ftp
        for alt_root in (ROOT / "dist" / "assets" / "img", ROOT / "nerobel_prod_ftp" / "assets" / "img"):
            if alt_root.exists():
                shutil.copy2(webp_path, alt_root / webp_path.name)
                shutil.copy2(jpg_path, alt_root / jpg_path.name)
                print(f"  -> Mirrored to {alt_root.parent.name}/{alt_root.name}")


if __name__ == "__main__":
    main()
