# Desenvolvimento e publicação

## Arquitetura

O site é um documento HTML com uma folha de estilos e um script carregado com `defer`. Todos os recursos de execução estão no repositório. Não há API, banco de dados, autenticação, envio de formulário ou compra real. O único link externo de navegação leva ao site da marca.

`index.html` define nove blocos: a visão geral e oito seções numeradas. IDs de seções alimentam a navegação. O sprite SVG no início do documento fornece os símbolos usados por `<use href="#i-…">`.

`assets/js/app.js` é uma IIFE, com escopo privado e execução única após a análise do HTML. Seus grupos comentados são utilitários, fundamentos visuais, botões, campos, dados, feedback, exportação e navegação. Os seletores dependem dos IDs e dos atributos `data-*` de `index.html`: atualize ambos quando mudar a estrutura. O script é a demonstração desta página, não uma biblioteca genérica para importar parcialmente.

`assets/css/styles.css` contém a base seguida dos refinamentos que definem o visual atual. Foi formatado para leitura sem reordenar regras. As declarações posteriores continuam prevalecendo de acordo com especificidade e ordem; não mova os blocos por assunto sem comparar desktop, mobile e estados. A consolidação de regras sobrepostas exige uma revisão visual própria. Os tokens ficam no primeiro `:root`; a exportação no JavaScript lê seus valores calculados.

## Onde ajustar

| Ajuste                   | Arquivo / ponto de entrada                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Textos, seções e ícones  | `index.html`                                                                                               |
| Cores, fontes e medidas  | `assets/css/styles.css`, `:root` e `@font-face`                                                            |
| Hover dos botões         | `.btn::after`, seletores `:hover` e transição final de `.btn`                                              |
| Navegação original       | `.brand-nav`, modo compacto e seletor de prévia em `#navigation`                                           |
| Catálogo                 | `#images`; manifesto em `assets/images/original/manifest.json`; gerador `scripts/catalog.py`               |
| Glass                    | `.glass-stage` / `.glass-security`; cenário original em `assets/images/original/2026-01-unnamed-file.webp` |
| Dados e fluxos fictícios | `assets/js/app.js`, grupos botões, formulário e tabela                                                     |
| Empacotamento            | `scripts/build.py`                                                                                         |

O hover atual expande o branco do centro para as laterais em −45°, com 240 ms e `ease-in-out` na entrada e na saída. O glass fica delimitado ao painel central de `#glass` e à barra `.brand-nav` da prévia em `#navigation`. Não adicionar novamente canvas, fumaça, partículas em tela inteira ou animações de entrada/saída ligadas à rolagem. Movimento reduzido desativa animações e transições decorativas.

## Caminhos e cache

Os caminhos do HTML são relativos à raiz da publicação e os caminhos `url(...)` do CSS são relativos a `assets/css/`. Preserve essa distinção: fontes em `../fonts/` e imagens em `../images/`. Não use caminhos que comecem com `/assets`, pois o Pages publica em `/ftc-brand-book/`.

Quando mudar CSS ou JavaScript, atualize os parâmetros `?v=` dos dois recursos em `index.html`. Eles invalidam caches do navegador. Os arquivos de origem e seus nomes são únicos; não manter cópias em outra pasta.

## Comandos

Execute a partir da raiz do projeto:

```sh
python3 -m http.server 3000
python3 scripts/verify.py
node --check assets/js/app.js
git diff --check
```

Python 3.10+ e sua biblioteca padrão bastam para servidor/build/verificação. Node 18+ permite conferir a sintaxe. Não existe `npm install` obrigatório. A formatação usa Prettier 3.6.2, opcional, com `.prettierrc.json`:

```sh
npx --yes prettier@3.6.2 --check index.html assets/css/styles.css assets/js/app.js
```

Para formatar, substitua `--check` por `--write`. A sensibilidade estrita de whitespace no HTML preserva espaços entre elementos inline. `.editorconfig` padroniza UTF-8, LF, indentação e newline final.

## Build e verificação estrutural

`scripts/build.py` incorpora CSS, JavaScript, as três fontes, o logotipo, o cenário SVG e os logos de criptomoedas (inclusive referências no JavaScript) em um HTML independente. Falha se os recursos esperados ou os pontos de inserção não forem encontrados. O ZIP inclui somente as pastas e extensões declaradas em `source_files()`, além dos arquivos de configuração explícitos. Ordem e metadados do ZIP são fixos, tornando execuções com os mesmos arquivos e ambiente reproduzíveis.

`scripts/verify.py` detecta caminhos locais quebrados no HTML/CSS/documentação, IDs duplicados, âncoras e referências acessíveis ausentes. Gera os entregáveis, verifica que o HTML não carrega recursos externos, compara cada membro do ZIP com sua origem e repete o build para conferir os bytes. Esses checks não substituem inspeção visual, interação em navegador ou testes de acessibilidade.

O navegador precisa suportar `<dialog>`, `inert`, `backdrop-filter`, propriedades CSS customizadas e os recursos JavaScript modernos usados na página. A validação de interface é feita no Chromium atual; não há matriz formal de suporte a outros navegadores.

## Checklist de interface

Antes de entregar, conferir as três variantes de botão, hover, teclado, pressionado, desabilitado e carregamento; validar o formulário, buscar/ordenar a tabela, abrir/fechar os modais e testar cópia/exportação. Conferir navegação no desktop e menu mobile, ausência de overflow horizontal e os efeitos glass delimitados aos exemplos. Validar também o menu do header original (incluindo Escape), a abertura/fechamento da prévia ampliada, os filtros e downloads do catálogo. Testar o HTML de `dist/` offline quando entregar esse arquivo.

As revisões anteriores de acessibilidade e responsividade estão registradas em `history/REVISAO-v0.2.md`. Seus resultados são históricos, não garantias para alterações posteriores.

## Publicação e recuperação

O Pages existente publica os arquivos da `main`, com `index.html` na raiz. O workflow automático observado é `pages build and deployment`, de caminho `dynamic/pages/pages-build-deployment`; não há workflow de deployment próprio versionado neste projeto. A reorganização preserva esse modelo. Verifique **Settings → Pages** antes de qualquer mudança futura de origem da publicação.

Após validar: revisar o diff, fazer commit e push na `main`, aguardar a conclusão do workflow e conferir o site. `dist/` não é publicado nem versionado: distribua seus arquivos separadamente quando precisar da versão offline. Para desfazer uma mudança publicada, prefira `git revert` do commit e um novo push, preservando o histórico.
