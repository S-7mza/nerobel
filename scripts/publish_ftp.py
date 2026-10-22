#!/usr/bin/env python3
"""
─────────────────────────────────────────────────────────────
NEROBEL GROUP · SECURE PRODUCTION FTP PUBLISHER
─────────────────────────────────────────────────────────────
Publishes production files from `nerobel_prod_ftp/` to the remote
web server via FTP / FTPS with:
- Interactive prompt or saved `.ftp_credentials.json`
- 3 Publishing Modes:
    1. SAV Only (Fast 1-click update: sav.html, js, css, .htaccess, images)
    2. Differential / Modified Files Only (Hash-based diff)
    3. Full Website (Complete 116 files mirror)
- Automatic passive mode, TLS support, and connection retries
─────────────────────────────────────────────────────────────
"""

import os
import sys
import json
import ftplib
import getpass
import hashlib
import argparse
import subprocess
from pathlib import Path
from datetime import datetime

WORKSPACE = Path(__file__).resolve().parent.parent
PROD_DIR = WORKSPACE / 'nerobel_prod_ftp'
CREDENTIALS_FILE = WORKSPACE / '.ftp_credentials.json'
MANIFEST_FILE = WORKSPACE / '.ftp_manifest.json'

SAV_TARGET_FILES = [
    'sav.html',
    'js/sav.js',
    'css/sav.css',
    '.htaccess',
    'serial-number-guide.svg',
    'contract-sample.webp',
    'assets/icons/serial-number-guide.svg',
    'assets/icons/contract-sample.webp',
    'assets/icons/serial-guide.svg'
]

def print_banner():
    print("""
=============================================================
   NEROBEL GROUP · PRODUCTION FTP PUBLISHING TOOL
=============================================================
""")

def compute_file_hash(filepath):
    hasher = hashlib.md5()
    try:
        with open(filepath, 'rb') as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception:
        return None

