import cv2
import numpy as np

img = cv2.imread('C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/theros_card_light.png')
h, w, c = img.shape
print(f'Image shape: {w}x{h}')

# The buttons are at the bottom ~70px of the image
# Let's crop the bottom 100px
bottom = img[h-120:h-20, :]
cv2.imwrite('C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/buttons_crop.png', bottom)

# Let's sample colors in the left button area (x: 20 to 100, y: h-100 to h-40)
left_btn = img[h-100:h-40, 20:100]
print('Left button min/max/mean BGR:', left_btn.min(), left_btn.max(), left_btn.mean(axis=(0,1)))

right_btn = img[h-100:h-40, 110:280]
print('Right button min/max/mean BGR:', right_btn.min(), right_btn.max(), right_btn.mean(axis=(0,1)))
