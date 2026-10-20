"""
monogram.py — generate a simple brand icon set from initials + a hex colour.

Usage:
    python3 scripts/monogram.py "<initials>" "<#hexcolor>" <outdir>

Writes files matching the names already used under public/*/brand/:
    favicon.ico (16/32/48 multi-size), favicon-16x16.png, favicon-32x32.png,
    apple-touch-icon.png (180), android-chrome-192x192.png,
    android-chrome-512x512.png, plus a bonus logo.png (512) monogram.

Used when a client has no logo: pass their initials (e.g. "MC") and a brand
hex colour and this fills brand/ with a plain, legible monogram instead of a
missing/broken icon.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/local/lib/python3.12/site-packages/matplotlib/mpl-data/fonts/ttf/DejaVuSans-Bold.ttf",
]


def _font(size: int):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _swatch(initials: str, hex_color: str, size: int) -> Image.Image:
    img = Image.new("RGB", (size, size), hex_color)
    draw = ImageDraw.Draw(img)
    text = initials.strip().upper()[:3] or "?"
    font_size = int(size * 0.46)
    font = _font(font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1]), text, font=font, fill="#FFFFFF")
    return img


def generate(initials: str, hex_color: str, outdir: str) -> None:
    if not hex_color.startswith("#"):
        hex_color = "#" + hex_color
    os.makedirs(outdir, exist_ok=True)

    sizes_png = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
        "logo.png": 512,
    }
    for name, size in sizes_png.items():
        _swatch(initials, hex_color, size).save(os.path.join(outdir, name))

    # favicon.ico — multi-resolution icon (16/32/48), built from the same monogram.
    ico_sizes = [16, 32, 48]
    biggest = _swatch(initials, hex_color, max(ico_sizes))
    biggest.save(
        os.path.join(outdir, "favicon.ico"),
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
    )


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("usage: monogram.py <initials> <#hexcolor> <outdir>", file=sys.stderr)
        sys.exit(1)
    generate(sys.argv[1], sys.argv[2], sys.argv[3])
    print("done")
