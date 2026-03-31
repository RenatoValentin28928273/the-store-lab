import os
import re
import glob

DOCS_DIR = './docs'
CONTENT_DIR = './content/docs'
TEMPLATE_FILE = './templates/doc.html'

def migrate():
    # Encontra todos os arquivos HTML na docs (exceto categorias e index)
    html_files = glob.glob(f"{DOCS_DIR}/*.html")
    
    for file_path in html_files:
        filename = os.path.basename(file_path)
        if filename in ['index.html', 'como-criar-loja-online-shopify.html', 'como-planejar-e-commerce-do-zero.html']:
            continue
            
        slug = filename.replace('.html', '')
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extrai Metadados simples
        title_match = re.search(r'<title>(.*?)<\/title>', content)
        title = title_match.group(1).replace(' — The Store Lab', '').replace(' — The Lab Store Docs', '') if title_match else slug
        
        desc_match = re.search(r'<meta name="description" content="(.*?)"', content)
        description = desc_match.group(1) if desc_match else ""
        
        # Extrai o corpo do artigo (div.article-body)
        body_match = re.search(r'<div class="article-body">(.*?)</div>', content, re.DOTALL)
        if not body_match:
            # Tenta outra classe comum em posts antigos
            body_match = re.search(r'<main.*?>(.*?)</main>', content, re.DOTALL)
            
        body = body_match.group(1).strip() if body_match else ""
        
        # Tenta extrair a categoria/tag do Breadcrumb ou de metadados
        category = "Docs"
        if 'Growth Tech' in content: category = "Growth Tech"
        elif 'Design' in content: category = "Design & Performance"
        
        # Cria o Markdown
        md_content = f"""---
title: "{title}"
seo_title: "{title} — The Store Lab"
description: "{description}"
date: 2024-03-31T20:00:00Z
category: "{category}"
tag: "{category}"
read_time: "5 min leitura"
---

{body}
"""
        
        target_path = os.path.join(CONTENT_DIR, f"{slug}.md")
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
            
        print(f"Migrated: {filename} -> {slug}.md")

if __name__ == "__main__":
    migrate()
