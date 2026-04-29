# The Store Lab Live Site

Base local criada a partir da versao publica em `https://thestorelab.com.br/`.

## Arquivos principais

- `index.html`: estrutura da landing publicada.
- `base.css`: reset, tokens e primitivos compartilhados usados pela landing.
- `themes.css`: estilos que estavam inline no `index.html`.
- `home-reference.css`: estilos da home atual.
- `app.js`: comportamento que estava inline no fim do HTML.
- `style.css`: CSS publico original mantido como referencia, mas nao carregado pela home otimizada.

## Desenvolvimento local

```bash
npm run dev
```

O projeto usa um servidor local estatico em Node, sem etapa de build.
