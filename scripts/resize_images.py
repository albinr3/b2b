#!/usr/bin/env python3
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except Exception as exc:
    print("Pillow is required. Install with: pip install pillow")
    raise

MAX_SIZE = int(os.getenv("MAX_SIZE", "1080"))
QUALITY = int(os.getenv("QUALITY", "75"))
RECURSIVE = os.getenv("RECURSIVE", "1") != "0"
IN_PLACE = os.getenv("IN_PLACE", "0") == "1"
SKIP_EXISTING = os.getenv("SKIP_EXISTING", "1") != "0"
PNG_TO_JPEG = os.getenv("PNG_TO_JPEG", "0") == "1"
PNG_TO_WEBP = os.getenv("PNG_TO_WEBP", "0") == "1"

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def iter_images(base_dir: Path):
    if RECURSIVE:
        for path in base_dir.rglob("*"):
            if path.is_file() and path.suffix.lower() in SUPPORTED_EXTS:
                yield path
    else:
        for path in base_dir.iterdir():
            if path.is_file() and path.suffix.lower() in SUPPORTED_EXTS:
                yield path


def output_path_for(src: Path, base_dir: Path, out_dir: Path):
    rel = src.relative_to(base_dir)
    return out_dir / rel


def choose_output_format(src: Path, img: Image.Image):
    ext = src.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        return "JPEG", src.suffix
    if ext == ".png":
        if PNG_TO_WEBP:
            return "WEBP", ".webp"
        if PNG_TO_JPEG and img.mode in ("RGB", "L"):
            return "JPEG", ".jpg"
        return "PNG", ".png"
    if ext == ".webp":
        return "WEBP", ".webp"
    return None, src.suffix


def save_image(img: Image.Image, out_path: Path, fmt: str):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if fmt == "JPEG":
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        img.save(
            out_path,
            format="JPEG",
            quality=QUALITY,
            optimize=True,
            progressive=True,
            subsampling=2,
        )
    elif fmt == "PNG":
        img.save(out_path, format="PNG", optimize=True, compress_level=9)
    elif fmt == "WEBP":
        img.save(out_path, format="WEBP", quality=QUALITY, method=6)
    else:
        img.save(out_path)


def process_one(src: Path, base_dir: Path, out_dir: Path):
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

        fmt, new_ext = choose_output_format(src, im)
        if fmt is None:
            return False, "unsupported"

        out_path = output_path_for(src, base_dir, out_dir)
        out_path = out_path.with_suffix(new_ext)

        if SKIP_EXISTING and out_path.exists():
            return False, "skipped"

        save_image(im, out_path, fmt)
        return True, "ok"


def main():
    base_dir = Path(__file__).resolve().parent
    if len(sys.argv) > 1:
        base_dir = Path(sys.argv[1]).resolve()

    if not base_dir.exists():
        print(f"Folder not found: {base_dir}")
        sys.exit(1)

    out_dir = base_dir if IN_PLACE else base_dir / "optimized"
    images = list(iter_images(base_dir))

    total = len(images)
    processed = 0
    saved = 0
    skipped = 0

    print(f"Base folder: {base_dir}")
    print(f"Output folder: {out_dir}")
    print(f"Images found: {total}")
    if total == 0:
        return

    for idx, img_path in enumerate(images, start=1):
        ok, status = process_one(img_path, base_dir, out_dir)
        processed += 1
        if status == "ok":
            saved += 1
        elif status == "skipped":
            skipped += 1
        if idx % 50 == 0 or idx == total:
            print(f"Processed {idx}/{total} | Saved {saved} | Skipped {skipped}")

    print(f"Done. Saved {saved}, Skipped {skipped}, Total {processed}")


if __name__ == "__main__":
    main()
