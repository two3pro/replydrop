#!/usr/bin/env python3

from __future__ import annotations

import random
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parent.parent
DOCS_ASSETS = ROOT / "docs" / "assets"
STORE_DIR = ROOT / "docs" / "store"
ICONS_DIR = ROOT / "icons"
README_HERO_PATH = DOCS_ASSETS / "replydrop-github-hero.png"
README_LOOP_PATH = DOCS_ASSETS / "replydrop-github-demo-loop.gif"
SMALL_PROMO_TILE_PATH = STORE_DIR / "chrome-web-store-small-promo-tile.png"
MARQUEE_PROMO_TILE_PATH = STORE_DIR / "chrome-web-store-marquee-promo-tile.png"
PROMO_VIDEO_PATH = STORE_DIR / "replydrop-chrome-web-store-promo.mp4"
PROMO_VIDEO_POSTER_PATH = STORE_DIR / "replydrop-chrome-web-store-promo-poster.png"

CANVAS_SIZE = (1280, 800)
PROMO_TILE_SIZE = (440, 280)
MARQUEE_SIZE = (1400, 560)
PROMO_VIDEO_SIZE = (1280, 720)
BG_COLOR = "#3a3634"
PAPER_COLOR = "#f6eed8"
INK_COLOR = "#231f1b"
RAIL_COLOR = "#24201c"
GOLD = "#eccf8c"
BLUE = "#63a8ff"
BLUE_DEEP = "#275cc3"
LINE_COLOR = "#d7c9aa"
TOKEN_PATTERN = re.compile(r"[A-Za-z0-9./_-]+|\s+|[^\x00-\x7F]|.")

STORE_SLIDES = [
    {
        "filename": "chrome-web-store-01-find-candidates.png",
        "screenshot_name": "replydrop-popup-home.png",
        "eyebrow": "DISCOVER FIRST",
        "title": "实时给 X 帖子打分\n先把窗口里的机会捞出来",
        "body": "ReplyDrop 会在你已经看到的公开帖子上直接给出分数和水滴提示，让你先判断窗口，再决定要不要出手。",
        "proofs": [
            "扫描当前时间线里已经可见的帖子，不靠额外后台页面。",
            "先看窗口是否还在起量，再决定要不要回复。",
        ],
        "chips": ["实时打分", "水滴提示", "窗口优先"],
        "accent": "#dcedef",
        "serial": "SCREEN 01  FIND CANDIDATES  1280x800",
        "tag": "LIVE SCORE",
    },
    {
        "filename": "chrome-web-store-02-language-boosts.png",
        "screenshot_name": "replydrop-popup-home.png",
        "eyebrow": "BOOST WHAT MATCHES",
        "title": "按语言和主题\n把回复机会收窄到你的主场",
        "body": "它不只是粗糙打分，还能按目标受众语言、细分主题和自定义关键词继续把候选压到更可执行的范围。",
        "proofs": [
            "回复语言加成覆盖中日韩英法西德意葡。",
            "AI / Crypto / Creator 等方向可直接加成，也支持自定义关键词。",
        ],
        "chips": ["多语种加成", "主题关键词", "自定义过滤"],
        "accent": "#eee0b9",
        "serial": "SCREEN 02  LANGUAGE BOOSTS  1280x800",
        "tag": "BOOST FILTERS",
    },
    {
        "filename": "chrome-web-store-03-layered-dashboard.png",
        "screenshot_name": "replydrop-dashboard-tabs.png",
        "eyebrow": "LAYERED DASHBOARD",
        "title": "首页保持轻\n真正工作区单独进仪表盘",
        "body": "ReplyDrop 把开关和入口留在首页，把工作台、概览、加成和关键词放进另一层仪表盘，避免插件一打开就是一条长网页。",
        "proofs": [
            "分层结构更像插件，不像被压扁的网页后台。",
            "先做决定，再进工作区，不会第一眼就被信息量劝退。",
        ],
        "chips": ["分层仪表盘", "票根视觉", "轻量入口"],
        "accent": "#efe5c6",
        "serial": "SCREEN 03  LAYERED DASHBOARD  1280x800",
        "tag": "LAYERED UI",
    },
    {
        "filename": "chrome-web-store-04-growth-dashboard.png",
        "screenshot_name": "replydrop-growth-dashboard.png",
        "eyebrow": "TRACK AFTER SHIP",
        "title": "把已发回复变成\n真正可复查的增长看板",
        "body": "Growth Dashboard 会把待执行、已发出、待确认和 pickup 复查看成一条连续链路，而不是只停留在候选数和抽象热度。",
        "proofs": [
            "发出后继续看 pickup，而不是发完就失联。",
            "把增长回到真实互动结果，而不是只看猜测。",
        ],
        "chips": ["Growth Dashboard", "Pickup 复查", "已发追踪"],
        "accent": "#dfeff5",
        "serial": "SCREEN 04  GROWTH DASHBOARD  1280x800",
        "tag": "POST-SHIP TRUTH",
    },
    {
        "filename": "chrome-web-store-05-local-automation.png",
        "screenshot_name": "replydrop-popup-home.png",
        "eyebrow": "AUTOMATION READY",
        "title": "给 Agent 稳定接口\n但不交出发送权",
        "body": "ReplyDrop 允许 Ada 或其他 AI Agent 通过 CDP 直接调用 ReplyDropAPI 读候选、入队和追踪状态，同时继续坚持本地优先和不自动发帖的边界。",
        "proofs": [
            "`window.ReplyDropAPI` 可以读候选、队列和完整状态快照。",
            "Agent 可直接 addToQueue / markShipped / skipCandidate。",
        ],
        "chips": ["ReplyDropAPI", "CDP / Agent", "Zero Upload"],
        "accent": "#e7ebf8",
        "serial": "SCREEN 05  AUTOMATION READY  1280x800",
        "tag": "AGENT CONTROL",
    },
]


