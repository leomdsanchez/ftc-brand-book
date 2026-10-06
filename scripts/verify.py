"""Check source references, anchors and reproducible offline release artifacts."""

from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import re
import zipfile

from build import CSS_PATH, CSS_URL, HTML_OUTPUT, IMAGE_PATH, JS_PATH, ROOT, ZIP_OUTPUT, build, source_files


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.references = []
        self.resources = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            identity = attrs["id"]
            if identity in self.ids:
                raise ValueError(f"Duplicate HTML id: {identity}")
            self.ids.add(identity)
        for attribute in ("href", "src"):
            if attribute in attrs:
                self.references.append(attrs[attribute])
        resource_attribute = {"link": "href", "img": "src", "script": "src"}.get(tag)
        if resource_attribute in attrs:
            self.resources.append(attrs[resource_attribute])
        for attribute in ("aria-controls", "aria-labelledby", "aria-describedby", "for"):
            if attribute in attrs:
                self.references.extend("#" + value for value in attrs[attribute].split())


def check_reference(reference, base, document=None):
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        return
    if parsed.path:
        path = (base / unquote(parsed.path)).resolve()
        if not path.is_relative_to(ROOT) or not path.is_file():
            raise ValueError(f"Broken local reference: {reference}")
    elif parsed.fragment and document is not None and parsed.fragment not in document.ids:
        raise ValueError(f"Missing anchor or accessible label: {reference}")


def verify():
    source = Document((ROOT / "index.html").read_text(encoding="utf-8"))
    for reference in source.references:
        check_reference(reference, ROOT, source)
    for match in CSS_URL.finditer(CSS_PATH.read_text(encoding="utf-8")):
        check_reference(match.group(2), CSS_PATH.parent)
    for match in IMAGE_PATH.finditer(JS_PATH.read_text(encoding="utf-8")):
        check_reference(match.group(0), ROOT)
    for path in [ROOT / "README.md", *(ROOT / "docs").rglob("*.md")]:
        for reference in re.findall(r"\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
            check_reference(reference, path.parent)
    build()
    html_bytes, zip_bytes = HTML_OUTPUT.read_bytes(), ZIP_OUTPUT.read_bytes()
    standalone = Document(html_bytes.decode("utf-8"))
    if IMAGE_PATH.search(html_bytes.decode("utf-8")):
        raise ValueError("Standalone HTML or JS still references a local image")
    if any(not resource.startswith("data:") for resource in standalone.resources):
        raise ValueError("Standalone HTML still loads an external resource")
    embedded_css = re.search(r"<style>(.*?)</style>", html_bytes.decode("utf-8"), re.S).group(1)
    if any(not match.group(2).startswith("data:") for match in CSS_URL.finditer(embedded_css)):
        raise ValueError("Standalone CSS still loads an external resource")
    expected = {"frontrade-cryptos/" + path.relative_to(ROOT).as_posix(): path for path in source_files()}
    with zipfile.ZipFile(ZIP_OUTPUT) as archive:
        if set(archive.namelist()) != set(expected) or len(archive.namelist()) != len(expected):
            raise ValueError("Source ZIP manifest differs from the source allowlist")
        for name, path in expected.items():
            if archive.read(name) != path.read_bytes():
                raise ValueError(f"Source ZIP content differs: {name}")
    build()
    if html_bytes != HTML_OUTPUT.read_bytes() or zip_bytes != ZIP_OUTPUT.read_bytes():
        raise ValueError("Build outputs are not reproducible")
    print(f"OK: local paths, anchors, offline HTML and reproducible ZIP ({len(expected)} source files)")


if __name__ == "__main__":
    verify()
