import cv2
import numpy as np
from PIL import Image

# 1. Load source living room image
room = cv2.imread('assets/img/theros-living-room-hook.jpg')
tv_screen = cv2.imread('C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.tempmediaStorage/oled_tv_screen.png')

h_tv, w_tv, _ = tv_screen.shape

# Source corners (the full 1600x900 graphic)
src_pts = np.float32([
    [0, 0],
    [w_tv, 0],
    [w_tv, h_tv],
    [0, h_tv]
])

# Destination corners on the physical TV screen in the 1920x1080 image
# Slightly inset by 1px so it sits inside the bezel
dst_pts = np.float32([
    [1163, 410],
    [1703, 387],
    [1703, 701],
    [1163, 721]
])

# Compute perspective transform
M = cv2.getPerspectiveTransform(src_pts, dst_pts)
warped = cv2.warpPerspective(tv_screen, M, (room.shape[1], room.shape[0]), flags=cv2.INTER_LANCZOS4)

# Create mask for seamless insertion
mask = np.zeros((room.shape[0], room.shape[1]), dtype=np.uint8)
cv2.fillConvexPoly(mask, np.int32(dst_pts), 255)

# Slightly feather the edge (1-2px blur) for anti-aliased bezel transition
mask_blur = cv2.GaussianBlur(mask, (3, 3), 0.8) / 255.0
mask_blur = np.repeat(mask_blur[:, :, np.newaxis], 3, axis=2)

# Blend into room
composed = (warped.astype(np.float32) * mask_blur + room.astype(np.float32) * (1.0 - mask_blur)).astype(np.uint8)

# Save test
cv2.imwrite('C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.tempmediaStorage/warped_tv_test.jpg', composed)
cv2.imwrite('C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.tempmediaStorage/warped_tv_crop.jpg', composed[350:750, 1100:1750])
print('Warped TV test saved!')
