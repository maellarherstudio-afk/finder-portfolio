#!/usr/bin/env python3
"""
Upload YouTube + mise à jour portfolio.json

Usage:
  # Upload tout un dossier racine (un sous-dossier = une marque)
  python3 scripts/upload.py --root /Volumes/SEAGATE/CTZAR --client "Organique"

  # Upload un seul dossier de marque
  python3 scripts/upload.py --root /Volumes/SEAGATE/CTZAR/CLARINS --client "Organique" --brand "Clarins"

Le ratio et le nom propre sont extraits automatiquement depuis le nom de fichier (ex: Clarins_Bluelagoon_9-16.mp4)
"""

import sys, json, re, pickle, argparse
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# ── Config ──────────────────────────────────────────────────────────
SCOPES        = ["https://www.googleapis.com/auth/youtube"]
SECRET_FILE   = Path(__file__).parent / "client_secret_717564396024-d0jj9ii6de3e2r36l4c9ohir7cvmbdqe.apps.googleusercontent.com.json"
TOKEN_FILE    = Path(__file__).parent / "token.pickle"
PORTFOLIO_FILE = Path(__file__).parent.parent / "data" / "portfolio.json"
VIDEO_EXTS    = {".mp4", ".mov", ".avi", ".mkv", ".m4v"}

RATIO_MAP = {
    "9-16": "9/16", "16-9": "16/9", "4-5": "4/5", "1-1": "1/1",
    "916": "9/16", "169": "16/9", "45": "4/5", "11": "1/1",
}

# ── Filename parsing ─────────────────────────────────────────────────
def parse_filename(stem):
    """Extract (clean_name, ratio, year) from filename like Clarins_Bluelagoon_9-16"""
    ratio = "16/9"
    # Detect ratio suffix
    m = re.search(r"[_\-](9[-]16|16[-]9|4[-]5|1[-]1)$", stem, re.IGNORECASE)
    if m:
        ratio = RATIO_MAP.get(m.group(1).replace("-", "-"), "16/9")
        stem = stem[:m.start()]

    # Detect year
    year = None
    m_year = re.search(r"(?<!\d)(20\d{2})(?!\d)", stem)
    if m_year:
        year = m_year.group(1)

    # Clean name: remove leading Client_ prefix if present
    clean = stem.strip("_- ")
    return clean, ratio, year

# ── Auth ─────────────────────────────────────────────────────────────
def get_youtube_client():
    creds = None
    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, "rb") as f:
            creds = pickle.load(f)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(SECRET_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "wb") as f:
            pickle.dump(creds, f)
    return build("youtube", "v3", credentials=creds)

# ── Playlist ─────────────────────────────────────────────────────────
def get_or_create_playlist(youtube, brand_name):
    response = youtube.playlists().list(part="snippet", mine=True, maxResults=50).execute()
    for p in response.get("items", []):
        if p["snippet"]["title"] == brand_name:
            print(f"  📋 Playlist existante : {brand_name}")
            return p["id"]
    response = youtube.playlists().insert(
        part="snippet,status",
        body={
            "snippet": {"title": brand_name, "description": f"Portfolio — {brand_name}"},
            "status": {"privacyStatus": "unlisted"},
        }
    ).execute()
    print(f"  📋 Playlist créée : {brand_name}")
    return response["id"]

def add_to_playlist(youtube, video_id, playlist_id):
    youtube.playlistItems().insert(
        part="snippet",
        body={"snippet": {"playlistId": playlist_id, "resourceId": {"kind": "youtube#video", "videoId": video_id}}}
    ).execute()

# ── Upload ────────────────────────────────────────────────────────────
def upload_video(youtube, filepath, title):
    print(f"  ⬆️  {filepath.name}")
    body = {
        "snippet": {"title": title, "categoryId": "22"},
        "status": {"privacyStatus": "unlisted"},
    }
    media = MediaFileUpload(str(filepath), chunksize=-1, resumable=True)
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"    {int(status.progress()*100)}%...", end="\r")
    print(f"  ✅ youtubeId: {response['id']}")
    return response["id"]

# ── portfolio.json ────────────────────────────────────────────────────
def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text

