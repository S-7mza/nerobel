from PIL import Image
import numpy as np

img = Image.open(r"C:\Users\7mza\.gemini\antigravity\brain\11db1119-7dba-44b1-89b6-13f447c137dd\eurogas_gas_heater_1792247061581.jpg")
# Top horizontal bevel of heater:
# x goes from ~600 to ~920
# Let's crop the top edge
crop_top = img.crop((550, 20, 950, 100))
crop_top.save("scratch_top_bevel.png")

# Also let's measure the digital display line
crop_disp = img.crop((680, 250, 840, 310))
crop_disp.save("scratch_disp_bevel.png")
print("Saved bevel crops")
