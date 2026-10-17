from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# Load original generated image
img_path = r"C:\Users\7mza\.gemini\antigravity\brain\11db1119-7dba-44b1-89b6-13f447c137dd\eurogas_gas_heater_1792247061581.jpg"
img = Image.open(img_path).convert("RGBA")

# Load official white logo
logo = Image.open("eurogas_white.png").convert("RGBA")

# We want to replace the generic text on the heater with the official logo
# Let's find the exact bounding box of the generic text in the image
# In scratch_eurogas_text_area:
# crop_area was: (int(w * 0.48), int(h * 0.12), int(w * 0.65), int(h * 0.22))
# w = 1376, h = 768
# x1 = 660, y1 = 92, x2 = 894, y2 = 168

# Let's inspect the exact pixel coordinates of the text
crop_full = img.crop((650, 90, 900, 180))
crop_full.save("scratch_crop_full.png")
print("Saved scratch_crop_full.png")
