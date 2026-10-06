# Revisão histórica da biblioteca — v0.2

Registro da revisão anterior à reorganização de 6 de outubro de 2026 (UTC). Os testes abaixo pertencem àquela revisão; não são resultados de cada novo commit. Consulte `../DEVELOPMENT.md` para a verificação atual.

## Ajustes realizados

- Foco dos campos com e sem ícone padronizado, sem contorno duplicado no input interno.
- Hover, pressionado, foco, desabilitado e carregamento corrigidos nas três variantes de botão.
- Hover aplicado ao ponteiro com suporte a hover; não fica preso após toque no mobile.
- Carregamento com bloqueio de disparos repetidos, largura estável e temporizadores sem conflito.
- Demonstração com estado atual visível e opção para desabilitar o botão.
- Rótulos e textos auxiliares maiores, cores de apoio com melhor contraste e inputs de 16 px.
- Grades, cards, cabeçalhos e escala de espaçamento ajustados para telas menores.
- Card da capa sem corte, âncoras alinhadas abaixo do cabeçalho e navegação ativa no final da página.
- Notificação de cópia disponível dentro do modal; bloco de código acessível por teclado.
- Valores fictícios da carteira e quantidades consistentes entre os cards e a tabela.
- Exportação de tokens lendo a mesma definição CSS usada pela biblioteca.
- HTML único e ZIP gerados pelos mesmos arquivos de origem com `build.py`.

## Verificação

No Chromium, foram examinadas as três variantes de botão nos seis estados, incluindo mouse, teclado e toque emulado. Também foram verificados os fluxos de validação, busca, ordenação, estados vazios, confirmação, clipboard e download de CSS.

Larguras examinadas: 320, 360, 390, 600, 760, 761, 768, 1024, 1200, 1440 e 1920 px. Não foi encontrado overflow horizontal da página nem corte nos controles examinados. As tabelas mantêm rolagem horizontal dentro da região própria quando necessário.

A checagem automática axe-core, nas regras WCAG A/AA selecionadas, não encontrou violações na página desktop, na página mobile e nos dois modais. Essa checagem cobre os testes automáticos executados, não representa uma certificação de acessibilidade.

Não foram encontrados erros de JavaScript nos fluxos examinados. A versão HTML única contém fontes, logotipo, CSS e JavaScript incorporados e não solicita recursos externos.
