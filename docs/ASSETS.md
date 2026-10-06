# Origem e manutenção dos assets

| Arquivos | Origem / finalidade |
| --- | --- |
| `assets/images/logo.webp` | Logotipo usado no site público da Frontrade Cryptos; preservado sem redesenho |
| `assets/fonts/Satoshi-*.woff2` | Arquivos da família Satoshi usados na referência da marca: pesos 400, 500 e 700 |
| `assets/images/glass-crystals.svg` | Ilustração estática criada para este exemplo de glass; não é uma imagem extraída da seção original |
| `assets/icons/crypto/*.svg` | Logos coloridos BTC, ETH e USDT da coleção Cryptocurrency Icons; SVGs preservados sem alteração |
| Sprite SVG de `index.html` | Ícones inline que acompanham os exemplos; não fazem requisições externas |
| `docs/previews/*.png` | Capturas históricas da biblioteca antes das últimas revisões visuais |

Referência de origem da marca: https://frontradecryptos.com/. O logotipo e as fontes não incluem licença, arquivo mestre do logotipo ou documentação de cessão. Esta reorganização não atribui uma licença nova a esses recursos: confirme os termos com a marca e a origem da fonte antes de redistribuí-los fora deste projeto.

Os logos de criptomoedas vêm de `spothq/cryptocurrency-icons`, commit `1a63530be6e374711a8554f31b17e4cb92c25fa5`, arquivos `svg/color/btc.svg`, `eth.svg` e `usdt.svg`. A licença publicada pela coleção é CC0 1.0; sua cópia integral está em [licenses/cryptocurrency-icons-CC0.md](licenses/cryptocurrency-icons-CC0.md). Origem: https://github.com/spothq/cryptocurrency-icons. A coleção é comunitária; não é apresentada como material publicado pelas próprias moedas.

Os arquivos são carregados localmente em cards e tabelas, com tamanho fixo e `alt=""` porque o nome e o ticker adjacentes identificam o ativo. O build incorpora também os ícones referenciados no JavaScript da tabela, preservando o funcionamento offline. Não há CDN, pacote de ícones ou fonte externa em execução.

O build incorpora os assets existentes e não baixa recursos. Novos arquivos precisam ter finalidade e origem registradas aqui. Preserve o nome e a extensão ou atualize os caminhos no HTML/CSS e as expectativas do build. Use imagens leves e estáticas para cenários decorativos.