def find_or_create_folder(children, folder_id, folder_name):
    for item in children:
        if item.get("id") == folder_id:
            return item
    new = {"id": folder_id, "name": folder_name, "type": "folder", "children": []}
    children.append(new)
    return new

def strip_brand_prefix(name, brand):
    """Remove brand prefix from display name (e.g. Clarins_Backstage → Backstage)"""
    clean = re.sub(r'^' + re.escape(brand) + r'[_\-\s]?', '', name, flags=re.IGNORECASE).strip('_- ')
    return clean if clean else name

def add_to_portfolio(portfolio, client, brand, video_name, youtube_id, ratio, year=None):
    root = portfolio["root"]["children"]
    client_id = slugify(client)
    client_node = find_or_create_folder(root, client_id, client)
    brand_id = f"{client_id}-{slugify(brand)}"
    brand_node = find_or_create_folder(client_node["children"], brand_id, brand)

    # Strip brand prefix for display name
    display_name = strip_brand_prefix(video_name, brand)

    # Skip if already exists (compare by filename, not youtubeId)
    expected_name = display_name + ".mp4"
    for v in brand_node["children"]:
        if v.get("name") == expected_name:
            print(f"  ℹ️  Déjà dans portfolio.json ({expected_name}), skip.")
            return

    entry = {
        "id": f"{brand_id}-{slugify(display_name)}",
        "name": display_name + ".mp4",
        "type": "video",
        "youtubeId": youtube_id,
        "ratio": ratio,
    }
    if year: entry["year"] = year
    brand_node["children"].append(entry)
    print(f"  ✅ portfolio.json → {client} / {brand} / {display_name} ({ratio})")

# ── Main ──────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root",   required=True, help="Dossier racine (contient les sous-dossiers de marques) ou dossier d'une marque")
    parser.add_argument("--client", required=True, help="Ex: Organique, Ad")
    parser.add_argument("--brand",  default=None,  help="Forcer le nom de marque (si --root est déjà un dossier de marque)")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.is_dir():
        print(f"❌ Dossier introuvable: {root}")
        sys.exit(1)

    # Build list of (brand_name, [video_files])
    jobs = []
    if args.brand:
        # Single brand mode
        videos = sorted([f for f in root.iterdir() if f.is_file() and f.suffix.lower() in VIDEO_EXTS and not f.name.startswith(".")])
        if videos:
            jobs.append((args.brand, videos))
    else:
        # Multi-brand mode: each subfolder = a brand
        for brand_dir in sorted(root.iterdir()):
            if not brand_dir.is_dir() or brand_dir.name.startswith("."): continue
            videos = sorted([f for f in brand_dir.iterdir() if f.is_file() and f.suffix.lower() in VIDEO_EXTS and not f.name.startswith(".")])
            if videos:
                jobs.append((brand_dir.name.capitalize(), videos))

    if not jobs:
        print("❌ Aucune vidéo trouvée.")
        sys.exit(1)

    total = sum(len(v) for _, v in jobs)
    print(f"\n🎬 {total} vidéo(s) dans {len(jobs)} marque(s)\n")

    with open(PORTFOLIO_FILE, "r", encoding="utf-8") as f:
        portfolio = json.load(f)

    print("🔐 Authentification YouTube...")
    youtube = get_youtube_client()
    print("✅ Connecté\n")

    for brand_name, videos in jobs:
        print(f"\n{'='*50}")
        print(f"  {brand_name} ({len(videos)} vidéos)")
        print(f"{'='*50}")
        playlist_id = get_or_create_playlist(youtube, brand_name)

        for filepath in videos:
            stem = filepath.stem
            clean_name, ratio, year = parse_filename(stem)
            print(f"\n─── {stem} ───")
            youtube_id = upload_video(youtube, filepath, stem)
            add_to_playlist(youtube, youtube_id, playlist_id)
            add_to_portfolio(portfolio, args.client, brand_name, clean_name, youtube_id, ratio, year)
            # Sauvegarde après chaque vidéo (évite la perte en cas de crash/quota)
            with open(PORTFOLIO_FILE, "w", encoding="utf-8") as f:
                json.dump(portfolio, f, ensure_ascii=False, indent=2)

    print(f"\n💾 portfolio.json mis à jour.")
    print("✅ Terminé ! Lance git push pour déployer.")

if __name__ == "__main__":
    main()
