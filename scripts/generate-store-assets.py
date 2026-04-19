#!/usr/bin/env python3

from __future__ import annotations

import random
import re
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parent.parent
DOCS_ASSETS = ROOT / "docs" / "assets"
STORE_DIR = ROOT / "docs" / "store"
ICONS_DIR = ROOT / "icons"

CANVAS_SIZE = (1280, 800)
BG_COLOR = "#3a3634"
PAPER_COLOR = "#f6eed8"
INK_COLOR = "#231f1b"
RAIL_COLOR = "#24201c"
GOLD = "#eccf8c"
BLUE = "#63a8ff"
BLUE_DEEP = "#275cc3"
LINE_COLOR = "#d7c9aa"
TOKEN_PATTERN = re.compile(r"[A-Za-z0-9./_-]+|\s+|[^\x00-\x7F]|.")


def ensure_dirs() -> None:
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    ICONS_DIR.mkdir(parents=True, exist_ok=True)


def load_font(size: int, *, kind: str = "sans", bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = []
    if kind == "title":
        candidates = [
            "/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf",
            "/System/Library/Fonts/Supplemental/Futura.ttc",
            "/System/Library/Fonts/Avenir Next Condensed.ttc",
        ]
    elif kind == "mono":
        candidates = [
            "/System/Library/Fonts/SFNSMono.ttf",
            "/System/Library/Fonts/Menlo.ttc",
        ]
    elif kind == "serif":
        candidates = [
            "/System/Library/Fonts/Supplemental/Georgia.ttf",
            "/System/Library/Fonts/Times.ttc",
        ]
    else:
        candidates = [
            "/System/Library/Fonts/Hiragino Sans GB.ttc",
            "/Library/Fonts/Arial Unicode.ttf",
            "/System/Library/Fonts/STHeiti Medium.ttc" if bold else "/System/Library/Fonts/STHeiti Light.ttc",
            "/System/Library/Fonts/Helvetica.ttc",
        ]

    for font_path in candidates:
        if Path(font_path).exists():
            try:
                return ImageFont.truetype(font_path, size=size)
            except OSError:
                continue

    return ImageFont.load_default()


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def sample_bezier(p0, p1, p2, p3, count=48):
    points = []
    for step in range(count + 1):
        t = step / count
        one_minus = 1 - t
        x = (
            (one_minus ** 3) * p0[0]
            + 3 * (one_minus ** 2) * t * p1[0]
            + 3 * one_minus * (t ** 2) * p2[0]
            + (t ** 3) * p3[0]
        )
        y = (
            (one_minus ** 3) * p0[1]
            + 3 * (one_minus ** 2) * t * p1[1]
            + 3 * one_minus * (t ** 2) * p2[1]
            + (t ** 3) * p3[1]
        )
        points.append((x, y))
    return points


def droplet_points(cx: float, cy: float, radius: float) -> list[tuple[float, float]]:
    top = (cx, cy - radius * 1.18)
    bottom = (cx, cy + radius * 1.18)
    left_curve = sample_bezier(
        top,
        (cx - radius * 0.96, cy - radius * 0.1),
        (cx - radius * 1.06, cy + radius * 0.88),
        bottom,
    )
    right_curve = sample_bezier(
        bottom,
        (cx + radius * 1.06, cy + radius * 0.88),
        (cx + radius * 0.96, cy - radius * 0.1),
        top,
    )
    return left_curve + right_curve


def draw_drop(draw: ImageDraw.ImageDraw, cx: float, cy: float, radius: float, *, fill: str, outline: str | None = None, outline_width: int = 0) -> None:
    points = droplet_points(cx, cy, radius)
    draw.polygon(points, fill=fill, outline=outline)
    if outline and outline_width > 1:
        for offset in range(1, outline_width):
            expanded = droplet_points(cx, cy, radius + offset * 0.6)
            draw.line(expanded + [expanded[0]], fill=outline, width=1)


def add_shadow(base: Image.Image, alpha_mask: Image.Image, *, offset=(0, 20), blur=30, opacity=120) -> None:
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    alpha = alpha_mask.filter(ImageFilter.GaussianBlur(blur))
    shadow.putalpha(alpha)
    shadow_layer = Image.new("RGBA", base.size, (0, 0, 0, opacity))
    shadow = ImageChops.multiply(shadow, shadow_layer)
    shifted = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shifted.alpha_composite(shadow, dest=offset)
    base.alpha_composite(shifted)


def draw_perforation(draw: ImageDraw.ImageDraw, x: int, y1: int, y2: int, *, gap=14, dash=8, color=LINE_COLOR, width=3) -> None:
    current = y1
    while current < y2:
        draw.line((x, current, x, min(current + dash, y2)), fill=color, width=width)
        current += dash + gap


def fit_image(path: Path, box: tuple[int, int]) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    return ImageOps.contain(image, box, Image.Resampling.LANCZOS)


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, width: int) -> str:
    words = TOKEN_PATTERN.findall(text)
    lines = []
    current = ""
    for token in words:
        candidate = f"{current}{token}"
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] <= width or not current:
            current = candidate
            continue
        lines.append(current.rstrip())
        current = token.lstrip()
    if current:
        lines.append(current.rstrip())
    return "\n".join(lines)


