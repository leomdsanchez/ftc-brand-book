# Frontrade Cryptos — base do brand book

Versão 0.1 · 4 de outubro de 2026

Referência: https://frontradecryptos.com/

Este documento inicia o brand book e a biblioteca de interface a partir da página pública existente. Os valores identificados no site são referências observadas; as regras de padronização abaixo são propostas para o sistema.

## 1. Identidade

A página combina superfícies escuras, azul intenso, tipografia Satoshi e imagens com luzes, partículas e referências ao universo cripto. A comunicação enfatiza segurança, transparência, rapidez e suporte humano.

O logotipo atual apresenta “FronTrade” em branco e “CRYPTOS” abaixo. Usar o arquivo original, preservando proporção e composição. Área de proteção, tamanho mínimo e versões para fundos claros ainda precisam ser definidos a partir do arquivo mestre.

## 2. Cores observadas

| Papel | Valor | Aplicação atual |
| --- | --- | --- |
| Azul principal | `#0052FC` | Ações de compra e cadastro |
| Fundo escuro | `#090909` | Hero e seções |
| Preto | `#000000` | Outras superfícies de fundo |
| Superfície | `#0D0D0D` | Cards e campos |
| Texto principal | `#FFFFFF` | Títulos e ações |
| Texto secundário | `#A4A4A4` | Parágrafos de seções |
| Texto de destaque suave | `#B2CBE2` | Selos e chamadas auxiliares |
| Borda sutil | `rgba(255,255,255,0.10)` | Cards |

Há pequenas variações de azul e de preto na página. Proposta: centralizar os valores acima em tokens, com papéis próprios para fundo, superfície, texto, borda e ação.

As cores de sucesso, alerta, erro e variação de mercado ainda precisam ser definidas. Cada status deve incluir texto ou ícone para comunicar seu significado.

## 3. Tipografia

Família principal observada: **Satoshi**, com fallback `sans-serif`.

| Elemento | Referência observada |
| --- | --- |
| Título principal no desktop | 70 px, peso 700, entrelinha 84 px |
| Título principal no mobile | 40 px |
| Títulos de seção | 48–55 px, peso 700 |
| Parágrafos de seções | 19 px, peso 400 |
| Navegação principal | 16 px, peso 500 |
| Botão principal | 17 px, peso 700 |
| Campos do formulário | 17 px, peso 300 |

Proposta para telas operacionais: corpo em 16 px, auxiliares em 14 px e títulos entre 24 e 32 px. Manter a escala maior nas páginas institucionais. Valores monetários e preços devem usar algarismos de largura uniforme quando disponíveis na fonte.

## 4. Forma e espaçamento

Referências observadas: botão de cadastro com raio de 8 px; CTA principal e campos com 10 px; navegação com 15 px; cards com 16–20 px. O botão do formulário usa raio de 3 px.

Proposta de escala de espaçamento: 4, 8, 12, 16, 24, 32, 48 e 64 px.

Proposta de padronização: raio de 10 px para controles, 16 px para cards e 20 px para painéis maiores; altura mínima de 44 px para controles interativos. Os selos podem manter formato de cápsula.

## 5. Biblioteca inicial de componentes

| Componente | Base existente | Extensão proposta para o sistema |
| --- | --- | --- |
| Logotipo | Versão branca | Versões e regras de aplicação |
| Navegação | Desktop e menu mobile | Item ativo e navegação interna |
| Botões | Cadastro, compra, venda e contato | Primário, secundário e discreto; tamanhos consistentes |
| Selos | Chamada no hero | Status de operação e verificação |
| Cards | Conteúdo institucional | Saldo, cotação e resumo de carteira |
| Campos | Nome, email e mensagem | Busca, valores, seletores e validação |
| Acordeão | Perguntas frequentes | Ajuda contextual |
| Tabela | A desenvolver | Ativos, ordens e histórico |
| Abas | A desenvolver | Organização de carteiras e operações |
| Modal | A desenvolver | Revisão e confirmação de operação |
| Alertas | A desenvolver | Sucesso, erro e informações |
| Estados vazios e carregamento | A desenvolver | Ausência de dados, espera e falha |

Para cada componente interativo, documentar os estados aplicáveis: padrão, hover, foco por teclado, pressionado, desabilitado, carregando e erro. Para tabelas, acrescentar ordenação, paginação e adaptação ao mobile.

## 6. Aplicação ao produto

Primeiras telas propostas para demonstrar os componentes: visão geral da carteira, compra/venda de cripto e histórico de transações. Os exemplos devem identificar valores fictícios, moeda, rede, taxas e status quando relevantes ao fluxo.

Preservar a base escura e o azul das ações. Nas telas com dados, usar as imagens e efeitos luminosos como apoio, mantendo boa leitura de preços, saldos e formulários.

## 7. Verificação e próximos detalhes

A página foi examinada em 1280 × 633 px e 390 × 844 px. Na largura mobile examinada, não foi detectado overflow horizontal da página. Foram capturadas referências visuais do hero desktop e mobile e extraídos estilos calculados do DOM.

Esta versão é um levantamento inicial; não é uma auditoria completa de acessibilidade nem uma biblioteca final de componentes.

Para a próxima versão: definir o formato de entrega (Figma, código ou ambos), obter o logotipo mestre, confirmar a tecnologia do sistema caso haja implementação e finalizar tokens, variantes e exemplos visuais.
