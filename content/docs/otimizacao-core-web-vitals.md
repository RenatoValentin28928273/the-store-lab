---
title: "Core Web Vitals no Shopify: Guia de LCP, CLS e INP — The Lab Store"
seo_title: "Core Web Vitals no Shopify: Guia de LCP, CLS e INP — The Lab Store — The Store Lab"
description: "Como otimizar LCP, CLS e INP em lojas Shopify para atingir 90+ no Lighthouse. Técnicas reais de engenharia frontend com exemplos em Liquid e CSS."
date: 2024-03-31T20:00:00Z
category: "Design & Performance"
tag: "Design & Performance"
read_time: "5 min leitura"
---

<p>Atingir 90+ no Lighthouse em uma loja Shopify real — com apps, pixels de rastreamento e carrossel de imagens — é difícil. Não porque o Shopify seja lento, mas porque cada app instalado adiciona JavaScript ao thread principal, cada imagem não otimizada aumenta o LCP, e cada elemento sem dimensão reservada empurra o layout durante o carregamento.</p>

        <p>Neste guia documentamos as técnicas que aplicamos em produção para controlar os três Core Web Vitals que o Google mede: <strong>LCP</strong>, <strong>CLS</strong> e <strong>INP</strong>.</p>

        <h2 id="cwv-definicoes">1. LCP, CLS e INP: o que o Google mede</h2>
        <p>O Google PageSpeed Insights e o Chrome User Experience Report (CrUX) avaliam três dimensões distintas de experiência:</p>

        <ul>
          <li><strong>LCP — Largest Contentful Paint:</strong> tempo até o maior elemento visível (hero banner ou imagem de produto) ser renderizado. Meta: abaixo de 2,5 segundos. Acima de 4s é considerado "Ruim".</li>
          <li><strong>CLS — Cumulative Layout Shift:</strong> soma de todos os deslocamentos visuais inesperados durante o carregamento. Meta: abaixo de 0,1. Um popup que empurra o conteúdo ou uma fonte que substitui uma fallback são causas clássicas.</li>
          <li><strong>INP — Interaction to Next Paint:</strong> mede o tempo entre qualquer interação do usuário (clique, tap, tecla) e a próxima atualização visual. Substituiu o FID em março de 2024. Meta: abaixo de 200ms.</li>
        </ul>

        <p>Para e-commerce, o impacto é direto: cada segundo adicional de LCP reduz conversões em aproximadamente 12% (fonte: Google/Deloitte Digital, 2019 — ainda a referência mais citada na literatura de CRO). O CLS afeta a taxa de erro em formulários e cliques em botões errados em mobile. O INP ruim faz o botão "Adicionar ao Carrinho" parecer travado.</p>

        <h2 id="lcp-shopify">2. Otimizando o LCP no Shopify</h2>
        <p>O elemento LCP em 90% das lojas Shopify é o hero banner da home ou a imagem principal da página de produto. O caminho para um LCP rápido começa antes de o browser fazer o primeiro request.</p>

        <h3>Preload + fetchpriority no hero</h3>
        <p>O browser descobre a imagem LCP somente ao parsear o HTML e encontrar a tag <code class="inline-code">&lt;img&gt;</code>. Com <code class="inline-code">preload</code>, você instrui o browser a iniciar o download imediatamente, antes mesmo de processar o CSS ou JS que renderizaria esse elemento.</p>

        <div class="tech-snippet">&lt;!-- No &lt;head&gt; do seu theme.liquid --&gt;
&lt;link rel="preload" as="image"
  href="{{ section.settings.hero_image | image_url: width: 1200 }}"
  fetchpriority="high"
&gt;

&lt;!-- Na tag img do hero --&gt;
&lt;img
  src="{{ section.settings.hero_image | image_url: width: 1200 }}"
  srcset="{{ section.settings.hero_image | image_url: width: 600 }} 600w,
          {{ section.settings.hero_image | image_url: width: 900 }} 900w,
          {{ section.settings.hero_image | image_url: width: 1200 }} 1200w"
  sizes="100vw"
  fetchpriority="high"
  decoding="async"
  alt="{{ section.settings.hero_image.alt | escape }}"
  width="1200"
  height="600"
/&gt;
