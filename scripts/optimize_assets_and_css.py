import os
import glob
import re
import shutil
import zipfile

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SCRATCH_BACKUP = r'C:\Users\7mza\.gemini\antigravity-ide\brain\b27782e0-ec6c-4cf2-8644-7ccf8f45ae3c\scratch\unused_assets_backup'
FTP_DIR = os.path.join(WORKSPACE_ROOT, 'nerobel_prod_ftp')
DIST_DIR = os.path.join(WORKSPACE_ROOT, 'dist')
ZIP_PATH = os.path.join(WORKSPACE_ROOT, 'nerobel-website-production.zip')

def get_all_production_code_text(exclude_icons_css=False):
    prod_files = (
        glob.glob(os.path.join(WORKSPACE_ROOT, '*.html')) +
        glob.glob(os.path.join(WORKSPACE_ROOT, 'ou-acheter', '*.html')) +
        glob.glob(os.path.join(WORKSPACE_ROOT, 'css', '*.css')) +
        glob.glob(os.path.join(WORKSPACE_ROOT, 'assets', 'css', '*.css')) +
        glob.glob(os.path.join(WORKSPACE_ROOT, 'js', '*.js')) +
        glob.glob(os.path.join(WORKSPACE_ROOT, 'content', '*.json'))
    )
    
    ignore_pages = {
        'debug_current_favicon.html',
        'test_logo_display.html',
        'test_professional_icons.html',
        'favicon_showcase.html'
    }
    
    all_text = ''
    for pf in prod_files:
        if os.path.basename(pf) in ignore_pages:
            continue
        if exclude_icons_css and os.path.basename(pf) == 'icons.css':
            continue
        with open(pf, 'r', encoding='utf-8', errors='ignore') as f:
            all_text += '\n' + f.read()
    return all_text

