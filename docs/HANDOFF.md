# Frontrade Cryptos — handoff dos componentes

Versão 0.2. Use `assets/css/styles.css` e preserve os arquivos em `assets/`.

O código reutilizável está em `index.html` e `assets/`; os entregáveis em `dist/` são gerados. Consulte [DEVELOPMENT.md](DEVELOPMENT.md) para arquitetura, comandos e publicação.

Ícones com `<use href="#i-…">` dependem dos símbolos SVG definidos no início de `index.html`. Ao copiar um componente para outra página, inclua os símbolos correspondentes ou substitua os ícones. O JavaScript depende dos IDs desta demonstração; adapte os handlers em vez de importar o script inteiro em uma página parcial.

## Botões

| Variante | Classe | Uso |
| --- | --- | --- |
| Primário | `btn primary` | Ação principal do contexto |
| Secundário | `btn secondary` | Alternativa ou cancelamento |
| Discreto | `btn ghost` | Ação de menor destaque |

Tamanhos: `small` (44 px), padrão (48 px) e `large` (56 px). `icon-only` exige um nome acessível via `aria-label`.

| Estado | Gatilho real | Contrato |
| --- | --- | --- |
| Padrão | Sem interação | Mantém a variante |
| Hover | Ponteiro com suporte a hover | Uma faixa branca inclinada em −45° se expande do centro para as duas bordas em 240 ms; texto e ícones ficam escuros. Reverte ao sair e respeita movimento reduzido; não sobrepõe pressionado, desabilitado ou carregamento |
| Pressionado | `:active` por mouse, toque ou teclado | Reforça a ativação até a liberação |
| Foco | `:focus-visible` | Contorno externo de 2 px; preserva o fundo do estado atual |
| Desabilitado | Atributo nativo `disabled` | Bloqueia ativação e mantém a aparência sob hover |
| Carregando | `aria-busy="true"` e `aria-disabled="true"` | Comunica a espera, mantém o foco e exige bloqueio de novos disparos no handler |

As classes `state-hover`, `state-pressed` e `state-focus` existem para as amostras da biblioteca. Em produção, use os estados nativos. Evite usar somente `aria-disabled` para bloquear uma ação: o atributo comunica o estado, mas não impede eventos.

```html
<button class="btn primary">Comprar cripto</button>
<button class="btn secondary" disabled>Indisponível</button>
<button class="btn primary" aria-busy="true" aria-disabled="true">
  <span class="spinner" aria-hidden="true"></span>
  Processando…
</button>
```

Em uma operação real, bloqueie disparos repetidos, defina os atributos antes de iniciar a requisição e remova-os em sucesso ou erro. Preserve a largura e o foco do controle durante a troca de rótulo. A demonstração em `assets/js/app.js` implementa esse comportamento localmente.

## Campos

Campos simples recebem o foco no próprio input. Campos com ícones usam `.input-wrap`: o contorno e a sombra ficam no wrapper via `:focus-within`. O input interno não desenha outro contorno. Isso mantém o foco alinhado ao campo completo.

Use `label` ligado ao `id` do input, `aria-describedby` para orientação e erro e `aria-invalid="true"` para entradas inválidas. Os inputs usam 16 px, inclusive no mobile.

## Tokens e entregáveis

O botão **Exportar tokens** lê os mesmos valores CSS que a página usa. Os estilos da marca e os estados propostos compartilham uma única definição em `:root`.

- `index.html`, `assets/css/styles.css`, `assets/js/app.js` e `assets/`: arquivos separados para implementação.
- `dist/frontrade-brand-book.html`: versão com todos os recursos incorporados.
- `scripts/build.py`: gera o HTML único e o ZIP a partir dos arquivos separados; execute `python3 scripts/build.py` depois de alterá-los.

Os valores financeiros e as interações são exemplos fictícios. Adapte os handlers e estados de retorno às regras do seu sistema.

## Rolagem sem animações

Títulos, painéis e cards permanecem visíveis, sem entrada, saída, deslocamento ou mudança de opacidade ligados à rolagem. A navegação por âncoras é imediata. O menu continua indicando a seção atual.

## Efeitos decorativos

O overlay de tela inteira, suas luzes e partículas foram removidos. Não há canvas decorativo nem loop contínuo de desenho. Os reflexos locais nos cards e o foco dos campos usam apenas CSS.

## Composição visual

A abertura usa uma hierarquia tipográfica mais forte, um card com planos sobrepostos e indicadores agrupados. As seções compartilham espaçamentos, divisores discretos, superfícies neutras e cantos consistentes. A navegação usa uma marca lateral azul para indicar a seção ativa. Em telas menores, a ilustração permanece visível, os indicadores ficam em duas colunas e os painéis se reorganizam sem reduzir os alvos de toque. A fonte Satoshi, o azul da marca, os estados dos botões e os reflexos discretos definem a identidade da composição.

## Glass e foco nos campos

O painel central da seção `#glass` demonstra glass com blur de 20 px, fundo preto com 20% de opacidade, cantos de 12 px e sem borda, conforme os estilos observados no site original. O painel permanece estático, inspirado na seção de segurança da marca. O fundo usa a ilustração SVG estática `assets/images/glass-crystals.svg`, sem animação ou overlay de tela inteira. A nova barra `.brand-nav` em `#navigation` também reproduz o blur local de 10 px observado no header original. Os dois efeitos ficam delimitados aos respectivos componentes, sem sobreposição. A abertura, as superfícies das seções, os cards internos, o cabeçalho e a navegação da própria biblioteca e os modais não usam desfoque de fundo. Ao focar um campo de texto, aparece uma sombra branca suave via CSS, sem partículas. As cores de erro e sucesso permanecem visíveis. O preenchimento diagonal dos botões dura 240 ms, com ease-in-out na entrada e na saída do hover; o movimento reduzido continua desativando animações.

## Navegação do site original

`#navigation` demonstra a barra `.brand-nav`, preservando o logo, os seis destinos, Login e Registrar-se do original. Os links abrem destinos externos em outra aba com `rel="noopener noreferrer"`. A altura se aproxima dos 68 px observados; a tipografia dos links foi reduzida para caber na prévia da biblioteca. Fundo `#17171780`, raio 15 px e blur local de 10 px seguem o original. A barra é estática dentro do exemplo; não se fixa sobre o restante da página.

O menu se recolhe quando a barra tem menos de 820 px. Um `ResizeObserver` acompanha somente mudanças de largura, sem trabalho ligado ao scroll. O botão controla `hidden` e `aria-expanded`, fecha com Escape (devolvendo o foco), com clique fora e ao ativar um link. No modo compacto, Login aparece dentro do menu e o cadastro permanece visível. O seletor Desktop/Mobile modifica a largura da prévia, mantendo o mesmo componente. Essa demonstração adapta o menu mobile do original ao painel local, sem overlay de tela inteira. O botão Ver HTML mostra a marcação atual; ao reutilizar, adapte os IDs e handlers do bloco de navegação no JS.

## Imagens e logos

`#images` contém 34 cards estáticos gerados por `scripts/catalog.py` a partir de `assets/images/original/manifest.json`. Os filtros são botões com `aria-pressed`; usam `hidden` nos cards e anunciam a contagem via `aria-live`. Downloads apontam para originais locais, e as prévias maiores usam arquivos reduzidos. Não há fetch em execução, dependência de CDN ou efeito animado na galeria. Consulte [ASSETS.md](ASSETS.md) para escopo, origem e manutenção do catálogo.
