"""Generate web-optimized images for Nikita biodata."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).parent
SRC = ROOT / "pic"
OUT = SRC / "web"
OUT.mkdir(exist_ok=True)

PROFILE_SRC = "DSC01536.jpg"
GALLERY = [
    "DSC01532.jpg",
    "DSC01534.jpg",
    "DSC01536.jpg",
    "DSC01538.jpg",
    "DSC01544.jpg",
    "Image1.jpeg",
    "Image2.jpeg",
]


def save_jpeg(img: Image.Image, path: Path, quality: int = 82) -> None:
    rgb = img.convert("RGB")
    rgb.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def make_profile() -> None:
    img = Image.open(SRC / PROFILE_SRC)
    img = ImageOps.exif_transpose(img)
    w, h = img.size
    side = min(w, h)
    face_y = int(h * 0.55)
    top = max(0, min(face_y - side // 2, h - side))
    left = (w - side) // 2
    cropped = img.crop((left, top, left + side, top + side))
    cropped = cropped.resize((340, 340), Image.Resampling.LANCZOS)
    save_jpeg(cropped, OUT / "profile.jpg", quality=88)
    print(f"profile.jpg -> {(OUT / 'profile.jpg').stat().st_size // 1024} KB")


def make_gallery(name: str) -> None:
    img = Image.open(SRC / name)
    img = ImageOps.exif_transpose(img)
    img.thumbnail((960, 1280), Image.Resampling.LANCZOS)
    out_name = Path(name).stem + ".jpg"
    save_jpeg(img, OUT / out_name, quality=82)

    thumb = img.copy()
    thumb.thumbnail((112, 112), Image.Resampling.LANCZOS)
    save_jpeg(thumb, OUT / f"thumb-{out_name}", quality=78)

    kb = (OUT / out_name).stat().st_size // 1024
    print(f"{out_name} -> {kb} KB")


if __name__ == "__main__":
    make_profile()
    for item in GALLERY:
        make_gallery(item)
    print("Done.")