def ensure_dirs() -> None:
    DOCS_ASSETS.mkdir(parents=True, exist_ok=True)
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
    tokens = TOKEN_PATTERN.findall(text)
    lines = []
    current = ""
    for token in tokens:
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
    ImageDraw.Draw(droplet_shadow).polygon(droplet_points(590, 508, 182), fill=255)
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

    canvas.save(STORE_DIR / "replydrop-store-icon-preview.png")
    for icon_size in (16, 32, 48, 128):
        canvas.resize((icon_size, icon_size), Image.Resampling.LANCZOS).save(ICONS_DIR / f"icon{icon_size}.png")


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


def draw_bullets(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, items: list[str]) -> int:
    font = load_font(24)
    current_y = y
    for item in items:
        draw.ellipse((x, current_y + 9, x + 14, current_y + 23), fill=GOLD, outline="#bc9250")
        wrapped = wrap(draw, item, font, width - 34)
        draw.multiline_text((x + 28, current_y), wrapped, fill="#51483d", font=font, spacing=7)
        bbox = draw.multiline_textbbox((x + 28, current_y), wrapped, font=font, spacing=7)
        current_y = bbox[3] + 14
    return current_y


def place_screenshot_card(
    canvas: Image.Image,
    box: tuple[int, int, int, int],
    screenshot_name: str,
    *,
    accent: str,
    serial: str,
    tag: str,
) -> None:
    shadow_mask = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(box, radius=38, fill=255)
    add_shadow(canvas, shadow_mask, offset=(0, 18), blur=22, opacity=95)

    frame = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame)
    frame_draw.rounded_rectangle(box, radius=38, fill="#f1e7ce", outline="#cab894", width=4)
    frame_draw.rounded_rectangle((box[0] + 22, box[1] + 18, box[2] - 18, box[1] + 96), radius=26, fill=accent)
    frame_draw.rectangle((box[0], box[1], box[0] + 36, box[3]), fill=RAIL_COLOR)
    draw_perforation(frame_draw, box[0] + 48, box[1] + 22, box[3] - 22, gap=11, dash=7, color="#d6c39e", width=2)
    frame_draw.text((box[0] + 78, box[1] + 40), serial, fill="#615747", font=load_font(22, kind="mono"))

    tag_font = load_font(22, kind="title")
    tag_bbox = frame_draw.textbbox((0, 0), tag, font=tag_font)
    tag_box = (box[2] - tag_bbox[2] - 56, box[1] + 28, box[2] - 26, box[1] + 76)
    frame_draw.rounded_rectangle(tag_box, radius=20, fill="#171412")
    frame_draw.text((tag_box[0] + 18, tag_box[1] + 11), tag, fill=PAPER_COLOR, font=tag_font)
    canvas.alpha_composite(frame)

    inner_box = (box[0] + 58, box[1] + 116, box[2] - 20, box[3] - 24)
    screenshot = fit_image(DOCS_ASSETS / screenshot_name, (inner_box[2] - inner_box[0], inner_box[3] - inner_box[1]))
    screenshot.putalpha(rounded_mask(screenshot.size, 26))
    paste_x = inner_box[0] + ((inner_box[2] - inner_box[0]) - screenshot.width) // 2
    paste_y = inner_box[1] + ((inner_box[3] - inner_box[1]) - screenshot.height) // 2
    canvas.alpha_composite(screenshot, dest=(paste_x, paste_y))


