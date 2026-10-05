# Frontrade Cryptos — handoff dos componentes

Versão 0.2. Use `styles.css` e preserve os arquivos em `assets/`.

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
| Hover | Ponteiro com suporte a hover | Branco entra com frentes inclinadas 45° para a direita, simultaneamente pelas laterais esquerda e direita até o centro em 520 ms; texto e ícones ficam escuros. Reverte ao sair e respeita movimento reduzido; não sobrepõe pressionado, desabilitado ou carregamento |
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

Em uma operação real, bloqueie disparos repetidos, defina os atributos antes de iniciar a requisição e remova-os em sucesso ou erro. Preserve a largura e o foco do controle durante a troca de rótulo. A demonstração em `app.js` implementa esse comportamento localmente.

## Campos

Campos simples recebem o foco no próprio input. Campos com ícones usam `.input-wrap`: o contorno e a sombra ficam no wrapper via `:focus-within`. O input interno não desenha outro contorno. Isso mantém o foco alinhado ao campo completo.

Use `label` ligado ao `id` do input, `aria-describedby` para orientação e erro e `aria-invalid="true"` para entradas inválidas. Os inputs usam 16 px, inclusive no mobile.

## Tokens e entregáveis

O botão **Exportar tokens** lê os mesmos valores CSS que a página usa. Os estilos da marca e os estados propostos compartilham uma única definição em `:root`.

- `index.html`, `styles.css`, `app.js` e `assets/`: arquivos separados para implementação.
- `frontrade-brand-book.html`: versão com todos os recursos incorporados.
- `build.py`: gera o HTML único e o ZIP a partir dos arquivos separados; execute `python build.py` depois de alterá-los.

Os valores financeiros e as interações são exemplos fictícios. Adapte os handlers e estados de retorno às regras do seu sistema.

## Rolagem sem animações

Títulos, painéis e cards permanecem visíveis, sem entrada, saída, deslocamento ou mudança de opacidade ligados à rolagem. A navegação por âncoras é imediata. O menu continua indicando a seção atual.

## Efeitos decorativos

O overlay de tela inteira, suas luzes e partículas foram removidos. Não há canvas decorativo nem loop contínuo de desenho. Os reflexos locais nos cards e o foco dos campos usam apenas CSS.

## Composição visual

A abertura usa uma hierarquia tipográfica mais forte, um card com planos sobrepostos e indicadores agrupados. As seções compartilham espaçamentos, divisores discretos, superfícies neutras e cantos consistentes. A navegação usa uma marca lateral azul para indicar a seção ativa. Em telas menores, a ilustração permanece visível, os indicadores ficam em duas colunas e os painéis se reorganizam sem reduzir os alvos de toque. A fonte Satoshi, o azul da marca, os estados dos botões e os reflexos discretos definem a identidade da composição.

## Glass e foco nos campos

Somente a abertura (`#overview`) demonstra glass em um painel delimitado com blur de 8 px. As outras seções, os cards internos, o cabeçalho, a navegação e os modais não usam desfoque de fundo. Nenhum blur é sobreposto a outro. Ao focar um campo de texto, aparece uma sombra branca suave via CSS, sem partículas. As cores de erro e sucesso permanecem visíveis. O preenchimento diagonal dos botões dura 1,05 s, com aceleração e desaceleração suaves; o movimento reduzido continua desativando animações.
