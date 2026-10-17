"""
Script to ingest, crop, optimize, and enforce 100% solid pitch-black chiaroscuro
for any new Imagen 3 Living Room render matching the theros-hero-hook template.

Usage:
  python scripts/optimize_livingroom_render.py <input_image_path>
"""
import sys
import os
import numpy as np
from PIL import Image

def process_living_room_hook(input_path):
    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        return False

    im = Image.open(input_path).convert('RGB')
    print(f"Input image opened: {input_path} ({im.size[0]}x{im.size[1]})")

    target_w, target_h = 1920, 1080
    scale = target_h / im.height
    new_w = int(im.width * scale)

    if new_w < target_w:
        scale = target_w / im.width
        new_w = target_w
        new_h = int(im.height * scale)
        im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        # Crop from top/center
        y_offset = (new_h - target_h) // 2
        canvas = im_resized.crop((0, y_offset, target_w, y_offset + target_h))
    else:
        im_resized = im.resize((new_w, target_h), Image.Resampling.LANCZOS)
        # Right align to preserve all appliances on the right
        x_offset = new_w - target_w
        canvas = im_resized.crop((x_offset, 0, new_w, target_h))

    # Apply guaranteed chiaroscuro mask: 100% solid black on left 42%
    arr = np.array(canvas, dtype=np.float32)
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

    final_img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

    webp_dest = 'assets/img/theros-living-room-hook.webp'
    jpg_dest = 'assets/img/theros-living-room-hook.jpg'

    final_img.save(webp_dest, 'WEBP', quality=92)
    final_img.save(jpg_dest, 'JPEG', quality=92)

    # Verification
    left_check = np.array(final_img)[:, :x_solid]
    print(f"Exported successfully:")
    print(f" - {webp_dest} ({os.path.getsize(webp_dest)/1024:.1f} KB)")
    print(f" - {jpg_dest} ({os.path.getsize(jpg_dest)/1024:.1f} KB)")
    print(f" - Left {x_solid}px mean brightness: {left_check.mean():.4f} (Must be 0.0000)")
    return True

if __name__ == '__main__':
    if len(sys.argv) > 1:
        process_living_room_hook(sys.argv[1])
    else:
        print("Provide input image path as argument.")
