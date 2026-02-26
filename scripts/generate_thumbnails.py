#!/usr/bin/env python3
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps, UnidentifiedImageError, features
except Exception:
    print("Pillow is required. Install with: pip install pillow")
    raise

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def parse_args():
    parser = argparse.ArgumentParser(
        description="Generate WebP thumbnails from an image folder without modifying originals."
    )
    parser.add_argument(
        "input_dir",
        nargs="?",
        default="r2-downloads/fotos",
        help="Input folder with original images (default: r2-downloads/fotos)",
    )
    parser.add_argument(
        "output_dir",
        nargs="?",
        default="r2-downloads/fotos-thumbs",
        help="Output folder for thumbnails (default: r2-downloads/fotos-thumbs)",
    )
    parser.add_argument(
        "--size",
        type=int,
        default=640,
        help="Maximum width/height for thumbnails (default: 640)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=65,
        help="WebP quality (default: 65)",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        default=True,
        help="Skip thumbnails that already exist (default: on)",
    )
    parser.add_argument(
        "--no-skip-existing",
        dest="skip_existing",
        action="store_false",
        help="Regenerate thumbnails even if output file exists",
    )
    return parser.parse_args()


def iter_images(base_dir: Path):
    for path in base_dir.rglob("*"):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTS:
            yield path


def ensure_output_is_not_inside_input(input_dir: Path, output_dir: Path):
    try:
        output_dir.relative_to(input_dir)
    except ValueError:
        return
    raise ValueError("Output folder must be outside input folder to avoid recursive processing.")


def resize_contain(im: Image.Image, max_size: int) -> Image.Image:
    im = ImageOps.exif_transpose(im)
    if im.mode not in ("RGB", "RGBA"):
        # Preserve alpha if present in paletted/other modes.
        im = im.convert("RGBA" if "transparency" in im.info else "RGB")
    im.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    return im


def save_webp(im: Image.Image, dst: Path, quality: int):
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, format="WEBP", quality=quality, method=6)


def main():
    args = parse_args()

    if not features.check("webp"):
        print("Pillow WebP support is not available in this Python installation.")
        sys.exit(1)

    input_dir = Path(args.input_dir).resolve()
    output_dir = Path(args.output_dir).resolve()

    if not input_dir.exists():
        print(f"Input folder not found: {input_dir}")
        sys.exit(1)

    try:
        ensure_output_is_not_inside_input(input_dir, output_dir)
    except ValueError as exc:
        print(str(exc))
        sys.exit(1)

    images = list(iter_images(input_dir))
    total = len(images)

    print(f"Input: {input_dir}")
    print(f"Output: {output_dir}")
    print(f"Found: {total} images")
    print(f"Thumb max size: {args.size}px | WebP quality: {args.quality}")

    if total == 0:
        return

    saved = 0
    skipped = 0
    errors = 0

    for index, src in enumerate(images, start=1):
        rel = src.relative_to(input_dir)
        dst = (output_dir / rel).with_suffix(".webp")

        if args.skip_existing and dst.exists():
            skipped += 1
        else:
            try:
                with Image.open(src) as im:
                    thumb = resize_contain(im, args.size)
                    save_webp(thumb, dst, args.quality)
                saved += 1
            except UnidentifiedImageError:
                errors += 1
                print(f"[ERROR] Invalid image: {src}")
            except Exception as exc:
                errors += 1
                print(f"[ERROR] {src}: {exc}")

        if index % 100 == 0 or index == total:
            print(f"Processed {index}/{total} | Saved {saved} | Skipped {skipped} | Errors {errors}")

    print(f"Done. Saved {saved}, Skipped {skipped}, Errors {errors}, Total {total}")


if __name__ == "__main__":
    main()
