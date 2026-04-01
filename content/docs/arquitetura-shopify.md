---
title: "Arquitetura de Temas Shopify 2.0"
seo_title: "Arquitetura de Temas Shopify 2.0 — The Store Lab"
description: "Explore a arquitetura Online Store 2.0 e saiba como a The Lab Store desenvolve temas Shopify modulares de alta performance."
date: 2024-03-31T20:00:00Z
category: "Design & Performance"
tag: "Design & Performance"
read_time: "5 min leitura"
---

<p>A arquitetura <strong>Online Store 2.0 (OS2.0)</strong> introduziu o maior salto em flexibilidade para lojistas na história da Shopify. Antes as seções eram limitadas apenas à homepage; hoje é possível mover, adicionar e reordenar blocos em <em>qualquer</em> página (produto, coleções, artigos, etc.) utilizando um formato focado em JSON.</p>

<h2 id="por-que-jsons">1. O Fim das Templates Hardcoded</h2>
<p>Ao invés de codificar o esqueleto principal em um arquivo <code>.liquid</code> fechado, a The Lab Store desenvolve temas onde os templates raízes são transformados em <code class="inline-code">JSON</code>. Isso permite que a árvore de seções seja manipulada visualmente pelo Customizer do lojista, sem precisar mexer em código.</p>

<div class="tech-snippet">{
  "name": "Product Layout",
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {
"show_vendor": true
      }
    },
    "recommendations": {
      "type": "product-recommendations"
    }
  },
  "order": ["main", "recommendations"]
}
