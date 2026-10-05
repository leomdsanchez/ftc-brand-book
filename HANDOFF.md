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

## Movimento na rolagem

Títulos, painéis e cards entram diagonalmente pelos cantos inferiores e saem pelos cantos superiores, com opacidade ligada à posição na tela. O efeito funciona nos dois sentidos da rolagem e se repete ao retornar à seção. O conteúdo fica totalmente visível na área de leitura; elementos com foco, impressão e movimento reduzido permanecem visíveis sem deslocamento.

## Iluminação e poeira

Pontos de luz azul cobrem toda a página, a navegação e o cabeçalho. Os focos da página permanecem ancorados ao conteúdo durante a rolagem e se adaptam à largura da tela. A luz é mais forte no centro de cada foco e diminui com o quadrado da distância normalizada até desaparecer na borda; a poeira usa a mesma queda de intensidade. A abertura, a ação de compra e o saldo da carteira recebem focos mais intensos. No escuro, a opacidade da poeira chega a zero; nas áreas iluminadas, mais partículas aparecem e ficam mais brilhantes, com transição suave. Perto de uma ação principal sob o ponteiro, a luz fica branca. A camada decorativa não recebe cliques, fica fora da árvore acessível, pausa em abas ocultas e é desativada com movimento reduzido. A animação usa até 30 quadros por segundo, com até 220 partículas no desktop e 70 em telas pequenas.