def make_store_screenshot(
    filename: str,
    screenshot_name: str,
    *,
    eyebrow: str,
    title: str,
    body: str,
    proofs: list[str],
    chips: list[str],
    accent: str,
    serial: str,
    tag: str,
) -> None:
    canvas = Image.new("RGBA", CANVAS_SIZE, BG_COLOR)
    card_box = draw_ticket_frame(canvas, accent)
    draw = ImageDraw.Draw(canvas)

    body_font = load_font(25)
    eyebrow_font = load_font(32, kind="title")
    proof_label_font = load_font(22, kind="title")

    text_left = card_box[0] + 150
    text_right = 648
    draw.text((text_left, card_box[1] + 78), eyebrow, fill="#4f6268", font=eyebrow_font)

    wrapped_title, title_font, title_bbox = fit_wrapped_font(
        draw,
        title,
        text_right - text_left,
        max_size=54,
        min_size=38,
        max_lines=4,
    )
    title_y = card_box[1] + 126
    draw.multiline_text((text_left, title_y), wrapped_title, fill=INK_COLOR, font=title_font, spacing=8)

    wrapped_body = wrap(draw, body, body_font, text_right - text_left)
    body_y = title_y + (title_bbox[3] - title_bbox[1]) + 28
    draw.multiline_text((text_left, body_y), wrapped_body, fill="#5f564a", font=body_font, spacing=12)
    body_bbox = draw.multiline_textbbox((text_left, body_y), wrapped_body, font=body_font, spacing=12)

    proof_label_y = body_bbox[3] + 26
    draw.text((text_left, proof_label_y), "WHY THIS WINS", fill="#8f7a59", font=proof_label_font)
    proofs_end_y = draw_bullets(draw, text_left, proof_label_y + 34, text_right - text_left, proofs)

    place_screenshot_card(canvas, (698, 92, 1146, 686), screenshot_name, accent=accent, serial=serial, tag=tag)

    overlay = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle((card_box[2] - 110, card_box[1] + 86, card_box[2] - 54, card_box[1] + 142), radius=28, fill=GOLD)
    overlay_draw.rounded_rectangle((card_box[2] - 96, card_box[1] + 100, card_box[2] - 68, card_box[1] + 128), radius=14, fill=INK_COLOR)
    canvas.alpha_composite(overlay)

    canvas.convert("RGB").save(STORE_DIR / filename, quality=95)


def generate_store_screenshots() -> None:
    for slide in STORE_SLIDES:
        make_store_screenshot(**slide)


