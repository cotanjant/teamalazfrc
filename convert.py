import sys
from pathlib import Path

table = str.maketrans("çÇğĞıİöÖşŞüÜ", "cCgGiIoOsSuU")
root = Path(sys.argv[1] if len(sys.argv) > 1 else "src")
exts = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json", ".md"}

files = {}
for p in root.rglob("*"):
    if p.is_file() and p.suffix in exts:
        text = p.read_bytes().decode("utf-8")
        if text != text.translate(table):
            files[p] = text

for p in files:
    print(p)
if not files:
    sys.exit("nothing to change")

if input(f"{len(files)} files, apply? (y/n) ").lower() != "y":
    sys.exit("aborted")

for p, text in files.items():
    p.write_bytes(text.translate(table).encode("utf-8"))

left = [p for p in root.rglob("*") if p.suffix in exts and p.is_file()
        and any(c in p.read_text(encoding="utf-8") for c in "çÇğĞıİöÖşŞüÜ")]
print("left:", left if left else "none")
