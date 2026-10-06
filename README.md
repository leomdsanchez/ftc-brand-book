# Frontrade Cryptos — Brand book & UI kit

Biblioteca estática e interativa da identidade Frontrade Cryptos, versão 0.2. HTML, CSS e JavaScript nativos; sem framework, backend ou dependências de execução. Os dados e as operações são demonstrações locais.

**Publicado:** https://leomdsanchez.github.io/ftc-brand-book/

## Começar

Clone o repositório e entre na pasta:

```sh
git clone https://github.com/leomdsanchez/ftc-brand-book.git
cd ftc-brand-book
```

Na raiz do projeto, com Python 3.10 ou superior:

```sh
python3 -m http.server 3000
```

Abra http://localhost:3000. Edite `index.html` e os arquivos de `assets/`; o site publicado usa esses mesmos arquivos. Não é necessário compilar para desenvolver ou para publicar no GitHub Pages.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Entrada do site, seções, marcação acessível e sprite de ícones SVG |
| `assets/css/styles.css` | Tokens, componentes, estados e responsividade; ordem da cascata preservada |
| `assets/js/app.js` | Demonstrações, tabelas, modais, cópia, tokens e navegação |
| `assets/fonts/` | Satoshi Regular, Medium e Bold |
| `assets/images/` | Logotipo e cenário SVG estático do exemplo de glass |
| `docs/` | Contrato atual, manutenção, proveniência e registros históricos |
| `scripts/` | Build de entregáveis e verificação estrutural, com biblioteca padrão Python |
| `dist/` | HTML independente e ZIP de fontes gerados; ignorados pelo Git |

## Passagem para outro dev

Leia [Desenvolvimento e publicação](docs/DEVELOPMENT.md), [Contrato dos componentes](docs/HANDOFF.md) e [Origem dos assets](docs/ASSETS.md). Os [registros anteriores](docs/history/README.md) e as [prévias históricas](docs/previews/README.md) servem como contexto, não como especificação visual atual.

## Verificar e gerar entregáveis

```sh
python3 scripts/verify.py
node --check assets/js/app.js
```

O primeiro comando verifica caminhos, âncoras, IDs, referências acessíveis, HTML offline e conteúdo/reprodutibilidade do ZIP. Também gera os entregáveis. Node 18+ é necessário apenas para a verificação de sintaxe JavaScript; não é uma dependência do site.

Para somente gerar os arquivos:

```sh
python3 scripts/build.py
```

Saídas: `dist/frontrade-brand-book.html`, que abre offline com fontes/imagens incorporadas, e `dist/frontrade-ui-kit.zip`, com as fontes e a documentação. Nunca edite os entregáveis diretamente. O ZIP não contém `.git`, `dist`, dependências ou arquivos temporários.

## Publicação

As alterações são publicadas por commit e push na `main`, mantendo `index.html` na raiz para o GitHub Pages existente. Após o push, acompanhe **Actions → pages build and deployment** e confira a URL publicada. Detalhes e checklist estão em [DEVELOPMENT.md](docs/DEVELOPMENT.md).

Referência visual da marca: https://frontradecryptos.com/.
