from PIL import Image, ImageFilter
import cv2
import numpy as np

# 1. Load original image
img_path = r"C:\Users\7mza\.gemini\antigravity\brain\11db1119-7dba-44b1-89b6-13f447c137dd\eurogas_gas_heater_1792247061581.jpg"
bgr = cv2.imread(img_path)

# Inpaint mask for the old text (x: 650 to 885, y: 90 to 180)
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
mask = np.zeros(gray.shape, dtype=np.uint8)

box = gray[90:185, 650:885]
text_pixels = (box > 160).astype(np.uint8) * 255
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
text_pixels = cv2.dilate(text_pixels, kernel, iterations=1)
mask[90:185, 650:885] = text_pixels

inpainted = cv2.inpaint(bgr, mask, 5, cv2.INPAINT_TELEA)
base = Image.fromarray(cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB)).convert("RGBA")

# 2. Load the pure vector rendered logo
vector_logo = Image.open("scratch_eurogas_vector_rendered.png").convert("RGBA")

# Target width: 182px (harmonious with display width of 150px)
target_w = 182
aspect = vector_logo.height / vector_logo.width
target_h = int(target_w * aspect)
logo_resized = vector_logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Rotate by -0.8 degrees
logo_rot = logo_resized.rotate(-0.8, resample=Image.Resampling.BICUBIC, expand=True)

# Soft subtle surface contact shadow
shadow = Image.new("RGBA", logo_rot.size, (0, 0, 0, 0))
shadow_alpha = logo_rot.split()[3].point(lambda a: int(a * 0.30))
shadow.paste((15, 15, 18, 255), (0, 0), shadow_alpha)
shadow = shadow.filter(ImageFilter.GaussianBlur(1.0))

# Color tint matching warm ambient light (#F5F2EC)
r, g, b, a = logo_rot.split()
tinted_logo = Image.merge("RGBA", (
    r.point(lambda p: int(p * 0.96)),
    g.point(lambda p: int(p * 0.94)),
    b.point(lambda p: int(p * 0.92)),
    a.point(lambda p: int(p * 0.95))
))

# Center coordinates
center_x = 771
center_y = 144
pos_x = int(center_x - logo_rot.width / 2)
pos_y = int(center_y - logo_rot.height / 2)

# Paste shadow
base.paste(shadow, (pos_x + 1, pos_y + 1), shadow)
# Paste logo
base.paste(tinted_logo, (pos_x, pos_y), tinted_logo)

# Save master image
final_img = base.convert("RGB")
final_path = r"assets\img\eurogas-boiler.jpg"
final_img.save(final_path, quality=96)
final_img.save(r"assets\img\eurogas-boiler.webp", quality=96)
print("Updated assets/img/eurogas-boiler.jpg and .webp successfully!")

# Verify crop
crop = final_img.crop((550, 40, 950, 450))
crop.save("scratch_heater_precise.jpg", quality=96)
print("Saved scratch_heater_precise.jpg")
