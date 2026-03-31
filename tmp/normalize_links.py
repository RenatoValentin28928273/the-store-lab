import os
import re

base_dir = r"c:\Users\acer\Desktop\The Store Lab"

def normalize_links(content, depth):
    # depth 1: docs/ or servicos/ (use ../ to reach root)
    # depth 2: docs/categorias/ (use ../../ to reach root)
    prefix = "../" * depth
    
    # Replace ../ or ../../ with /
    # But be careful with images/scripts that might be in the same folder (though they seem to be in root)
    
    # Common patterns:
    # href="../style.css" -> href="/style.css"
    # href="../../style.css" -> href="/style.css"
    # src="../script.js" -> src="/script.js"
    # href="../index.html" -> href="/"
    
    # Use regex to find attributes starting with the relative prefix
    # Matches href="../..." or src="../..."
    pattern = rf'(href|src)=["\']{re.escape(prefix)}([^"\']*)["\']'
    repl = r'\1="/\2"'
    content = re.sub(pattern, repl, content)
    
    # Special cases for root
    content = content.replace('href="/"', 'href="/"') # Just in case
    content = content.replace('href="/index.html"', 'href="/"')
    
    return content

# Apply only to specific folders
folders = {
    "servicos": 1,
    "docs": 1,
    "docs/categorias": 2
}

for folder_rel, depth in folders.items():
    folder_path = os.path.join(base_dir, folder_rel)
    if not os.path.exists(folder_path): continue
    
    for file in os.listdir(folder_path):
        if file.endswith(".html"):
            file_path = os.path.join(folder_path, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = normalize_links(content, depth)
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Normalized links in: {file_path}")
