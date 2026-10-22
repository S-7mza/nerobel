import os
import shutil
import zipfile
import re
import glob

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BRAIN_BACKUP = r'C:\Users\7mza\.gemini\antigravity-ide\brain\b27782e0-ec6c-4cf2-8644-7ccf8f45ae3c\scratch\backup_pre_clean'
DIST_DIR = os.path.join(WORKSPACE_ROOT, 'dist')
ZIP_NAME = 'nerobel-website-production.zip'
ZIP_PATH = os.path.join(WORKSPACE_ROOT, ZIP_NAME)
DIST_ZIP_PATH = os.path.join(DIST_DIR, ZIP_NAME)

CORE_PAGES = [
    'index.html',
    'brands.html',
    'b2b.html',
    'sav.html',
    'network.html',
    'contact.html',
    'confidentialite.html',
    'mentions-legales.html',
    'pacific.html',
    '404.html'
]

CORE_CONFIG = [
    'robots.txt',
    'sitemap.xml'
]

HTACCESS_CONTENT = """# ==============================================================================
# Nerobel Group — Production Server Configuration (.htaccess)
# ==============================================================================

# 1. UTF-8 Character Encoding
AddDefaultCharset UTF-8
AddCharset UTF-8 .html .css .js .xml .json

# 2. Custom Error Page
ErrorDocument 404 /404.html

# 3. Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 4. MIME Types for Modern Web Formats
<IfModule mod_mime.c>
    AddType image/avif                     avif
    AddType image/webp                     webp
    AddType image/svg+xml                  svg svgz
    AddType application/json               json
    AddType font/woff2                     woff2
    AddType font/woff                      woff
</IfModule>

# 5. Gzip & Deflate Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript
    AddOutputFilterByType DEFLATE application/javascript application/x-javascript application/json
    AddOutputFilterByType DEFLATE application/xml application/xhtml+xml application/rss+xml
    AddOutputFilterByType DEFLATE image/svg+xml font/woff font/woff2
</IfModule>

# 6. Leverage Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"

    # HTML
    ExpiresByType text/html "access plus 1 hour"

    # CSS & JavaScript
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"

    # Images & Favicons
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"

    # Fonts
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"

    # Data
    ExpiresByType application/json "access plus 1 day"
    ExpiresByType application/xml "access plus 1 day"
</IfModule>

# 7. Protect Hidden Files and Prevent Directory Listing
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

Options -Indexes
"""

