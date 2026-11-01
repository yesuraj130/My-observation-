#!/usr/bin/env python3
"""
Photo Date Segregator (Date, Month, Year)
=========================================
Segregates all your photo files into clean Year / Month / Day folders.

Usage:
    python extreme_photo_manager.py /path/to/my/photos
    python extreme_photo_manager.py /path/to/my/photos --execute
"""

import os
import sys
import shutil
import argparse
from pathlib import Path
from datetime import datetime

PHOTO_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.raw', '.arw', '.cr2', '.cr3', '.nef', '.dng', '.tiff', '.tif'}

def segregate_photos(directory: str, execute: bool = False):
    root = Path(directory)
    if not root.exists():
        print(f"[!] Directory not found: {directory}")
        return

    photos = [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in PHOTO_EXTENSIONS]
    print(f"[*] Found {len(photos)} photos to segregate by Date, Month, and Year.\n")

    for p in photos:
        mtime = datetime.fromtimestamp(p.stat().st_mtime)
        year = str(mtime.year)
        month_name = mtime.strftime("%B") # e.g. October
        day = f"{mtime.day:02d}"

        # Target structure: root / YEAR / MONTH / DAY / filename
        dest_dir = root / "Organized_Photos" / year / month_name / day
        dest_file = dest_dir / p.name

        print(f"  {p.name}  --->  Organized_Photos/{year}/{month_name}/{day}/{p.name}")

        if execute:
            dest_dir.mkdir(parents=True, exist_ok=True)
            if not dest_file.exists():
                shutil.copy2(p, dest_file)

    if not execute:
        print("\n[!] This was a preview (dry run). Run with --execute to create folders and move photos:")
        print(f"    python extreme_photo_manager.py \"{directory}\" --execute")
    else:
        print("\n[+] All photos segregated successfully into Year / Month / Day folders!")

def main():
    parser = argparse.ArgumentParser(description="Segregate photos into Year/Month/Day folders")
    parser.add_argument("directory", help="Folder containing your photos")
    parser.add_argument("--execute", action="store_true", help="Actually create folders and copy photos")
    args = parser.parse_args()

    segregate_photos(args.directory, execute=args.execute)

if __name__ == "__main__":
    main()
