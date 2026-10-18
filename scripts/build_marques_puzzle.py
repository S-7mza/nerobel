"""
Build the 4-part synchronized puzzle panorama for the 'Nos marques' (#marques)
4-column section on index.html:
  1. brand-puzzle-theros.{webp,jpg}   (Panel 01/04: Theros Pro-Slim in luxury dark marble spa)
  2. brand-puzzle-pacific.{webp,jpg}  (Panel 02/04: Pacific Horizon in hydro-comfort suite)
  3. brand-puzzle-eurogas.{webp,jpg}  (Panel 03/04: Eurogas Master Flame in gourmet dark kitchen)
  4. brand-puzzle-nerobel.{webp,jpg}  (Panel 04/04: Nerobel Multi-Door Fridge, AC & 65" OLED TV)

All 4 panels are assembled on a single 5000x1000 master canvas (4 x 1250x1000) with:
  - Harmonized architectural wall/counter transitions across seams x=1250, 2500, 3750
  - Sub-pixel anti-aliased continuous glowing cyan & champagne-gold Smart Habitat energy wave
  - Smooth glassmorphic interlocking jigsaw puzzle tabs & split connector rings at each seam
  - Clean top-left zones for the HTML .brand-card-badge overlay
"""
import math
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(r"c:\Users\7mza\nerobel")
BRAIN = Path(r"C:\Users\7mza\.gemini\antigravity\brain\2ec6ba29-a90c-451c-885b-fcdae000d81b")
OUT_DIR = ROOT / "assets" / "img"

PANEL_W = 1250
PANEL_H = 1000
MASTER_W = PANEL_W * 4
MASTER_H = PANEL_H

SCENES = [
    BRAIN / "puzzle_scene_1_theros_1792284622073.jpg",
    BRAIN / "puzzle_scene_2_pacific_1792284630725.jpg",
    BRAIN / "puzzle_scene_3_eurogas_1792284640944.jpg",
    BRAIN / "puzzle_scene_4_nerobel_1792284650640.jpg",
]


def crop_to_panel(img: Image.Image, y_bias: float = 0.5) -> Image.Image:
    """Crop/resize a 4:3 (1200x896) image to 1250x1000 (5:4)."""
    target_ratio = PANEL_W / PANEL_H  # 1.25
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


