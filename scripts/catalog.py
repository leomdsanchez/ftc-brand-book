"""Render the static image catalog from its checked-in provenance manifest."""

from pathlib import Path
import hashlib
import html
import json

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets/images/original/manifest.json"
START = "<!-- ORIGINAL-CATALOG:START -->"
END = "<!-- ORIGINAL-CATALOG:END -->"
CATEGORIES = {"logos": "Logos", "backgrounds": "Fundos", "illustrations": "Ilustrações"}


def entries():
    return json.loads(MANIFEST.read_text(encoding="utf-8"))["images"]


def validate():
    """Check original bytes, preview bytes and unique paths without network access."""
    rows = entries()
    paths = [row["file"] for row in rows]
    if len(paths) != len(set(paths)):
        raise ValueError("Duplicate catalog paths")
    for row in rows:
        if row["category"] not in CATEGORIES:
            raise ValueError(f"Unknown category: {row['category']}")
        for key, digest in (("file", "sha256"), ("preview", "preview_sha256")):
            path = (ROOT / row[key]).resolve()
            if not path.is_relative_to(ROOT / "assets/images") or path.is_symlink():
                raise ValueError(f"Invalid catalog asset: {row[key]}")
            if hashlib.sha256(path.read_bytes()).hexdigest() != row[digest]:
                raise ValueError(f"Catalog asset changed: {row[key]}")
        if (ROOT / row["file"]).stat().st_size != row["bytes"]:
            raise ValueError(f"Incorrect file size: {row['file']}")
    return rows


def render():
    cards = []
    for row in validate():
        value = {key: html.escape(str(item), quote=True) for key, item in row.items()}
        cards.append(f'''<article class="image-card" data-image-category="{value['category']}">
  <div class="image-card-preview image-card-preview--{value['category']}">
    <img src="{value['preview']}" alt="{value['title']}" loading="lazy" decoding="async" width="{value['preview_width']}" height="{value['preview_height']}" />
  </div>
  <div class="image-card-body">
    <span class="label">{CATEGORIES[row['category']]}</span>
    <h3>{value['title']}</h3>
    <p>{value['name']}</p>
    <div class="image-card-meta"><span>{value['width']} × {value['height']}</span><span>{Path(row['file']).suffix[1:].upper()} · {row['bytes'] / 1024:.1f} KB</span></div>
    <a class="image-download" href="{value['file']}" download="{value['name']}">Baixar original <svg class="icon" aria-hidden="true"><use href="#i-download" /></svg></a>
  </div>
</article>''')
    return "\n".join(cards)


if __name__ == "__main__":
    path = ROOT / "index.html"
    document = path.read_text(encoding="utf-8")
    before, remainder = document.split(START, 1)
    _, after = remainder.split(END, 1)
    path.write_text(before + START + "\n" + render() + "\n" + END + after, encoding="utf-8")
    print(f"Rendered {len(entries())} original images")
