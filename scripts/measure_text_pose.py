from PIL import Image
import numpy as np

crop = Image.open("scratch_crop_full.png").convert("L")
arr = np.array(crop)

# The text is very bright (values > 200) compared to dark brushed metal (< 120)
mask = arr > 175
coords = np.argwhere(mask)
y_min, x_min = coords.min(axis=0)
y_max, x_max = coords.max(axis=0)

print(f"Text in crop: x from {x_min} to {x_max} (width {x_max - x_min})")
print(f"Text in crop: y from {y_min} to {y_max} (height {y_max - y_min})")

# In absolute image coordinates (since crop was from 650, 90):
abs_x1 = 650 + x_min
abs_x2 = 650 + x_max
abs_y1 = 90 + y_min
abs_y2 = 90 + y_max
print(f"Absolute bounds: ({abs_x1}, {abs_y1}) to ({abs_x2}, {abs_y2})")

# Measure slope: left edge of 'E' vs right edge of 'S'
e_mask = mask[:, :x_min + 30]
s_mask = mask[:, x_max - 30:]
e_y = np.mean(np.argwhere(e_mask)[:, 0])
s_y = np.mean(np.argwhere(s_mask)[:, 0])
angle_deg = np.degrees(np.arctan2(s_y - e_y, (x_max - 15) - (x_min + 15)))
print(f"Tilt angle: {angle_deg:.2f} degrees (downward slope: {s_y - e_y:.1f}px)")
