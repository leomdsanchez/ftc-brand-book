# Origem e manutenção dos assets

| Arquivos                                           | Origem / finalidade                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `assets/images/logo.webp`                          | Logotipo usado no site público da Frontrade Cryptos; preservado sem redesenho                                        |
| `assets/fonts/Satoshi-*.woff2`                     | Arquivos da família Satoshi usados na referência da marca: pesos 400, 500 e 700                                      |
| `assets/images/original/2026-01-unnamed-file.webp` | Composição original da seção de segurança, usada nos cenários das amostras de glass e navegação                      |
| `assets/icons/crypto/*.svg`                        | Logos coloridos BTC, ETH e USDT da coleção Cryptocurrency Icons; SVGs preservados sem alteração                      |
| `assets/images/original/*`                         | 34 arquivos referenciados pelo DOM e CSS da homepage original em 06/10/2026; inclui variantes responsivas e favicons |
| `assets/images/original/manifest.json`             | URL de origem, finalidade, categoria, dimensões, tamanho e SHA-256 de cada original e prévia                         |
| `assets/images/previews/original/*.webp`           | Miniaturas derivadas dos originais maiores, com proporção preservada e limite de 640 × 360 px                        |
| Sprite SVG de `index.html`                         | Ícones inline que acompanham os exemplos; não fazem requisições externas                                             |
| `docs/previews/*.png`                              | Capturas históricas da biblioteca antes das últimas revisões visuais                                                 |

Referência de origem da marca: https://frontradecryptos.com/. O logotipo e as fontes não incluem licença, arquivo mestre do logotipo ou documentação de cessão. Esta reorganização não atribui uma licença nova a esses recursos: confirme os termos com a marca e a origem da fonte antes de redistribuí-los fora deste projeto.

Os logos de criptomoedas vêm de `spothq/cryptocurrency-icons`, commit `1a63530be6e374711a8554f31b17e4cb92c25fa5`, arquivos `svg/color/btc.svg`, `eth.svg` e `usdt.svg`. A licença publicada pela coleção é CC0 1.0; sua cópia integral está em [licenses/cryptocurrency-icons-CC0.md](licenses/cryptocurrency-icons-CC0.md). Origem: https://github.com/spothq/cryptocurrency-icons. A coleção é comunitária; não é apresentada como material publicado pelas próprias moedas.

Os arquivos são carregados localmente em cards e tabelas, com tamanho fixo e `alt=""` porque o nome e o ticker adjacentes identificam o ativo. O build incorpora também os ícones referenciados no JavaScript da tabela, preservando o funcionamento offline. Não há CDN, pacote de ícones ou fonte externa em execução.

O build incorpora os assets existentes e não baixa recursos. Novos arquivos precisam ter finalidade e origem registradas aqui. Preserve o nome e a extensão ou atualize os caminhos no HTML/CSS e as expectativas do build. Use imagens leves e estáticas para cenários decorativos.

## Catálogo do site original

O inventário cobre as URLs de imagens encontradas na homepage e nas folhas de estilo carregadas por ela, inclusive regras mobile, tablet e imagens ocultas no desktop. Repetições da mesma URL foram removidas; variantes com arquivos distintos foram preservadas. Não representa toda a biblioteca de mídia do WordPress nem imagens de outras páginas. Os nomes locais levam o prefixo do mês de upload para evitar colisões como `1.svg` e `1.webp`. O download no catálogo usa o nome original.

Os bytes dos originais foram preservados. As miniaturas raster maiores foram geradas uma vez com Pillow, WebP qualidade 78 e redução Lanczos; o projeto não depende de Pillow para rodar, verificar ou gerar entregáveis. Logos pequenos e SVGs usam o próprio arquivo como prévia. A galeria carrega imagens com `loading="lazy"` e `decoding="async"`; os arquivos em resolução completa só são acessados ao baixar.

Para acrescentar um arquivo, salve o original, gere uma prévia se necessário e registre as informações e hashes no manifesto. Execute `python3 scripts/catalog.py`, formate `index.html` e rode `python3 scripts/verify.py`. O gerador escreve somente o intervalo entre os comentários `ORIGINAL-CATALOG:START` e `ORIGINAL-CATALOG:END`. A verificação confere os hashes, as referências da galeria e a inclusão dos arquivos no ZIP. Nenhuma etapa de build depende do site de origem.
