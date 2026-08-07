"""
Build web-sized copies of the photos in public/ into public/photos/.

The originals are never touched — this only writes new files — so it's safe to
re-run any time you add or replace a picture:

    python scripts/optimize-photos.py

Why it exists: straight off a phone these are ~30 MB in total, and she'll be
opening the site on an iPhone, quite possibly on mobile data. Resized to 1600px
and re-encoded as progressive JPEG they land around a tenth of that with no
visible difference on a phone screen.

It also normalises the filenames (COuple7.jpeg -> couple-7.jpg). The originals
have inconsistent casing, which works on Windows but breaks on case-sensitive
hosts like Netlify, Vercel or GitHub Pages.
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public"
DEST = SOURCE / "photos"

# Long-edge cap in pixels. 1600 still looks sharp full-screen on a 3x iPhone.
MAX_EDGE = 1600
COVER_MAX_EDGE = 1800
QUALITY = 82

# original filename -> clean, lowercase, hyphenated output name
RENAMES = {
    "CoverPhoto.PNG": "cover",
    "Her1.jpeg": "her-1",
    "her2.jpeg": "her-2",
    "her3.jpeg": "her-3",
    "her4.jpeg": "her-4",
    "her5.jpg": "her-5",
    "her6.jpg": "her-6",
    "her7.jpg": "her-7",
    "BirthPhoto.JPEG": "birth",
    "Child.jpeg": "child",
    "Date1.jpeg": "date-1",
    "Date2.jpeg": "date-2",
    "Date3.jpeg": "date-3",
    "Date4.jpeg": "date-4",
    "Date5.jpeg": "date-5",
    "Date6.jpeg": "date-6",
    "Date7.jpeg": "date-7",
    "Date8.jpeg": "date-8",
    "Date9.jpeg": "date-9",
    "Date10.jpeg": "date-10",
    "Couple1.jpeg": "couple-1",
    "couple3.jpeg": "couple-3",
    "couple4.jpg": "couple-4",
    "couple5.jpg": "couple-5",
    "couple6.jpeg": "couple-6",
    "COuple7.jpeg": "couple-7",
    "FirstTimeWeClickPhoto.jpeg": "first-photo",
    "TheTImeiProposedyou.jpeg": "proposal",
    # FirstPhotoTogether.jpeg is byte-identical to FirstTimeWeClickPhoto.jpeg,
    # so it's deliberately not listed here.
}


def convert(src: Path, out_name: str) -> tuple[int, int]:
    """Resize + re-encode one image. Returns (bytes before, bytes after)."""
    before = src.stat().st_size
    with Image.open(src) as img:
        # Phones store rotation in EXIF rather than rotating the pixels; without
        # this, portrait shots come out sideways in the browser.
        img = ImageOps.exif_transpose(img)

        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        cap = COVER_MAX_EDGE if out_name == "cover" else MAX_EDGE
        if max(img.size) > cap:
            img.thumbnail((cap, cap), Image.LANCZOS)

        dest = DEST / f"{out_name}.jpg"
        img.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)

    return before, dest.stat().st_size


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)

    total_before = total_after = 0
    missing: list[str] = []

    for original, out_name in RENAMES.items():
        src = SOURCE / original
        if not src.exists():
            missing.append(original)
            continue

        before, after = convert(src, out_name)
        total_before += before
        total_after += after
        print(f"  {original:<30} -> photos/{out_name}.jpg"
              f"  {before / 1e6:6.2f} MB -> {after / 1e6:5.2f} MB")

    if missing:
        print("\n  ! not found:", ", ".join(missing))

    saved = 1 - total_after / total_before if total_before else 0
    print(f"\n  {len(RENAMES) - len(missing)} photos: "
          f"{total_before / 1e6:.1f} MB -> {total_after / 1e6:.1f} MB "
          f"({saved:.0%} smaller)")


if __name__ == "__main__":
    main()