def generate_readme_hero() -> None:
    size = (1600, 920)
    canvas = Image.new("RGBA", size, BG_COLOR)
    draw = ImageDraw.Draw(canvas)
    decorate_background(draw, size)

    hero_box = (74, 58, 1526, 850)
    shadow_mask = Image.new("L", size, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(hero_box, radius=66, fill=255)
    add_shadow(canvas, shadow_mask, offset=(0, 24), blur=36, opacity=112)

    draw.rounded_rectangle(hero_box, radius=66, fill=PAPER_COLOR)
    draw.rounded_rectangle((hero_box[0], hero_box[1], hero_box[0] + 126, hero_box[3]), radius=66, fill=RAIL_COLOR)
    draw.rectangle((hero_box[0] + 62, hero_box[1], hero_box[0] + 126, hero_box[3]), fill=RAIL_COLOR)
    draw_perforation(draw, hero_box[0] + 146, hero_box[1] + 46, hero_box[3] - 46, gap=16, dash=9, color="#d8c7a5", width=3)
    draw.rounded_rectangle((hero_box[0] + 170, hero_box[1] + 48, hero_box[2] - 48, hero_box[1] + 206), radius=38, fill="#dcecef")
    draw.line((hero_box[0] + 172, hero_box[1] + 246, hero_box[2] - 60, hero_box[1] + 246), fill="#d8ccb3", width=2)

    title_font = load_font(70, bold=True)
    body_font = load_font(30)
    eyebrow_font = load_font(34, kind="title")
    stat_font = load_font(24, kind="mono")
    proof_font = load_font(24)

    text_left = hero_box[0] + 188
    text_width = 600
    draw.text((text_left, hero_box[1] + 84), "REPLYDROP", fill="#53656d", font=eyebrow_font)
    hero_title = "给 X 时间线实时打分\n在窗口关闭前\n抓住最值得回复的机会"
    draw.multiline_text((text_left, hero_box[1] + 138), hero_title, fill=INK_COLOR, font=title_font, spacing=10)
    hero_body = "开源免费，本地运行，零数据上传。把发现候选、排队执行、发出复查和 Agent 接管收成一条插件尺度的本地工作流。"
    draw.multiline_text((text_left, hero_box[1] + 372), wrap(draw, hero_body, body_font, text_width), fill="#5f564a", font=body_font, spacing=12)

    proof_y = 566
    for index, proof in enumerate(
        [
            "实时打分 + 水滴提示",
            "分层仪表盘，不做成长网页",
            "本地队列、pickup 追踪、ReplyDropAPI 接管",
        ]
    ):
        row_y = proof_y + index * 50
        draw.ellipse((text_left, row_y + 8, text_left + 16, row_y + 24), fill=GOLD, outline="#c89d57")
        draw.text((text_left + 28, row_y), proof, fill="#51483d", font=proof_font)

    chip_y = hero_box[1] + 640
    chip_x = text_left
    for chip in ["Free & Open Source", "Local-First", "Agent Ready"]:
        chip_font = load_font(24, bold=True)
        bbox = draw.textbbox((0, 0), chip, font=chip_font)
        chip_width = bbox[2] + 58
        draw_chip(draw, (chip_x, chip_y, chip_x + chip_width, chip_y + 58), chip, fill="#fbf5e6", outline="#d7c69e", text_color="#5a5046", font_size=24)
        chip_x += chip_width + 16

    draw.text((text_left, hero_box[1] + 734), "REPLYDROP  •  LOCAL-FIRST X REPLY WORKFLOW", fill="#7d705f", font=load_font(24, kind="serif"))
    draw.text((text_left, hero_box[1] + 768), "README HERO  1600x920", fill="#847664", font=stat_font)

    place_screenshot_card(canvas, (1016, 172, 1288, 596), "replydrop-popup-home.png", accent="#dcecef", serial="HOME ENTRY", tag="LIVE")
    place_screenshot_card(canvas, (1198, 140, 1468, 564), "replydrop-dashboard-tabs.png", accent="#efe5c6", serial="DASHBOARD", tag="LAYERED")
    place_screenshot_card(canvas, (1108, 392, 1388, 778), "replydrop-growth-dashboard.png", accent="#dfeff5", serial="GROWTH", tag="REVIEW")

    canvas.convert("RGB").save(README_HERO_PATH, quality=95)


def generate_readme_demo_loop() -> None:
    frames = []
    for slide in STORE_SLIDES:
        image = Image.open(STORE_DIR / slide["filename"]).convert("RGBA")
        frame = Image.new("RGBA", (1140, 720), BG_COLOR)
        shadow_mask = Image.new("L", frame.size, 0)
        ImageDraw.Draw(shadow_mask).rounded_rectangle((42, 34, 1098, 686), radius=42, fill=255)
        add_shadow(frame, shadow_mask, offset=(0, 14), blur=22, opacity=94)
        fitted = ImageOps.contain(image, (1040, 640), Image.Resampling.LANCZOS)
        fitted.putalpha(rounded_mask(fitted.size, 26))
        frame.alpha_composite(fitted, dest=((frame.width - fitted.width) // 2, (frame.height - fitted.height) // 2))
        frames.append(frame.convert("P", palette=Image.ADAPTIVE))

    frames[0].save(
        README_LOOP_PATH,
        save_all=True,
        append_images=frames[1:],
        duration=[1500, 1500, 1500, 1500, 1800],
        loop=0,
        optimize=True,
        disposal=2,
    )


def draw_promotional_shell(
    base: Image.Image,
    card_box: tuple[int, int, int, int],
    *,
    accent: str,
    radius: int,
    rail_width: int,
    perforation_offset: int,
    header_height: int,
    center_notch_radius: int,
    bottom_notch_radius: int = 0,
    bottom_notch_step: int = 0,
    bottom_notch_gap_pattern: int = 0,
) -> None:
    draw = ImageDraw.Draw(base)
    decorate_background(draw, base.size)

    shadow_mask = Image.new("L", base.size, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(card_box, radius=radius, fill=255)
    add_shadow(base, shadow_mask, offset=(0, max(12, radius // 5)), blur=max(18, radius // 2), opacity=110)

    draw.rounded_rectangle(card_box, radius=radius, fill=PAPER_COLOR)
    draw.rounded_rectangle((card_box[0], card_box[1], card_box[0] + rail_width, card_box[3]), radius=radius, fill=RAIL_COLOR)
    draw.rectangle((card_box[0] + rail_width // 2, card_box[1], card_box[0] + rail_width, card_box[3]), fill=RAIL_COLOR)
    draw_perforation(
        draw,
        card_box[0] + rail_width + perforation_offset,
        card_box[1] + 28,
        card_box[3] - 28,
        gap=max(9, radius // 4),
        dash=max(6, radius // 5),
        color="#d5c39f",
        width=3,
    )
    draw.rounded_rectangle(
        (card_box[0] + rail_width + 38, card_box[1] + 28, card_box[2] - 28, card_box[1] + 28 + header_height),
        radius=max(22, radius // 2),
        fill=accent,
    )

    center_y = (card_box[1] + card_box[3]) // 2
    for side_x in (card_box[0], card_box[2]):
        draw.ellipse(
            (side_x - center_notch_radius, center_y - center_notch_radius, side_x + center_notch_radius, center_y + center_notch_radius),
            fill=BG_COLOR,
        )

    if bottom_notch_radius and bottom_notch_step:
        bottom_y = card_box[3] - max(4, bottom_notch_radius // 2)
        index = 0
        for x in range(card_box[0] + rail_width + 70, card_box[2] - 50, bottom_notch_step):
            if bottom_notch_gap_pattern and index % bottom_notch_gap_pattern == 1:
                index += 1
                continue
            draw.ellipse((x - bottom_notch_radius, bottom_y - bottom_notch_radius, x + bottom_notch_radius, bottom_y + bottom_notch_radius), fill=BG_COLOR)
            index += 1


def generate_small_promo_tile() -> None:
    canvas = Image.new("RGBA", PROMO_TILE_SIZE, BG_COLOR)
    card_box = (18, 16, 422, 262)
    draw_promotional_shell(
        canvas,
        card_box,
        accent="#dcecef",
        radius=34,
        rail_width=54,
        perforation_offset=12,
        header_height=54,
        center_notch_radius=17,
        bottom_notch_radius=12,
        bottom_notch_step=72,
        bottom_notch_gap_pattern=3,
    )

    draw = ImageDraw.Draw(canvas)
    eyebrow_font = load_font(20, kind="title")
    title_font = load_font(34, kind="title")
    body_font = load_font(16)
    chip_font = load_font(16, kind="title")

    draw.text((126, 36), "REPLYDROP", fill="#4f6268", font=eyebrow_font)
    draw.text((126, 78), "Find reply windows\nbefore they cool off", fill=INK_COLOR, font=title_font, spacing=5)
    body = wrap(draw, "Live scoring for visible X posts. Local-first queue, pickup, and review.", body_font, 232)
    draw.multiline_text((126, 164), body, fill="#5f564a", font=body_font, spacing=5)

    draw.rounded_rectangle((54, 86, 112, 198), radius=18, fill="#171412")
    draw.text((66, 118), "RD", fill=PAPER_COLOR, font=load_font(22, kind="title"))

    chip_box = (124, 220, 230, 248)
    draw.rounded_rectangle(chip_box, radius=14, fill="#171412")
    draw.text((chip_box[0] + 14, chip_box[1] + 7), "LOCAL-FIRST", fill=PAPER_COLOR, font=chip_font)

    canvas.convert("RGB").save(SMALL_PROMO_TILE_PATH, quality=95)


def generate_marquee_promo_tile() -> None:
    canvas = Image.new("RGBA", MARQUEE_SIZE, BG_COLOR)
    card_box = (46, 34, 1354, 524)
    draw_promotional_shell(
        canvas,
        card_box,
        accent="#eee0b9",
        radius=52,
        rail_width=92,
        perforation_offset=16,
        header_height=88,
        center_notch_radius=26,
        bottom_notch_radius=16,
        bottom_notch_step=116,
        bottom_notch_gap_pattern=3,
    )

    draw = ImageDraw.Draw(canvas)
    eyebrow_font = load_font(28, kind="title")
    title_font = load_font(54, kind="title")
    body_font = load_font(22)
    proof_font = load_font(18)

    text_left = 182
    draw.text((text_left, 78), "REPLYDROP  •  CHROME WEB STORE", fill="#596a72", font=eyebrow_font)
    draw.multiline_text((text_left, 132), "Score visible X posts.\nQueue the best replies.\nReview pickup locally.", fill=INK_COLOR, font=title_font, spacing=8)

    body = "ReplyDrop keeps the workflow plugin-scale: score the timeline you already see, queue promising posts, and revisit shipped replies with a local growth dashboard."
    wrapped_body = wrap(draw, body, body_font, 500)
    body_y = 324
    draw.multiline_text((text_left, body_y), wrapped_body, fill="#5f564a", font=body_font, spacing=9)
    body_bbox = draw.multiline_textbbox((text_left, body_y), wrapped_body, font=body_font, spacing=9)

    proof_y = body_bbox[3] + 18
    for index, proof in enumerate(
        [
            "Live scoring on x.com / twitter.com",
            "Layered dashboard, not a long admin page",
        ]
    ):
        row_y = proof_y + index * 28
        draw.ellipse((text_left, row_y + 6, text_left + 12, row_y + 18), fill=GOLD, outline="#c89d57")
        draw.text((text_left + 24, row_y), proof, fill="#51483d", font=proof_font)

    place_screenshot_card(canvas, (820, 112, 1128, 432), "replydrop-popup-home.png", accent="#dcecef", serial="HOME", tag="LIVE")
    place_screenshot_card(canvas, (1038, 86, 1314, 366), "replydrop-dashboard-tabs.png", accent="#efe5c6", serial="DASH", tag="LAYERED")
    place_screenshot_card(canvas, (1002, 284, 1288, 486), "replydrop-growth-dashboard.png", accent="#dfeff5", serial="GROWTH", tag="REVIEW")

    draw.rounded_rectangle((1234, 62, 1304, 118), radius=20, fill="#171412")
    draw.text((1254, 78), "RD", fill=PAPER_COLOR, font=load_font(24, kind="title"))

    canvas.convert("RGB").save(MARQUEE_PROMO_TILE_PATH, quality=95)


def render_video_slide(source_path: Path, *, label: str) -> Image.Image:
    canvas = Image.new("RGBA", PROMO_VIDEO_SIZE, BG_COLOR)
    draw = ImageDraw.Draw(canvas)
    decorate_background(draw, PROMO_VIDEO_SIZE)

    frame_box = (68, 56, 1212, 664)
    shadow_mask = Image.new("L", PROMO_VIDEO_SIZE, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(frame_box, radius=44, fill=255)
    add_shadow(canvas, shadow_mask, offset=(0, 16), blur=26, opacity=102)
    draw.rounded_rectangle(frame_box, radius=44, fill=PAPER_COLOR)
    draw.rounded_rectangle((frame_box[0], frame_box[1], frame_box[0] + 96, frame_box[3]), radius=44, fill=RAIL_COLOR)
    draw.rectangle((frame_box[0] + 48, frame_box[1], frame_box[0] + 96, frame_box[3]), fill=RAIL_COLOR)
    draw_perforation(draw, frame_box[0] + 116, frame_box[1] + 30, frame_box[3] - 30, gap=12, dash=8, color="#d6c39e", width=3)
    draw.rounded_rectangle((frame_box[0] + 144, frame_box[1] + 28, frame_box[2] - 28, frame_box[1] + 96), radius=28, fill="#dcecef")

    label_font = load_font(28, kind="title")
    draw.text((frame_box[0] + 168, frame_box[1] + 47), label, fill="#53656d", font=label_font)

    fitted = ImageOps.contain(Image.open(source_path).convert("RGBA"), (996, 520), Image.Resampling.LANCZOS)
    fitted.putalpha(rounded_mask(fitted.size, 28))
    canvas.alpha_composite(fitted, dest=(frame_box[0] + 156 + ((996 - fitted.width) // 2), frame_box[1] + 120 + ((500 - fitted.height) // 2)))
    return canvas


def generate_promo_video() -> None:
    ffmpeg_path = shutil.which("ffmpeg") or ("/opt/homebrew/bin/ffmpeg" if Path("/opt/homebrew/bin/ffmpeg").exists() else None)
    if not ffmpeg_path:
        print("Skipping promo video: ffmpeg not found")
        return

    storyboard = [
        (README_HERO_PATH, "REPLYDROP  •  OPEN SOURCE X REPLY WORKFLOW"),
        (STORE_DIR / "chrome-web-store-01-find-candidates.png", "SCREEN 01  •  FIND CANDIDATES"),
        (STORE_DIR / "chrome-web-store-02-language-boosts.png", "SCREEN 02  •  BOOST WHAT MATCHES"),
        (STORE_DIR / "chrome-web-store-03-layered-dashboard.png", "SCREEN 03  •  LAYERED DASHBOARD"),
        (STORE_DIR / "chrome-web-store-04-growth-dashboard.png", "SCREEN 04  •  GROWTH DASHBOARD"),
        (STORE_DIR / "chrome-web-store-05-local-automation.png", "SCREEN 05  •  AGENT READY"),
    ]

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        for index, (source_path, label) in enumerate(storyboard, start=1):
            frame = render_video_slide(source_path, label=label)
            frame_path = temp_path / f"frame-{index:02d}.png"
            frame.convert("RGB").save(frame_path, quality=95)
            if index == 1:
                frame.convert("RGB").save(PROMO_VIDEO_POSTER_PATH, quality=95)

        subprocess.run(
            [
                ffmpeg_path,
                "-y",
                "-framerate",
                "1/3",
                "-i",
                str(temp_path / "frame-%02d.png"),
                "-vf",
                "fps=30,format=yuv420p",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                str(PROMO_VIDEO_PATH),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def main() -> None:
    random.seed(42)
    ensure_dirs()
    generate_icon()
    generate_store_screenshots()
    generate_small_promo_tile()
    generate_marquee_promo_tile()
    generate_readme_hero()
    generate_readme_demo_loop()
    generate_promo_video()
    print(f"Generated store assets in {STORE_DIR} and icons in {ICONS_DIR}")


if __name__ == "__main__":
    main()
