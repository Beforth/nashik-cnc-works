import re
import pathlib

html = pathlib.Path("public/karan-engineers-vcard.html").read_text(encoding="utf-8")
m = re.search(r"<style>(.*?)</style>", html, re.S)
css = m.group(1)
css = re.sub(r"\*\{[^}]+\}", "", css)
css = re.sub(r":root\{[^}]+\}", "", css)
css = re.sub(r"body\{[^}]+\}", "", css)

header = """@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
.vcard-scope {
  --orange: #E65C00;
  --orange-dark: #b34700;
  --orange-light: #fff3ec;
  --orange-mid: #ff7a2b;
  --orange-pale: #fff8f4;
  --text: #222;
  --subtext: #666;
  --border: #e8e8e8;
  --white: #fff;
  --radius: 10px;
  --shadow: 0 2px 12px rgba(230,92,0,0.10);
  font-family: 'Poppins', sans-serif;
  background: #f5f5f5;
  color: var(--text);
  min-height: 100vh;
}
.vcard-scope *, .vcard-scope *::before, .vcard-scope *::after {
  box-sizing: border-box;
}
"""

out_lines = [header.rstrip()]

for line in css.splitlines():
    s = line.strip()
    if not s:
        out_lines.append(line)
        continue
    if s.startswith("/*"):
        out_lines.append(line)
        continue
    if not s.startswith("."):
        out_lines.append(line)
        continue
    m2 = re.match(r"^(\s*)(\..*)$", line)
    if not m2:
        out_lines.append(line)
        continue
    ind, rest = m2.group(1), m2.group(2)
    if "{" not in rest:
        out_lines.append(line)
        continue
    i = rest.index("{")
    sel, decl = rest[:i], rest[i:]
    parts = [p.strip() for p in sel.split(",")]
    scoped = ", ".join(".vcard-scope " + p for p in parts)
    out_lines.append(ind + scoped + decl)

pathlib.Path("src/app/profile/profile-card.css").write_text("\n".join(out_lines) + "\n", encoding="utf-8")
print("Wrote src/app/profile/profile-card.css")
