import os

replacements = {
    'Ã§': 'ç', 'Ã£': 'ã', 'Ã©': 'é', 'Ã³': 'ó', 'Ã­': 'í', 'Ãª': 'ê', 'Ã¡': 'á', 'Ã´': 'ô', 'Ã ': 'à', 'Ãº': 'ú', 'Ãš': 'Ú', 'Ã€': 'À', 'Ã¢': 'â',
    'â€”': '—', 'â†’': '→', 'â€œ': '“', 'â€\x9d': '”', 'â€˜': '‘', 'â€™': '’', 'â€¢': '•', 'â€¦': '…', 'Â©': '©', 'Ã\xad': 'í'
}

base_dir = r"c:\Users\acer\Desktop\The Store Lab"

for root, dirs, files in os.walk(base_dir):
    if ".gemini" in root or "node_modules" in root:
        continue
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                changed = False
                for old, new in replacements.items():
                    if old in content:
                        content = content.replace(old, new)
                        changed = True
                
                # Fix mobile menu double comments
                if "<!-- Mobile Menu -->\n    <!-- Mobile Menu -->" in content:
                    content = content.replace("<!-- Mobile Menu -->\n    <!-- Mobile Menu -->", "<!-- Mobile Menu -->")
                    changed = True
                
                if changed:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Fixed: {file_path}")
            except Exception as e:
                print(f"Error on {file_path}: {e}")