def load_credentials():
    # 1. Environment variables
    if os.getenv('FTP_HOST') and os.getenv('FTP_USER') and os.getenv('FTP_PASS'):
        return {
            'host': os.getenv('FTP_HOST'),
            'user': os.getenv('FTP_USER'),
            'password': os.getenv('FTP_PASS'),
            'remote_dir': os.getenv('FTP_DIR', '/public_html'),
            'port': int(os.getenv('FTP_PORT', '21')),
            'secure': bool(int(os.getenv('FTP_SECURE', '1')))
        }

    # 2. Saved credentials file
    if CREDENTIALS_FILE.exists():
        try:
            with open(CREDENTIALS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if data.get('host') and data.get('user'):
                    return data
        except Exception:
            pass

    return None

def prompt_credentials():
    print("\n--- Configuration des Identifiants FTP ---")
    host = input("Hôte FTP (ex: ftp.nerobel.com ou IP du serveur) : ").strip()
    while not host:
        host = input("Hôte FTP requis : ").strip()

    user = input("Nom d'utilisateur FTP (ex: cpanel_user) : ").strip()
    while not user:
        user = input("Nom d'utilisateur requis : ").strip()

    password = getpass.getpass("Mot de passe FTP (saisie masquée) : ").strip()
    while not password:
        password = getpass.getpass("Mot de passe requis : ").strip()

    remote_dir = input("Répertoire distant [/public_html] : ").strip() or '/public_html'
    
    save_ans = input("Enregistrer ces identifiants pour les prochains déploiements ? (o/n) [o] : ").strip().lower()
    creds = {
        'host': host,
        'user': user,
        'password': password,
        'remote_dir': remote_dir,
        'port': 21,
        'secure': True
    }

    if save_ans in ('', 'o', 'oui', 'y', 'yes'):
        try:
            with open(CREDENTIALS_FILE, 'w', encoding='utf-8') as f:
                json.dump(creds, f, indent=2)
            print(f"[OK] Identifiants sauvegardés dans {CREDENTIALS_FILE.name} (ignoré par Git).")
        except Exception as e:
            print(f"[WARN] Impossible de sauvegarder les identifiants : {e}")

    return creds

def connect_ftp(creds):
    host = creds['host']
    port = creds.get('port', 21)
    user = creds['user']
    password = creds['password']
    use_tls = creds.get('secure', True)

    print(f"\nConnexion au serveur FTP {host}:{port}...")

    ftp = None
    if use_tls:
        try:
            print("  -> Tentative de connexion sécurisée FTPS (TLS)...")
            ftp = ftplib.FTP_TLS()
            ftp.connect(host, port, timeout=30)
            ftp.login(user, password)
            ftp.prot_p()
            ftp.set_pasv(True)
            print("  [OK] Connexion FTPS sécurisée établie avec succès !")
            return ftp
        except Exception as e:
            print(f"  [INFO] FTPS non supporté par le serveur ({e}).")
            print("  -> Bascule vers FTP standard (Port 21)...")

    # Fallback to plain FTP
    ftp = ftplib.FTP()
    ftp.connect(host, port, timeout=30)
    ftp.login(user, password)
    ftp.set_pasv(True)
    print("  [OK] Connexion FTP standard établie avec succès !")
    return ftp

def ensure_remote_dir(ftp, remote_path):
    parts = [p for p in remote_path.replace('\\', '/').strip('/').split('/') if p]
    cur = ''
    for p in parts:
        cur += '/' + p
        try:
            ftp.cwd(cur)
        except ftplib.error_perm:
            try:
                ftp.mkd(cur)
                ftp.cwd(cur)
            except Exception:
                pass

def ensure_fresh_build():
    build_script = WORKSPACE / 'scripts' / 'build_production_release.py'
    if not PROD_DIR.exists():
        print("[INFO] Recompilation du package de production nerobel_prod_ftp/...")
        subprocess.run([sys.executable, str(build_script)], check=True)
    else:
        # Check if root sav.html is newer than ftp sav.html
        root_sav = WORKSPACE / 'sav.html'
        ftp_sav = PROD_DIR / 'sav.html'
        if root_sav.exists() and ftp_sav.exists() and root_sav.stat().st_mtime > ftp_sav.stat().st_mtime:
            print("[INFO] Fichiers sources plus récents détectés. Actualisation de nerobel_prod_ftp/...")
            subprocess.run([sys.executable, str(build_script)], check=True)

def select_files_to_upload(mode):
    ensure_fresh_build()
    
    all_files = []
    for root, _, files in os.walk(PROD_DIR):
        for f in files:
            full_p = Path(root) / f
            rel_p = full_p.relative_to(PROD_DIR).as_posix()
            all_files.append((full_p, rel_p))

    if mode == 'sav':
        selected = [item for item in all_files if item[1] in SAV_TARGET_FILES]
        print(f"\n[MODE SAV ONLY] {len(selected)} fichiers ciblés sélectionnés.")
        return selected

    if mode == 'diff':
        manifest = {}
        if MANIFEST_FILE.exists():
            try:
                with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
                    manifest = json.load(f)
            except Exception:
                manifest = {}

        selected = []
        new_manifest = {}
        for full_p, rel_p in all_files:
            h = compute_file_hash(full_p)
            new_manifest[rel_p] = h
            if manifest.get(rel_p) != h:
                selected.append((full_p, rel_p))

        if not selected:
            print("\n[INFO] Aucun fichier modifié par rapport au dernier déploiement !")
            ans = input("Voulez-vous forcer le déploiement complet ? (o/n) [n] : ").strip().lower()
            if ans in ('o', 'oui', 'y', 'yes'):
                return all_files
            return []

        print(f"\n[MODE MODIFIÉS] {len(selected)} fichiers modifiés détectés sur {len(all_files)} au total.")
        return selected

    # mode == 'full'
    print(f"\n[MODE COMPLET] {len(all_files)} fichiers de production prêts pour téléversement.")
    return all_files

def upload_files(ftp, files_to_upload, remote_root):
    total = len(files_to_upload)
    if total == 0:
        print("[INFO] Rien à téléverser.")
        return

    print(f"\nDébut du téléversement vers le répertoire : {remote_root}")
    print("=" * 60)

    uploaded = 0
    total_bytes = 0
    start_time = datetime.now()
    new_manifest = {}

    for full_path, rel_path in files_to_upload:
        remote_rel_dir = os.path.dirname(rel_path)
        if remote_rel_dir:
            target_dir = f"{remote_root.rstrip('/')}/{remote_rel_dir}"
        else:
            target_dir = remote_root.rstrip('/')

        ensure_remote_dir(ftp, target_dir)
        ftp.cwd(target_dir)

        filename = os.path.basename(rel_path)
        file_size = full_path.stat().st_size
        total_bytes += file_size

        with open(full_path, 'rb') as fp:
            ftp.storbinary(f'STOR {filename}', fp, blocksize=32768)

        uploaded += 1
        pct = (uploaded / total) * 100
        size_kb = file_size / 1024
        print(f"  [{uploaded:3d}/{total} - {pct:5.1f}%] {rel_path} ({size_kb:.1f} Ko)")

        # Record hash
        new_manifest[rel_path] = compute_file_hash(full_path)

    elapsed = (datetime.now() - start_time).total_seconds() or 0.01
    speed_kb = (total_bytes / 1024) / elapsed

    # Update manifest
    try:
        manifest = {}
        if MANIFEST_FILE.exists():
            try:
                with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
                    manifest = json.load(f)
            except Exception:
                manifest = {}
        manifest.update(new_manifest)
        with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
    except Exception:
        pass

    print("=" * 60)
    print(f"\n[SUCCÈS] {uploaded} fichier(s) déployé(s) en {elapsed:.1f}s ({speed_kb:.1f} Ko/s) !")
    print("\nVérifiez le rendu en ligne :")
    print("  • Page SAV : https://nerobel.com/sav")
    print("  • Accueil  : https://nerobel.com/")

def main():
    print_banner()

    parser = argparse.ArgumentParser(description="Nerobel FTP Deployment Tool")
    parser.add_argument('--mode', choices=['sav', 'diff', 'full'], help="Mode: sav, diff ou full")
    parser.add_argument('--host', help="Hôte FTP")
    parser.add_argument('--user', help="Utilisateur FTP")
    parser.add_argument('--pass', dest='password', help="Mot de passe FTP")
    parser.add_argument('--remote-dir', help="Répertoire distant (ex: /public_html)")
    args = parser.parse_args()

    creds = load_credentials()
    if args.host:
        creds = creds or {}
        creds['host'] = args.host
        if args.user: creds['user'] = args.user
        if args.password: creds['password'] = args.password
        if args.remote_dir: creds['remote_dir'] = args.remote_dir

    if not creds or not creds.get('host') or not creds.get('user') or not creds.get('password'):
        creds = prompt_credentials()

    mode = args.mode
    if not mode:
        print("\nChoisissez le mode de publication :")
        print("  [1] ⚡ SAV Uniquement (sav.html, js, css, .htaccess, images) — Rapide (1s)")
        print("  [2] 🔄 Fichiers Modifiés Uniquement (détection automatique)")
        print("  [3] 📦 Site Complet (tous les 116 fichiers de production)")
        choice = input("\nVotre choix (1, 2 ou 3) [1] : ").strip()
        if choice == '2':
            mode = 'diff'
        elif choice == '3':
            mode = 'full'
        else:
            mode = 'sav'

    files = select_files_to_upload(mode)
    if not files:
        print("Aucun fichier à téléverser. Opération terminée.")
        return

    try:
        ftp = connect_ftp(creds)
        try:
            upload_files(ftp, files, creds.get('remote_dir', '/public_html'))
        finally:
            try:
                ftp.quit()
            except Exception:
                pass
    except Exception as e:
        print(f"\n[ERREUR DE CONNEXION FTP] : {e}")
        print("Vérifiez vos identifiants ou contactez votre hébergeur.")
        sys.exit(1)

if __name__ == '__main__':
    main()
