import os
import re

def fix_mobile_menu(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Group sublinks in a div if not already grouped
    # We look for a sequence of 2 or more mobile-link-sub
    # Match the sequence of <a> tags
    pattern = r'((?:<a[^>]*class="mobile-link mobile-link-sub"[^>]*>.*?</a>\s*){2,})'
    
    def wrap_sublinks(match):
        links = match.group(0).strip()
        # Clean up arrows and whitespace inside <a> tags
        # Also ensure we don't double wrap if we run this twice
        if 'mobile-sublinks-group' in links:
            return match.group(0)
            
        links = re.sub(r'→\s*', '', links) # Remove arrows for cleaner look
        return f'<div class="mobile-sublinks-group">\n      {links}\n    </div>'
    
    new_content = re.sub(pattern, wrap_sublinks, content)
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed: {file_path}")
        return True
    return False

# Search in the workspace (adjust path if needed)
base_path = "."
for root, dirs, files in os.walk(base_path):
    for file in files:
        if file.endswith('.html'):
            fix_mobile_menu(os.path.join(root, file))
