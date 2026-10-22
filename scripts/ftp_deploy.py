"""
Nerobel Production FTP Deployment Utility
-----------------------------------------
Uploads the contents of `nerobel_prod_ftp/` to a remote web server via FTP or FTPS.

Usage:
  python scripts/ftp_deploy.py --host ftp.yourserver.com --user your_username --remote-dir /public_html
  
Or configure via environment variables:
  FTP_HOST, FTP_USER, FTP_PASS, FTP_DIR, FTP_SECURE (0 or 1)
"""

import os
import sys
import ftplib
import argparse
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent
LOCAL_DIR = WORKSPACE / 'nerobel_prod_ftp'

def connect_ftp(host, user, password, port=21, secure=False):
    print(f"Connecting to {host}:{port} (secure={secure})...")
    if secure:
        ftp = ftplib.FTP_TLS()
    else:
        ftp = ftplib.FTP()
    
    ftp.connect(host, port, timeout=30)
    ftp.login(user, password)
    if secure:
        ftp.prot_p()  # Switch data connection to TLS
    print(f"[OK] Logged in as {user}")
    return ftp

def ensure_remote_dir(ftp, remote_dir):
    parts = remote_dir.strip('/').split('/')
    cur = ''
    for p in parts:
        if not p:
            continue
        cur += '/' + p
        try:
            ftp.cwd(cur)
        except ftplib.error_perm:
            try:
                ftp.mkd(cur)
                ftp.cwd(cur)
            except Exception as e:
                print(f"[WARN] Could not create {cur}: {e}")

def upload_folder(ftp, local_dir, remote_root):
    total_files = 0
    uploaded_files = 0
    
    # Count files
    for root, _, files in os.walk(local_dir):
        total_files += len(files)
        
    print(f"Starting upload of {total_files} files from {local_dir} -> {remote_root}...")
    
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir)
        if rel_path == '.':
            remote_target = remote_root
        else:
            remote_target = f"{remote_root}/{rel_path.replace(os.sep, '/')}"
            
        ensure_remote_dir(ftp, remote_target)
        ftp.cwd(remote_target)
        
        for f in files:
            local_file = os.path.join(root, f)
            ext = os.path.splitext(f)[1].lower()
            is_text = ext in ('.html', '.css', '.js', '.json', '.xml', '.txt', '.htaccess', '.md', '.svg')
            
            mode = 'r' if is_text else 'rb'
            cmd = f'STOR {f}'
            
            with open(local_file, 'rb') as fp:
                ftp.storbinary(cmd, fp)
                
            uploaded_files += 1
            if uploaded_files % 10 == 0 or uploaded_files == total_files:
                pct = (uploaded_files / total_files) * 100
                print(f"  [{uploaded_files}/{total_files} - {pct:.1f}%] Uploaded: {rel_path}/{f}")
                
    print(f"\n[DONE] Successfully uploaded all {uploaded_files} files to {remote_root}!")

def main():
    parser = argparse.ArgumentParser(description="Upload Nerobel production build via FTP")
    parser.add_argument("--host", default=os.getenv("FTP_HOST"), help="FTP Hostname / IP")
    parser.add_argument("--user", default=os.getenv("FTP_USER"), help="FTP Username")
    parser.add_argument("--pass", dest="password", default=os.getenv("FTP_PASS"), help="FTP Password")
    parser.add_argument("--port", type=int, default=int(os.getenv("FTP_PORT", "21")), help="FTP Port (default 21)")
    parser.add_argument("--remote-dir", default=os.getenv("FTP_DIR", "/public_html"), help="Remote target directory")
    parser.add_argument("--secure", action="store_true", default=bool(int(os.getenv("FTP_SECURE", "0"))), help="Use FTPS (TLS)")
    
    args = parser.parse_args()
    
    if not LOCAL_DIR.exists():
        print(f"[ERROR] Build directory {LOCAL_DIR} does not exist. Run build_production_release.py first.")
        sys.exit(1)
        
    if not args.host or not args.user:
        print("Usage:")
        print("  python scripts/ftp_deploy.py --host <HOST> --user <USER> [--pass <PASS>] [--remote-dir /public_html]")
        print("\nOr manually upload the contents of folder:")
        print(f"  {LOCAL_DIR}")
        print("to your FTP webroot (e.g. /public_html/) using FileZilla or WinSCP.")
        sys.exit(0)
        
    password = args.password
    if not password:
        import getpass
        password = getpass.getpass(f"Password for {args.user}@{args.host}: ")
        
    ftp = connect_ftp(args.host, args.user, password, args.port, args.secure)
    try:
        upload_folder(ftp, str(LOCAL_DIR), args.remote_dir)
    finally:
        try:
            ftp.quit()
        except:
            pass

if __name__ == '__main__':
    main()