def clean_theros_wall_stencil(panel1: Image.Image) -> Image.Image:
    """Remove the dark baked-in THEROS stencil on the top-right marble of Panel 1."""
    arr = np.array(panel1).astype(np.float32)
    y0, y1 = 62, 162
    x0, x1 = 860, 1158
    w_box = x1 - x0
    src_patch = arr[y0:y1, x0 - w_box:x0].copy()[:, ::-1, :]

    mask = np.zeros((y1 - y0, w_box), dtype=np.float32)
    mask[10:-10, 10:-10] = 1.0
    mask_img = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=9))
    alpha = (np.array(mask_img).astype(np.float32) / 255.0)[..., None]

    arr[y0:y1, x0:x1] = arr[y0:y1, x0:x1] * (1.0 - alpha) + src_patch * alpha
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def refine_eurogas_heater_badge(panel3: Image.Image) -> Image.Image:
    """Replace the tiny AI-garbled nameplate on the Eurogas heater with a crisp brushed-silver EUROGAS badge."""
    # Badge sits around x=825..879, y=296..316 on the 1250x1000 Panel 3
    scale = 4
    bw, bh = 56 * scale, 20 * scale
    badge = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(badge)
    d.rounded_rectangle(
        [0, 0, bw - 1, bh - 1],
        radius=4 * scale,
        fill=(198, 204, 210, 255),
        outline=(110, 116, 124, 255),
        width=scale,
    )
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 11 * scale)
    except Exception:
        font = ImageFont.load_default()
    txt = "EUROGAS"
    bbox = d.textbbox((0, 0), txt, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((bw - tw) // 2, (bh - th) // 2 - scale), txt, font=font, fill=(28, 32, 38, 255))
    badge_small = badge.resize((56, 20), Image.Resampling.LANCZOS)

    out = panel3.convert("RGBA")
    out.alpha_composite(badge_small, (824, 296))
    return out.convert("RGB")


def harmonize_seam(master_arr: np.ndarray, seam_x: int, band_w: int = 95) -> None:
    """Subtly harmonize luminance & color warmth across each vertical panel boundary."""
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


def draw_continuous_puzzle_overlay(master: Image.Image) -> Image.Image:
    """
    Render a sub-pixel anti-aliased continuous Smart Habitat Energy Wave,
    smooth interlocking jigsaw puzzle tabs at each seam, and architectural sequence bar.
    """
    arr = np.array(master).astype(np.float32)
    yy_p, xx_p = np.mgrid[0:PANEL_H, 0:PANEL_W]
    tl_dist = np.sqrt((xx_p / 340.0) ** 2 + (yy_p / 160.0) ** 2)
    tl_mask = np.clip(1.0 - tl_dist, 0.0, 1.0) ** 1.6
    bot_mask = np.clip((yy_p - 860.0) / 140.0, 0.0, 1.0) ** 1.4

    for i in range(4):
        x0 = i * PANEL_W
        panel_slice = arr[:, x0:x0 + PANEL_W, :]
        panel_slice *= (1.0 - 0.42 * tl_mask[..., None])
        panel_slice *= (1.0 - 0.55 * bot_mask[..., None])
        arr[:, x0:x0 + PANEL_W, :] = panel_slice

    # 1. Sub-pixel anti-aliased continuous Smart Habitat Energy Waves (y around 790..875)
    y_band0, y_band1 = 770, 900
    yy, xx = np.mgrid[y_band0:y_band1, 0:MASTER_W].astype(np.float32)

    wy1 = (
        836.0
        + 22.0 * np.sin(2.0 * np.pi * xx / 1650.0 - 0.4)
        + 9.0 * np.cos(2.0 * np.pi * xx / 825.0 + 0.7)
    )
    wy2 = (
        845.0
        + 17.0 * np.sin(2.0 * np.pi * xx / 1650.0 + 0.35)
        - 8.0 * np.sin(2.0 * np.pi * xx / 950.0)
    )

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

    # 2. Supersampled (2x) Interlocking Jigsaw Puzzle Tabs & Split Seam Medallions
    # We render the seam overlays at 2x resolution on local seam strips (width 240px around each seam)
    # for 100% silky-smooth anti-aliased curves!
    master_rgba = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")

    seam_xs = [1250, 2500, 3750]
    tab_centers_y = [465, 515, 465]

    for seam_x, cy in zip(seam_xs, tab_centers_y):
        strip_half_w = 110
        sx0 = seam_x - strip_half_w
        sw = strip_half_w * 2
        sh = PANEL_H
        scale = 3  # 3x supersampling for ultra-crisp vector quality

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

        # Left card's outgoing puzzle tab near its right edge (offset -50px from seam, protruding +40px right)
        pts_left = make_jigsaw_curve(strip_half_w - 50.0, +40.0, cy)
        # Right card's matching incoming puzzle socket near its left edge (offset +10px from seam, protruding +40px right)
        pts_right = make_jigsaw_curve(strip_half_w + 10.0, +40.0, cy)

        for pts in (pts_left, pts_right):
            dg.line(pts, fill=(0, 212, 255, 115), width=6 * scale)
            ds.line(pts, fill=(235, 200, 95, 210), width=2 * scale)

        # Horizontal alignment bridges linking the puzzle tab to the matching socket across the seam
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

        # Split puzzle-lock medallion centered on the seam at `cy`
        r_lock = 20 * scale
        cy_s = cy * scale
        dg.ellipse([cx_local - r_lock, cy_s - r_lock, cx_local + r_lock, cy_s + r_lock], outline=(0, 212, 255, 160), width=5 * scale)
        ds.ellipse([cx_local - r_lock, cy_s - r_lock, cx_local + r_lock, cy_s + r_lock], outline=(248, 224, 142, 235), width=2 * scale)
        ds.ellipse([cx_local - 5 * scale, cy_s - 5 * scale, cx_local + 5 * scale, cy_s + 5 * scale], fill=(0, 212, 255, 250))

        # Split wave nexus medallion right where the continuous energy wave crosses the seam
        wy_seam = (
            836.0
            + 22.0 * math.sin(2.0 * math.pi * seam_x / 1650.0 - 0.4)
            + 9.0 * math.cos(2.0 * math.pi * seam_x / 825.0 + 0.7)
        )
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

    # 3. Continuous bottom architectural sequence ruler & panel badges
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
        ("01 / 04", "THEROS · PRO-SLIM SMART"),
        ("02 / 04", "PACIFIC · HORIZON 75°C"),
        ("03 / 04", "EUROGAS™ · MASTER FLAME"),
        ("04 / 04", "NEROBEL · CONSUMER TECH"),
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
        if idx == 0:
            panel = clean_theros_wall_stencil(panel)
        elif idx == 2:
            panel = refine_eurogas_heater_badge(panel)
        panel = ImageEnhance.Contrast(panel).enhance(1.05)
        panel = ImageEnhance.Sharpness(panel).enhance(1.08)
        panels.append(panel)

    master = Image.new("RGB", (MASTER_W, MASTER_H))
    for idx, panel in enumerate(panels):
        master.paste(panel, (idx * PANEL_W, 0))

    master_arr = np.array(master).astype(np.float32)
    for seam_x in (1250, 2500, 3750):
        harmonize_seam(master_arr, seam_x, band_w=95)
    master = Image.fromarray(np.clip(master_arr, 0, 255).astype(np.uint8))

    master = draw_continuous_puzzle_overlay(master)

    master_preview = BRAIN / "marques_puzzle_master_panorama.jpg"
    master.resize((2500, 500), Image.Resampling.LANCZOS).save(master_preview, "JPEG", quality=93)
    print(f"Saved master panorama preview: {master_preview}")

    slugs = [
        "brand-puzzle-theros",
        "brand-puzzle-pacific",
        "brand-puzzle-eurogas",
        "brand-puzzle-nerobel",
    ]
    for idx, slug in enumerate(slugs):
        x0 = idx * PANEL_W
        card_img = master.crop((x0, 0, x0 + PANEL_W, PANEL_H))
        webp_path = OUT_DIR / f"{slug}.webp"
        jpg_path = OUT_DIR / f"{slug}.jpg"
        card_img.save(webp_path, "WEBP", quality=92, method=6)
        card_img.save(jpg_path, "JPEG", quality=93, optimize=True)
        print(f"Saved {webp_path.name} ({webp_path.stat().st_size // 1024} KB) & {jpg_path.name}")


if __name__ == "__main__":
    main()