def step1_backup_and_clean_workspace():
    print("--- STEP 1: Backing up and cleaning loose scratch files from workspace root ---")
    os.makedirs(BRAIN_BACKUP, exist_ok=True)
    
    root_files = os.listdir(WORKSPACE_ROOT)
    loose_images = [f for f in root_files if os.path.isfile(os.path.join(WORKSPACE_ROOT, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    scratch_html = [f for f in root_files if os.path.isfile(os.path.join(WORKSPACE_ROOT, f)) and (f.startswith(('test_', 'debug_')) and f.endswith('.html'))]
    
    to_clean = loose_images + scratch_html
    print(f"Found {len(to_clean)} scratch files in root ({len(loose_images)} images, {len(scratch_html)} test HTMLs).")
    
    copied = 0
    for f in to_clean:
        src = os.path.join(WORKSPACE_ROOT, f)
        dst = os.path.join(BRAIN_BACKUP, f)
        shutil.copy2(src, dst)
        os.remove(src)
        copied += 1
    print(f"Successfully backed up and deleted {copied} scratch files from root.")
    
    # Also clean test-results and __pycache__ if present
    tr_dir = os.path.join(WORKSPACE_ROOT, 'test-results')
    if os.path.exists(tr_dir):
        shutil.rmtree(tr_dir, ignore_errors=True)
        print("Removed test-results/ directory.")
        
    pycache = os.path.join(WORKSPACE_ROOT, 'scripts', '__pycache__')
    if os.path.exists(pycache):
        shutil.rmtree(pycache, ignore_errors=True)
        print("Removed scripts/__pycache__/ directory.")

def step2_build_dist():
    print("\n--- STEP 2: Assembling clean production dist/ directory ---")
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
    os.makedirs(DIST_DIR, exist_ok=True)
    
    # 1. Copy core HTML pages
    for page in CORE_PAGES:
        src = os.path.join(WORKSPACE_ROOT, page)
        dst = os.path.join(DIST_DIR, page)
        shutil.copy2(src, dst)
        print(f"  + Page: {page}")
        
    # 2. Copy core config
    for cfg in CORE_CONFIG:
        src = os.path.join(WORKSPACE_ROOT, cfg)
        dst = os.path.join(DIST_DIR, cfg)
        shutil.copy2(src, dst)
        print(f"  + Config: {cfg}")
        
    # 3. Create .htaccess
    htaccess_path = os.path.join(DIST_DIR, '.htaccess')
    with open(htaccess_path, 'w', encoding='utf-8') as f:
        f.write(HTACCESS_CONTENT)
    print("  + Created: .htaccess (caching, compression, security headers)")
    
    # Also keep a copy of .htaccess in workspace root for direct FTP/server uploads
    root_htaccess = os.path.join(WORKSPACE_ROOT, '.htaccess')
    with open(root_htaccess, 'w', encoding='utf-8') as f:
        f.write(HTACCESS_CONTENT)
    print("  + Created: workspace root .htaccess")
        
    # 4. Copy ou-acheter/
    src_ou = os.path.join(WORKSPACE_ROOT, 'ou-acheter')
    dst_ou = os.path.join(DIST_DIR, 'ou-acheter')
    shutil.copytree(src_ou, dst_ou)
    print("  + Copied: ou-acheter/")
    
    # 5. Copy content/
    src_content = os.path.join(WORKSPACE_ROOT, 'content')
    dst_content = os.path.join(DIST_DIR, 'content')
    shutil.copytree(src_content, dst_content)
    print("  + Copied: content/")
    
    # 6. Copy css/
    src_css = os.path.join(WORKSPACE_ROOT, 'css')
    dst_css = os.path.join(DIST_DIR, 'css')
    shutil.copytree(src_css, dst_css)
    print("  + Copied: css/")
    
    # 7. Copy js/
    src_js = os.path.join(WORKSPACE_ROOT, 'js')
    dst_js = os.path.join(DIST_DIR, 'js')
    shutil.copytree(src_js, dst_js)
    print("  + Copied: js/")
    
    # 8. Copy assets/ (excluding raw img-src and markdown audit)
    dst_assets = os.path.join(DIST_DIR, 'assets')
    os.makedirs(dst_assets, exist_ok=True)
    
    # assets/css
    shutil.copytree(os.path.join(WORKSPACE_ROOT, 'assets', 'css'), os.path.join(dst_assets, 'css'))
    print("  + Copied: assets/css/")
    
    # assets/icons
    shutil.copytree(os.path.join(WORKSPACE_ROOT, 'assets', 'icons'), os.path.join(dst_assets, 'icons'))
    print("  + Copied: assets/icons/")
    
    # assets/img
    shutil.copytree(os.path.join(WORKSPACE_ROOT, 'assets', 'img'), os.path.join(dst_assets, 'img'))
    print("  + Copied: assets/img/ (production optimized images)")

def step3_create_zip():
    print("\n--- STEP 3: Creating ready-to-upload ZIP package ---")
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)
        
    with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                # Compute relative path inside the zip archive
                arcname = os.path.relpath(file_path, DIST_DIR)
                zipf.write(file_path, arcname)
                
    # Also place a copy inside dist/
    shutil.copy2(ZIP_PATH, DIST_ZIP_PATH)
    
    zip_size_mb = os.path.getsize(ZIP_PATH) / (1024 * 1024)
    print(f"Generated ZIP package: {ZIP_NAME}")
    print(f"  -> Path: {ZIP_PATH}")
    print(f"  -> Size: {zip_size_mb:.2f} MB")

def step4_verify_dist():
    print("\n--- STEP 4: Verifying dist/ production integrity ---")
    html_files = glob.glob(os.path.join(DIST_DIR, '*.html')) + glob.glob(os.path.join(DIST_DIR, 'ou-acheter', '*.html'))
    
    broken = []
    total_refs = 0
    for hf in html_files:
        base_dir = os.path.dirname(hf)
        with open(hf, 'r', encoding='utf-8') as f:
            content = f.read()
            
        clean_html = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
        matches = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', clean_html)
        srcset_matches = re.findall(r'srcset=["\']([^"\']+)["\']', clean_html)
        for sm in srcset_matches:
            for part in sm.split(','):
                url = part.strip().split(' ')[0]
                if url:
                    matches.append(url)
                    
        for ref in matches:
            ref_clean = ref.split('?')[0].split('#')[0]
            if not ref_clean or ref_clean.startswith(('http://', 'https://', 'mailto:', 'tel:', 'data:', 'javascript:')):
                continue
            total_refs += 1
            target_path = os.path.normpath(os.path.join(base_dir, ref_clean))
            if not os.path.exists(target_path):
                broken.append((os.path.relpath(hf, DIST_DIR), ref, target_path))

    css_files = glob.glob(os.path.join(DIST_DIR, 'css', '*.css')) + glob.glob(os.path.join(DIST_DIR, 'assets', 'css', '*.css'))
    for cf in css_files:
        base_dir = os.path.dirname(cf)
        with open(cf, 'r', encoding='utf-8') as f:
            content = f.read()
        clean_css = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        url_matches = re.findall(r'url\(\s*["\']?([^"\'\)\s]+)["\']?\s*\)', clean_css)
        for ref in url_matches:
            ref_clean = ref.split('?')[0].split('#')[0]
            if not ref_clean or ref_clean.startswith(('http://', 'https://', 'data:')):
                continue
            total_refs += 1
            target_path = os.path.normpath(os.path.join(base_dir, ref_clean))
            if not os.path.exists(target_path):
                broken.append((os.path.relpath(cf, DIST_DIR), ref, target_path))

    dist_files_count = sum(len(files) for _, _, files in os.walk(DIST_DIR) if not any(f.endswith('.zip') for f in files))
    dist_size_mb = sum(os.path.getsize(os.path.join(r, f)) for r, _, files in os.walk(DIST_DIR) for f in files if not f.endswith('.zip')) / (1024 * 1024)

    print(f"Dist contains {dist_files_count} production files ({dist_size_mb:.2f} MB uncompressed).")
    print(f"Verified {len(html_files)} HTML pages and {len(css_files)} CSS files with {total_refs} asset references.")
    
    if broken:
        print(f"[FAIL] Found {len(broken)} broken references in dist:")
        for page, ref, target in broken:
            print(f"  {page}: {ref} -> {target}")
        raise RuntimeError("Dist verification failed!")
    else:
        print("[SUCCESS] ALL PRODUCTION ASSETS AND LINKS ARE 100% VALID & RESOLVED!")

if __name__ == '__main__':
    step1_backup_and_clean_workspace()
    step2_build_dist()
    step3_create_zip()
    step4_verify_dist()
    print("\n=======================================================")
    print("PRODUCTION BUILD & CLEANUP COMPLETED SUCCESSFULLY!")
    print("=======================================================")
