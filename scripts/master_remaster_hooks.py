import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from playwright.sync_api import sync_playwright

def render_svg_to_png(svg_path, out_path, width, height, fill_color, drop_shadow=None):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': width, 'height': height})
        
        with open(svg_path, 'r', encoding='utf-8') as f:
            svg_content = f.read()
            
        # Replace fill color if requested
        if fill_color:
            # Replace fill="#FFFFFF" or fill="#007367"
            import re
            svg_content = re.sub(r'fill="[^"]+"', f'fill="{fill_color}"', svg_content)
            
        shadow_style = f"filter: {drop_shadow};" if drop_shadow else ""
        html = f"""<!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background:transparent; display:flex; align-items:center; justify-content:center; width:{width}px; height:{height}px;">
          <div style="width:90%; height:auto; {shadow_style}">
            {svg_content}
          </div>
        </body>
        </html>"""
        page.set_content(html)
        page.screenshot(path=out_path, omit_background=True)
        browser.close()

def overlay_transparent(background, overlay, x, y, scale=1.0, angle=0.0, opacity=1.0):
    """Overlay a transparent RGBA image onto a BGR background at (x, y)."""
    h_bg, w_bg, _ = background.shape
    h_ov, w_ov, c_ov = overlay.shape
    
    if scale != 1.0:
        new_w = int(w_ov * scale)
        new_h = int(h_ov * scale)
        overlay = cv2.resize(overlay, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
        h_ov, w_ov, _ = overlay.shape
        
    if angle != 0.0:
        M = cv2.getRotationMatrix2D((w_ov / 2, h_ov / 2), angle, 1.0)
        overlay = cv2.warpAffine(overlay, M, (w_ov, h_ov), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))

    # Bounding box
    x1, y1 = max(0, x), max(0, y)
    x2, y2 = min(w_bg, x + w_ov), min(h_bg, y + h_ov)
    
    ov_x1 = x1 - x
    ov_y1 = y1 - y
    ov_x2 = ov_x1 + (x2 - x1)
    ov_y2 = ov_y1 + (y2 - y1)
    
    if x2 <= x1 or y2 <= y1:
        return background

    overlay_crop = overlay[ov_y1:ov_y2, ov_x1:ov_x2]
    alpha = (overlay_crop[:, :, 3] / 255.0) * opacity
    alpha = np.repeat(alpha[:, :, np.newaxis], 3, axis=2)
    
    bg_crop = background[y1:y2, x1:x2].astype(np.float32)
    ov_rgb = overlay_crop[:, :, :3].astype(np.float32)
    
    blended = ov_rgb * alpha + bg_crop * (1.0 - alpha)
    background[y1:y2, x1:x2] = np.clip(blended, 0, 255).astype(np.uint8)
    return background

def enhance_clarity_and_details(bgr_img):
    """Advanced unsharp mask and contrast curve on luminance channel."""
    lab = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # CLAHE for rich micro-contrast in stone and wood
    clahe = cv2.createCLAHE(clipLimit=1.6, tileGridSize=(16, 16))
    l_enhanced = clahe.apply(l)
    
    # High-frequency unsharp mask on luminance
    l_blur = cv2.GaussianBlur(l_enhanced, (0, 0), sigmaX=2.0)
    l_sharp = cv2.addWeighted(l_enhanced, 1.45, l_blur, -0.45, 0)
    
    merged = cv2.merge([l_sharp, a, b])
    return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)

def enforce_chiaroscuro_mask(bgr_img, target_w=1920, target_h=1080):
    """Enforces 100% pitch black #000000 on the left 40% with smooth Hermite blend."""
    arr = bgr_img.astype(np.float32)
    w = target_w
    h = target_h
    x_solid = int(w * 0.40)  # ~768px pure #000000
    x_blend = int(w * 0.54)  # ~1036px smooth transition

    mask = np.ones((h, w), dtype=np.float32)
    mask[:, :x_solid] = 0.0
    for x in range(x_solid, x_blend):
        t = (x - x_solid) / (x_blend - x_solid)
        mask[:, x] = t * t * (3.0 - 2.0 * t)  # Smooth cubic Hermite

    for c in range(3):
        arr[:, :, c] = arr[:, :, c] * mask

    return np.clip(arr, 0, 255).astype(np.uint8)

print("Master remaster library ready.")
