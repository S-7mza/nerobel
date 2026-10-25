#!/usr/bin/env python3
"""
─────────────────────────────────────────────────────────────
NEROBEL GROUP · SECURE PRODUCTION FTP PUBLISHER
─────────────────────────────────────────────────────────────
Publishes production files from `nerobel_prod_ftp/` to the remote
web server via FTP / FTPS with:
- Interactive prompt or saved `.ftp_credentials.json`
- Time-based & module publishing modes:
    1. Modifiés Aujourd'hui   (fichiers touchés depuis 00:00 aujourd'hui)
    2. Modifiés Depuis Hier   (fichiers touchés depuis 00:00 hier)
    3. Modifiés Cette Semaine (fichiers touchés dans les 7 derniers jours)
    4. SAV Uniquement         (sav.html, js, css, .htaccess, images)
    5. Fichiers Modifiés      (comparaison par empreinte hash MD5)
    6. Site Complet           (tous les fichiers de production)
- Table récapitulative des fichiers sélectionnés (chemin, date, taille)
- Mode prévisualisation (--list / --dry-run) pour inspecter sans téléverser
- Support passif automatique, FTPS (TLS) sécurisé et reprise
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
from datetime import datetime, timedelta

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
    'assets/icons/serial-guide.svg',
    'js/nerobel-sav-engine.js',
    'css/nerobel-sav-engine.css',
    'embed-sav-demo.html',
    'sav-proxy.php'
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
    if not parts:
        ftp.cwd('/')
        return
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
        print("[INFO] Compilation initiale du package de production nerobel_prod_ftp/...")
        subprocess.run([sys.executable, str(build_script)], check=True)
        return

    needs_rebuild = False
    newest_source = None

    prod_root_files = {
        'index.html', 'brands.html', 'b2b.html', 'sav.html', 'network.html',
        'contact.html', 'confidentialite.html', 'mentions-legales.html',
        'pacific.html', 'embed-sav-demo.html', '404.html',
        'robots.txt', 'sitemap.xml', 'serial-number-guide.svg',
        'contract-sample.webp', 'sav-proxy.php', '.htaccess'
    }

    # 1. Root files
    for src in WORKSPACE.glob('*'):
        if src.is_file() and src.name in prod_root_files:
            dst = PROD_DIR / src.name
            if not dst.exists() or src.stat().st_mtime > dst.stat().st_mtime + 1:
                needs_rebuild = True
                newest_source = src
                break

    # 2. Production subdirectories
    prod_folders = [
        'js', 'css', 'content', 'ou-acheter',
        os.path.join('assets', 'css'),
        os.path.join('assets', 'icons'),
        os.path.join('assets', 'img')
    ]
    if not needs_rebuild:
        for folder in prod_folders:
            src_folder = WORKSPACE / folder
            if src_folder.exists():
                for src in src_folder.rglob('*'):
                    if src.is_file():
                        rel = src.relative_to(WORKSPACE)
                        dst = PROD_DIR / rel
                        if not dst.exists() or src.stat().st_mtime > dst.stat().st_mtime + 1:
                            needs_rebuild = True
                            newest_source = src
                            break
                    if needs_rebuild:
                        break

    if needs_rebuild:
        print(f"[INFO] Source modifiée ({newest_source.name}). Recompilation automatique de nerobel_prod_ftp/...")
        subprocess.run([sys.executable, str(build_script)], check=True)

def get_time_cutoffs():
    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday_start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)
    return {
        'today': today_start,
        'yesterday': yesterday_start,
        'week': week_start,
        'now': now
    }

def get_all_production_files():
    ensure_fresh_build()
    all_files = []
    for root, _, files in os.walk(PROD_DIR):
        for f in files:
            full_p = Path(root) / f
            rel_p = full_p.relative_to(PROD_DIR).as_posix()
            all_files.append((full_p, rel_p))
    return all_files

def filter_files_by_time(all_files, cutoff_dt):
    cutoff_ts = cutoff_dt.timestamp()
    matching = [f for f in all_files if f[0].stat().st_mtime >= cutoff_ts]
    matching.sort(key=lambda x: x[0].stat().st_mtime, reverse=True)
    return matching

def get_diff_files(all_files):
    manifest = {}
    if MANIFEST_FILE.exists():
        try:
            with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
        except Exception:
            manifest = {}

    selected = []
    for full_p, rel_p in all_files:
        h = compute_file_hash(full_p)
        if manifest.get(rel_p) != h:
            selected.append((full_p, rel_p))
    selected.sort(key=lambda x: x[0].stat().st_mtime, reverse=True)
    return selected

def print_files_table(selected_files, title):
    print("\n" + "=" * 72)
    print(f"   {title} ({len(selected_files)} fichier(s))")
    print("=" * 72)
    print(f"  {'FICHIER':<40} | {'DERNIÈRE MODIF':<16} | {'TAILLE':>10}")
    print("-" * 72)
    total_size = 0
    for full_p, rel_p in selected_files:
        mtime = datetime.fromtimestamp(full_p.stat().st_mtime)
        mtime_str = mtime.strftime('%d/%m/%Y %H:%M')
        sz = full_p.stat().st_size
        total_size += sz
        if sz >= 1024 * 1024:
            sz_str = f"{sz / (1024*1024):.2f} Mo"
        elif sz >= 1024:
            sz_str = f"{sz / 1024:.1f} Ko"
        else:
            sz_str = f"{sz} o"
        
        display_rel = rel_p if len(rel_p) <= 40 else '...' + rel_p[-37:]
        print(f"  {display_rel:<40} | {mtime_str:<16} | {sz_str:>10}")
        
    print("-" * 72)
    tot_str = f"{total_size / 1024:.1f} Ko" if total_size < 1024*1024 else f"{total_size / (1024*1024):.2f} Mo"
    print(f"  TOTAL : {len(selected_files)} fichier(s) · {tot_str}")
    print("=" * 72)

def resolve_mode(mode_input):
    mapping = {
        '1': 'today',
        'today': 'today',
        'aujourdhui': 'today',
        '2': 'yesterday',
        'yesterday': 'yesterday',
        'hier': 'yesterday',
        '3': 'week',
        'week': 'week',
        'semaine': 'week',
        '4': 'sav',
        'sav': 'sav',
        '5': 'diff',
        'diff': 'diff',
        'modifies': 'diff',
        '6': 'full',
        'full': 'full',
        'tout': 'full'
    }
    return mapping.get(str(mode_input).lower().strip())

def select_files_by_mode(mode, all_files, cutoffs):
    mode = resolve_mode(mode) or mode

    if mode == 'today':
        selected = filter_files_by_time(all_files, cutoffs['today'])
        title = f"MODIFIÉS AUJOURD'HUI (depuis {cutoffs['today'].strftime('%d/%m/%Y 00:00')})"
        return selected, title

    elif mode == 'yesterday':
        selected = filter_files_by_time(all_files, cutoffs['yesterday'])
        title = f"MODIFIÉS DEPUIS HIER (depuis {cutoffs['yesterday'].strftime('%d/%m/%Y 00:00')})"
        return selected, title

    elif mode == 'week':
        selected = filter_files_by_time(all_files, cutoffs['week'])
        title = f"MODIFIÉS CETTE SEMAINE (7 derniers jours, depuis {cutoffs['week'].strftime('%d/%m/%Y %H:%M')})"
        return selected, title

    elif mode == 'sav':
        selected = [item for item in all_files if item[1] in SAV_TARGET_FILES]
        selected.sort(key=lambda x: x[0].stat().st_mtime, reverse=True)
        title = "MODULE SAV & RESSOURCES CLÉS"
        return selected, title

    elif mode == 'diff':
        selected = get_diff_files(all_files)
        title = "FICHIERS MODIFIÉS DEPUIS LE DERNIER DÉPLOIEMENT (HASH MD5)"
        return selected, title

    elif mode == 'full':
        selected = list(all_files)
        selected.sort(key=lambda x: x[0].stat().st_mtime, reverse=True)
        title = "SITE COMPLET (TOUS LES FICHIERS DE PRODUCTION)"
        return selected, title

    return [], "AUCUN FICHIER"

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
        remote_rel_dir = os.path.dirname(rel_path).replace('\\', '/')
        if remote_rel_dir:
            if remote_root == '/' or not remote_root:
                target_dir = '/' + remote_rel_dir.lstrip('/')
            else:
                target_dir = f"{remote_root.rstrip('/')}/{remote_rel_dir.lstrip('/')}"
        else:
            target_dir = remote_root.rstrip('/') or '/'

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

    parser = argparse.ArgumentParser(description="Nerobel FTP Deployment Tool with Time Filters")
    parser.add_argument('positional_mode', nargs='?', choices=['today', 'yesterday', 'week', 'sav', 'diff', 'full', '1', '2', '3', '4', '5', '6'], help="Mode direct : today, yesterday, week, sav, diff, full (ou 1..6)")
    parser.add_argument('--mode', choices=['today', 'yesterday', 'week', 'sav', 'diff', 'full'], help="Mode de publication")
    parser.add_argument('--today', action='store_const', const='today', dest='flag_mode', help="Modifiés aujourd'hui")
    parser.add_argument('--yesterday', action='store_const', const='yesterday', dest='flag_mode', help="Modifiés depuis hier")
    parser.add_argument('--week', action='store_const', const='week', dest='flag_mode', help="Modifiés cette semaine (7 jours)")
    parser.add_argument('--sav', action='store_const', const='sav', dest='flag_mode', help="Module SAV uniquement")
    parser.add_argument('--diff', action='store_const', const='diff', dest='flag_mode', help="Fichiers modifiés par hash MD5")
    parser.add_argument('--full', action='store_const', const='full', dest='flag_mode', help="Site web complet")
    parser.add_argument('--list', '--dry-run', dest='dry_run', action='store_true', help="Lister uniquement les fichiers sans se connecter au serveur FTP")
    parser.add_argument('--yes', '-y', action='store_true', help="Confirmer automatiquement sans prompt interactif")
    parser.add_argument('--host', help="Hôte FTP")
    parser.add_argument('--user', help="Utilisateur FTP")
    parser.add_argument('--pass', dest='password', help="Mot de passe FTP")
    parser.add_argument('--remote-dir', help="Répertoire distant (ex: /public_html)")
    args = parser.parse_args()

    # Determine requested mode from arguments if provided
    raw_mode = args.flag_mode or args.mode or args.positional_mode
    chosen_mode = resolve_mode(raw_mode) if raw_mode else None

    # Load credentials
    creds = load_credentials()
    if args.host:
        creds = creds or {}
        creds['host'] = args.host
        if args.user: creds['user'] = args.user
        if args.password: creds['password'] = args.password
        if args.remote_dir: creds['remote_dir'] = args.remote_dir

    cutoffs = get_time_cutoffs()
    all_files = get_all_production_files()

    while True:
        if not chosen_mode:
            # Calculate live counts for each option
            c_today = len(filter_files_by_time(all_files, cutoffs['today']))
            c_yesterday = len(filter_files_by_time(all_files, cutoffs['yesterday']))
            c_week = len(filter_files_by_time(all_files, cutoffs['week']))
            c_sav = len([item for item in all_files if item[1] in SAV_TARGET_FILES])
            c_diff = len(get_diff_files(all_files))
            c_total = len(all_files)

            print("Choisissez les fichiers à publier sur le serveur FTP :")
            print("  ─────────────────────────────────────────────────────────────")
            print(f"  [1] 📅 Modifiés Aujourd'hui   ({c_today:>3} fichier(s) depuis 00:00)")
            print(f"  [2] 📅 Depuis Hier            ({c_yesterday:>3} fichier(s) depuis hier 00:00)")
            print(f"  [3] 📅 Cette Semaine          ({c_week:>3} fichier(s) sur les 7 derniers jours)")
            print("  ─────────────────────────────────────────────────────────────")
            print(f"  [4] ⚡ Module SAV Uniquement  ({c_sav:>3} fichiers : sav.html, js, css, etc.)")
            print(f"  [5] 🔄 Fichiers Modifiés      ({c_diff:>3} fichier(s) détecté(s) par hash MD5)")
            print(f"  [6] 📦 Tout le Site Web       ({c_total:>3} fichiers complets)")
            print("  ─────────────────────────────────────────────────────────────")
            print("  [L] 📋 Lister / Inspecter les fichiers d'un mode (sans téléverser)")
            print("  [Q] ❌ Quitter")

            choice = input("\nVotre choix (1 à 6, L ou Q) [1] : ").strip().lower()
            if choice in ('q', 'quit', 'exit', 'annuler'):
                print("Opération annulée.")
                return

            if choice in ('l', 'list'):
                sub_choice = input("Quel mode voulez-vous inspecter (1: Aujourd'hui, 2: Depuis hier, 3: Semaine, 4: SAV, 5: Diff, 6: Tout) [1] : ").strip()
                sub_mode = resolve_mode(sub_choice) or 'today'
                sub_files, sub_title = select_files_by_mode(sub_mode, all_files, cutoffs)
                if not sub_files:
                    print(f"\n[INFO] Aucun fichier trouvé pour le mode '{sub_title}'.")
                else:
                    print_files_table(sub_files, f"APERÇU : {sub_title}")
                input("\nAppuyez sur Entrée pour revenir au menu...")
                continue

            chosen_mode = resolve_mode(choice) or 'today'

        files, title = select_files_by_mode(chosen_mode, all_files, cutoffs)

        if not files:
            print(f"\n[INFO] Aucun fichier trouvé pour le mode : {title}")
            retry = input("Voulez-vous choisir un autre filtre (ex: Depuis Hier ou Semaine) ? (o/n) [o] : ").strip().lower()
            if retry in ('', 'o', 'oui', 'y', 'yes'):
                chosen_mode = None
                continue
            else:
                print("Opération terminée.")
                return

        # Print the detailed table of matching files
        print_files_table(files, title)

        if args.dry_run:
            print("\n[DRY RUN] Mode inspection uniquement. Aucun fichier n'a été téléversé.")
            return

        # Confirmation prompt
        if not args.yes:
            confirm = input(f"\nConfirmer le téléversement de ces {len(files)} fichier(s) vers le FTP ? (o/n) [o] : ").strip().lower()
            if confirm not in ('', 'o', 'oui', 'y', 'yes'):
                print("Téléversement annulé par l'utilisateur.")
                change = input("Voulez-vous choisir un autre mode ? (o/n) [n] : ").strip().lower()
                if change in ('o', 'oui', 'y', 'yes'):
                    chosen_mode = None
                    continue
                return

        # Ensure credentials before connecting
        if not creds or not creds.get('host') or not creds.get('user') or not creds.get('password'):
            creds = prompt_credentials()

        try:
            ftp = connect_ftp(creds)
            try:
                target_dir = creds.get('remote_dir') or '/public_html'
                upload_files(ftp, files, target_dir)
            finally:
                try:
                    ftp.quit()
                except Exception:
                    pass
            break
        except Exception as e:
            print(f"\n[ERREUR DE CONNEXION FTP] : {e}")
            print("Vérifiez vos identifiants ou contactez votre hébergeur.")
            sys.exit(1)

if __name__ == '__main__':
    main()