def prune_icons_css(code_text):
    icons_path = os.path.join(WORKSPACE_ROOT, 'css', 'icons.css')
    with open(icons_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Split header / base styles and icon rules
    # Find all blocks of the form .ti-name { ... }
    blocks = re.findall(r'(\.ti-[a-z0-9-,\s\.]+\{[^}]+\})', content)
    
    kept_blocks = []
    pruned_count = 0
    pruned_bytes = 0
    
    for b in blocks:
        classes = re.findall(r'\.(ti-[a-z0-9-]+)', b)
        if any(cls in code_text for cls in classes):
            kept_blocks.append(b)
        else:
            pruned_count += 1
            pruned_bytes += len(b)
            
    # Base part up to the first icon block
    first_block_idx = content.find(blocks[0]) if blocks else len(content)
    base_part = content[:first_block_idx].strip()
    
    pruned_content = base_part + '\n\n' + '\n'.join(kept_blocks) + '\n'
    print(f"Icons CSS pruning: removed {pruned_count} unused icon rules ({pruned_bytes/1024:.1f} KB saved).")
    return pruned_content

def minify_css(css_text):
    # Strip comments
    css = re.sub(r'/\*.*?\*/', '', css_text, flags=re.DOTALL)
    # Normalize whitespace
    css = re.sub(r'\s+', ' ', css)
    # Remove space around delimiters: { } : ; , > + ~
    css = re.sub(r'\s*([\{\}\:\;\,\>\+\~])\s*', r'\1', css)
    # Remove trailing semicolon before }
    css = re.sub(r';\}', '}', css)
    # 0px, 0rem, 0em, 0% -> 0
    css = re.sub(r'(?<=[\:\s\,])0(px|rem|em|%|pt)', '0', css)
    # Hex colors: #ffffff -> #fff
    css = re.sub(r'#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3(?=[\;\s\,\}])', r'#\1\2\3', css)
    return css.strip()

def remove_unused_assets(code_text):
    print("\n--- Scanning & Removing Unused Assets ---")
    os.makedirs(SCRATCH_BACKUP, exist_ok=True)
    
    assets_dir = os.path.join(WORKSPACE_ROOT, 'assets')
    all_asset_files = []
    
    for root, dirs, files in os.walk(assets_dir):
        if 'img-src' in root:
            continue
        for f in files:
            full_p = os.path.join(root, f)
            rel_p = os.path.relpath(full_p, WORKSPACE_ROOT).replace('\\', '/')
            all_asset_files.append((full_p, f, rel_p))
            
    unused = []
    for full_p, fname, rel_p in all_asset_files:
        # Check if used
        if fname in code_text or rel_p in code_text:
            continue
        unused.append((full_p, fname, rel_p, os.path.getsize(full_p)))
        
    print(f"Found {len(unused)} unused assets ({sum(s for _, _, _, s in unused)/1024:.1f} KB).")
    
    # Backup & delete
    deleted_count = 0
    deleted_bytes = 0
    for full_p, fname, rel_p, sz in unused:
        # backup
        rel_backup = os.path.join(SCRATCH_BACKUP, rel_p.replace('/', os.sep))
        os.makedirs(os.path.dirname(rel_backup), exist_ok=True)
        shutil.copy2(full_p, rel_backup)
        # remove
        os.remove(full_p)
        deleted_count += 1
        deleted_bytes += sz
        
    # Remove empty directories in assets
    for root, dirs, files in os.walk(assets_dir, topdown=False):
        if not files and not dirs and 'img-src' not in root:
            try:
                os.rmdir(root)
            except:
                pass
                
    print(f"Backed up & removed {deleted_count} unused assets ({deleted_bytes / (1024*1024):.2f} MB freed).")

def optimize_and_build_ftp():
    print("\n--- Optimizing CSS & Rebuilding nerobel_prod_ftp & dist ---")
    code_text_no_icons = get_all_production_code_text(exclude_icons_css=True)
    
    # 1. Prune icons.css in workspace
    pruned_icons = prune_icons_css(code_text_no_icons)
    with open(os.path.join(WORKSPACE_ROOT, 'css', 'icons.css'), 'w', encoding='utf-8') as f:
        f.write(pruned_icons)
        
    # Re-fetch code_text with pruned icons
    code_text = get_all_production_code_text()
    
    # 2. Remove unused assets from workspace assets/
    remove_unused_assets(code_text)
    
    # 3. Assemble nerobel_prod_ftp and dist
    for target_dir in [FTP_DIR, DIST_DIR]:
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        os.makedirs(target_dir, exist_ok=True)
        
        # Core pages
        core_pages = [
            'index.html', 'brands.html', 'b2b.html', 'sav.html', 'network.html',
            'contact.html', 'confidentialite.html', 'mentions-legales.html',
            'pacific.html', '404.html', 'robots.txt', 'sitemap.xml', '.htaccess'
        ]
        for cp in core_pages:
            shutil.copy2(os.path.join(WORKSPACE_ROOT, cp), os.path.join(target_dir, cp))
            
        # ou-acheter, content, js
        shutil.copytree(os.path.join(WORKSPACE_ROOT, 'ou-acheter'), os.path.join(target_dir, 'ou-acheter'))
        shutil.copytree(os.path.join(WORKSPACE_ROOT, 'content'), os.path.join(target_dir, 'content'))
        shutil.copytree(os.path.join(WORKSPACE_ROOT, 'js'), os.path.join(target_dir, 'js'))
        
        # css with minification
        target_css = os.path.join(target_dir, 'css')
        os.makedirs(target_css, exist_ok=True)
        for cf in glob.glob(os.path.join(WORKSPACE_ROOT, 'css', '*.css')):
            fname = os.path.basename(cf)
            with open(cf, 'r', encoding='utf-8') as fp:
                css_content = fp.read()
            min_content = minify_css(css_content)
            with open(os.path.join(target_css, fname), 'w', encoding='utf-8') as fp:
                fp.write(min_content)
                
        # assets
        target_assets = os.path.join(target_dir, 'assets')
        os.makedirs(target_assets, exist_ok=True)
        
        # assets/css with minification
        target_assets_css = os.path.join(target_assets, 'css')
        os.makedirs(target_assets_css, exist_ok=True)
        for cf in glob.glob(os.path.join(WORKSPACE_ROOT, 'assets', 'css', '*.css')):
            fname = os.path.basename(cf)
            with open(cf, 'r', encoding='utf-8') as fp:
                css_content = fp.read()
            min_content = minify_css(css_content)
            with open(os.path.join(target_assets_css, fname), 'w', encoding='utf-8') as fp:
                fp.write(min_content)
                
        # assets/icons & assets/img (already cleaned of unused assets)
        shutil.copytree(os.path.join(WORKSPACE_ROOT, 'assets', 'icons'), os.path.join(target_assets, 'icons'))
        shutil.copytree(os.path.join(WORKSPACE_ROOT, 'assets', 'img'), os.path.join(target_assets, 'img'))
        
    print("Cleaned and minified builds generated in nerobel_prod_ftp/ and dist/.")
    
    # 4. Generate optimized ZIP
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)
        
    with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for root, dirs, files in os.walk(FTP_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, FTP_DIR)
                zipf.write(file_path, arcname)
                
    zip_sz = os.path.getsize(ZIP_PATH) / (1024*1024)
    ftp_sz = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(FTP_DIR) for f in fs) / (1024*1024)
    ftp_count = sum(len(fs) for _, _, fs in os.walk(FTP_DIR))
    
    print(f"\nOptimization Summary:")
    print(f"  nerobel_prod_ftp total files: {ftp_count}")
    print(f"  nerobel_prod_ftp uncompressed: {ftp_sz:.2f} MB (reduced from 11.57 MB)")
    print(f"  Production ZIP size: {zip_sz:.2f} MB (reduced from 10.95 MB)")

if __name__ == '__main__':
    optimize_and_build_ftp()
