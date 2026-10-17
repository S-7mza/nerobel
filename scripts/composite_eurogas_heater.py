from PIL import Image, ImageFilter
import cv2
import numpy as np

# Load original image
img_path = r"C:\Users\7mza\.gemini\antigravity\brain\11db1119-7dba-44b1-89b6-13f447c137dd\eurogas_gas_heater_1792247061581.jpg"
bgr = cv2.imread(img_path)

# Inpaint mask for the old text:
# x: 660 to 870, y: 100 to 180
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
mask = np.zeros(gray.shape, dtype=np.uint8)

# Select bright text pixels in that box
box = gray[95:180, 660:875]
text_pixels = (box > 165).astype(np.uint8) * 255
# Dilate slightly to cover edges
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
text_pixels = cv2.dilate(text_pixels, kernel, iterations=1)
mask[95:180, 660:875] = text_pixels

# Telea inpainting to restore the clean brushed metal surface
inpainted = cv2.inpaint(bgr, mask, 5, cv2.INPAINT_TELEA)

# Convert to PIL
inpainted_pil = Image.fromarray(cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB)).convert("RGBA")

# Load official white logo
logo = Image.open("eurogas_white.png").convert("RGBA")
# Target width: ~195px
target_w = 195
aspect = logo.height / logo.width
target_h = int(target_w * aspect)
logo_resized = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Rotate by tilt angle (-4.84 degrees)
logo_rot = logo_resized.rotate(-4.84, resample=Image.Resampling.BICUBIC, expand=True)

# Create a subtle drop-shadow / bevel for photorealism on the brushed metal surface
logo_layer = Image.new("RGBA", inpainted_pil.size, (0, 0, 0, 0))

# Place logo at center of original text area:
# Original center was around x: 765, y: 140
pos_x = int(765 - logo_rot.width / 2)
pos_y = int(140 - logo_rot.height / 2)

# Make logo slightly off-white (matching the ambient warm kitchen lighting, like #F4EFEA, opacity 94%)
r, g, b, a = logo_rot.split()
tinted_logo = Image.merge("RGBA", (
    r.point(lambda p: int(p * 0.96)),
    g.point(lambda p: int(p * 0.94)),
    b.point(lambda p: int(p * 0.91)),
    a.point(lambda p: int(p * 0.92))
))

logo_layer.paste(tinted_logo, (pos_x, pos_y), tinted_logo)

# Composite final image
final_img = Image.alpha_composite(inpainted_pil, logo_layer).convert("RGB")
final_img.save("scratch_eurogas_composite.jpg", quality=95)
print("Saved scratch_eurogas_composite.jpg successfully!")

# Also crop the heater area to verify
heater_crop = final_img.crop((550, 40, 950, 450))
heater_crop.save("scratch_heater_crop.jpg", quality=95)
