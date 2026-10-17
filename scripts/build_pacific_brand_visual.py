"""Build the Pacific brand key-visual, synced with theros_brand_page_withlogo_crop.

Art direction mirrors the Theros visual 1:1:
  * same navy studio backdrop, same 3:2 frame (1800x1200), product hero on the right
  * feature storytelling element centre-left (Theros: phone + Wi-Fi waves,
    Pacific: horizontal unit + blue 90deg rotation arc = multi-position)
  * official white brand logo top-left at the same visual weight/position,
    with a light subtitle underneath (matching "Comfort Provider" on Theros)

Output: assets/img/pacific_brand_page_withlogo.{jpg,webp}
"""
import os
import re
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCENE = os.path.join(ROOT, "assets/img/pacific_brand_scene_raw.jpg")
LOGO_SVG = os.path.join(ROOT, "assets/icons/pacific-logo-white.svg")
LOGO_PNG = os.path.join(ROOT, "assets/img/_pacific_logo_render.png")
OUT_JPG = os.path.join(ROOT, "assets/img/pacific_brand_page_withlogo.jpg")
OUT_WEBP = os.path.join(ROOT, "assets/img/pacific_brand_page_withlogo.webp")

OUT_W, OUT_H = 1800, 1200          # exact same output size as the Theros crop
LOGO_X, LOGO_Y = 82, 62
LOGO_W = 420
TAGLINE = "Multi-Position Comfort"
FONT = r"C:\Windows\Fonts\segoeuisl.ttf"


def render_logo(width_px: int) -> Image.Image:
    """Rasterise the official SVG inline at 3x then downsample for crisp edges."""
    with open(LOGO_SVG, "r", encoding="utf-8") as f:
        svg_raw = f.read()
    target_w = width_px * 3
    svg_sized = re.sub(
        r"<svg\b([^>]*)>",
        f'<svg\\1 style="width:{target_w}px;height:auto;display:block;">',
        svg_raw,
        count=1,
    )
    html = (
        "<!DOCTYPE html><html><body style='margin:0;padding:20px;background:transparent;display:inline-block;'>"
        f"<div id='wrap' style='display:inline-block;'>{svg_sized}</div>"
        "</body></html>"
    )
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": target_w + 100, "height": target_w})
        pg.set_content(html)
        pg.wait_for_timeout(200)
        pg.query_selector("#wrap").screenshot(path=LOGO_PNG, omit_background=True)
        b.close()
    logo = Image.open(LOGO_PNG).convert("RGBA")
    os.remove(LOGO_PNG)
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    h = round(logo.height * width_px / logo.width)
    return logo.resize((width_px, h), Image.LANCZOS)


def main():
    scene = Image.open(SCENE).convert("RGB")
    scale = max(OUT_W / scene.width, OUT_H / scene.height)
    scene = scene.resize((round(scene.width * scale), round(scene.height * scale)), Image.LANCZOS)
    left = (scene.width - OUT_W) // 2
    top = (scene.height - OUT_H) // 2
    canvas = scene.crop((left, top, left + OUT_W, top + OUT_H)).convert("RGBA")

    logo = render_logo(LOGO_W)
    print(f"Rendered Pacific vector logo: {logo.size}")

    font = ImageFont.truetype(FONT, 34)
    tag_x = LOGO_X + 105  # aligned with the 'P' of Pacific
    tag_y = LOGO_Y + logo.height + 6

    # Soft dark ambient glow behind logo for contrast
    halo = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    halo.paste((0, 0, 0, 150), (LOGO_X, LOGO_Y), logo.split()[-1])
    halo = halo.filter(ImageFilter.GaussianBlur(14))
    canvas = Image.alpha_composite(canvas, halo)

    canvas.alpha_composite(logo, (LOGO_X, LOGO_Y))
    d = ImageDraw.Draw(canvas)
    d.text((tag_x, tag_y), TAGLINE, font=font, fill=(226, 234, 245, 235))

    out = canvas.convert("RGB")
    out.save(OUT_WEBP, "WEBP", quality=88, method=6)
    out.save(OUT_JPG, "JPEG", quality=86, optimize=True, progressive=True)
    for f in (OUT_WEBP, OUT_JPG):
        print(f"Created {os.path.relpath(f, ROOT)}: {os.path.getsize(f) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
