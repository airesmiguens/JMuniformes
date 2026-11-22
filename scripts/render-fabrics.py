"""Renders close-up fabric images for the site (public/images/tecidos/).

Each weave is simulated yarn by yarn: a height field (round yarns crossing
over/under), fibre streaks and twist, then lit like a macro photo with a soft
fold across the swatch. Stand-ins until real swatch photos exist.

    python3 scripts/render-fabrics.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

W, H = 960, 640
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "tecidos"
rng = np.random.default_rng(7)


def streaks(shape, along_axis, scale):
    """Fibre noise: fine across the yarn, long along it."""
    n = rng.standard_normal(shape)
    k = (1, int(scale)) if along_axis == 1 else (int(scale), 1)
    img = Image.fromarray(((n - n.min()) / (np.ptp(n)) * 255).astype(np.uint8))
    img = img.resize((max(1, shape[1] // k[1]), max(1, shape[0] // k[0])), Image.BILINEAR).resize(
        (shape[1], shape[0]), Image.BICUBIC
    )
    a = np.asarray(img, dtype=float) / 255.0
    return (a - 0.5) * 2


def smooth_noise(grid, amp):
    """Low-frequency noise field in [-amp, amp], used to make yarns wander and to drape the swatch."""
    n = rng.standard_normal((grid, int(grid * W / H)))
    img = Image.fromarray(((n - n.min()) / np.ptp(n) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return (np.asarray(img, dtype=float) / 255 - 0.5) * 2 * amp


def woven(pattern, cell, yarn_ratio=0.92):
    """Height field for a woven fabric. pattern(i, j) -> True when the warp (vertical) yarn is on top."""
    y, x = np.mgrid[0:H, 0:W].astype(float)
    x = x + smooth_noise(6, cell * 0.35)
    y = y + smooth_noise(6, cell * 0.35)
    i = (y // cell).astype(int)
    j = (x // cell).astype(int)
    u = (x % cell) / cell  # across the warp yarn
    v = (y % cell) / cell  # across the weft yarn
    warp_top = pattern(i, j)

    def yarn(across, along):
        d = np.clip(np.abs(across * 2 - 1) / yarn_ratio, 0, 1)
        h = np.sqrt(1 - d**2)
        dip = np.sin(np.pi * np.clip(along, 0, 1)) ** 0.35  # yarn dives under at the cell edges
        return h * (0.55 + 0.45 * dip)

    h_warp = yarn(u, v)
    h_weft = yarn(v, u)
    height = np.where(warp_top, h_warp, h_weft)

    # twist striations running diagonally along each yarn
    twist_w = np.sin((v * 5 + u * 1.6) * np.pi * 2) * 0.05
    twist_f = np.sin((u * 5 + v * 1.6) * np.pi * 2) * 0.05
    height += np.where(warp_top, twist_w, twist_f) * height

    fib_v = streaks((H, W), 0, cell * 3)
    fib_h = streaks((H, W), 1, cell * 3)
    height += np.where(warp_top, fib_v, fib_h) * 0.06
    # per-yarn thickness variation (slubs)
    col_var = rng.normal(0, 0.06, W // cell + 2)[j]
    row_var = rng.normal(0, 0.06, H // cell + 2)[i]
    height *= 1 + np.where(warp_top, col_var, row_var)
    return height, warp_top


def knit(cell_w, cell_h):
    """Jersey knit: columns of V-shaped loops."""
    y, x = np.mgrid[0:H, 0:W].astype(float)
    x = x + smooth_noise(6, cell_w * 0.25)
    y = y + smooth_noise(6, cell_h * 0.2)
    u = (x % cell_w) / cell_w
    v = (y % cell_h) / cell_h
    r = 0.26

    def seg_dist(px, py, ax, ay, bx, by):
        pax, pay = px - ax, py - ay
        bax, bay = bx - ax, by - ay
        t = np.clip((pax * bax + pay * bay) / (bax * bax + bay * bay), 0, 1)
        return np.hypot(pax - bax * t, pay - bay * t)

    # each loop: two legs leaning in, slightly offset so neighbours interlock
    d1 = seg_dist(u, v * 1.6, 0.05, -0.1, 0.48, 1.5)
    d2 = seg_dist(u, v * 1.6, 0.95, -0.1, 0.52, 1.5)
    d = np.minimum(d1, d2)
    h = np.sqrt(np.clip(1 - (d / r) ** 2, 0, 1))
    h += streaks((H, W), 0, cell_h) * 0.05 * h
    return h, None


def shade(height, base, warp_top=None, weft_tint=None, gloss=0.08, fold=True):
    y, x = np.mgrid[0:H, 0:W].astype(float)
    # macro drape: two soft diagonal folds plus gentle undulation
    t = (x / W) * 0.9 + (y / H) * 0.55
    drape = 0.5 * np.sin(t * np.pi * 2.0 + 0.4) + 0.25 * np.sin(t * np.pi * 4.3 + 1.7) + smooth_noise(3, 0.25)
    if not fold:
        drape *= 0
    total = height * 5.0 + drape * 90.0

    gy, gx = np.gradient(total)
    n = np.dstack([-gx, -gy, np.ones_like(total)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    light = np.array([-0.4, -0.5, 0.77])
    light /= np.linalg.norm(light)
    lam = np.clip((n * light).sum(axis=2), 0, 1)
    half = light + np.array([0, 0, 1.0])
    half /= np.linalg.norm(half)
    spec = np.clip((n * half).sum(axis=2), 0, 1) ** 30 * gloss
    ao = 0.72 + 0.28 * np.clip(height, 0, 1)  # crevices between yarns are a little darker

    col = np.ones((H, W, 3)) * np.array(base, dtype=float) / 255
    if warp_top is not None and weft_tint is not None:
        col = np.where(warp_top[..., None], col, np.array(weft_tint, dtype=float) / 255)
    # heathered yarn colour and fibre fuzz
    col = col * (1 + smooth_noise(40, 0.05)[..., None]) * (1 + rng.normal(0, 0.035, (H, W, 1)))

    img = col * (0.42 + 0.78 * lam[..., None]) * ao[..., None] + spec[..., None]
    vig = 1 - 0.18 * (((x / W - 0.5) ** 2 + (y / H - 0.5) ** 2) * 2.2)
    img *= vig[..., None]
    return np.clip(img, 0, 1)


def save(name, rgb, blur=0.6):
    im = Image.fromarray((rgb * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))
    # Downsample here with a proper filter: fine weaves shimmer (moiré) when the browser shrinks them.
    im = im.resize((640, 427), Image.LANCZOS)
    im.save(OUT / f"{name}.jpg", quality=84, optimize=True, progressive=True)
    print("wrote", OUT / f"{name}.jpg")


FABRICS = {
    # name: (height-field builder, base colour, weft colour, gloss)
    "sarja": (lambda: woven(lambda i, j: (j - i) % 4 != 0, 12), (48, 66, 112), (40, 56, 96), 0.06),
    "sarjinha": (lambda: woven(lambda i, j: (j - i) % 3 != 0, 9), (196, 176, 138), (182, 162, 124), 0.05),
    "popeline": (lambda: woven(lambda i, j: (i + j) % 2 == 0, 7, 0.98), (190, 214, 238), (178, 204, 230), 0.12),
    "minimatt": (lambda: woven(lambda i, j: ((i // 2) + (j // 2)) % 2 == 0, 8), (112, 116, 128), (100, 104, 116), 0.07),
    "malha": (lambda: knit(16, 22), (122, 62, 190), None, 0.05),
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (build, base, weft, gloss) in FABRICS.items():
        height, warp_top = build()
        save(name, shade(height, base, warp_top, weft, gloss))


if __name__ == "__main__":
    main()
