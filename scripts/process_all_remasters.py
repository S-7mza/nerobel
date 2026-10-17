import os
import sys
sys.path.append('scripts')
import cv2
import numpy as np
from PIL import Image
from master_remaster_hooks import render_svg_to_png, overlay_transparent, enhance_clarity_and_details, enforce_chiaroscuro_mask

TEMP_DIR = 'C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.tempmediaStorage'
os.makedirs(TEMP_DIR, exist_ok=True)

# 1. Render necessary high-res logo assets from official SVG
print("1. Rendering authentic Theros vector logos...")
ac_logo_path = os.path.join(TEMP_DIR, 'theros_logo_ac.png')
render_svg_to_png(
    svg_path='assets/icons/theros-logo-white.svg',
    out_path=ac_logo_path,
    width=320,
    height=80,
    fill_color='#cdd2d8',
    drop_shadow='drop-shadow(0 1px 2px rgba(0,0,0,0.7))'
)

heater_logo_path = os.path.join(TEMP_DIR, 'theros_logo_heater.png')
render_svg_to_png(
    svg_path='assets/icons/theros-logo-white.svg',
    out_path=heater_logo_path,
    width=320,
    height=80,
    fill_color='#1c2024',
    drop_shadow='drop-shadow(0 1px 1px rgba(255,255,255,0.25))'
)
print("Logos rendered.")

# -------------------------------------------------------------
# 2. REMASTER SLIDE 1 (Living Room: TV & Split AC)
# -------------------------------------------------------------
print("\n2. Remastering Slide 1 (Living Room)...")
raw_lr = cv2.imread(r'C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.user_uploaded/media_1792163093447.jpg')
scale_lr = 1080.0 / raw_lr.shape[0]
new_w_lr = int(raw_lr.shape[1] * scale_lr)
resized_lr = cv2.resize(raw_lr, (new_w_lr, 1080), interpolation=cv2.INTER_LANCZOS4)
x_off_lr = new_w_lr - 1920
living_room = resized_lr[:, x_off_lr:new_w_lr].copy()

# A. Inpaint fake logo on AC
mask_ac = np.zeros((living_room.shape[0], living_room.shape[1]), dtype=np.uint8)
mask_ac[175:225, 1370:1470] = 255
living_room = cv2.inpaint(living_room, mask_ac, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

# B. Warp authentic 4K OLED TV screen
tv_screen = cv2.imread(os.path.join(TEMP_DIR, 'oled_tv_screen.png'))
h_tv, w_tv, _ = tv_screen.shape
src_pts = np.float32([[0, 0], [w_tv, 0], [w_tv, h_tv], [0, h_tv]])
dst_pts = np.float32([
    [1163, 410],
    [1703, 387],
    [1703, 701],
    [1163, 721]
])
M_tv = cv2.getPerspectiveTransform(src_pts, dst_pts)
warped_tv = cv2.warpPerspective(tv_screen, M_tv, (living_room.shape[1], living_room.shape[0]), flags=cv2.INTER_LANCZOS4)

tv_poly_mask = np.zeros((living_room.shape[0], living_room.shape[1]), dtype=np.uint8)
cv2.fillConvexPoly(tv_poly_mask, np.int32(dst_pts), 255)
tv_poly_blur = cv2.GaussianBlur(tv_poly_mask, (3, 3), 0.8) / 255.0
tv_poly_blur = np.repeat(tv_poly_blur[:, :, np.newaxis], 3, axis=2)

living_room = (warped_tv.astype(np.float32) * tv_poly_blur + living_room.astype(np.float32) * (1.0 - tv_poly_blur)).astype(np.uint8)

# C. Overlay authentic brushed platinum Theros logo on AC unit
ac_logo_img = cv2.imread(ac_logo_path, cv2.IMREAD_UNCHANGED)
living_room = overlay_transparent(living_room, ac_logo_img, x=1385, y=190, scale=0.32, angle=-2.5, opacity=0.92)

# D. Enhance clarity, stone relief and micro-textures
living_room = enhance_clarity_and_details(living_room)

# E. Re-enforce pure chiaroscuro 100% black on left 40%
living_room = enforce_chiaroscuro_mask(living_room)

# Save Slide 1 outputs (high quality Q95)
cv2.imwrite('assets/img/theros-living-room-hook.jpg', living_room, [cv2.IMWRITE_JPEG_QUALITY, 95])
Image.fromarray(cv2.cvtColor(living_room, cv2.COLOR_BGR2RGB)).save('assets/img/theros-living-room-hook.webp', 'WEBP', quality=95)
print("Slide 1 saved successfully.")


# -------------------------------------------------------------
# 3. REMASTER SLIDE 0 (Bathroom: Theros Pro-Slim 50L)
# -------------------------------------------------------------
print("\n3. Remastering Slide 0 (Bathroom)...")
raw_br = cv2.imread(r'C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.user_uploaded/media_1792159727377.jpg')
scale_br = 1080.0 / raw_br.shape[0]
new_w_br = int(raw_br.shape[1] * scale_br)
resized_br = cv2.resize(raw_br, (new_w_br, 1080), interpolation=cv2.INTER_LANCZOS4)
x_off_br = new_w_br - 1920
bathroom = resized_br[:, x_off_br:new_w_br].copy()

# A. Inpaint fake logo smudge on water heater with elliptical mask
mask_ht = np.zeros((bathroom.shape[0], bathroom.shape[1]), dtype=np.uint8)
# Center in 1920x1080 is at (1320, 193) with radii (45, 34)
cv2.ellipse(mask_ht, (1320, 193), (45, 34), 0, 0, 360, 255, -1)
bathroom = cv2.inpaint(bathroom, mask_ht, inpaintRadius=9, flags=cv2.INPAINT_TELEA)

# B. Overlay authentic laser-etched Theros logo
heater_logo_img = cv2.imread(heater_logo_path, cv2.IMREAD_UNCHANGED)
bathroom = overlay_transparent(bathroom, heater_logo_img, x=1275, y=178, scale=0.30, angle=-1.0, opacity=0.92)

# C. Enhance digital 55°C display circle
disp_x1, disp_y1, disp_x2, disp_y2 = 1270, 580, 1400, 710
disp_crop = bathroom[disp_y1:disp_y2, disp_x1:disp_x2]
disp_sharp = cv2.addWeighted(disp_crop, 1.35, cv2.GaussianBlur(disp_crop, (0,0), 1.2), -0.35, 0)
bathroom[disp_y1:disp_y2, disp_x1:disp_x2] = disp_sharp

# D. Enhance clarity, basalt relief and backlit mirrors
bathroom = enhance_clarity_and_details(bathroom)

# E. Re-enforce pure chiaroscuro 100% black on left 40%
bathroom = enforce_chiaroscuro_mask(bathroom)

# Save Slide 0 outputs (high quality Q95)
cv2.imwrite('assets/img/theros-hero-hook.jpg', bathroom, [cv2.IMWRITE_JPEG_QUALITY, 95])
Image.fromarray(cv2.cvtColor(bathroom, cv2.COLOR_BGR2RGB)).save('assets/img/theros-hero-hook.webp', 'WEBP', quality=95)
print("Slide 0 saved successfully.")

print("\nALL REMASTERS COMPLETE AND SAVED TO PRODUCTION ASSETS!")
