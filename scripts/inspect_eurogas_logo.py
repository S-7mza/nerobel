from PIL import Image
import numpy as np

img_path = r"C:\Users\7mza\.gemini\antigravity\brain\11db1119-7dba-44b1-89b6-13f447c137dd\eurogas_gas_heater_1792247061581.jpg"
img = Image.open(img_path)
print("Image size:", img.size)

# Find coordinates of the heater logo area
# The heater is in the middle-right. Let's crop around x: 45% to 65%, y: 12% to 22%
w, h = img.size
crop_area = (int(w * 0.48), int(h * 0.12), int(w * 0.65), int(h * 0.22))
crop = img.crop(crop_area)
crop.save("scratch_eurogas_text_area.png")
print("Saved scratch_eurogas_text_area.png")
