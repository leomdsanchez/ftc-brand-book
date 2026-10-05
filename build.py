"""Build the standalone brand book and source ZIP with no dependencies."""
from pathlib import Path
import base64
import re
import zipfile

root = Path(__file__).resolve().parent
css = (root / "styles.css").read_text()
for name in ("Satoshi-Regular.woff2", "Satoshi-Medium.woff2", "Satoshi-Bold.woff2"):
    encoded = base64.b64encode((root / "assets" / name).read_bytes()).decode()
    css = css.replace("assets/" + name, "data:font/woff2;base64," + encoded)

html = (root / "index.html").read_text()
html = re.sub(r'<link rel="stylesheet" href="styles\.css(?:\?[^"]*)?">', lambda _: "<style>" + css + "</style>", html)
html = re.sub(r'<script src="app\.js(?:\?[^"]*)?" defer></script>', "", html)
logo = base64.b64encode((root / "assets/logo.webp").read_bytes()).decode()
html = html.replace("assets/logo.webp", "data:image/webp;base64," + logo)
script = (root / "app.js").read_text().replace("</script", "<\\/script")
html = html.replace("</body>", "<script>" + script + "</script></body>")
(root / "frontrade-brand-book.html").write_text(html)

archive = root.parent / "frontrade-ui-kit.zip"
excluded_directories = {".git", "__pycache__", ".venv", "node_modules"}
with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as package:
    for file in sorted(root.rglob("*")):
        relative = file.relative_to(root)
        if (
            file.is_file()
            and not excluded_directories.intersection(relative.parts)
            and file.suffix not in (".png", ".pyc", ".zip")
            and not file.name.startswith(".env")
            and file.name != ".DS_Store"
        ):
            package.write(file, "frontrade-cryptos/" + str(relative))
print(f"HTML e ZIP atualizados: {root / 'frontrade-brand-book.html'}; {archive}")
