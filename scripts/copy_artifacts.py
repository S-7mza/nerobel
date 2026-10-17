import shutil
import os

artifact_dir = r"C:\Users\7mza\.gemini\antigravity-ide\brain\91c0eadf-5c12-47e1-9592-adb8f974273a"

files = [
    ("current_sav_sidebar.png", "sav_sidebar_before.png"),
    ("final_sav_sidebar_dark.png", "sav_sidebar_after_laser.png"),
    ("final_homepage_tracker_box_dark.png", "homepage_tracker_box_laser.png"),
]

for src, dst in files:
    src_path = os.path.join(r"c:\Users\7mza\nerobel", src)
    dst_path = os.path.join(artifact_dir, dst)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied {src} -> {dst_path}")
