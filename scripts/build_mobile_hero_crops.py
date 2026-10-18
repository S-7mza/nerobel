import os
from PIL import Image

def generate_crops():
    img_dir = 'assets/img'
    out_dir = 'assets/img'
    
    slides = [
        {
            'src': 'theros-hero-hook.webp',
            'name': 'theros-hero-mobile-4x5',
            'center_x': 1380,
            'center_y': 540,
            'focal_pct_x': 72,
            'focal_pct_y': 46,
            'safe_area': {'x1': 120, 'y1': 50, 'x2': 680, 'y2': 750}
        },
        {
            'src': 'theros-living-room-hook.webp',
            'name': 'theros-living-room-mobile-4x5',
            'center_x': 1433,
            'center_y': 540,
            'focal_pct_x': 75,
            'focal_pct_y': 51,
            'safe_area': {'x1': 100, 'y1': 100, 'x2': 700, 'y2': 780}
        },
        {
            'src': 'eurogas-hero-hook.webp',
            'name': 'eurogas-hero-mobile-4x5',
            'center_x': 1375,
            'center_y': 540,
            'focal_pct_x': 72,
            'focal_pct_y': 46,
            'safe_area': {'x1': 120, 'y1': 60, 'x2': 680, 'y2': 760}
        },
        {
            'src': 'theros-bedroom-hook.webp',
            'name': 'theros-bedroom-mobile-4x5',
            'center_x': 1400,
            'center_y': 540,
            'focal_pct_x': 73,
            'focal_pct_y': 44,
            'safe_area': {'x1': 100, 'y1': 60, 'x2': 700, 'y2': 750}
        }
    ]
    
    for slide in slides:
        in_path = os.path.join(img_dir, slide['src'])
        if not os.path.exists(in_path):
            print(f"Warning: {in_path} not found")
            continue
        
        im = Image.open(in_path).convert('RGB')
        w, h = im.size
        
        # Calculate 4:5 crop window from 1920x1080 (height 1080 -> width 864)
        crop_h = h
        crop_w = int(crop_h * 4 / 5) # 864
        
        x1 = max(0, min(w - crop_w, slide['center_x'] - crop_w // 2))
        y1 = 0
        x2 = x1 + crop_w
        y2 = h
        
        cropped = im.crop((x1, y1, x2, y2))
        print(f"Cropped {slide['name']} from {in_path}: box=({x1}, {y1}, {x2}, {y2}), size={cropped.size}")
        
        # Save responsive sizes: 800x1000 and 480x600
        for target_w, suffix in [(800, ''), (800, '-800'), (480, '-480')]:
            target_h = int(target_w * 5 / 4)
            resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            base_name = f"{slide['name']}{suffix}"
            
            # WebP
            webp_path = os.path.join(out_dir, f"{base_name}.webp")
            resized.save(webp_path, 'WEBP', quality=88)
            
            # JPEG
            jpg_path = os.path.join(out_dir, f"{base_name}.jpg")
            resized.save(jpg_path, 'JPEG', quality=86)
            
        print(f"-> Generated {slide['name']} assets successfully.")

if __name__ == '__main__':
    generate_crops()
