import shutil
import os

artifact_dir = r"C:\Users\7mza\.gemini\antigravity-ide\brain\91c0eadf-5c12-47e1-9592-adb8f974273a"
src = r"c:\Users\7mza\nerobel\preview_theros_brand_replaced.png"
dst = os.path.join(artifact_dir, "theros_brand_replaced_live.png")

if os.path.exists(src):
    shutil.copy2(src, dst)
    print(f"Copied to {dst}")