def fit_wrapped_font(draw: ImageDraw.ImageDraw, text: str, width: int, *, max_size: int, min_size: int, max_lines: int):
    best = None
    for size in range(max_size, min_size - 1, -2):
        font = load_font(size, bold=True)
        wrapped = wrap(draw, text, font, width)
        lines = wrapped.count("\n") + 1
        bbox = draw.multiline_textbbox((0, 0), wrapped, font=font, spacing=8)
        if lines <= max_lines and bbox[2] <= width:
            return wrapped, font, bbox
        best = (wrapped, font, bbox)
    return best


def draw_chip(draw: ImageDraw.ImageDraw, xy, text: str, *, fill: str, outline: str, text_color: str, font_size: int = 25) -> None:
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=22, fill=fill, outline=outline, width=2)
    font = load_font(font_size, bold=True)
    bbox = draw.textbbox((0, 0), text, font=font)
    tx = x1 + (x2 - x1 - bbox[2]) / 2
    ty = y1 + (y2 - y1 - bbox[3]) / 2 - 3
    draw.text((tx, ty), text, fill=text_color, font=font)


def generate_icon() -> None:
    size = 1024
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rect_box = (110, 96, 914, 928)

    shape_mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(shape_mask)
    mask_draw.rounded_rectangle(rect_box, radius=210, fill=255)
    notch_radius = 80
    notch_y = (rect_box[1] + rect_box[3]) // 2
    mask_draw.ellipse((rect_box[0] - notch_radius, notch_y - notch_radius, rect_box[0] + notch_radius, notch_y + notch_radius), fill=0)
    mask_draw.ellipse((rect_box[2] - notch_radius, notch_y - notch_radius, rect_box[2] + notch_radius, notch_y + notch_radius), fill=0)

    card = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card)
    card_draw.rounded_rectangle(rect_box, radius=210, fill=PAPER_COLOR, outline="#1c1916", width=22)
    card_draw.rectangle((rect_box[0], rect_box[1], rect_box[0] + 144, rect_box[3]), fill=RAIL_COLOR)
    draw_perforation(card_draw, rect_box[0] + 160, rect_box[1] + 94, rect_box[3] - 94, gap=15, dash=10, color="#d9c8a6", width=5)

    for y in range(rect_box[1] + 40, rect_box[3] - 40, 24):
        alpha = 18 if (y // 24) % 2 == 0 else 10
        card_draw.line((rect_box[0] + 198, y, rect_box[2] - 54, y), fill=(226, 213, 180, alpha), width=2)

    droplet_shadow = Image.new("L", (size, size), 0)
    shadow_draw = ImageDraw.Draw(droplet_shadow)
    shadow_draw.polygon(droplet_points(590, 508, 182), fill=255)
    add_shadow(canvas, droplet_shadow, offset=(0, 18), blur=32, opacity=110)

    masked_card = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    masked_card.paste(card, mask=shape_mask)
    canvas.alpha_composite(masked_card)

    draw = ImageDraw.Draw(canvas)
    draw_drop(draw, 560, 500, 212, fill=BLUE, outline=BLUE_DEEP, outline_width=6)
    draw_drop(draw, 560, 518, 138, fill="#96c7ff")
    draw.ellipse((616, 336, 688, 412), fill=(255, 255, 255, 170))
    draw.ellipse((254, 236, 318, 300), fill=GOLD)
    draw.ellipse((254, 712, 318, 776), fill=GOLD)

    preview_path = STORE_DIR / "replydrop-store-icon-preview.png"
    canvas.save(preview_path)

    for icon_size in (16, 32, 48, 128):
        resized = canvas.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        resized.save(ICONS_DIR / f"icon{icon_size}.png")


def decorate_background(draw: ImageDraw.ImageDraw, canvas_size: tuple[int, int]) -> None:
    width, height = canvas_size
    for offset in range(-height, width, 110):
        draw.line((offset, 0, offset + height, height), fill=(255, 255, 255, 12), width=2)
    for offset in range(-height, width, 220):
        draw.line((offset + 90, 0, offset + height + 90, height), fill=(0, 0, 0, 20), width=1)


def draw_ticket_frame(base: Image.Image, accent: str) -> tuple[int, int, int, int]:
    draw = ImageDraw.Draw(base)
    decorate_background(draw, base.size)

    card_box = (70, 58, 1210, 742)
    shadow_mask = Image.new("L", base.size, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(card_box, radius=54, fill=255)
    add_shadow(base, shadow_mask, offset=(0, 18), blur=28, opacity=105)

    draw.rounded_rectangle(card_box, radius=54, fill=PAPER_COLOR)
    rail_box = (card_box[0], card_box[1], card_box[0] + 96, card_box[3])
    draw.rounded_rectangle(rail_box, radius=54, fill=RAIL_COLOR)
    draw.rectangle((rail_box[0] + 46, rail_box[1], rail_box[2], rail_box[3]), fill=RAIL_COLOR)
    draw_perforation(draw, card_box[0] + 112, card_box[1] + 44, card_box[3] - 44, gap=14, dash=8, color="#d5c39f", width=3)

    notch_color = ImageColor_getrgb(BG_COLOR)
    notch_radius = 28
    center_y = (card_box[1] + card_box[3]) // 2
    bottom_y = card_box[3] - 10
    for side_x in (card_box[0], card_box[2]):
        draw.ellipse((side_x - notch_radius, center_y - notch_radius, side_x + notch_radius, center_y + notch_radius), fill=BG_COLOR)
    for x in range(card_box[0] + 210, card_box[2] - 90, 106):
        draw.ellipse((x - 24, bottom_y - 24, x + 24, bottom_y + 24), fill=BG_COLOR)

    draw.rounded_rectangle((card_box[0] + 130, card_box[1] + 44, card_box[2] - 40, card_box[1] + 188), radius=34, fill=accent)
    draw.line((card_box[0] + 132, card_box[1] + 232, card_box[2] - 52, card_box[1] + 232), fill="#d9ceb3", width=2)

    return card_box


def ImageColor_getrgb(color: str) -> tuple[int, int, int]:
    image = Image.new("RGB", (1, 1), color)
    return image.getpixel((0, 0))


def make_store_screenshot(filename: str, screenshot_name: str, *, eyebrow: str, title: str, body: str, chips: list[str], accent: str, serial: str) -> None:
    canvas = Image.new("RGBA", CANVAS_SIZE, BG_COLOR)
    card_box = draw_ticket_frame(canvas, accent)
    draw = ImageDraw.Draw(canvas)

    body_font = load_font(28)
    eyebrow_font = load_font(30, kind="title")
    serial_font = load_font(22, kind="mono")
    label_font = load_font(24, kind="serif")

    text_left = card_box[0] + 150
    text_right = 700
    draw.text((text_left, card_box[1] + 78), eyebrow, fill="#546167", font=eyebrow_font)
    wrapped_title, title_font, title_bbox = fit_wrapped_font(
        draw,
        title,
        text_right - text_left,
        max_size=56,
        min_size=42,
        max_lines=4,
    )
    title_y = card_box[1] + 126
    draw.multiline_text((text_left, title_y), wrapped_title, fill=INK_COLOR, font=title_font, spacing=8)
    wrapped_body = wrap(draw, body, body_font, text_right - text_left)
    body_y = title_y + (title_bbox[3] - title_bbox[1]) + 28
    draw.multiline_text((text_left, body_y), wrapped_body, fill="#5f564a", font=body_font, spacing=12)

    chip_y = body_y + 190
    chip_x = text_left
    chip_limit = screen_left = 710
    for chip in chips:
        chip_font = load_font(23, bold=True)
        bbox = draw.textbbox((0, 0), chip, font=chip_font)
        chip_width = bbox[2] + 56
        if chip_x + chip_width > chip_limit:
            chip_x = text_left
            chip_y += 72
        draw_chip(draw, (chip_x, chip_y, chip_x + chip_width, chip_y + 56), chip, fill="#fbf6ea", outline="#dccda9", text_color="#5a5046", font_size=23)
        chip_x += chip_width + 18

    footer_y = max(chip_y + 96, card_box[1] + 606)
    draw.text((text_left, footer_y), "LOCAL-FIRST X REPLY WORKFLOW", fill="#7b6d5c", font=label_font)
    draw.text((text_left, footer_y + 34), serial, fill="#857666", font=serial_font)

    screen_outer = (730, 110, 1132, 690)
    shadow_mask = Image.new("L", CANVAS_SIZE, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(screen_outer, radius=36, fill=255)
    add_shadow(canvas, shadow_mask, offset=(0, 16), blur=22, opacity=95)

    frame = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame)
    frame_draw.rounded_rectangle(screen_outer, radius=36, fill="#efe5ca", outline="#cab894", width=4)
    frame_draw.rectangle((screen_outer[0], screen_outer[1], screen_outer[0] + 34, screen_outer[3]), fill=RAIL_COLOR)
    draw_perforation(frame_draw, screen_outer[0] + 46, screen_outer[1] + 24, screen_outer[3] - 24, gap=11, dash=7, color="#dcc79f", width=2)
    canvas.alpha_composite(frame)

    inner_box = (screen_outer[0] + 46, screen_outer[1] + 22, screen_outer[2] - 18, screen_outer[3] - 22)
    screenshot = fit_image(DOCS_ASSETS / screenshot_name, (inner_box[2] - inner_box[0], inner_box[3] - inner_box[1]))
    inner_mask = rounded_mask(screenshot.size, 24)
    screenshot.putalpha(inner_mask)
    paste_x = inner_box[0] + ((inner_box[2] - inner_box[0]) - screenshot.width) // 2
    paste_y = inner_box[1] + ((inner_box[3] - inner_box[1]) - screenshot.height) // 2
    canvas.alpha_composite(screenshot, dest=(paste_x, paste_y))

    overlay = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle((card_box[2] - 110, card_box[1] + 86, card_box[2] - 54, card_box[1] + 142), radius=28, fill=GOLD)
    overlay_draw.rounded_rectangle((card_box[2] - 96, card_box[1] + 100, card_box[2] - 68, card_box[1] + 128), radius=14, fill=INK_COLOR)
    canvas.alpha_composite(overlay)

    output_path = STORE_DIR / filename
    canvas.convert("RGB").save(output_path, quality=95)


def generate_store_screenshots() -> None:
    make_store_screenshot(
        "chrome-web-store-01-find-candidates.png",
        "replydrop-popup-home.png",
        eyebrow="DISCOVER FIRST",
        title="把值得回复的 X 帖子先捞出来",
        body="ReplyDrop 会在时间线里给出本地评分、水滴提示和语言开关，让你先看窗口，再决定要不要出手。",
        chips=["本地打分", "水滴提示", "多语言"],
        accent="#dcedef",
        serial="SCREEN 01  FIND CANDIDATES  1280x800",
    )
    make_store_screenshot(
        "chrome-web-store-02-layered-dashboard.png",
        "replydrop-dashboard-tabs.png",
        eyebrow="LAYERED DASHBOARD",
        title="把仪表盘分层，而不是塞进一条长插件页",
        body="首页只保留入口和基础开关，真正的工作区单独进仪表盘，避免把所有信息挤在一条长面板里。",
        chips=["分层面板", "票根视觉", "轻量入口"],
        accent="#efe5c6",
        serial="SCREEN 02  LAYERED DASHBOARD  1280x800",
    )
    make_store_screenshot(
        "chrome-web-store-03-growth-dashboard.png",
        "replydrop-growth-dashboard.png",
        eyebrow="TRACK AFTER SHIP",
        title="把已发回复变成真正可追踪的增长看板",
        body="Growth Dashboard 聚合已发出、待确认和 pickup 复查，让回复结果不再停留在凭感觉判断。",
        chips=["Growth Dashboard", "Pickup 复查", "已发追踪"],
        accent="#dfeff5",
        serial="SCREEN 03  GROWTH DASHBOARD  1280x800",
    )
    make_store_screenshot(
        "chrome-web-store-04-local-automation.png",
        "replydrop-popup-home.png",
        eyebrow="LOCAL AUTOMATION READY",
        title="给自动化稳定接口 但不把发送权交出去",
        body="当前版本支持在 x.com 页面通过 ReplyDropAPI 读取候选、入队和标记已发，仍然坚持本地优先与人工发送边界。",
        chips=["ReplyDropAPI", "本地优先", "不自动发帖"],
        accent="#e7ebf8",
        serial="SCREEN 04  AUTOMATION READY  1280x800",
    )


def main() -> None:
    random.seed(42)
    ensure_dirs()
    generate_icon()
    generate_store_screenshots()
    print(f"Generated store assets in {STORE_DIR} and icons in {ICONS_DIR}")


if __name__ == "__main__":
    main()
